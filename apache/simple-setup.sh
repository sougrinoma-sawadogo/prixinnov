#!/bin/bash

# Script simple pour configurer Apache comme reverse proxy vers nginx container
# Usage: sudo ./apache/simple-setup.sh

set -e

echo "=== Configuration Apache → Nginx Container ==="

# Vérifier les privilèges
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Veuillez exécuter avec sudo"
    exit 1
fi

# Étape 1: Vérifier docker-compose.prod.yml
echo "📋 Vérification de docker-compose.prod.yml..."
if grep -q '"80:80"' docker-compose.prod.yml; then
    echo "⚠️  Les ports 80/443 sont encore configurés dans docker-compose.prod.yml"
    echo "   Modifiez les ports nginx pour utiliser 8080/8443:"
    echo ""
    echo "   nginx:"
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

# Étape 2: Arrêter nginx si nécessaire
echo "🛑 Arrêt du conteneur nginx..."
docker stop prixddi_nginx_prod 2>/dev/null || echo "   Nginx déjà arrêté"

# Étape 3: Activer les modules Apache
echo "🔧 Activation des modules Apache..."
a2enmod proxy proxy_http ssl headers 2>/dev/null || true
systemctl restart apache2

# Étape 4: Copier la configuration Apache
echo "📋 Copie de la configuration Apache..."
if [ -f "apache/prixddi.conf" ]; then
    cp apache/prixddi.conf /etc/apache2/sites-available/prixddi.conf
    echo "✅ Configuration copiée"
else
    echo "❌ Fichier apache/prixddi.conf introuvable"
    exit 1
fi

# Étape 5: Vérifier les certificats SSL
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
    echo "   Configurez les certificats dans /etc/apache2/sites-available/prixddi.conf"
    echo "   Ou utilisez: sudo certbot --apache -d prinnov.benit.biz"
fi

# Étape 6: Activer le site
echo "🚀 Activation du site Apache..."
a2ensite prixddi.conf 2>/dev/null || true

# Étape 7: Tester la configuration
echo "🧪 Test de la configuration Apache..."
if apache2ctl configtest; then
    echo "✅ Configuration valide"
else
    echo "❌ Erreurs dans la configuration Apache"
    exit 1
fi

# Étape 8: Recharger Apache
echo "🔄 Rechargement d'Apache..."
systemctl reload apache2

# Résumé
echo ""
echo "=== Configuration terminée ==="
echo ""
echo "✅ Apache est configuré comme reverse proxy vers nginx container"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Modifiez docker-compose.prod.yml pour changer les ports nginx:"
echo "      ports:"
echo "        - \"127.0.0.1:8080:80\""
echo "        - \"127.0.0.1:8443:443\""
echo ""
echo "   2. Redémarrez nginx:"
echo "      docker-compose -f docker-compose.prod.yml up -d nginx"
echo ""
echo "   3. Vérifiez que nginx écoute sur les nouveaux ports:"
echo "      netstat -tuln | grep 8080"
echo ""
echo "   4. Testez l'application:"
echo "      curl -I https://prinnov.benit.biz"
echo ""
echo "📋 Commandes utiles:"
echo "   - Logs Apache: sudo tail -f /var/log/apache2/prixddi_error.log"
echo "   - Logs Nginx: docker logs prixddi_nginx_prod"
echo "   - Tester nginx: curl http://localhost:8080"

