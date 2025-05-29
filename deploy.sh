#!/bin/bash

# Shoppy Bird v2 - Deployment Script
echo "🚀 Starting Shoppy Bird v2 deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Format code
echo "✨ Formatting code..."
npm run format

# Build the project
echo "🏗️ Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Ready for Vercel deployment!"
    echo ""
    echo "Next steps:"
    echo "1. npm install -g vercel"
    echo "2. vercel login"
    echo "3. vercel --prod"
else
    echo "❌ Build failed! Please fix the errors before deploying."
    exit 1
fi
