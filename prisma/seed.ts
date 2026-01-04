import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // CREATE DOCTORS
  // ============================================

  // Doctor 1: Teodora PARASCHIV (Psychiatrist)
  const doctor1 = await prisma.doctor.upsert({
    where: { email: 'teodora@clinica.ro' },
    update: {},
    create: {
      email: 'teodora@clinica.ro',
      name: 'Dr. Teodora PARASCHIV',
      speciality: 'Psychiatrist',
      phone: '+40711111111',
      bio: 'Specialist în psihiatrie pentru adulți cu 15+ ani experiență',
      workingHoursStart: 900, // 09:00
      workingHoursEnd: 1700, // 17:00
      slotDuration: 60, // 60 min consultații
      breakBetweenSlots: 15, // 15 min pauză
      // Password: "test123"
      passwordHash: await bcrypt.hash('test123', 10),
      isActive: true,
    },
  });
  console.log('✅ Created doctor:', doctor1.name);

  // Doctor 2: George REBEGEA (Psychologist)
  const doctor2 = await prisma.doctor.upsert({
    where: { email: 'george@clinica.ro' },
    update: {},
    create: {
      email: 'george@clinica.ro',
      name: 'George REBEGEA',
      speciality: 'Psychologist',
      phone: '+40722222222',
      bio: 'Psihoterapeut și psiholog clinic cu certificări internaționale',
      workingHoursStart: 1000, // 10:00
      workingHoursEnd: 1900, // 19:00
      slotDuration: 50, // 50 min sesii
      breakBetweenSlots: 10,
      // Password: "test123"
      passwordHash: await bcrypt.hash('test123', 10),
      isActive: true,
    },
  });
  console.log('✅ Created doctor:', doctor2.name);

  // ============================================
  // CREATE SERVICES
  // ============================================

  // Services for Teodora (Psychiatrist)
  const service1 = await prisma.service.create({
    data: {
      name: 'Psychiatric Consultation',
      description: 'Initial psychiatric evaluation and treatment planning',
      duration: 60,
      price: '200.00',
      doctorId: doctor1.id,
    },
  });
  console.log('✅ Created service:', service1.name);

  const service2 = await prisma.service.create({
    data: {
      name: 'Follow-up Consultation',
      description: 'Regular psychiatric follow-up session',
      duration: 45,
      price: '150.00',
      doctorId: doctor1.id,
    },
  });
  console.log('✅ Created service:', service2.name);

  // Services for George (Psychologist)
  const service3 = await prisma.service.create({
    data: {
      name: 'Individual Psychotherapy',
      description: 'One-on-one psychotherapy session',
      duration: 50,
      price: '150.00',
      doctorId: doctor2.id,
    },
  });
  console.log('✅ Created service:', service3.name);

  const service4 = await prisma.service.create({
    data: {
      name: 'Couples Therapy',
      description: 'Therapy session for couples',
      duration: 60,
      price: '180.00',
      doctorId: doctor2.id,
    },
  });
  console.log('✅ Created service:', service4.name);

  console.log('✅ Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
