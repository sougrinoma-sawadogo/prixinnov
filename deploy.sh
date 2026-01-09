#!/bin/bash

# Deployment script for Prix DDI application
# Domain: prinnov.benit.biz

set -e

echo "🚀 Starting deployment for prinnov.benit.biz..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo -e "${RED}❌ Error: .env.prod file not found!${NC}"
    echo "Please create .env.prod file with required environment variables."
    echo "You can copy .env.prod.example and fill in the values."
    exit 1
fi

# Load environment variables
export $(cat .env.prod | grep -v '^#' | xargs)

# Check required environment variables
REQUIRED_VARS=("DB_PASSWORD" "JWT_SECRET" "EMAIL_HOST" "EMAIL_USER" "EMAIL_PASSWORD" "EMAIL_FROM")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Error: $var is not set in .env.prod${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment variables loaded${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check SSL certificates
if [ ! -f nginx/ssl/fullchain.pem ] || [ ! -f nginx/ssl/privkey.pem ]; then
    echo -e "${YELLOW}⚠️  SSL certificates not found in nginx/ssl/${NC}"
    echo "Please obtain SSL certificates (Let's Encrypt recommended) and place them in:"
    echo "  - nginx/ssl/fullchain.pem"
    echo "  - nginx/ssl/privkey.pem"
    echo ""
    echo "You can use certbot to obtain certificates:"
    echo "  certbot certonly --standalone -d prinnov.benit.biz -d www.prinnov.benit.biz"
    echo ""
    read -p "Continue without SSL? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down || true

# Build and start services
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo -e "${YELLOW}🏥 Checking service health...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Waiting for backend... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "Checking logs..."
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

# Show running containers
echo -e "${GREEN}📦 Running containers:${NC}"
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo -e "${GREEN}📋 Recent logs:${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=50

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Application is available at:"
echo "   - https://prinnov.benit.biz"
echo ""
echo "📊 To view logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f docker-compose.prod.yml down"
echo ""

