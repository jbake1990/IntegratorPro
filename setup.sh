#!/bin/bash

# Integrator Pro Setup Script
# This script will help you set up the Integrator Pro application

set -e

echo "🚀 Welcome to Integrator Pro Setup!"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   Please install PostgreSQL v12 or higher."
    echo "   Download from: https://www.postgresql.org/download/"
    echo ""
    read -p "Continue with setup anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ PostgreSQL detected"
fi

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Dependencies installed successfully!"

# Database setup
echo ""
echo "🗄️  Database Setup"
echo "=================="

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "📝 Creating environment file..."
    cp server/env.example server/.env
    echo "✅ Environment file created: server/.env"
    echo ""
    echo "⚠️  IMPORTANT: Please edit server/.env and update your database credentials:"
    echo "   - DATABASE_URL: Your PostgreSQL connection string"
    echo "   - JWT_SECRET: A secure random string for JWT tokens"
    echo ""
    read -p "Press Enter when you've updated the .env file..."
else
    echo "✅ Environment file already exists"
fi

# Database setup
echo ""
echo "🗄️  Setting up database..."
cd server

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

# Run migrations
echo "Running database migrations..."
npm run db:migrate

# Seed database
echo "Seeding database with sample data..."
npm run db:seed

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "📋 Next steps:"
echo "1. Start the application: npm run dev"
echo "2. Open your browser to: http://localhost:3000"
echo "3. Log in with:"
echo "   - Email: admin@integratorpro.com"
echo "   - Password: admin123"
echo ""
echo "📚 For more information, see SETUP.md"
echo ""
echo "Happy integrating! 🚀" 