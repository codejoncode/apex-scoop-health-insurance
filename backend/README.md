# ApexScoop Backend API

Express.js REST API for the ApexScoop lead generation platform. Handles lead management, blog content, and admin authentication.

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run build
npx tsx seed.ts
npm run dev
```

Server runs on `http://localhost:3001`

## API Documentation

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Register Admin User
**POST** `/api/auth/register`

Create a new admin account.

**Request Body:**
```json
{
  "email": "admin@apexscoop.com",
  "password": "securepassword",
  "name": "Your Name"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@apexscoop.com",
    "name": "Your Name"
  }
}
```

#### Admin Login
**POST** `/api/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "admin@apexscoop.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@apexscoop.com",
    "name": "Your Name"
  }
}
```

#### Get Current User
**GET** `/api/auth/me` (Protected)

Get info about the currently logged-in user.

**Response:**
```json
{
  "id": 1,
  "email": "admin@apexscoop.com",
  "name": "Your Name"
}
```

---

### Leads Management

#### Create Lead
**POST** `/api/leads`

Create a new lead (public endpoint).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "message": "I'm interested in term life insurance"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "message": "I'm interested in term life insurance",
  "status": "new",
  "notes": null,
  "created_at": "2026-04-21T15:30:00Z",
  "updated_at": "2026-04-21T15:30:00Z"
}
```

#### Get All Leads
**GET** `/api/leads` (Protected)

Retrieve all leads with optional status filter.

**Query Parameters:**
- `status` (optional) - Filter by status: `new`, `contacted`, `converted`, `rejected`

**Example:** `GET /api/leads?status=new`

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "status": "new",
    "notes": null,
    "created_at": "2026-04-21T15:30:00Z",
    "updated_at": "2026-04-21T15:30:00Z"
  }
]
```

#### Get Single Lead
**GET** `/api/leads/:id` (Protected)

Get detailed information about a specific lead.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "message": "I'm interested in term life insurance",
  "status": "new",
  "notes": null,
  "created_at": "2026-04-21T15:30:00Z",
  "updated_at": "2026-04-21T15:30:00Z"
}
```

#### Update Lead Status
**PATCH** `/api/leads/:id` (Protected)

Update a lead's status and add notes.

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Called on 4/21, interested in $500k term"
}
```

**Valid Statuses:**
- `new` - New lead
- `contacted` - Already contacted
- `converted` - Became a customer
- `rejected` - Not a good fit

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "status": "contacted",
  "notes": "Called on 4/21, interested in $500k term",
  "created_at": "2026-04-21T15:30:00Z",
  "updated_at": "2026-04-21T16:45:00Z"
}
```

#### Delete Lead
**DELETE** `/api/leads/:id` (Protected)

Remove a lead from the database.

**Response:**
```json
{
  "message": "Lead deleted"
}
```

#### Get Lead Statistics
**GET** `/api/leads/stats` (Protected)

Get counts of leads by status.

**Response:**
```json
{
  "total": 25,
  "new": 10,
  "contacted": 8,
  "converted": 5,
  "rejected": 2
}
```

---

### Blog Posts

#### Get All Blog Posts
**GET** `/api/blog`

Retrieve all published blog posts.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Understanding Life Insurance: A Beginner's Guide",
    "slug": "understanding-life-insurance",
    "excerpt": "Learn the basics of life insurance...",
    "content": "<h2>What is Life Insurance?</h2>...",
    "author": "ApexScoop",
    "image_url": null,
    "published": true,
    "created_at": "2026-04-21T10:00:00Z",
    "updated_at": "2026-04-21T10:00:00Z"
  }
]
```

#### Get Single Blog Post by Slug
**GET** `/api/blog/:slug`

Get a published blog post by its slug.

**Example:** `GET /api/blog/understanding-life-insurance`

**Response:**
```json
{
  "id": 1,
  "title": "Understanding Life Insurance: A Beginner's Guide",
  "slug": "understanding-life-insurance",
  "excerpt": "Learn the basics of life insurance...",
  "content": "<h2>What is Life Insurance?</h2>...",
  "author": "ApexScoop",
  "image_url": null,
  "published": true,
  "created_at": "2026-04-21T10:00:00Z",
  "updated_at": "2026-04-21T10:00:00Z"
}
```

#### Create Blog Post
**POST** `/api/blog` (Protected)

Create a new blog post.

**Request Body:**
```json
{
  "title": "New Blog Post Title",
  "slug": "new-blog-post-title",
  "excerpt": "Short excerpt for the post",
  "content": "<p>Full HTML content of the post</p>",
  "author": "Your Name",
  "image_url": "https://example.com/image.jpg",
  "published": true
}
```

**Response:** Same as Get Single Blog Post

#### Update Blog Post
**PATCH** `/api/blog/:id` (Protected)

Update an existing blog post.

**Request Body:** Same fields as Create (all optional)

**Response:** Updated blog post

#### Delete Blog Post
**DELETE** `/api/blog/:id` (Protected)

Remove a blog post.

**Response:**
```json
{
  "message": "Blog post deleted"
}
```

---

## Environment Variables

Create a `.env` file with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/apex_scoop_db

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production

# Email Service (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_actual_sendgrid_key
EMAIL_FROM=noreply@apexscoop.com
EMAIL_TO=your-email@example.com

# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Email Notifications

When a new lead is submitted, an email is automatically sent to the admin email address with:
- Lead name, email, phone
- Their message/inquiry
- Link to the admin dashboard

### Setting Up SendGrid

1. Create account at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key in Settings → API Keys
3. Add to `.env` as `SMTP_PASS`

## Database Schema

### Leads Table
```sql
- id: Primary key
- name: String (required)
- email: String (required, unique)
- phone: String (optional)
- message: Text (optional)
- status: Enum (new, contacted, converted, rejected)
- notes: Text (optional)
- created_at: Timestamp
- updated_at: Timestamp
```

### Blog Posts Table
```sql
- id: Primary key
- title: String (required)
- slug: String (required, unique)
- content: Text (required)
- excerpt: String
- author: String
- image_url: String
- published: Boolean
- created_at: Timestamp
- updated_at: Timestamp
```

### Admin Users Table
```sql
- id: Primary key
- email: String (required, unique)
- password_hash: String (required)
- name: String
- created_at: Timestamp
```

## Troubleshooting

### Database Connection Error
```
Check:
1. PostgreSQL is running
2. Database exists: createdb apex_scoop_db
3. DATABASE_URL is correct
4. User has proper permissions
```

### Email Not Sending
```
Check:
1. SendGrid API key is correct
2. Sender email is authorized
3. Check SMTP credentials in .env
4. Look at server logs for errors
```

### JWT Token Issues
```
Check:
1. JWT_SECRET is set in .env
2. Token is in Authorization header
3. Token format: "Bearer YOUR_TOKEN"
4. Token hasn't expired (24 hour expiry)
```

## Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript
- `npm run typecheck` - Check TypeScript types

## Production Deployment

See `DEPLOYMENT.md` in the root directory for complete deployment instructions to Railway, Render, or other platforms.

## Security Notes

- Always use strong JWT_SECRET in production
- Never commit .env file
- Use HTTPS in production
- Keep dependencies updated
- Validate all inputs (Zod schema in place)
- Password hashing with bcryptjs

## Support

For issues, check the main README.md or DEPLOYMENT.md
