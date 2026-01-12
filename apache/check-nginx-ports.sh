#!/bin/bash

# Script pour vérifier et corriger les ports nginx
# Usage: sudo ./apache/check-nginx-ports.sh

echo "=== Vérification des ports Nginx ==="

# Vérifier la configuration dans docker-compose.prod.yml
echo "📋 Configuration dans docker-compose.prod.yml:"
grep -A 2 "ports:" docker-compose.prod.yml | grep -E "(80|443|8080|8443)" || echo "Aucun port trouvé"

echo ""
echo "📋 Ports actuellement utilisés par nginx:"
docker port prixddi_nginx_prod 2>/dev/null || echo "Conteneur nginx non trouvé"

echo ""
echo "📋 Ports en écoute sur le système:"
netstat -tuln | grep -E ':(80|443|8080|8443)' || echo "Aucun port trouvé"

echo ""
echo "🔍 Si nginx écoute sur 80/443 au lieu de 8080/8443:"
echo "   1. Vérifiez que docker-compose.prod.yml a les bons ports"
echo "   2. Arrêtez nginx: docker stop prixddi_nginx_prod"
echo "   3. Supprimez le conteneur: docker rm prixddi_nginx_prod"
echo "   4. Redémarrez: docker-compose -f docker-compose.prod.yml up -d --no-deps nginx"

