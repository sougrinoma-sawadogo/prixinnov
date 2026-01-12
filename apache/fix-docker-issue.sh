#!/bin/bash

# Script pour corriger l'erreur Docker Compose
# Usage: sudo ./apache/fix-docker-issue.sh

set -e

echo "=== Correction des problèmes Docker Compose ==="

# Vérifier que .env.prod existe
if [ ! -f .env.prod ]; then
    echo "⚠️  Fichier .env.prod non trouvé"
    echo "   Les variables d'environnement utiliseront les valeurs par défaut"
    echo ""
fi

# Solution 1: Redémarrer uniquement nginx sans toucher aux autres services
echo "🔄 Redémarrage uniquement du conteneur nginx..."

# Arrêter nginx
docker stop prixddi_nginx_prod 2>/dev/null || echo "Nginx déjà arrêté"

# Supprimer le conteneur nginx
docker rm prixddi_nginx_prod 2>/dev/null || echo "Conteneur nginx déjà supprimé"

# Vérifier que les ports sont corrects dans docker-compose.prod.yml
if grep -q '"80:80"' docker-compose.prod.yml; then
    echo "⚠️  ATTENTION: Les ports dans docker-compose.prod.yml sont encore 80/443"
    echo "   Ils devraient être 8080/8443 pour Apache"
    echo "   Vérifiez que le fichier a été mis à jour avec:"
    echo "     ports:"
    echo "       - \"127.0.0.1:8080:80\""
    echo "       - \"127.0.0.1:8443:443\""
    echo ""
    read -p "Continuer quand même? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Redémarrer uniquement nginx avec docker-compose (sans dépendances)
echo "📦 Recréation du conteneur nginx avec la nouvelle configuration..."
docker-compose -f docker-compose.prod.yml up -d --no-deps --force-recreate nginx

# Attendre un peu pour que le conteneur démarre
sleep 2

# Vérifier que nginx est démarré
if docker ps | grep -q prixddi_nginx_prod; then
    echo "✅ Nginx démarré avec succès"
    echo ""
    echo "📋 Ports mappés par le conteneur:"
    docker port prixddi_nginx_prod
    echo ""
    echo "📋 Ports en écoute sur le système:"
    netstat -tuln | grep -E ':(8080|8443)' || echo "⚠️  Les ports 8080/8443 ne sont pas encore actifs"
    
    # Vérifier que les bons ports sont utilisés
    if docker port prixddi_nginx_prod | grep -q "8080\|8443"; then
        echo "✅ Les ports 8080/8443 sont correctement configurés"
    else
        echo "⚠️  ATTENTION: Le conteneur n'utilise pas les ports 8080/8443"
        echo "   Vérifiez que docker-compose.prod.yml a été mis à jour"
    fi
else
    echo "❌ Échec du démarrage de nginx"
    echo ""
    echo "Tentative de solution alternative..."
    
    # Solution alternative: Arrêter et redémarrer tous les services
    echo "🛑 Arrêt de tous les conteneurs..."
    docker-compose -f docker-compose.prod.yml down
    
    echo "🚀 Redémarrage de tous les services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "✅ Services redémarrés"
fi

echo ""
echo "📋 État des conteneurs:"
docker ps --filter "name=prixddi" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

