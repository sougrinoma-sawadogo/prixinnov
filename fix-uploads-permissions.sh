#!/bin/bash

# Script to fix uploads directory permissions for Docker container
# Run this on your production server

echo "🔧 Fixing uploads directory permissions..."

# Get the directory
UPLOADS_DIR="./backend/uploads"

# Create directory if it doesn't exist
mkdir -p "$UPLOADS_DIR"

# Set ownership to match container user (UID 1001)
# This assumes your host user can use sudo
if [ -w "$UPLOADS_DIR" ]; then
    # If we can write, try to change ownership
    sudo chown -R 1001:1001 "$UPLOADS_DIR" 2>/dev/null || \
    chown -R 1001:1001 "$UPLOADS_DIR" 2>/dev/null || \
    echo "⚠️  Could not change ownership. You may need to run: sudo chown -R 1001:1001 $UPLOADS_DIR"
else
    echo "⚠️  Cannot write to $UPLOADS_DIR. Using sudo..."
    sudo chown -R 1001:1001 "$UPLOADS_DIR"
fi

# Set permissions
chmod -R 755 "$UPLOADS_DIR" 2>/dev/null || sudo chmod -R 755 "$UPLOADS_DIR"

echo "✅ Permissions fixed!"
echo ""
echo "Directory: $UPLOADS_DIR"
ls -la "$UPLOADS_DIR" | head -5

