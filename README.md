# Integrator Pro - Business Management System

A comprehensive business management solution designed specifically for the custom integration industry. This system handles inventory management, invoicing, purchase orders, receiving, and point of sale operations.

## Features

### Core Modules
- **Inventory Management**: Track inventory in warehouse and across multiple service vehicles
- **Invoicing System**: Create professional invoices from inventory items
- **Purchase Orders**: Manage vendor relationships and purchase orders
- **Receiving**: Track incoming inventory and update stock levels
- **Point of Sale**: Retail sales interface for walk-in customers
- **Vehicle Management**: Track inventory on service vehicles
- **Reporting**: Comprehensive business analytics and reporting

### Future Integrations
- QuickBooks integration for accounting
- Barcode scanning for inventory
- Mobile app for field technicians
- Customer relationship management (CRM)

## Technology Stack

- **Frontend**: React 18 with TypeScript, Material-UI
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io for live updates

## Project Structure

```
integrator-pro/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── database/              # Database migrations and seeds
├── docs/                  # Documentation
└── shared/                # Shared types and utilities
```

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Setup Database**
   ```bash
   npm run setup-db
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

## Environment Setup

Create a `.env` file in the server directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/integrator_pro"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

## Development

- **Frontend Development**: `npm run client`
- **Backend Development**: `npm run server`
- **Full Stack Development**: `npm run dev`

## Database Schema

The system uses a comprehensive database schema with the following main entities:
- Users and Authentication
- Inventory Items and Categories
- Warehouses and Vehicles
- Customers and Vendors
- Invoices and Purchase Orders
- Transactions and Payments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details 