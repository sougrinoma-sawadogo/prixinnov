#!/bin/bash

# Script rapide pour migrer de Nginx Docker vers Apache
# Usage: sudo ./apache/quick-migration.sh

set -e

echo "=== Migration Nginx Docker -> Apache ==="

# Vérifier les privilèges
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Veuillez exécuter avec sudo"
    exit 1
fi

# Étape 1: Arrêter le conteneur nginx
echo "📦 Arrêt du conteneur nginx..."
docker stop prixddi_nginx_prod 2>/dev/null || echo "⚠️  Conteneur nginx déjà arrêté"

# Étape 2: Vérifier que les ports sont libres
echo "🔍 Vérification des ports..."
if netstat -tuln | grep -qE ':(80|443)\s'; then
    echo "⚠️  Les ports 80 ou 443 sont encore utilisés:"
    netstat -tuln | grep -E ':(80|443)'
    read -p "Continuer quand même? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Étape 3: Activer les modules Apache
echo "🔧 Activation des modules Apache..."
a2enmod proxy proxy_http ssl headers rewrite 2>/dev/null || true
systemctl restart apache2

# Étape 4: Vérifier que le backend est accessible
echo "🔍 Vérification du backend..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend accessible"
else
    echo "⚠️  Backend non accessible sur localhost:3000"
    echo "   Vérifiez que le backend expose le port 3000"
    echo "   Commande: docker logs prixddi_backend_prod"
fi

# Étape 5: Copier la configuration Apache
echo "📋 Copie de la configuration Apache..."
if [ -f "apache/prixddi.conf" ]; then
    cp apache/prixddi.conf /etc/apache2/sites-available/prixddi.conf
    echo "✅ Configuration copiée"
else
    echo "❌ Fichier apache/prixddi.conf introuvable"
    exit 1
fi

# Étape 6: Vérifier les certificats SSL
echo "🔐 Vérification des certificats SSL..."
if [ -f "/etc/letsencrypt/live/prinnov.benit.biz/fullchain.pem" ]; then
    echo "✅ Certificats Let's Encrypt trouvés"
elif [ -f "/etc/ssl/certs/prinnov.benit.biz.crt" ]; then
    echo "✅ Certificats personnalisés trouvés"
    # Modifier la config pour utiliser les certificats personnalisés
    sed -i 's|SSLCertificateFile /etc/letsencrypt|# SSLCertificateFile /etc/letsencrypt|' /etc/apache2/sites-available/prixddi.conf
    sed -i 's|# SSLCertificateFile /etc/ssl/certs|SSLCertificateFile /etc/ssl/certs|' /etc/apache2/sites-available/prixddi.conf
    sed -i 's|# SSLCertificateKeyFile /etc/ssl/private|SSLCertificateKeyFile /etc/ssl/private|' /etc/apache2/sites-available/prixddi.conf
else
    echo "⚠️  Aucun certificat SSL trouvé"
    echo "   Vous devrez configurer les certificats manuellement"
    echo "   Ou utiliser: sudo certbot --apache -d prinnov.benit.biz"
fi

# Étape 7: Activer le site
echo "🚀 Activation du site Apache..."
a2ensite prixddi.conf 2>/dev/null || true

# Étape 8: Tester la configuration
echo "🧪 Test de la configuration Apache..."
if apache2ctl configtest; then
    echo "✅ Configuration valide"
else
    echo "❌ Erreurs dans la configuration Apache"
    echo "   Corrigez les erreurs avant de continuer"
    exit 1
fi

# Étape 9: Préparer le frontend (optionnel)
echo "📦 Préparation du frontend..."
if [ -d "frontend/dist" ]; then
    mkdir -p /var/www/prixddi/frontend/dist
    cp -r frontend/dist/* /var/www/prixddi/frontend/dist/ 2>/dev/null || true
    chown -R www-data:www-data /var/www/prixddi
    echo "✅ Frontend copié vers /var/www/prixddi/frontend/dist"
else
    echo "⚠️  Répertoire frontend/dist introuvable"
    echo "   Le frontend sera servi depuis le conteneur nginx (port 8080)"
    echo "   Assurez-vous que la section proxy dans prixddi.conf est activée"
fi

# Étape 10: Recharger Apache
echo "🔄 Rechargement d'Apache..."
systemctl reload apache2

# Résumé
echo ""
echo "=== Migration terminée ==="
echo ""
echo "✅ Apache est maintenant configuré pour servir l'application"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Vérifier les logs: sudo tail -f /var/log/apache2/prixddi_error.log"
echo "   2. Tester l'application: curl -I https://prinnov.benit.biz"
echo "   3. Si le backend n'est pas accessible, exposez le port 3000:"
echo "      Modifiez docker-compose.prod.yml pour ajouter:"
echo "      backend:"
echo "        ports:"
echo "          - \"127.0.0.1:3000:3000\""
echo ""
echo "🔄 Pour revenir à Nginx:"
echo "   sudo a2dissite prixddi.conf && sudo systemctl reload apache2"
echo "   docker start prixddi_nginx_prod"

