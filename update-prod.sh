#!/bin/bash

# Script pour mettre à jour l'application en production

echo "🔄 Mise à jour de l'application en production..."
echo ""

# 1. Sauvegarder les changements locaux (optionnel)
echo "1️⃣ Récupération des dernières modifications..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du pull. Vérifiez votre connexion et vos permissions."
    exit 1
fi

echo "✅ Code mis à jour"
echo ""

# 2. Reconstruire les images Docker
echo "2️⃣ Reconstruction des images Docker..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache backend frontend

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction des images"
    exit 1
fi

echo "✅ Images reconstruites"
echo ""

# 3. Redémarrer les services
echo "3️⃣ Redémarrage des services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du redémarrage"
    exit 1
fi

echo "✅ Services redémarrés"
echo ""

# 4. Attendre que les services soient prêts
echo "4️⃣ Attente du démarrage des services..."
sleep 10

# 5. Vérifier le statut
echo "5️⃣ Vérification du statut..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps

echo ""
echo "6️⃣ Vérification de la santé du backend..."
sleep 5

if curl -f -s http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ Backend est en ligne"
    curl -s http://localhost/api/health | jq . 2>/dev/null || curl -s http://localhost/api/health
else
    echo "⚠️  Backend ne répond pas encore. Vérifiez les logs:"
    echo "   docker-compose -f docker-compose.prod.yml --env-file .env.prod logs backend"
fi

echo ""
echo "✅ Mise à jour terminée!"
echo ""
echo "📋 Commandes utiles:"
echo "   Voir les logs: docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f"
echo "   Vérifier le statut: docker-compose -f docker-compose.prod.yml --env-file .env.prod ps"
echo ""

