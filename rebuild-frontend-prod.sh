#!/bin/bash

# Script pour forcer la reconstruction complète du frontend en production

echo "🔄 Reconstruction complète du frontend..."
echo ""

# 1. Arrêter le frontend et nginx
echo "1️⃣ Arrêt des services frontend et nginx..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod stop frontend nginx
docker-compose -f docker-compose.prod.yml --env-file .env.prod rm -f frontend nginx
echo "✅ Services arrêtés"
echo ""

# 2. Supprimer le volume frontend_dist pour forcer la reconstruction
echo "2️⃣ Suppression du volume frontend_dist..."
docker volume rm prixinnov_frontend_dist 2>/dev/null || true
echo "✅ Volume supprimé"
echo ""

# 3. Reconstruire le frontend sans cache
echo "3️⃣ Reconstruction du frontend (sans cache)..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache frontend
echo "✅ Frontend reconstruit"
echo ""

# 4. Redémarrer les services
echo "4️⃣ Redémarrage des services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d frontend nginx
echo "✅ Services redémarrés"
echo ""

# 5. Vérifier
echo "5️⃣ Vérification..."
sleep 5
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps frontend nginx
echo ""

echo "✅ Reconstruction terminée!"
echo ""
echo "💡 Conseil: Videz le cache de votre navigateur (Ctrl+Shift+R ou Cmd+Shift+R)"
echo "   ou testez en navigation privée pour voir les changements."
echo ""

