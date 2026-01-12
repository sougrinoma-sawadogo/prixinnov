#!/bin/bash

# Script to deploy Prix DDI with Apache as reverse proxy

set -e

echo "=== Prix DDI Deployment with Apache ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Step 1: Enable required Apache modules
echo -e "${YELLOW}Step 1: Enabling Apache modules...${NC}"
a2enmod proxy
a2enmod proxy_http
a2enmod ssl
a2enmod headers
a2enmod rewrite

# Step 2: Copy Apache configuration
echo -e "${YELLOW}Step 2: Copying Apache configuration...${NC}"
if [ -f "apache/prixddi.conf" ]; then
    cp apache/prixddi.conf /etc/apache2/sites-available/prixddi.conf
    echo -e "${GREEN}Apache configuration copied${NC}"
else
    echo -e "${RED}Error: apache/prixddi.conf not found${NC}"
    exit 1
fi

# Step 3: Enable the site
echo -e "${YELLOW}Step 3: Enabling Apache site...${NC}"
a2ensite prixddi.conf

# Step 4: Test Apache configuration
echo -e "${YELLOW}Step 4: Testing Apache configuration...${NC}"
if apache2ctl configtest; then
    echo -e "${GREEN}Apache configuration is valid${NC}"
else
    echo -e "${RED}Apache configuration has errors. Please fix them before continuing.${NC}"
    exit 1
fi

# Step 5: Build and extract frontend
echo -e "${YELLOW}Step 5: Building frontend...${NC}"
cd frontend
npm install
npm run build
cd ..

# Step 6: Copy frontend files
echo -e "${YELLOW}Step 6: Copying frontend files...${NC}"
mkdir -p /var/www/prixddi/frontend/dist
cp -r frontend/dist/* /var/www/prixddi/frontend/dist/
chown -R www-data:www-data /var/www/prixddi
echo -e "${GREEN}Frontend files copied${NC}"

# Step 7: Start Docker containers
echo -e "${YELLOW}Step 7: Starting Docker containers...${NC}"
docker-compose -f docker-compose.prod.apache.yml up -d

# Step 8: Wait for services to be ready
echo -e "${YELLOW}Step 8: Waiting for services to start...${NC}"
sleep 10

# Step 9: Reload Apache
echo -e "${YELLOW}Step 9: Reloading Apache...${NC}"
systemctl reload apache2

# Step 10: Check status
echo -e "${YELLOW}Step 10: Checking service status...${NC}"
echo ""
echo "Docker containers:"
docker ps --filter "name=prixddi"

echo ""
echo "Apache status:"
systemctl status apache2 --no-pager -l

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Your application should be available at: https://prinnov.benit.biz"
echo ""
echo "To check logs:"
echo "  - Apache: sudo tail -f /var/log/apache2/prixddi_error.log"
echo "  - Backend: docker logs prixddi_backend_prod"
echo "  - Frontend: docker logs prixddi_frontend_prod"

