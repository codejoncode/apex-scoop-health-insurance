# ApexScoop Deployment Guide

## Local Development Setup

### 1. Database Setup

Install PostgreSQL if you haven't already, then create the database:

```bash
# Linux/Mac
createdb apex_scoop_db

# Windows (using psql)
psql -U postgres
# Inside psql:
CREATE DATABASE apex_scoop_db;
\q
```

### 2. Backend Setup & Running

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your settings
cp .env.example .env

# Edit .env with:
# - Your PostgreSQL connection string
# - A strong JWT_SECRET
# - Email credentials (for lead notifications)

# Initialize the database schema
psql -U postgres -d apex_scoop_db -f database.sql

# Seed initial data (creates admin user and blog posts)
npm run build
npx tsx seed.ts

# Start dev server
npm run dev
```

**Backend will run on:** http://localhost:3001

**Default admin user:**
- Email: admin@apexscoop.com
- Password: admin123

⚠️ **Change these credentials immediately in production!**

### 3. Frontend Setup & Running

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend will run on:** http://localhost:3000

## Email Configuration

For email notifications when leads submit, configure SendGrid (or similar SMTP provider):

### SendGrid Setup:

1. Create account at https://sendgrid.com
2. Create API key
3. Update backend `.env`:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
EMAIL_FROM=noreply@apexscoop.com
EMAIL_TO=your-email@example.com
```

## Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```
5. Deploy!

#### Backend on Railway

1. Create Railway account at https://railway.app
2. Create new project and connect GitHub
3. Add PostgreSQL plugin
4. Set environment variables:
   ```
   DATABASE_URL=[Railway PostgreSQL connection string]
   JWT_SECRET=your-strong-secret
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   EMAIL_FROM=noreply@apexscoop.com
   EMAIL_TO=your-email@example.com
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://apexscoop.com
   ```
5. Run migrations on the hosted database
6. Deploy!

### Option 2: Render.com (Backend)

1. Create Render account
2. Create Web Service from GitHub repo
3. Add PostgreSQL database
4. Configure environment variables (same as above)
5. Deploy!

## Domain Setup (ApexScoop.com)

### Point Domain to Services:

1. **Frontend (Vercel):** 
   - Update DNS A records to Vercel's IP
   - Or use CNAME: `apexscoop.com` → `cname.vercel-dns.com`

2. **Backend API:**
   - Create subdomain: `api.apexscoop.com`
   - Point to your backend service (Railway/Render)

3. **Update Frontend `.env`:**
   ```
   NEXT_PUBLIC_API_URL=https://api.apexscoop.com
   ```

## Monitoring & Maintenance

### Logs

- **Frontend:** Check Vercel dashboard
- **Backend:** Check Railway/Render logs
- **Database:** Monitor PostgreSQL on Railway

### Backups

Set up automated database backups:
- Railway: Automatic daily backups
- Render: Configure backup schedule

### Updates

Keep dependencies updated:
```bash
# Frontend
cd frontend
npm update

# Backend
cd backend
npm update
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -U postgres -h localhost -d apex_scoop_db
```

### CORS Errors

Make sure `FRONTEND_URL` in backend .env matches your domain

### Email Not Sending

- Check SMTP credentials
- Verify sender email is authorized with SendGrid
- Check backend logs for errors

### Authentication Issues

- Clear browser localStorage
- Verify JWT_SECRET is the same on frontend calls

## Next Steps

1. ✅ Local development complete
2. Push to GitHub
3. Connect to Vercel (frontend)
4. Connect to Railway (backend)
5. Set up custom domain
6. Test end-to-end
7. Monitor and maintain

## Support

For issues or questions, review the main README.md or check component-specific documentation.
