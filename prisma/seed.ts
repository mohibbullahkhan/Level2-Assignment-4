import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@rentnest.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@rentnest.com',
      password: hashedPassword,
      role: Role.ADMIN,
      phone: '1234567890',
    },
  });
  console.log('Admin user seeded:', admin.email);

  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@rentnest.com' },
    update: {},
    create: {
      name: 'John Landlord',
      email: 'landlord@rentnest.com',
      password: hashedPassword,
      role: Role.LANDLORD,
      phone: '0987654321',
    },
  });
  
  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@rentnest.com' },
    update: {},
    create: {
      name: 'Jane Tenant',
      email: 'tenant@rentnest.com',
      password: hashedPassword,
      role: Role.TENANT,
      phone: '1122334455',
    },
  });

  const categories = ['Apartment', 'House', 'Studio', 'Condo', 'Duplex'];
  const dbCategories = [];
  
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} category` },
    });
    dbCategories.push(cat);
  }
  console.log('Categories seeded.');

  const property = await prisma.property.create({
    data: {
      title: 'Luxury Apartment in NYC',
      description: 'A beautiful luxury apartment...',
      address: '123 5th Ave',
      city: 'New York',
      price: 2500.00,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      amenities: ['WiFi', 'Pool', 'Gym'],
      landlordId: landlord.id,
      categoryId: dbCategories[0].id,
      images: ['https://example.com/image1.jpg']
    }
  });
  console.log('Sample property seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
