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
if ! grep -q "127.0.0.1:808" docker-compose.prod.yml; then
    echo "❌ ERREUR: Les ports dans docker-compose.prod.yml ne sont pas corrects"
    echo "   Ils devraient être configurés (ex: 8081/8444)"
    exit 1
fi

# Vérifier si les ports sont déjà utilisés
echo "🔍 Vérification des ports..."
NGINX_HTTP_PORT=$(grep -A 2 "ports:" docker-compose.prod.yml | grep -oP '127\.0\.0\.1:\K\d+(?=:80)' | head -1)
NGINX_HTTPS_PORT=$(grep -A 2 "ports:" docker-compose.prod.yml | grep -oP '127\.0\.0\.1:\K\d+(?=:443)' | head -1)

if [ -z "$NGINX_HTTP_PORT" ] || [ -z "$NGINX_HTTPS_PORT" ]; then
    echo "⚠️  Impossible de détecter les ports depuis docker-compose.prod.yml"
    echo "   Utilisation des ports par défaut: 8081 et 8444"
    NGINX_HTTP_PORT=8081
    NGINX_HTTPS_PORT=8444
fi

if netstat -tuln 2>/dev/null | grep -q ":$NGINX_HTTP_PORT "; then
    echo "⚠️  Le port $NGINX_HTTP_PORT est déjà utilisé:"
    netstat -tuln | grep ":$NGINX_HTTP_PORT "
    echo ""
    echo "Options:"
    echo "  1. Arrêter le processus qui utilise le port"
    echo "  2. Modifier docker-compose.prod.yml pour utiliser un autre port"
    read -p "Voulez-vous continuer quand même? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Vérifier si la config nginx doit être mise à jour pour Apache
if [ -f "nginx/conf.d/default.apache.conf" ] && ! grep -q "return 301" nginx/conf.d/default.conf 2>/dev/null; then
    echo "📋 Configuration nginx déjà adaptée pour Apache"
elif [ -f "nginx/conf.d/default.apache.conf" ]; then
    echo "📋 Mise à jour de la configuration nginx pour Apache..."
    if [ -f "nginx/conf.d/default.conf" ]; then
        cp nginx/conf.d/default.conf nginx/conf.d/default.conf.backup
    fi
    cp nginx/conf.d/default.apache.conf nginx/conf.d/default.conf
    echo "✅ Configuration nginx mise à jour (plus de redirection HTTP->HTTPS)"
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
netstat -tuln | grep -E ":($NGINX_HTTP_PORT|$NGINX_HTTPS_PORT)" || echo "⚠️  Ports $NGINX_HTTP_PORT/$NGINX_HTTPS_PORT non trouvés"

echo ""
echo "✅ Nginx recréé. Testez avec: curl http://localhost:$NGINX_HTTP_PORT"
echo "   Ports configurés: HTTP=$NGINX_HTTP_PORT, HTTPS=$NGINX_HTTPS_PORT"
echo ""
echo "📋 Note: Si vous voyez une redirection 301, mettez à jour la config nginx:"
echo "   sudo ./apache/update-nginx-config.sh"
echo "   Cela désactivera la redirection HTTP->HTTPS (Apache gère déjà le SSL)"

