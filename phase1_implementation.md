# 🚀 PHASE 1: FOUNDATION IMPLEMENTATION

## Week 1-2: Database Setup & Authentication

---

## STEP 1: CREATE PRISMA SCHEMA

Create `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// DOCTORS
// ============================================
model Doctor {
  id                    String     @id @default(cuid())
  email                 String     @unique
  passwordHash          String
  
  name                  String
  phone                 String?
  speciality            String     // "Psychiatrist", "Psychologist", etc.
  bio                   String?
  profileImage          String?
  
  googleCalendarId      String?    // For sync
  googleCalendarEmail   String?    // Doctor's Google email
  
  color                 String     @default("#3B82F6") // Calendar color
  
  // Working hours
  workingHoursStart     Int        @default(900)    // 9:00 AM
  workingHoursEnd       Int        @default(1700)   // 5:00 PM
  slotDuration          Int        @default(60)     // minutes per slot
  breakBetweenSlots     Int        @default(15)     // break time
  
  // Business relationships
  services              Service[]
  bookings              Booking[]
  slots                 Slot[]
  
  // Metadata
  isActive              Boolean    @default(true)
  createdAt             DateTime   @default(now())
  updatedAt             DateTime   @updatedAt

  @@index([email])
}

// ============================================
// SERVICES
// ============================================
model Service {
  id                    String     @id @default(cuid())
  name                  String     // "Individual Psychotherapy", "Psychiatric Consultation"
  description           String?
  duration              Int        // minutes
  price                 Decimal    @db.Decimal(10, 2) // EUR
  
  isPayable             Boolean    @default(true)
  paymentRequired       Boolean    @default(false) // false = optional at booking
  
  doctorId              String
  doctor                Doctor     @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  
  bookings              Booking[]
  
  createdAt             DateTime   @default(now())
  updatedAt             DateTime   @updatedAt

  @@unique([doctorId, name])
  @@index([doctorId])
}

// ============================================
// BOOKINGS
// ============================================
model Booking {
  id                    String     @id @default(cuid())
  
  // Patient info
  patientName           String
  patientEmail          String
  patientPhone          String
  patientNote           String?
  
  // Appointment details
  doctorId              String
  doctor                Doctor     @relation(fields: [doctorId], references: [id], onDelete: Restrict)
  
  serviceId             String
  service               Service    @relation(fields: [serviceId], references: [id], onDelete: Restrict)
  
  appointmentDate       DateTime   // Full date + time
  duration              Int        // minutes (from service)
  
  // Status tracking
  status                BookingStatus @default(PENDING)
  cancellationReason    String?
  cancelledAt           DateTime?
  
  // Payment
  payment               Payment?
  
  // Google Calendar sync
  googleEventId         String?
  
  // Confirmation token (for email link)
  confirmationToken     String     @unique @default(cuid())
  
  // Relations
  notifications         Notification[]
  
  createdAt             DateTime   @default(now())
  updatedAt             DateTime   @updatedAt

  @@index([doctorId])
  @@index([patientEmail])
  @@index([appointmentDate])
  @@index([status])
}

enum BookingStatus {
  PENDING       // Waiting for confirmation/payment
  CONFIRMED     // Confirmed, no payment needed
  PAID          // Payment completed
  CANCELLED     // Cancelled
  COMPLETED     // Happened
  NO_SHOW       // Didn't show up
}

// ============================================
// PAYMENTS
// ============================================
model Payment {
  id                    String     @id @default(cuid())
  
  bookingId             String     @unique
  booking               Booking    @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  
  // Stripe
  stripePaymentIntentId String     @unique
  stripeCustomerId      String?
  
  amount                Decimal    @db.Decimal(10, 2) // EUR
  currency              String     @default("EUR")
  
  status                PaymentStatus @default(PENDING)
  
  receiptUrl            String?
  failureReason         String?
  
  createdAt             DateTime   @default(now())
  updatedAt             DateTime   @updatedAt

  @@index([bookingId])
  @@index([stripePaymentIntentId])
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  CANCELLED
  REFUNDED
}

// ============================================
// SLOTS (Available appointment times)
// ============================================
model Slot {
  id                    String     @id @default(cuid())
  
  doctorId              String
  doctor                Doctor     @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  
  date                  DateTime   @db.Date
  startTime             DateTime   // Full timestamp
  endTime               DateTime
  
  isAvailable           Boolean    @default(true)
  
  createdAt             DateTime   @default(now())

  @@unique([doctorId, startTime])
  @@index([doctorId])
  @@index([date])
  @@index([isAvailable])
}

// ============================================
// NOTIFICATIONS
// ============================================
model Notification {
  id                    String     @id @default(cuid())
  
  bookingId             String
  booking               Booking    @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  
  type                  NotificationType
  channel               NotificationChannel  // EMAIL or SMS
  recipient             String     // email or phone
  
  subject               String?    // For emails
  message               String
  
  status                NotificationStatus @default(PENDING)
  sentAt                DateTime?
  failureReason         String?
  
  createdAt             DateTime   @default(now())

  @@index([bookingId])
  @@index([status])
}

enum NotificationType {
  BOOKING_CONFIRMATION
  APPOINTMENT_REMINDER
  PAYMENT_RECEIVED
  CANCELLATION
  RESCHEDULE
}

enum NotificationChannel {
  EMAIL
  SMS
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
  BOUNCED
}
```

