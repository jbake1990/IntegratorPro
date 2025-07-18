const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('Testing login functionality...');
    
    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:', {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      isActive: adminUser.isActive
    });
    
    // Test password verification
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);
    
    if (isMatch) {
      console.log('✅ Password verification successful');
    } else {
      console.log('❌ Password verification failed');
    }
    
    // Test with wrong password
    const wrongPassword = 'wrongpassword';
    const isWrongMatch = await bcrypt.compare(wrongPassword, adminUser.password);
    
    if (!isWrongMatch) {
      console.log('✅ Wrong password correctly rejected');
    } else {
      console.log('❌ Wrong password incorrectly accepted');
    }
    
  } catch (error) {
    console.error('❌ Login test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 