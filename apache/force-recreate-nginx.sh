#!/bin/bash

# Script pour forcer la recréation de nginx avec les nouveaux ports
# Usage: sudo ./apache/force-recreate-nginx.sh

set -e

echo "=== Recréation forcée de Nginx ==="

# Arrêter nginx
echo "🛑 Arrêt de nginx..."
docker stop prixddi_nginx_prod 2>/dev/null || echo "Nginx déjà arrêté"

# Supprimer le conteneur
echo "🗑️  Suppression du conteneur nginx..."
docker rm prixddi_nginx_prod 2>/dev/null || echo "Conteneur déjà supprimé"

# Vérifier la configuration
echo "📋 Vérification de la configuration..."
if ! grep -q "127.0.0.1:8080:80" docker-compose.prod.yml; then
    echo "❌ ERREUR: Les ports dans docker-compose.prod.yml ne sont pas corrects"
    echo "   Ils devraient être:"
    echo "     - \"127.0.0.1:8080:80\""
    echo "     - \"127.0.0.1:8443:443\""
    exit 1
fi

# Recréer nginx avec --force-recreate et --no-deps
echo "📦 Recréation du conteneur nginx..."
docker-compose -f docker-compose.prod.yml up -d --force-recreate --no-deps nginx

# Attendre
sleep 3

# Vérifier
echo ""
echo "📋 État du conteneur:"
docker ps --filter "name=prixddi_nginx_prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📋 Ports mappés:"
docker port prixddi_nginx_prod

echo ""
echo "📋 Ports en écoute:"
netstat -tuln | grep -E ':(8080|8443)' || echo "⚠️  Ports 8080/8443 non trouvés"

echo ""
echo "✅ Nginx recréé. Testez avec: curl http://localhost:8080"

