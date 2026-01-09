#!/bin/bash

# Script to clean up Docker containers and volumes
# Use this if you encounter ContainerConfig errors

echo "🧹 Cleaning up Docker containers and volumes..."

# Stop and remove containers
docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true

# Remove any orphaned containers
docker ps -a | grep prixddi | awk '{print $1}' | xargs -r docker rm -f 2>/dev/null || true

# Remove any orphaned volumes (be careful with this)
docker volume ls | grep prixddi | awk '{print $2}' | xargs -r docker volume rm 2>/dev/null || true

# Remove any orphaned networks
docker network ls | grep prixddi | awk '{print $1}' | xargs -r docker network rm 2>/dev/null || true

# Prune system (optional - removes unused images, containers, networks)
# Uncomment if you want a more aggressive cleanup
# docker system prune -a -f

echo "✅ Cleanup complete!"
echo ""
echo "You can now run:"
echo "  ./deploy.sh"
echo "  or"
echo "  docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d"

