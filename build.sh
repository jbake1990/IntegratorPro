#!/bin/bash

# Build script for Vercel deployment

echo "🚀 Starting Integrator Pro build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "🔧 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "🎨 Installing client dependencies..."
cd client
npm install

# Build client
echo "🏗️ Building client application..."
npm run build
cd ..

echo "✅ Build process completed!" 