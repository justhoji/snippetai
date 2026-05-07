import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      console.log('CREATED_USER_ID=' + user.id);
    } else {
      console.log('EXISTING_USER_ID=' + user.id);
    }
  } catch (err) {
    console.error('DATABASE_ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
