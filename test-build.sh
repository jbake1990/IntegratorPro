#!/bin/bash

echo "🧪 Testing Integrator Pro Build Process"
echo "======================================"

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
        exit 1
    fi
}

echo "📦 Installing dependencies..."
npm run install-all
check_status "Dependencies installation"

echo "🔨 Building client..."
cd client && npm run build
check_status "Client build"

echo "🔨 Building server..."
cd ../server && npm run build
check_status "Server build"

echo "🔨 Building API..."
cd ../api && npm run build
check_status "API build"

echo "🔍 Checking build outputs..."
if [ -d "client/build" ]; then
    echo "✅ Client build directory exists"
else
    echo "❌ Client build directory missing"
    exit 1
fi

if [ -d "server/dist" ]; then
    echo "✅ Server build directory exists"
else
    echo "❌ Server build directory missing"
    exit 1
fi

if [ -d "api/dist" ]; then
    echo "✅ API build directory exists"
else
    echo "❌ API build directory missing"
    exit 1
fi

echo ""
echo "🎉 All builds completed successfully!"
echo "🚀 Ready for Vercel deployment"
echo ""
echo "Next steps:"
echo "1. Push your changes to GitHub"
echo "2. Deploy to Vercel using the dashboard or CLI"
echo "3. Set up your environment variables in Vercel"
echo "4. Configure your database connection" 