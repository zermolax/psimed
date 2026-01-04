# 📋 MASTER PLAN: SISTEM DE REZERVĂRI - CLINICA SF. GHERASIM

**Project Manager & Senior Developer (20+ ani XP)**  
**Document Version**: 1.0  
**Data**: 06.01.2026  
**Status**: APPROVED FOR IMPLEMENTATION

---

## 🎯 EXECUTIVE SUMMARY

Construim un **sistem de rezervări medical complet, enterprise-grade**, integrat seamlessly cu SvelteKit deja în curs de dezvoltare. Stack: **Node.js + SvelteKit + PostgreSQL + Stripe + Google Calendar API**. Timeline: **6-8 săptămâni** (cu 15-20h/săpt dev time).

**Key deliverables:**
- ✅ Booking form public (frontend)
- ✅ Admin dashboard (medicii + admin)
- ✅ Payment processing (Stripe)
- ✅ Google Calendar 2-way sync
- ✅ Notifications (SMS/Email)
- ✅ Database schema & API

---

## 📐 ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (SvelteKit Frontend - SSR + Client Components)              │
│                                                               │
│  ├─ Public Booking Page (/book)                              │
│  ├─ Booking Confirmation (/book/confirm)                     │
│  ├─ Admin Dashboard (/admin)                                 │
│  ├─ Doctor Schedule (/admin/schedule)                        │
│  └─ Payment Receipt (/book/receipt)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ (API Calls + Form Actions)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                  │
│  (SvelteKit Server Routes + Node.js Backend)                 │
│                                                               │
│  ├─ /api/doctors (GET - list doctors)                        │
│  ├─ /api/availability (GET - free slots)                     │
│  ├─ /api/bookings (POST - create, GET - list)                │
│  ├─ /api/payments (POST - create intent, webhooks)           │
│  ├─ /api/calendar (POST - sync with Google)                  │
│  └─ /api/notifications (POST - SMS/Email)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ (Query & Mutations)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                        │
│  (Services, Validators, Transformers)                        │
│                                                               │
│  ├─ BookingService (CRUD, validation, conflict checking)     │
│  ├─ PaymentService (Stripe SDK wrapper)                      │
│  ├─ CalendarService (Google Calendar API wrapper)            │
│  ├─ NotificationService (Email/SMS via Sendgrid/Twilio)      │
│  └─ DoctorService (Schedule management)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                  │
│  (PostgreSQL + Prisma ORM)                                   │
│                                                               │
│  ├─ doctors (id, name, speciality, email, color)             │
│  ├─ services (id, name, duration, price, doctor_id)          │
│  ├─ bookings (id, doctor_id, patient_*, date, time, status)  │
│  ├─ payments (id, booking_id, stripe_id, amount, status)     │
│  ├─ slots (id, doctor_id, date, time, available)             │
│  └─ notifications (id, booking_id, type, status, sent_at)    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                        │
│                                                               │
│  ├─ Stripe (Payment processing + webhooks)                   │
│  ├─ Google Calendar (2-way sync)                             │
│  ├─ Sendgrid/Resend (Email notifications)                    │
│  └─ Twilio (SMS notifications)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠 TECH STACK (RATIONALE)

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend Framework** | SvelteKit | Already using, reactive, SSR-capable, type-safe |
| **Backend** | Node.js + Express | Same language (JS/TS), shared codebase, perfect for SvelteKit |
| **Database** | PostgreSQL | ACID compliance, JSONB support, mature, reliable |
| **ORM** | Prisma | Type-safe, migrations built-in, excellent DX |
| **Auth** | Lucia (optional) or session-based | Lightweight, works with SvelteKit |
| **Payment** | Stripe + svelte-stripe | EU-compliant, webhooks, best DX |
| **Calendar** | Google Calendar API | Free, reliable, doctors already use |
| **Email** | Resend or Sendgrid | API-first, transactional, affordable |
| **SMS** | Twilio | Industry standard, affordable |
| **Hosting** | Vercel (frontend) + Railway/Render (backend) | Serverless, auto-scaling, simple deployments |
| **Database Hosting** | Supabase PostgreSQL or Railway | Managed, backup, zero-maintenance |

