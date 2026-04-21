# ApexScoop - Life Insurance Lead Generation Platform

A professional, full-stack web application for capturing and managing life insurance leads. Built with React/Next.js frontend, Node.js/Express backend, and PostgreSQL database.

## Features

- 🎯 Lead capture with embedded Google Form
- 📝 Blog posts about life insurance and financial planning
- 👨‍💼 Admin dashboard for lead management
- 📧 Email notifications for new leads
- 🔐 Secure admin authentication with JWT
- 📊 Lead statistics and filtering
- 💅 Responsive, modern UI with Tailwind CSS
- 🚀 Production-ready code architecture

## Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer (SMTP)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database and SMTP credentials

# Create database
createdb apex_scoop_db

# Run migrations
psql -U postgres -d apex_scoop_db -f database.sql

# Seed initial data (creates admin user and blog posts)
npm run build
npm run dev  # in another terminal, or run: npx tsx seed.ts
```

**Default admin credentials after seeding:**
- Email: `admin@apexscoop.com`
- Password: `admin123`

Change these immediately in production!

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (optional, defaults are provided)
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Run development server
npm run dev
```

Access the app at `http://localhost:3000`

## Project Structure

```
apex-scoop-health-insurance/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, validation, etc
│   │   ├── services/         # Email service
│   │   ├── db.ts             # Database connection
│   │   └── index.ts          # App entry point
│   ├── database.sql          # Database schema
│   └── seed.ts               # Seed initial data
├── frontend/
│   ├── src/
│   │   ├── pages/            # Next.js pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities (API client)
│   │   └── styles/           # CSS
│   └── public/               # Static assets
└── README.md
```

## API Endpoints

### Public Routes
- `POST /api/leads` - Create a new lead
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get single blog post

### Protected Routes (Admin Only)
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get single lead
- `PATCH /api/leads/:id` - Update lead status
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/stats` - Get lead statistics

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login admin user
- `GET /api/auth/me` - Get current user (requires token)

## Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel
```

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway or Render
3. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret for JWT tokens
   - `SMTP_*` - Email configuration
   - `FRONTEND_URL` - Your frontend URL

4. Run migrations on the hosted database
5. Deploy!

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/apex_scoop_db
JWT_SECRET=your-secret-key-change-in-production
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

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://api.apexscoop.com
```

## Email Setup

Using SendGrid for email notifications:

1. Create SendGrid account at sendgrid.com
2. Generate API key
3. Update SMTP credentials in backend .env

## Security Notes

- Change default admin credentials immediately
- Use strong JWT_SECRET in production
- Enable HTTPS on production
- Keep dependencies updated
- Validate and sanitize all inputs
- Use environment variables for secrets

## License

Proprietary - ApexScoop.com
