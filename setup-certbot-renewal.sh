#!/bin/bash

# Script to set up automatic certificate renewal with deploy hook
# This ensures certificates are automatically copied to the project when renewed

set -e

echo "🔄 Setting up automatic certificate renewal..."

# Get the project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$SCRIPT_DIR"

# Create renewal deploy hook script
sudo tee /etc/letsencrypt/renewal-hooks/deploy/copy-to-project.sh > /dev/null <<EOF
#!/bin/bash
# Copy renewed certificates to project directory
cp /etc/letsencrypt/live/prinnov.benit.biz/fullchain.pem $PROJECT_DIR/nginx/ssl/
cp /etc/letsencrypt/live/prinnov.benit.biz/privkey.pem $PROJECT_DIR/nginx/ssl/
chmod 644 $PROJECT_DIR/nginx/ssl/fullchain.pem
chmod 600 $PROJECT_DIR/nginx/ssl/privkey.pem
chown $USER:$USER $PROJECT_DIR/nginx/ssl/*.pem

# Restart nginx container to use new certificates
cd $PROJECT_DIR
docker-compose -f docker-compose.prod.yml restart nginx || true
EOF

# Make the script executable
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/copy-to-project.sh

echo "✅ Automatic renewal hook configured!"
echo ""
echo "Certificates will be automatically:"
echo "  1. Renewed by Certbot (runs twice daily)"
echo "  2. Copied to nginx/ssl/ directory"
echo "  3. Nginx container will be restarted"
echo ""
echo "Test renewal with:"
echo "  sudo certbot renew --dry-run"
echo ""