---

## STEP 2: SETUP .env FILE

Create `.env` in root:

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://user:password@localhost:5432/clinica_db"
# OR for cloud: postgresql://user:pass@db.railway.app:5432/clinica_db

# ============================================
# STRIPE KEYS
# ============================================
PUBLIC_STRIPE_KEY="pk_test_51234567890"  # Get from Stripe dashboard
SECRET_STRIPE_KEY="sk_test_51234567890"
STRIPE_WEBHOOK_SECRET="whsec_test_1234567890"  # After creating webhook

# ============================================
# GOOGLE CALENDAR
# ============================================
GOOGLE_CALENDAR_API_KEY="AIzaSy..."  # From Google Cloud Console
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_CALENDAR_PROJECT_ID="your-project-id"

# ============================================
# EMAIL (Resend)
# ============================================
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# ============================================
# SMS (Twilio)
# ============================================
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+40123456789"  # Your Twilio phone number

# ============================================
# SESSION & AUTH
# ============================================
SESSION_SECRET="your-super-secret-string-min-32-chars"

# ============================================
# APP CONFIG
# ============================================
PUBLIC_APP_URL="http://localhost:5173"
NODE_ENV="development"
```

Create `.env.example` (commit to git):

```env
DATABASE_URL="postgresql://user:password@host:5432/db"
PUBLIC_STRIPE_KEY="pk_test_..."
SECRET_STRIPE_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
GOOGLE_CALENDAR_API_KEY="..."
GOOGLE_CALENDAR_PRIVATE_KEY="..."
GOOGLE_CALENDAR_CLIENT_EMAIL="..."
RESEND_API_KEY="re_..."
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+40..."
SESSION_SECRET="min-32-characters-secret-key"
PUBLIC_APP_URL="https://clinicasfgherasim.ro"
NODE_ENV="production"
```

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## STEP 3: INSTALL DEPENDENCIES

```bash
npm install prisma @prisma/client
npm install stripe @stripe/stripe-js svelte-stripe
npm install zod            # Validation
npm install bcrypt         # Password hashing
npm install jwt            # Sessions (or use Lucia)
npm install axios          # HTTP client
npm install dotenv         # Env variables

# Dev dependencies
npm install -D prisma
npm install -D @types/node
```

---

## STEP 4: CREATE PRISMA SEED FILE

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create test doctors
  const doctor1 = await prisma.doctor.upsert({
    where: { email: 'teodora@clinica.ro' },
    update: {},
    create: {
      email: 'teodora@clinica.ro',
      name: 'Dr. Teodora PARASCHIV',
      speciality: 'Psychiatrist',
      phone: '+40711111111',
      bio: 'Specialist in adult psychiatry',
      color: '#E74C3C',
      passwordHash: await bcrypt.hash('test123', 10),
      workingHoursStart: 900,
      workingHoursEnd: 1700,
      slotDuration: 60,
      breakBetweenSlots: 15,
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { email: 'george@clinica.ro' },
    update: {},
    create: {
      email: 'george@clinica.ro',
      name: 'George REBEGEA',
      speciality: 'Psychologist',
      phone: '+40722222222',
      bio: 'Clinical psychologist and psychotherapist',
      color: '#3498DB',
      passwordHash: await bcrypt.hash('test123', 10),
      workingHoursStart: 1000,
      workingHoursEnd: 1900,
      slotDuration: 50,
      breakBetweenSlots: 10,
    },
  });

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: 'Individual Psychotherapy',
      description: 'One-on-one psychotherapy session',
      duration: 50,
      price: '150.00',
      isPayable: true,
      paymentRequired: false,
      doctorId: doctor2.id,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'Psychiatric Consultation',
      description: 'Psychiatric evaluation and treatment planning',
      duration: 60,
      price: '200.00',
      isPayable: true,
      paymentRequired: true,
      doctorId: doctor1.id,
    },
  });

  console.log('Seeded:', { doctor1, doctor2, service1, service2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

---

## STEP 5: INITIALIZE DATABASE

```bash
# Create migration
npx prisma migrate dev --name init

# Seed data
npx prisma db seed

# View data (Prisma Studio)
npx prisma studio
```

---

## STEP 6: CREATE DATABASE CLIENT

Create `src/lib/server/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## STEP 7: CREATE AUTH UTILITIES

Create `src/lib/server/utils/password.ts`:

```typescript
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

Create `src/lib/server/middleware/auth.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function protectRoute(event: RequestEvent) {
  const session = event.cookies.get('doctor_session');

  if (!session) {
    throw redirect(303, '/admin/login');
  }

  // Parse and validate session
  try {
    const parsed = JSON.parse(session);
    return parsed;
  } catch (e) {
    event.cookies.delete('doctor_session');
    throw redirect(303, '/admin/login');
  }
}