---

## 📦 PROJECT STRUCTURE

```
clinica-sf-gherasim/
├── src/
│   ├── routes/                          # SvelteKit routes (frontend + API)
│   │   ├── +page.svelte                 # Home page
│   │   ├── book/
│   │   │   ├── +page.svelte             # Booking form
│   │   │   ├── +page.server.ts          # Server-side data loading
│   │   │   ├── confirm/+page.svelte     # Confirmation page
│   │   │   └── receipt/+page.svelte     # Receipt page
│   │   ├── admin/
│   │   │   ├── +page.svelte             # Admin dashboard
│   │   │   ├── +layout.ts               # Protected route
│   │   │   ├── schedule/+page.svelte    # Schedule management
│   │   │   └── bookings/+page.svelte    # All bookings list
│   │   ├── api/
│   │   │   ├── doctors/+server.ts       # GET /api/doctors
│   │   │   ├── availability/+server.ts  # GET /api/availability
│   │   │   ├── bookings/+server.ts      # GET/POST /api/bookings
│   │   │   ├── payments/
│   │   │   │   ├── intent/+server.ts    # POST /api/payments/intent
│   │   │   │   └── webhook/+server.ts   # POST /api/payments/webhook
│   │   │   ├── calendar/+server.ts      # POST /api/calendar/sync
│   │   │   └── notifications/+server.ts # POST /api/notifications
│   │   └── auth/
│   │       ├── login/+page.svelte       # Doctor login
│   │       └── logout/+server.ts        # Logout
│   │
│   ├── lib/
│   │   ├── server/                      # Server-only code
│   │   │   ├── db.ts                    # Prisma client
│   │   │   ├── services/                # Business logic
│   │   │   │   ├── booking.service.ts   # Booking CRUD + validation
│   │   │   │   ├── payment.service.ts   # Stripe integration
│   │   │   │   ├── calendar.service.ts  # Google Calendar sync
│   │   │   │   ├── notification.service.ts # Email/SMS
│   │   │   │   └── doctor.service.ts    # Doctor management
│   │   │   ├── validators/
│   │   │   │   ├── booking.validator.ts # Zod schemas
│   │   │   │   └── payment.validator.ts
│   │   │   ├── utils/
│   │   │   │   ├── stripe.ts            # Stripe client setup
│   │   │   │   ├── google-calendar.ts   # Google Calendar setup
│   │   │   │   ├── email.ts             # Resend client
│   │   │   │   └── sms.ts               # Twilio client
│   │   │   └── middleware/
│   │   │       └── auth.ts              # Authentication
│   │   │
│   │   ├── client/                      # Client-only code
│   │   │   ├── stores/
│   │   │   │   ├── booking.ts           # Booking state
│   │   │   │   └── auth.ts              # Auth state
│   │   │   ├── components/
│   │   │   │   ├── BookingForm.svelte   # Main booking component
│   │   │   │   ├── DoctorSelect.svelte  # Doctor picker
│   │   │   │   ├── DatePicker.svelte    # Custom date picker
│   │   │   │   ├── TimePicker.svelte    # Time slots
│   │   │   │   ├── PaymentForm.svelte   # Stripe payment UI
│   │   │   │   └── ConfirmDialog.svelte # Confirmation modal
│   │   │   └── utils/
│   │   │       └── api.ts               # API client helpers
│   │   │
│   │   └── config/
│   │       ├── constants.ts             # App constants
│   │       └── env.ts                   # Environment validation
│   │
│   └── app.html                         # Root HTML template
│
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── migrations/                      # Database migrations
│
├── static/                              # Static assets
│   └── favicon.svg
│
├── .env.example                         # Environment template
├── .env                                 # Local env (DO NOT COMMIT)
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🗄️ DATABASE SCHEMA (PRISMA)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// DOCTORS (Medicii din clinică)
model Doctor {
  id                String     @id @default(cuid())
  name              String
  email             String     @unique
  phone             String?
  speciality        String     // "Psychiatrist", "Psychologist", etc.
  bio               String?
  profileImage      String?
  googleCalendarId  String?    // For sync
  color             String     @default("#3B82F6") // Calendar color
  
  // Business logic
  workingHoursStart Int        @default(900) // 9:00
  workingHoursEnd   Int        @default(1700) // 17:00
  slotDuration      Int        @default(60) // minutes
  breakBetweenSlots Int        @default(15) // minutes
  
  // Relations
  services          Service[]
  bookings          Booking[]
  slots             Slot[]
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
}

// SERVICES (Serviciile oferite - psihiatrie, psihologie, etc.)
model Service {
  id                String     @id @default(cuid())
  name              String     // "Individual Psychotherapy", "Psychiatric Consultation"
  description       String?
  duration          Int        // minutes
  price             Decimal    @db.Decimal(10, 2) // EUR
  isPayable         Boolean    @default(true)
  paymentRequired   Boolean    @default(false) // false = optional
  
  doctorId          String
  doctor            Doctor     @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  
  bookings          Booking[]
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  
  @@unique([doctorId, name])
}

// BOOKINGS (Programările pacienților)
model Booking {
  id                String     @id @default(cuid())
  
  // Patient info
  patientName       String
  patientEmail      String
  patientPhone      String
  patientNote       String?    // "Am anxietate", etc.
  
  // Appointment details
  doctorId          String
  doctor            Doctor     @relation(fields: [doctorId], references: [id], onDelete: Restrict)
  
  serviceId         String
  service           Service    @relation(fields: [serviceId], references: [id], onDelete: Restrict)
  
  appointmentDate   DateTime   // Date + time of appointment
  duration          Int        // minutes (copied from service)
  
  // Status tracking
  status            BookingStatus @default(PENDING) // PENDING, CONFIRMED, PAID, CANCELLED, COMPLETED, NO_SHOW
  cancellationReason String?
  
  // Payment
  payment           Payment?
  
  // Google Calendar
  googleEventId     String?    // Google Calendar event ID for sync
  
  // Hash for public confirmation link
  confirmationToken String     @unique @default(cuid())
  
  // Relations
  notifications     Notification[]
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  
  @@index([doctorId])
  @@index([patientEmail])
  @@index([appointmentDate])
}

enum BookingStatus {
  PENDING           // Waiting for payment or confirmation
  CONFIRMED         // Confirmed, no payment needed
  PAID              // Payment completed
  CANCELLED         // Cancelled by patient
  COMPLETED         // Appointment happened
  NO_SHOW           // Patient didn't show up
}

// PAYMENTS (Plăți prin Stripe)
model Payment {
  id                String     @id @default(cuid())
  
  bookingId         String     @unique
  booking           Booking    @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  
  // Stripe details
  stripePaymentIntentId String @unique
  stripeCustomerId  String?
  
  amount            Decimal    @db.Decimal(10, 2) // EUR
  currency          String     @default("EUR")
  
  status            PaymentStatus @default(PENDING) // PENDING, SUCCEEDED, FAILED, CANCELLED
  
  // Metadata
  receiptUrl        String?    // Stripe receipt URL
  failureReason     String?
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  
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

// SLOTS (Available time slots - generated daily/weekly)
model Slot {
  id                String     @id @default(cuid())
  
  doctorId          String
  doctor            Doctor     @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  
  date              DateTime   @db.Date
  startTime         DateTime   // Full timestamp
  endTime           DateTime
  
  isAvailable       Boolean    @default(true)
  
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  
  @@unique([doctorId, startTime])
  @@index([doctorId])
  @@index([date])
}

// NOTIFICATIONS (Email/SMS tracking)
model Notification {
  id                String     @id @default(cuid())
  
  bookingId         String
  booking           Booking    @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  
  type              NotificationType // BOOKING_CONFIRMATION, APPOINTMENT_REMINDER, PAYMENT_RECEIVED, CANCELLATION
  channel           NotificationChannel // EMAIL, SMS
  recipient         String     // Email or phone
  
  subject           String?    // For emails
  message           String
  
  status            NotificationStatus @default(PENDING) // PENDING, SENT, FAILED
  sentAt            DateTime?
  failureReason     String?
  
  createdAt         DateTime   @default(now())
  
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

## 🎨 FRONTEND COMPONENTS ARCHITECTURE

### **Main User Journeys**

#### **Journey 1: Public Booking (Unauthenticated Patient)**
```
1. Patient opens clinicasfgherasim.ro/book
2. Sees list of doctors with specialities
3. Selects doctor → calendar loads with available dates
4. Picks date → sees available time slots
5. Picks service (if multiple) and time
6. Reviews: Doctor + Date + Time + Service + Price
7. Enters: Name, Email, Phone, Notes
8. Click "Continue to Payment"
9. Payment form (Stripe) appears
10. Enters card details
11. Payment confirmed
12. Redirected to /book/receipt
13. Email + SMS sent with confirmation
```

#### **Journey 2: Doctor Login & Schedule Management**
```
1. Doctor goes to clinicasfgherasim.ro/admin
2. Logs in with email + password
3. Sees dashboard with:
   - Today's appointments
   - Week view calendar
   - Patient list
