# Quick Start Guide - ApexScoop

Get the ApexScoop lead generation website up and running in 10 minutes.

## Prerequisites

- Node.js 18+ (https://nodejs.org)
- PostgreSQL 12+ (https://www.postgresql.org/download/)
- Git

## Step 1: Clone & Setup Database

```bash
# Create database
createdb apex_scoop_db

# Apply schema
psql -U postgres -d apex_scoop_db -f backend/database.sql
```

## Step 2: Backend Setup (Terminal 1)

```bash
cd backend

# Install dependencies
npm install

# Create .env file with minimum config
cat > .env << EOF
DATABASE_URL=postgresql://postgres:@localhost:5432/apex_scoop_db
JWT_SECRET=dev-secret-key-change-in-production
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-key-or-skip-for-now
EMAIL_FROM=noreply@apexscoop.com
EMAIL_TO=your-email@example.com
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
EOF

# Build and seed database
npm run build
npx tsx seed.ts

# Start server
npm run dev
```

✅ Backend running on `http://localhost:3001`

**Login with:**
- Email: `admin@apexscoop.com`
- Password: `admin123`

## Step 3: Frontend Setup (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running on `http://localhost:3000`

## Step 4: Test the Application

1. **Home Page:** http://localhost:3000
2. **Blog:** http://localhost:3000/blog
3. **Get Quote (Lead Form):** http://localhost:3000/leads
4. **Admin Login:** http://localhost:3000/admin/login
5. **Admin Dashboard:** http://localhost:3000/admin/dashboard

## What's Included

### Frontend Features
- ✅ Professional home page with your headshots
- ✅ Blog pages with sample posts
- ✅ Embedded Google Form for lead capture
- ✅ Admin dashboard for lead management
- ✅ Modern, responsive design with Tailwind CSS

### Backend Features
- ✅ REST API for leads, blog, and authentication
- ✅ PostgreSQL database with proper schema
- ✅ JWT-based admin authentication
- ✅ Email notifications (when configured)
- ✅ Lead management with status tracking

### Admin Dashboard Features
- 📊 Lead statistics (total, new, contacted, converted, rejected)
- 🔍 Filter leads by status
- ✏️ Update lead status and add notes
- 🗑️ Delete leads
- 📧 Receive email notifications for new leads

## Configuration Notes

### Email Notifications

To receive email notifications when leads submit:

1. Get a SendGrid account (free tier available)
2. Generate API key
3. Update `backend/.env`:
   ```
   SMTP_PASS=SG.your_actual_key_here
   EMAIL_TO=your-actual-email@gmail.com
   ```

### Database

If using different credentials:

```bash
# Update database connection
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/apex_scoop_db
```

## Common Issues

### "Cannot find module" errors
```bash
# Reinstall dependencies
npm install
```

### Database connection failed
```bash
# Verify database exists
createdb apex_scoop_db

# Check connection
psql -U postgres -d apex_scoop_db
```

### Port already in use
```bash
# Backend on different port
PORT=3002 npm run dev

# Update frontend .env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## Next Steps

1. ✅ Local development working
2. 📝 Customize blog posts in admin dashboard
3. 🎨 Update branding/colors in `tailwind.config.js`
4. 📧 Configure SendGrid for email notifications
5. 🌐 Deploy to Vercel (frontend) and Railway (backend)
6. 🔗 Set up custom domain (ApexScoop.com)

See `DEPLOYMENT.md` for production deployment guide.

## File Structure Quick Reference

```
backend/
  ├── src/routes/         # API endpoints
  ├── src/controllers/    # Business logic
  ├── src/models/         # Database models
  ├── database.sql        # Schema
  └── seed.ts            # Seed data

frontend/
  ├── src/pages/         # Website pages
  ├── src/components/    # React components
  ├── public/images/     # Your headshots
  └── public/logo.svg    # Logo
```

## Questions?

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for production setup
- Backend API docs: `backend/src/routes/`
- Frontend structure: `frontend/src/`
