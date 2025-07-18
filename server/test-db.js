const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true
      }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser);
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Count total users
    const userCount = await prisma.user.count();
    console.log(`Total users in database: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 