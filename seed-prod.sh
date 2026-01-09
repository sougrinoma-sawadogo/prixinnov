#!/bin/bash

# Script to run database seeders in production

echo "🌱 Running database seeders in production..."
echo ""

# Check if backend container is running
BACKEND_CONTAINER=$(docker-compose -f docker-compose.prod.yml --env-file .env.prod ps -q backend)

if [ -z "$BACKEND_CONTAINER" ]; then
    echo "❌ Backend container is not running!"
    echo "Please start it first:"
    echo "  docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d backend"
    exit 1
fi

echo "✅ Backend container is running"
echo ""

# Run seeders
echo "📊 Running all seeders..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod exec backend npm run db:seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Seeders executed successfully!"
    echo ""
    echo "📝 Created users:"
    echo "   - admin@mef.gov.bf (password: Admin123!)"
    echo "   - secretaire.technique@mef.gov.bf (password: Admin123!)"
    echo ""
    echo "⚠️  IMPORTANT: Change these passwords after first login!"
else
    echo ""
    echo "❌ Seeder execution failed!"
    echo "Check logs with:"
    echo "  docker-compose -f docker-compose.prod.yml --env-file .env.prod logs backend"
    exit 1
fi

