#!/bin/bash

# Force cleanup script for corrupted Docker containers

echo "🧹 Force cleaning up Docker containers and volumes..."
echo ""

# Stop all containers
echo "1️⃣ Stopping all containers..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod down 2>/dev/null || true
docker stop $(docker ps -aq --filter "name=prixddi") 2>/dev/null || true
echo "✅ Containers stopped"
echo ""

# Remove all containers
echo "2️⃣ Removing all containers..."
docker rm -f $(docker ps -aq --filter "name=prixddi") 2>/dev/null || true
docker-compose -f docker-compose.prod.yml --env-file .env.prod rm -f 2>/dev/null || true
echo "✅ Containers removed"
echo ""

# Remove orphaned containers
echo "3️⃣ Removing orphaned containers..."
docker container prune -f
echo "✅ Orphaned containers removed"
echo ""

# Remove networks (be careful - this removes the network)
echo "4️⃣ Removing networks..."
docker network rm prixddi_network 2>/dev/null || true
docker network prune -f
echo "✅ Networks cleaned"
echo ""

# Note: We're NOT removing volumes to preserve data
echo "⚠️  Volumes are preserved to keep your data safe"
echo ""

echo "✅ Cleanup complete!"
echo ""
echo "Now you can start fresh:"
echo "  docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d"
echo ""

