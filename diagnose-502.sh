#!/bin/bash

# Script to diagnose 502 Bad Gateway errors

echo "🔍 Diagnosing 502 Bad Gateway error..."
echo ""

# Check if backend container is running
echo "1️⃣ Checking backend container status:"
BACKEND_STATUS=$(docker-compose -f docker-compose.prod.yml --env-file .env.prod ps backend | grep -v "NAME" | awk '{print $1}')
if [ -z "$BACKEND_STATUS" ] || [ "$BACKEND_STATUS" = "prixddi_backend_prod" ]; then
    docker-compose -f docker-compose.prod.yml --env-file .env.prod ps backend
else
    echo "❌ Backend container is not running!"
fi
echo ""

# Check backend logs
echo "2️⃣ Recent backend logs (last 30 lines):"
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs --tail=30 backend
echo ""

# Check if backend is listening on port 3000
echo "3️⃣ Checking if backend is listening on port 3000:"
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend netstat -tuln 2>/dev/null | grep 3000 || \
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend ss -tuln 2>/dev/null | grep 3000 || \
echo "⚠️  Cannot check port (container might not be running)"
echo ""

# Test backend connectivity from nginx container
echo "4️⃣ Testing backend connectivity from nginx:"
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec nginx wget -qO- http://backend:3000/api/health 2>&1 || \
echo "❌ Cannot connect to backend from nginx"
echo ""

# Check network connectivity
echo "5️⃣ Checking Docker network:"
docker network inspect prixddi_network 2>/dev/null | grep -A 5 "Containers" || \
echo "⚠️  Network might not exist"
echo ""

# Check nginx error logs
echo "6️⃣ Nginx error logs (last 20 lines):"
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec nginx tail -20 /var/log/nginx/error.log 2>/dev/null || \
echo "⚠️  Cannot read nginx error log"
echo ""

# Check backend environment variables
echo "7️⃣ Checking backend environment (PORT):"
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend printenv PORT 2>/dev/null || \
echo "⚠️  Cannot check environment variables"
echo ""

echo "✅ Diagnosis complete!"
echo ""
echo "Common fixes:"
echo "  1. Restart backend: docker-compose -f docker-compose.prod.yml --env-file .env.prod restart backend"
echo "  2. Rebuild backend: docker-compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache backend"
echo "  3. Check backend logs: docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f backend"

