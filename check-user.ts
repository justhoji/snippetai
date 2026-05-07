import { PrismaClient } from './backend/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    console.log('Created test user:', user.id);
  } else {
    console.log('Found existing user:', user.id);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