export function getSessionFromCookie(cookies: any): any | null {
  const session = cookies.get('doctor_session');
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}
```

---

## STEP 8: CREATE VALIDATION SCHEMAS

Create `src/lib/server/validators/booking.validator.ts`:

```typescript
import { z } from 'zod';

export const createBookingSchema = z.object({
  patientName: z.string().min(3, 'Name must be at least 3 characters'),
  patientEmail: z.string().email('Invalid email address'),
  patientPhone: z.string().regex(/^\+?[0-9]{10,}$/, 'Invalid phone number'),
  patientNote: z.string().optional(),
  doctorId: z.string().cuid('Invalid doctor ID'),
  serviceId: z.string().cuid('Invalid service ID'),
  appointmentDate: z.coerce.date(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
```

---

## STEP 9: CREATE DOCTOR LOGIN PAGE

Create `src/routes/admin/login/+page.svelte`:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  let email = '';
  let password = '';
  let loading = false;
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Clinica SF. Gherasim</h1>
    <p class="text-gray-600 mb-6">Doctor Login</p>

    {#if $page.form?.error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {$page.form.error}
      </div>
    {/if}

    <form method="POST" use:enhance={() => {
      loading = true;
      return async ({ update }) => {
        loading = false;
        await update();
      };
    }}>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          bind:value={email}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          bind:value={password}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  </div>
</div>
```

Create `src/routes/admin/login/+page.server.ts`:

```typescript
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/db';
import { verifyPassword } from '$lib/server/utils/password';
import { json } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required' });
    }

    // Find doctor
    const doctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (!doctor) {
      return fail(401, { error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await verifyPassword(password, doctor.passwordHash);
    if (!isValid) {
      return fail(401, { error: 'Invalid email or password' });
    }

    // Set session cookie
    cookies.set('doctor_session', JSON.stringify({ doctorId: doctor.id, email: doctor.email }), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    throw redirect(303, '/admin');
  },
};
```

---

## STEP 10: CREATE ADMIN LAYOUT WITH PROTECTION

Create `src/routes/admin/+layout.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, cookies }) => {
  const session = cookies.get('doctor_session');

  if (!session) {
    throw redirect(303, '/admin/login');
  }

  try {
    const parsed = JSON.parse(session);
    return { doctorId: parsed.doctorId, email: parsed.email };
  } catch (e) {
    cookies.delete('doctor_session');
    throw redirect(303, '/admin/login');
  }
};
```

Create `src/routes/admin/+page.svelte`:

```svelte
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="p-6">
  <h1 class="text-3xl font-bold mb-6">Welcome, {data.email}</h1>
  
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-blue-50 border border-blue-200 p-4 rounded">
      <p class="text-sm text-gray-600">Today's Appointments</p>
      <p class="text-3xl font-bold text-blue-600">--</p>
    </div>
    <div class="bg-green-50 border border-green-200 p-4 rounded">
      <p class="text-sm text-gray-600">This Week</p>
      <p class="text-3xl font-bold text-green-600">--</p>
    </div>
    <div class="bg-purple-50 border border-purple-200 p-4 rounded">
      <p class="text-sm text-gray-600">This Month</p>
      <p class="text-3xl font-bold text-purple-600">--</p>
    </div>
  </div>

  <div class="bg-white p-6 rounded-lg border">
    <h2 class="text-xl font-bold mb-4">Navigation</h2>
    <ul class="space-y-2">
      <li><a href="/admin/schedule" class="text-indigo-600 hover:underline">📅 My Schedule</a></li>
      <li><a href="/admin/bookings" class="text-indigo-600 hover:underline">📋 All Bookings</a></li>
      <li><a href="/admin/logout" class="text-red-600 hover:underline">🚪 Logout</a></li>
    </ul>
  </div>
</div>
```

---

## STEP 11: LOGOUT ENDPOINT

Create `src/routes/admin/logout/+server.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
  cookies.delete('doctor_session', { path: '/' });
  throw redirect(303, '/admin/login');
};
```

---

## STEP 12: TEST EVERYTHING

```bash
# Start dev server
npm run dev

# Test database seed worked:
npx prisma studio
# Should see 2 doctors + 2 services

# Test login:
# 1. Go to http://localhost:5173/admin/login
# 2. Use: teodora@clinica.ro / test123
# 3. Should redirect to /admin dashboard

# Test logout:
# 1. Click logout
# 2. Should redirect to /admin/login
```

---

## ✅ PHASE 1 DELIVERABLES

- [x] PostgreSQL database created & connected
- [x] Prisma schema defined with all models
- [x] Database seeded with test data
- [x] Doctor authentication working (login/logout)
- [x] Admin dashboard accessible (protected route)
- [x] Environment variables configured
- [x] Password hashing implemented
- [x] Validation schemas ready

---

## 📝 NEXT: PHASE 2

When Phase 1 is complete, we move to **PHASE 2: PUBLIC BOOKING FORM**

This will include:
- DoctorSelect component
- DatePicker component
- TimePicker with availability
- ServiceSelect component
- Booking confirmation
- POST /api/bookings endpoint

**Ready to continue? Let me know!**
