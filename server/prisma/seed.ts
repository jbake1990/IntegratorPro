import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@integratorpro.com' },
    update: {
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true
    },
    create: {
      username: 'admin',
      email: 'admin@integratorpro.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true
    }
  });

  console.log('✅ Admin user created:', adminUser.username);

  // Create some sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: {
        name: 'Electronics',
        description: 'Electronic components and devices'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Tools' },
      update: {},
      create: {
        name: 'Tools',
        description: 'Hand tools and power tools'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Cables' },
      update: {},
      create: {
        name: 'Cables',
        description: 'Various types of cables and connectors'
      }
    })
  ]);

  console.log('✅ Sample categories created');

  // Create sample warehouses
  const warehouses = await Promise.all([
    prisma.warehouse.upsert({
      where: { id: 'warehouse-main' },
      update: {},
      create: {
        id: 'warehouse-main',
        name: 'Main Warehouse',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        phone: '555-123-4567',
        isActive: true
      }
    }),
    prisma.warehouse.upsert({
      where: { id: 'warehouse-secondary' },
      update: {},
      create: {
        id: 'warehouse-secondary',
        name: 'Secondary Warehouse',
        address: '456 Oak Ave',
        city: 'Somewhere',
        state: 'CA',
        zipCode: '90211',
        phone: '555-987-6543',
        isActive: true
      }
    })
  ]);

  console.log('✅ Sample warehouses created');

  // Create sample vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { licensePlate: 'ABC123' },
      update: {},
      create: {
        name: 'Service Van 1',
        licensePlate: 'ABC123',
        make: 'Ford',
        model: 'Transit',
        year: 2020,
        isActive: true
      }
    }),
    prisma.vehicle.upsert({
      where: { licensePlate: 'XYZ789' },
      update: {},
      create: {
        name: 'Service Van 2',
        licensePlate: 'XYZ789',
        make: 'Chevrolet',
        model: 'Express',
        year: 2019,
        isActive: true
      }
    })
  ]);

  console.log('✅ Sample vehicles created');

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { id: 'customer-acme' },
      update: {},
      create: {
        id: 'customer-acme',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '555-111-2222',
        address: '789 Business Blvd',
        city: 'Business City',
        state: 'CA',
        zipCode: '90212',
        isActive: true
      }
    }),
    prisma.customer.upsert({
      where: { id: 'customer-tech' },
      update: {},
      create: {
        id: 'customer-tech',
        name: 'Tech Solutions Inc',
        email: 'info@techsolutions.com',
        phone: '555-333-4444',
        address: '321 Tech Way',
        city: 'Tech Town',
        state: 'CA',
        zipCode: '90213',
        isActive: true
      }
    })
  ]);

  console.log('✅ Sample customers created');

  // Create sample vendors
  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: { id: 'vendor-supply' },
      update: {},
      create: {
        id: 'vendor-supply',
        name: 'Supply Co',
        email: 'sales@supplyco.com',
        phone: '555-555-6666',
        address: '654 Supply St',
        city: 'Supply City',
        state: 'CA',
        zipCode: '90214',
        contactPerson: 'John Supplier',
        isActive: true
      }
    }),
    prisma.vendor.upsert({
      where: { id: 'vendor-parts' },
      update: {},
      create: {
        id: 'vendor-parts',
        name: 'Parts Unlimited',
        email: 'orders@partsunlimited.com',
        phone: '555-777-8888',
        address: '987 Parts Ave',
        city: 'Parts Town',
        state: 'CA',
        zipCode: '90215',
        contactPerson: 'Jane Parts',
        isActive: true
      }
    })
  ]);

  console.log('✅ Sample vendors created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📋 Admin Credentials:');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('Email: admin@integratorpro.com');
  console.log('');
  console.log('🔐 You can now log in with these credentials');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 