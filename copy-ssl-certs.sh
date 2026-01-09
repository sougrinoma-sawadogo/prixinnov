#!/bin/bash

# Script to copy Let's Encrypt certificates to project directory
# Run this on your production server after obtaining certificates

set -e

echo "🔐 Copying SSL certificates to project directory..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create ssl directory if it doesn't exist
mkdir -p nginx/ssl

# Copy certificates from Let's Encrypt
sudo cp /etc/letsencrypt/live/prinnov.benit.biz/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/prinnov.benit.biz/privkey.pem nginx/ssl/

# Set proper permissions
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem

# Change ownership to current user (so Docker can read them)
sudo chown $USER:$USER nginx/ssl/*.pem

echo "✅ Certificates copied successfully!"
echo ""
echo "Certificate location: nginx/ssl/"
echo "  - fullchain.pem"
echo "  - privkey.pem"
echo ""
echo "Certificate expires on: 2026-04-09"
echo ""
echo "You can now deploy your application with:"
echo "  ./deploy.sh"
echo ""