4. Can:
   - Mark appointment as COMPLETED
   - See patient notes
   - Reschedule (drag & drop)
   - Mark as NO_SHOW
5. Calendar syncs to Google Calendar in real-time
```

---

## 🔌 API ENDPOINTS SPECIFICATION

### **1. Doctors**
```typescript
GET /api/doctors
Response: {
  doctors: [
    { id, name, speciality, bio, profileImage, color }
  ]
}

GET /api/doctors/:id
Response: {
  doctor: { id, name, speciality, ... }
  services: [{ id, name, duration, price }]
}
```

### **2. Availability**
```typescript
GET /api/availability?doctorId=X&serviceId=Y&date=2026-01-20
Response: {
  availableSlots: [
    { time: "09:00", date: "2026-01-20", slotId: "..." },
    { time: "09:30", date: "2026-01-20", slotId: "..." },
    { time: "10:00", date: "2026-01-20", slotId: "..." }
  ]
}
```

### **3. Bookings**
```typescript
POST /api/bookings
Body: {
  patientName: "Ion Popescu",
  patientEmail: "ion@example.com",
  patientPhone: "+40711234567",
  patientNote: "Am anxietate și atacs de panică",
  doctorId: "cid_doctor_1",
  serviceId: "cid_service_1",
  appointmentDate: "2026-01-20T14:00:00Z"
}
Response: {
  booking: {
    id: "cid_booking_1",
    status: "PENDING", // Awaiting payment
    confirmationToken: "xyz123..."
  }
}

