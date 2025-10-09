#!/bin/bash

echo "🚀 Starting production build with permission fixes..."

# Set proper permissions
echo "🔧 Setting proper permissions..."
chmod -R 755 .
chmod -R 777 .next 2>/dev/null || true

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out

# Create .next directory with proper permissions
mkdir -p .next
chmod 777 .next

# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Set proper permissions for build output
    chmod -R 755 .next
    chmod -R 644 .next/static 2>/dev/null || true
    
    echo "🎉 Production build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
