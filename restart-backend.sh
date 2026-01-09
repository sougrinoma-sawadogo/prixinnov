#!/bin/bash

# Script to restart backend and fix common issues

echo "🔧 Restarting backend service..."
echo ""

# Fix uploads permissions first
echo "1️⃣ Fixing uploads directory permissions..."
sudo chown -R 1001:1001 ./backend/uploads 2>/dev/null || chown -R 1001:1001 ./backend/uploads 2>/dev/null
sudo chmod -R 755 ./backend/uploads 2>/dev/null || chmod -R 755 ./backend/uploads 2>/dev/null
echo "✅ Permissions fixed"
echo ""

# Pull latest changes
echo "2️⃣ Pulling latest changes..."
git pull origin main
echo ""

# Rebuild backend
echo "3️⃣ Rebuilding backend container..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod build --no-cache backend
echo ""

# Stop backend
echo "4️⃣ Stopping backend..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod stop backend
docker-compose -f docker-compose.prod.yml --env-file .env.prod rm -f backend
echo ""

# Start backend
echo "5️⃣ Starting backend..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d backend
echo ""

# Wait a bit
echo "6️⃣ Waiting for backend to start..."
sleep 10
echo ""

# Check status
echo "7️⃣ Checking backend status..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod ps backend
echo ""

# Show logs
echo "8️⃣ Recent backend logs:"
docker-compose -f docker-compose.prod.yml --env-file .env.prod logs --tail=20 backend
echo ""

# Test health
echo "9️⃣ Testing backend health..."
sleep 5
if curl -f -s http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
    curl -s http://localhost/api/health | jq . 2>/dev/null || curl -s http://localhost/api/health
else
    echo "❌ Backend health check failed"
    echo "Check logs with: docker-compose -f docker-compose.prod.yml --env-file .env.prod logs -f backend"
fi
echo ""

echo "✅ Restart complete!"