GET /api/bookings/:id
Response: {
  booking: { ... full booking data ... }
}

GET /api/bookings (admin only)
Query: ?doctorId=X&from=2026-01-01&to=2026-01-31&status=PAID
Response: {
  bookings: [ ... ]
}

PATCH /api/bookings/:id
Body: { status: "CANCELLED", cancellationReason: "..." }
Response: { booking: { ... } }
```

### **4. Payments**
```typescript
POST /api/payments/intent
Body: {
  bookingId: "cid_booking_1",
  amount: 150.00,
  currency: "EUR"
}
Response: {
  clientSecret: "pi_1234567890_secret_...",
  amount: 150.00
}

POST /api/payments/webhook (Stripe webhook)
// Stripe sends payment event
// We update booking.status -> PAID
// Create calendar event
// Send notifications
Response: { ok: true }
```

### **5. Calendar Sync**
```typescript
POST /api/calendar/sync
Body: {
  bookingId: "cid_booking_1"
}
Response: {
  googleEventId: "abc123xyz",
  calendarLink: "https://calendar.google.com/..."
}

DELETE /api/calendar/sync/:bookingId
// Removes from Google Calendar
Response: { ok: true }
```

### **6. Notifications**
```typescript
POST /api/notifications/send
Body: {
  bookingId: "cid_booking_1",
  type: "BOOKING_CONFIRMATION",
  channel: "EMAIL"
}
Response: {
  notification: { id, status: "SENT" }
}
```

---

## 🚀 IMPLEMENTATION PHASES

### **PHASE 1: FOUNDATION (Weeks 1-2) - 15 hours**

**Goals:**
- Database setup & schema
- Basic API structure
- Authentication scaffold

**Tasks:**
1. ✅ Create PostgreSQL database (Supabase or Railway)
2. ✅ Write Prisma schema (`prisma/schema.prisma`)
3. ✅ Run migrations: `npx prisma migrate dev --name init`
4. ✅ Seed test data (`prisma/seed.ts`)
5. ✅ Setup Prisma client (`lib/server/db.ts`)
6. ✅ Create Doctor login page & session middleware
7. ✅ Setup environment variables (.env)

**Deliverable:** Working database + login system

---

### **PHASE 2: PUBLIC BOOKING FLOW (Weeks 3-4) - 20 hours**

**Goals:**
- Functional public booking form
- Availability calculation
- Form validation

**Tasks:**
1. ✅ Build `/book` page with Svelte components
2. ✅ Implement DoctorSelect component
3. ✅ Implement DatePicker (calendar widget)
4. ✅ Implement TimePicker (available slots)
5. ✅ Implement ServiceSelect component
6. ✅ Write BookingService (validation, slot checking)
7. ✅ Create `POST /api/bookings` endpoint
8. ✅ Form validation with Zod
9. ✅ Error handling & user feedback

**Deliverable:** Can book appointment (without payment)

---

### **PHASE 3: PAYMENT INTEGRATION (Weeks 5-6) - 18 hours**

**Goals:**
- Stripe integration
- Webhooks handling
- Receipt generation

**Tasks:**
1. ✅ Setup Stripe account & API keys
2. ✅ Install Stripe dependencies: `npm install stripe @stripe/stripe-js svelte-stripe`
3. ✅ Create PaymentService wrapper
4. ✅ Build PaymentForm component (Stripe Elements)
5. ✅ Implement `POST /api/payments/intent`
6. ✅ Implement `POST /api/payments/webhook`
7. ✅ Setup webhook secret in Stripe dashboard
8. ✅ Update booking status on payment success
9. ✅ Generate payment receipts
10. ✅ Test with Stripe test cards

**Deliverable:** Full payment flow working

---

### **PHASE 4: GOOGLE CALENDAR SYNC (Weeks 7-8) - 12 hours**

**Goals:**
- 2-way Google Calendar sync
- Automatic event creation
- Conflict prevention

**Tasks:**
1. ✅ Setup Google Calendar API credentials
2. ✅ Create CalendarService wrapper
3. ✅ Implement event creation on booking confirmed
4. ✅ Implement event deletion on cancellation
5. ✅ Implement doctor availability from Google Calendar
6. ✅ Setup timezone handling
7. ✅ Test sync bidirectionally

**Deliverable:** Bookings appear on Google Calendar

---

### **PHASE 5: NOTIFICATIONS (Weeks 9-10) - 10 hours**

**Goals:**
- Email confirmations
- SMS reminders
- Notification tracking

**Tasks:**
1. ✅ Setup Resend (or Sendgrid) for emails
2. ✅ Setup Twilio for SMS
3. ✅ Create NotificationService
4. ✅ Write email templates
5. ✅ Implement `POST /api/notifications/send`
6. ✅ Schedule reminder 24h before appointment (cron job or trigger)
7. ✅ Track notification delivery status
8. ✅ Handle bounce/failure cases

**Deliverable:** Patients receive confirmations + reminders

---

### **PHASE 6: ADMIN DASHBOARD (Weeks 11-12) - 20 hours**

**Goals:**
- Doctor can see bookings
- Schedule management
- Patient management

**Tasks:**
1. ✅ Build admin layout with protected routes
2. ✅ Create BookingList component with filters
3. ✅ Implement calendar week/day view for doctors
4. ✅ Add booking details modal
5. ✅ Implement reschedule functionality (drag & drop)
6. ✅ Implement mark as COMPLETED / NO_SHOW
7. ✅ Add patient notes viewing
8. ✅ Create reports/analytics view
9. ✅ Implement booking cancellation with email

**Deliverable:** Doctors can manage their schedule

---

### **PHASE 7: TESTING & DEPLOYMENT (Weeks 13-14) - 15 hours**

**Goals:**
- Full system testing
- Production deployment
- Monitoring setup

**Tasks:**
1. ✅ Write unit tests (services, validators)
2. ✅ Write integration tests (API endpoints)
3. ✅ End-to-end testing (user journeys)
4. ✅ Performance testing (load testing)
5. ✅ Security audit (OWASP)
6. ✅ Database backups setup
7. ✅ Deploy frontend to Vercel
8. ✅ Deploy backend to Railway/Render
9. ✅ Setup monitoring & alerts (Sentry, LogRocket)
10. ✅ Create runbooks for ops

**Deliverable:** Production-ready system

---

## 📝 DEVELOPMENT WORKFLOW

### **Day-to-day Setup**

```bash
# 1. Clone & setup
git clone <repo>
cd clinica-sf-gherasim
npm install

