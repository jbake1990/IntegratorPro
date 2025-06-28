# Integrator Pro - Setup Guide

This guide will walk you through setting up the Integrator Pro business management system on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Setup

### 1. Install Dependencies

Run the following command from the project root to install all dependencies:

```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Backend server (Node.js/Express)
- Frontend client (React)

### 2. Database Setup

#### Create PostgreSQL Database

1. Open your PostgreSQL client (pgAdmin, psql, or any GUI tool)
2. Create a new database named `integrator_pro`
3. Note down your database credentials

#### Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp server/env.example server/.env
   ```

2. Edit `server/.env` and update the following:
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/integrator_pro"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

### 3. Initialize Database

Run the database setup command:

```bash
npm run setup-db
```

This will:
- Generate Prisma client
- Run database migrations
- Seed the database with sample data

### 4. Start the Application

Start both the backend and frontend servers:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Default Login Credentials

After running the seed script, you can log in with:

- **Email**: admin@integratorpro.com
- **Password**: admin123

## Manual Setup (Alternative)

If you prefer to set up each part manually:

### Backend Setup

```bash
cd server
npm install
cp env.example .env
# Edit .env with your database credentials
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

## Project Structure

```
integrator-pro/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── src/               # Source code
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema and migrations
│   └── package.json
├── database/              # Database scripts and documentation
├── docs/                  # Project documentation
└── package.json
```

## Features Overview

### Core Modules

1. **Inventory Management**
   - Track items in warehouse and vehicles
   - Set minimum/maximum stock levels
   - Barcode support
   - Location tracking

2. **Invoicing System**
   - Create professional invoices
   - Multiple status tracking
   - PDF generation
   - Email integration

3. **Purchase Orders**
   - Vendor management
   - PO creation and tracking
   - Cost tracking
   - Receiving integration

4. **Receiving**
   - Track incoming inventory
   - Update stock levels
   - Quality control
   - Cost allocation

5. **Point of Sale**
   - Retail sales interface
   - Quick item lookup
   - Payment processing
   - Receipt printing

6. **Vehicle Management**
   - Track inventory on service vehicles
   - Assign technicians
   - Mobile inventory tracking

7. **Reporting**
   - Sales reports
   - Inventory reports
   - Financial reports
   - Custom dashboards

## Development Commands

### Backend Commands

```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

### Frontend Commands

```bash
cd client
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
```

### Root Commands

```bash
npm run dev         # Start both servers
npm run server      # Start only backend
npm run client      # Start only frontend
npm run build       # Build frontend
npm run setup-db    # Setup database
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `integrator_pro` exists

2. **Port Already in Use**
   - Backend: Change `PORT` in `.env`
   - Frontend: Change port in `client/package.json`

3. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Prisma Issues**
   - Run `npm run db:generate` in server directory
   - Check database connection
   - Verify schema syntax

### Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Ensure database is properly configured
4. Check environment variables are set correctly

## Next Steps

After successful setup:

1. **Explore the Application**
   - Log in with admin credentials
   - Navigate through different modules
   - Review sample data

2. **Customize for Your Business**
   - Add your company information
   - Create custom categories
   - Set up your warehouse locations
   - Add your vehicles

3. **User Management**
   - Create additional user accounts
   - Set appropriate roles and permissions
   - Configure user access

4. **Data Import**
   - Import existing inventory
   - Add customer database
   - Set up vendor relationships

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment
2. Use a production PostgreSQL instance
3. Configure proper JWT secrets
4. Set up SSL certificates
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

## Support

For technical support or questions:
- Check the documentation in the `docs/` folder
- Review the API documentation
- Contact the development team 