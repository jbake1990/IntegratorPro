"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@integratorpro.com' },
        update: {},
        create: {
            email: 'admin@integratorpro.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        },
    });
    const mainWarehouse = await prisma.warehouse.upsert({
        where: { name: 'Main Warehouse' },
        update: {},
        create: {
            name: 'Main Warehouse',
            address: '123 Business St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '90210',
            phone: '(555) 123-4567',
        },
    });
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Audio Equipment' },
            update: {},
            create: {
                name: 'Audio Equipment',
                description: 'Speakers, amplifiers, and audio processing equipment',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Video Equipment' },
            update: {},
            create: {
                name: 'Video Equipment',
                description: 'Displays, projectors, and video processing equipment',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Control Systems' },
            update: {},
            create: {
                name: 'Control Systems',
                description: 'Control processors, touch panels, and automation equipment',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Cables & Connectors' },
            update: {},
            create: {
                name: 'Cables & Connectors',
                description: 'Various cables, connectors, and termination supplies',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Tools & Equipment' },
            update: {},
            create: {
                name: 'Tools & Equipment',
                description: 'Installation tools and testing equipment',
            },
        }),
    ]);
    const items = await Promise.all([
        prisma.item.upsert({
            where: { sku: 'SPK-001' },
            update: {},
            create: {
                sku: 'SPK-001',
                name: 'In-Ceiling Speaker 8"',
                description: '8-inch in-ceiling speaker with back can',
                categoryId: categories[0].id,
                brand: 'SpeakerBrand',
                model: 'IC8',
                cost: 89.99,
                price: 149.99,
                minStock: 10,
                maxStock: 50,
                weight: 2.5,
                dimensions: '8" x 8" x 4"',
            },
        }),
        prisma.item.upsert({
            where: { sku: 'AMP-001' },
            update: {},
            create: {
                sku: 'AMP-001',
                name: 'Multi-Zone Amplifier',
                description: '6-zone amplifier with 50W per channel',
                categoryId: categories[0].id,
                brand: 'AmpBrand',
                model: 'MZ6-50',
                cost: 299.99,
                price: 499.99,
                minStock: 5,
                maxStock: 20,
                weight: 8.0,
                dimensions: '17" x 3.5" x 12"',
            },
        }),
        prisma.item.upsert({
            where: { sku: 'TV-001' },
            update: {},
            create: {
                sku: 'TV-001',
                name: '65" 4K Smart TV',
                description: '65-inch 4K Ultra HD Smart LED TV',
                categoryId: categories[1].id,
                brand: 'TVBrand',
                model: '65UHD4K',
                cost: 599.99,
                price: 999.99,
                minStock: 3,
                maxStock: 15,
                weight: 45.0,
                dimensions: '57" x 33" x 3"',
            },
        }),
        prisma.item.upsert({
            where: { sku: 'CTRL-001' },
            update: {},
            create: {
                sku: 'CTRL-001',
                name: 'Control Processor',
                description: 'Central control processor for automation systems',
                categoryId: categories[2].id,
                brand: 'ControlBrand',
                model: 'CP-1000',
                cost: 899.99,
                price: 1499.99,
                minStock: 2,
                maxStock: 10,
                weight: 3.0,
                dimensions: '17" x 1.75" x 12"',
            },
        }),
        prisma.item.upsert({
            where: { sku: 'CBL-001' },
            update: {},
            create: {
                sku: 'CBL-001',
                name: 'HDMI Cable 50ft',
                description: '50-foot HDMI cable with gold-plated connectors',
                categoryId: categories[3].id,
                brand: 'CableBrand',
                model: 'HDMI-50G',
                cost: 19.99,
                price: 39.99,
                minStock: 20,
                maxStock: 100,
                weight: 0.5,
                dimensions: '50ft x 0.25"',
            },
        }),
    ]);
    await Promise.all([
        prisma.inventory.upsert({
            where: {
                itemId_warehouseId_vehicleId: {
                    itemId: items[0].id,
                    warehouseId: mainWarehouse.id,
                    vehicleId: null,
                },
            },
            update: {},
            create: {
                itemId: items[0].id,
                warehouseId: mainWarehouse.id,
                quantity: 25,
                location: 'A1-01',
            },
        }),
        prisma.inventory.upsert({
            where: {
                itemId_warehouseId_vehicleId: {
                    itemId: items[1].id,
                    warehouseId: mainWarehouse.id,
                    vehicleId: null,
                },
            },
            update: {},
            create: {
                itemId: items[1].id,
                warehouseId: mainWarehouse.id,
                quantity: 8,
                location: 'A2-01',
            },
        }),
        prisma.inventory.upsert({
            where: {
                itemId_warehouseId_vehicleId: {
                    itemId: items[2].id,
                    warehouseId: mainWarehouse.id,
                    vehicleId: null,
                },
            },
            update: {},
            create: {
                itemId: items[2].id,
                warehouseId: mainWarehouse.id,
                quantity: 5,
                location: 'B1-01',
            },
        }),
        prisma.inventory.upsert({
            where: {
                itemId_warehouseId_vehicleId: {
                    itemId: items[3].id,
                    warehouseId: mainWarehouse.id,
                    vehicleId: null,
                },
            },
            update: {},
            create: {
                itemId: items[3].id,
                warehouseId: mainWarehouse.id,
                quantity: 3,
                location: 'B2-01',
            },
        }),
        prisma.inventory.upsert({
            where: {
                itemId_warehouseId_vehicleId: {
                    itemId: items[4].id,
                    warehouseId: mainWarehouse.id,
                    vehicleId: null,
                },
            },
            update: {},
            create: {
                itemId: items[4].id,
                warehouseId: mainWarehouse.id,
                quantity: 50,
                location: 'C1-01',
            },
        }),
    ]);
    const customers = await Promise.all([
        prisma.customer.upsert({
            where: { email: 'john.doe@example.com' },
            update: {},
            create: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '(555) 123-4567',
                address: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zipCode: '90210',
            },
        }),
        prisma.customer.upsert({
            where: { email: 'jane.smith@example.com' },
            update: {},
            create: {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '(555) 987-6543',
                address: '456 Oak Ave',
                city: 'Somewhere',
                state: 'CA',
                zipCode: '90211',
            },
        }),
    ]);
    const vendors = await Promise.all([
        prisma.vendor.upsert({
            where: { name: 'Audio Supply Co.' },
            update: {},
            create: {
                name: 'Audio Supply Co.',
                email: 'sales@audiosupply.com',
                phone: '(800) 555-0123',
                address: '789 Industrial Blvd',
                city: 'Manufacturing City',
                state: 'CA',
                zipCode: '90212',
                contactPerson: 'Mike Johnson',
            },
        }),
        prisma.vendor.upsert({
            where: { name: 'Video Solutions Inc.' },
            update: {},
            create: {
                name: 'Video Solutions Inc.',
                email: 'orders@videosolutions.com',
                phone: '(800) 555-0456',
                address: '321 Tech Drive',
                city: 'Tech Town',
                state: 'CA',
                zipCode: '90213',
                contactPerson: 'Sarah Wilson',
            },
        }),
    ]);
    const vehicles = await Promise.all([
        prisma.vehicle.upsert({
            where: { licensePlate: 'ABC123' },
            update: {},
            create: {
                name: 'Service Van 1',
                licensePlate: 'ABC123',
                make: 'Ford',
                model: 'Transit',
                year: 2022,
                assignedTo: adminUser.id,
            },
        }),
        prisma.vehicle.upsert({
            where: { licensePlate: 'XYZ789' },
            update: {},
            create: {
                name: 'Service Van 2',
                licensePlate: 'XYZ789',
                make: 'Chevrolet',
                model: 'Express',
                year: 2021,
            },
        }),
    ]);
    console.log('✅ Database seeded successfully!');
    console.log(`👤 Admin user created: ${adminUser.email}`);
    console.log(`🏢 Warehouse created: ${mainWarehouse.name}`);
    console.log(`📦 ${categories.length} categories created`);
    console.log(`📋 ${items.length} items created`);
    console.log(`👥 ${customers.length} customers created`);
    console.log(`🏪 ${vendors.length} vendors created`);
    console.log(`🚐 ${vehicles.length} vehicles created`);
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map