# 2. Environment setup
cp .env.example .env
# Fill in: DATABASE_URL, STRIPE_SECRET_KEY, GOOGLE_CALENDAR_API_KEY, etc.

# 3. Database setup
npx prisma migrate dev
npx prisma db seed

# 4. Start development
npm run dev
# Frontend: http://localhost:5173
# API: http://localhost:5173/api/*

# 5. Testing
npm run test           # Unit tests
npm run test:e2e       # End-to-end

# 6. Linting & formatting
npm run lint
npm run format

# 7. Build for production
npm run build
npm run preview
```

### **Git Workflow**

```bash
# Branch naming: feature/module-name or fix/issue-number
git checkout -b feature/payment-integration
git commit -m "feat: integrate Stripe payment processing"
git push origin feature/payment-integration
# Create PR, review, merge to main

# Deployment happens automatically on main push
```

---

## 🔐 SECURITY & COMPLIANCE

### **Data Protection**
- ✅ HTTPS everywhere (enforced by Vercel/Railway)
- ✅ Password hashing (bcrypt in Lucia/session)
- ✅ Session tokens (signed, httpOnly cookies)
- ✅ CSRF protection (SvelteKit built-in)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ XSS protection (Svelte auto-escaping)

### **Payment Security**
- ✅ PCI DSS Level 1: Stripe handles all card processing
- ✅ 3D Secure (SCA) for EU transactions
- ✅ Webhook signature verification
- ✅ No card data in database

### **GDPR Compliance**
- ✅ Right to be forgotten (cascade deletes in Prisma)
- ✅ Data export (patient can download their data)
- ✅ Consent tracking (newsletter opt-in)
- ✅ Privacy policy integration
- ✅ Encrypted patient notes

### **API Security**
- ✅ Rate limiting (on endpoints)
- ✅ Input validation (Zod schemas)
- ✅ Authentication on admin endpoints
- ✅ Audit logging (who made what changes)
- ✅ Environment variable protection (never in code)

---

## 📊 DEPLOYMENT & INFRASTRUCTURE

### **Hosting Strategy**

```
┌─────────────────────────────────────┐
│ Domain: clinicasfgherasim.ro        │
├─────────────────────────────────────┤
│ Frontend              │  Backend     │
├──────────────────────┬───────────────┤
│ Vercel (CDN)         │ Railway/Render│
│ SvelteKit SSR        │ Node.js       │
│ Auto-scaling         │ PostgreSQL    │
│ Logs: Datadog        │ Logs: Sentry  │
└──────────────────────┴───────────────┘
```

### **Environment Variables**

```env
# .env (NEVER commit)

