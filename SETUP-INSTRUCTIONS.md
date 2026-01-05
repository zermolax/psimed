# Setup Instructions for Clinica SF. Gherasim Booking System

## 🚨 Critical: `.env` File Configuration

The `.env` file is **NOT tracked in git** for security reasons. You must create it manually on each computer.

### Step 1: Create `.env` File

Copy the `.env.example` template and fill in the actual values:

```bash
cp .env.example .env
```

### Step 2: Update Database Connection (CRITICAL FIX)

Edit `.env` and update the `DATABASE_URL` with the **Session Pooler** connection string:

```bash
# ❌ OLD (IPv6-only, doesn't work on systems without IPv6):
# DATABASE_URL="postgresql://postgres:PASSWORD@db.irdeihaulzilkrebzlnp.supabase.co:5432/postgres"

# ✅ CORRECT (Use Session Pooler for IPv4 compatibility):
DATABASE_URL="postgresql://postgres.irdeihaulzilkrebzlnp:8f6gw8RH8SNoAEIJ@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```

**Important:** The password is the same, but the hostname and username format change:
- **Old hostname:** `db.irdeihaulzilkrebzlnp.supabase.co` (IPv6-only)
- **New hostname:** `aws-1-eu-west-1.pooler.supabase.com` (IPv4 + IPv6)
- **Old format:** `postgres:PASSWORD`
- **New format:** `postgres.PROJECT-ID:PASSWORD`

### Step 3: Complete `.env` File Content

Fill in all required values:

```env
# Database Connection - Using Supabase Session Pooler for IPv4 compatibility
DATABASE_URL="postgresql://postgres.irdeihaulzilkrebzlnp:8f6gw8RH8SNoAEIJ@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"

# Session/Auth Secret (min 32 characters)
SESSION_SECRET="this-is-a-super-secret-key-min-32-characters-long-for-security-change-in-prod"

# Email API Key (optional - leave as placeholder to test without emails)
RESEND_API_KEY="re_placeholder_get_from_resend"

# App Environment
NODE_ENV="development"
PUBLIC_APP_URL="http://localhost:5173"
```

## 🔧 Development Setup

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Start dev server
npm run dev
```

### Running the Dev Server

```bash
npm run dev
```

The server will start on a free port (usually `http://localhost:5173` or similar).

## ✅ Testing the System

### 1. Public Booking Form
```
http://localhost:5173/programare
```
- Select a doctor
- Select a service
- Choose date and time
- Enter patient info
- Submit booking

### 2. API Endpoints (for testing)
```bash
# Get list of doctors
curl http://localhost:5173/api/doctors

# Get available time slots
curl "http://localhost:5173/api/availability?doctorId=ID&serviceId=ID&date=2026-01-15"

# Create a booking (test)
curl -X POST http://localhost:5173/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "cmk0666if00008y972iy0g12d",
    "serviceId": "cmk06677z00038y97lrjkhq76",
    "patientName": "Test",
    "patientEmail": "test@example.com",
    "patientPhone": "+40700000000",
    "date": "2026-01-15",
    "time": "09:00"
  }'
```

### 3. Admin Dashboard
```
http://localhost:5173/admin/login
```

**Test Login:**
- Email: `teodora@clinica.ro`
- Password: `password123`

## 🆘 Troubleshooting

### Error: "Failed to fetch doctors"
**Cause:** Database connection not working
**Solution:**
1. Verify `.env` file exists with correct `DATABASE_URL`
2. Ensure you're using the **Session Pooler** endpoint (not direct connection)
3. Restart dev server: `npm run dev`

### Error: "@prisma/client did not initialize yet"
**Cause:** Prisma Client not generated
**Solution:**
```bash
npx prisma generate
npm run dev
```

### Error: "Network is unreachable"
**Cause:** Direct Supabase connection (IPv6-only) on system without IPv6
**Solution:** Update `.env` to use Session Pooler endpoint (see Step 2 above)

### Port already in use
**Cause:** Another process is using the port
**Solution:**
```bash
# Kill all npm processes
pkill -f "npm run dev"

# Start fresh
npm run dev
```

## 📚 Key Files

- **Booking System:** `src/routes/programare/+page.svelte`
- **Admin Dashboard:** `src/routes/admin/programari/+page.svelte`
- **API Endpoints:** `src/routes/api/`
- **Database Models:** `prisma/schema.prisma`
- **Services:** `src/lib/server/services/`

## 🔐 Security Notes

- **Never commit `.env` to git** - it contains sensitive credentials
- `.env` is in `.gitignore` for security
- Session secrets and API keys must be unique per environment
- In production, use environment variables from your hosting platform (Vercel, etc.)

---

**Questions?** Check the git logs or review the implementation plan in the conversation history.
