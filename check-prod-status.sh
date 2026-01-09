#!/bin/bash

# Script to check production deployment status

echo "🔍 Checking production deployment status..."
echo ""

# Check if containers are running
echo "📦 Container Status:"
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps
echo ""

# Check container health
echo "🏥 Container Health:"
docker ps --filter "name=prixddi" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check backend health endpoint
echo "🔗 Backend Health Check:"
if curl -f -s https://prinnov.benit.biz/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
    curl -s https://prinnov.benit.biz/api/health | jq . 2>/dev/null || curl -s https://prinnov.benit.biz/api/health
else
    echo "❌ Backend health check failed"
fi
echo ""

# Check nginx status
echo "🌐 Nginx Status:"
if curl -f -s -I https://prinnov.benit.biz > /dev/null 2>&1; then
    echo "✅ Website is accessible"
    echo "   URL: https://prinnov.benit.biz"
else
    echo "❌ Website is not accessible"
fi
echo ""

# Check recent logs
echo "📋 Recent Backend Logs (last 10 lines):"
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs --tail=10 backend
echo ""

echo "📋 Recent Nginx Logs (last 10 lines):"
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs --tail=10 nginx
echo ""

echo "✅ Status check complete!"
echo ""
echo "🌐 Access your application at:"
echo "   https://prinnov.benit.biz"
echo ""
echo "📊 To view live logs:"
echo "   docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f"