# Database
DATABASE_URL=postgresql://user:pass@host:5432/clinica_db

# Stripe
PUBLIC_STRIPE_KEY=pk_live_xxxxx
SECRET_STRIPE_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Google Calendar
GOOGLE_CALENDAR_API_KEY=xxxxx
GOOGLE_CALENDAR_PRIVATE_KEY=xxxxx
GOOGLE_CALENDAR_CLIENT_EMAIL=xxxxx

# Email (Resend)
RESEND_API_KEY=xxxxx

# SMS (Twilio)
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+xxxx

# Session
SESSION_SECRET=xxxxx_random_string

# App
PUBLIC_APP_URL=https://clinicasfgherasim.ro
NODE_ENV=production
```

---

## 💰 COST BREAKDOWN (MONTHLY)

| Service | Free Tier | Cost | Usage |
|---------|-----------|------|-------|
| **PostgreSQL (Supabase)** | 500MB | Free | < 1GB data |
| **Frontend (Vercel)** | 100GB bandwidth | Free | Generous limits |
| **Backend (Railway)** | $5 starter | $5-20 | Light usage |
| **Stripe** | N/A | 2.9% + EUR 0.30 | Per transaction |
| **Google Calendar** | Unlimited | Free | Unlimited |
| **Resend (Email)** | 100/day | Free | Low volume |
| **Twilio (SMS)** | Free trial | ~EUR 0.05/SMS | ~50/month |
| **Sentry (Monitoring)** | 5,000 events | Free | Error tracking |
| **Domain** | N/A | ~EUR 15 | Annual renewal |
| **TOTAL** | | **EUR 30-60/month** | |

---

## ✅ QUALITY ASSURANCE CHECKLIST

### **Code Quality**
- [ ] All functions have JSDoc comments
- [ ] TypeScript strict mode enabled
- [ ] 80%+ code coverage (unit tests)
- [ ] Linter (ESLint) passes
- [ ] Formatter (Prettier) applied
- [ ] No console.log in production code

### **Performance**
- [ ] Lighthouse score > 90
- [ ] API response time < 200ms (p95)
- [ ] Page load time < 3s (first paint)
- [ ] Database queries optimized (no N+1)
- [ ] Images optimized (WebP format)

### **Security**
- [ ] OWASP Top 10 audit passed
- [ ] No secrets in code/git
- [ ] SQL injection tests passed
- [ ] XSS protection verified
- [ ] CORS configured correctly
- [ ] HTTPS enforced

### **User Experience**
- [ ] Mobile responsive (< 480px to > 1920px)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Loading states implemented
- [ ] Error messages clear & actionable
- [ ] Forms have proper validation feedback

### **Operations**
- [ ] Monitoring & alerting setup
- [ ] Backup strategy documented
- [ ] Disaster recovery plan
- [ ] Runbooks for common issues
- [ ] Logging configured (structured logs)

---

## 🛣️ ROADMAP POST-LAUNCH (Nice-to-haves)

**Month 2-3:**
- Mobile app (React Native)
- Video consultation booking
- Patient portal (own bookings history)
- Waiting list management

**Month 4-6:**
- AI patient intake form
- Automated reminder calls (Twilio)
- Insurance integration
- Prescription management
- Patient feedback & reviews

**Month 6+:**
- Marketplace for multiple clinics
- Doctor availability optimization (ML)
- Telemedicine integration
- Advanced analytics

---

## 📞 SUPPORT & MAINTENANCE

### **During Development**
- Daily standup (15 min)
- Weekly review (1h)
- Code reviews on all PRs
- Pair programming for complex features

### **Post-Launch**
- 24/7 monitoring
- On-call rotation for critical issues
- Monthly performance reviews
- Quarterly feature planning

---

## 📄 SUCCESS METRICS

- ✅ System uptime > 99.9%
- ✅ Average booking time < 5 minutes
- ✅ 99% payment success rate
- ✅ Email delivery > 98%
- ✅ SMS delivery > 95%
- ✅ Doctor satisfaction > 4/5
- ✅ Patient satisfaction > 4.5/5

---

## 🎓 KNOWLEDGE TRANSFER

Final deliverable: **Complete handover documentation**
- Architecture guide
- API documentation
- Database documentation
- Deployment procedures
- Troubleshooting guide
- Code walkthroughs

---

**END OF MASTER PLAN**

*Document prepared by: Senior Developer (20+ years)*  
*Ready for implementation: ✅ YES*  
*Estimated delivery: 14 weeks (with 15-20h/week)*
