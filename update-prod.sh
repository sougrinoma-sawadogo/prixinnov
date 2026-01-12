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

# 2. Nettoyer les conteneurs corrompus (si nécessaire)
echo "2️⃣ Nettoyage des conteneurs corrompus..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod down 2>/dev/null || true
docker ps -aq --filter "name=prixddi" | xargs -r docker rm -f 2>/dev/null || true
docker network rm prixddi_network 2>/dev/null || true
docker container prune -f > /dev/null 2>&1
docker network prune -f > /dev/null 2>&1
echo "✅ Nettoyage terminé"
echo ""

# 3. Reconstruire les images Docker
echo "3️⃣ Reconstruction des images Docker..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache backend frontend

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction des images"
    exit 1
fi

echo "✅ Images reconstruites"
echo ""

# 4. Mettre à jour la configuration nginx si nécessaire (pour Apache)
echo "4️⃣ Vérification de la configuration nginx..."
if [ -f "nginx/conf.d/default.apache.conf" ] && grep -q "return 301" nginx/conf.d/default.conf 2>/dev/null; then
    echo "📋 Mise à jour de la configuration nginx pour Apache..."
    if [ -f "nginx/conf.d/default.conf" ]; then
        cp nginx/conf.d/default.conf nginx/conf.d/default.conf.backup
    fi
    cp nginx/conf.d/default.apache.conf nginx/conf.d/default.conf
    echo "✅ Configuration nginx mise à jour"
fi

# 5. Redémarrer les services
echo "5️⃣ Redémarrage des services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du redémarrage"
    exit 1
fi

echo "✅ Services redémarrés"
echo ""

# 5.5. Mettre à jour Apache si configuré
if [ -f "/etc/apache2/sites-available/prixddi.conf" ]; then
    echo "5.5️⃣ Mise à jour de la configuration Apache..."
    if [ -f "apache/prixddi.conf" ]; then
        cp apache/prixddi.conf /etc/apache2/sites-available/prixddi.conf
        if apache2ctl configtest > /dev/null 2>&1; then
            systemctl reload apache2
            echo "✅ Configuration Apache mise à jour"
        else
            echo "⚠️  Erreurs dans la configuration Apache - vérifiez avec: apache2ctl configtest"
        fi
    fi
    echo ""
fi

# 6. Attendre que les services soient prêts
echo "6️⃣ Attente du démarrage des services..."
sleep 10

# 7. Vérifier le statut
echo "7️⃣ Vérification du statut..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps

echo ""
echo "8️⃣ Vérification de la santé du backend..."
sleep 5

# Tester via Apache (si configuré) ou directement
if curl -f -s https://prinnov.benit.biz/api/health > /dev/null 2>&1; then
    echo "✅ Backend est accessible via Apache"
    curl -s https://prinnov.benit.biz/api/health | jq . 2>/dev/null || curl -s https://prinnov.benit.biz/api/health
elif curl -f -s http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ Backend est accessible via nginx direct"
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

