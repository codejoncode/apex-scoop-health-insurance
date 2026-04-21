# ApexScoop Frontend

Next.js + React + TypeScript web application for ApexScoop life insurance lead generation platform.

## Quick Start

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`

## Pages & Features

### Public Pages (No Login Required)

#### Home Page (`/`)
- **Hero Section** - Professional introduction with agent photos
- **Why Choose Us** - Benefits highlights (Expert Guidance, Quick Process, Trusted Professional)
- **Meet Your Expert** - Your headshots and credentials
- **Call to Action** - Multiple CTAs to "Get Your Free Quote"

#### Blog (`/blog`)
- **Blog Listing** - All published blog posts
- **Dynamic Post Pages** (`/blog/:slug`) - Individual blog post with full content
- **Related Content** - Links to quote page from each post

#### Get Quotes Page (`/leads`)
- **Embedded Google Form** - Your Google Form directly embedded
- **Information Panels** - "What to Expect" and "FAQ" sections
- **Fully Responsive** - Mobile-friendly form embedding

### Admin Pages (Login Required)

#### Admin Login (`/admin/login`)
- **Email/Password Authentication** - Secure JWT-based login
- **Register Link** - Create new admin accounts
- **Error Handling** - Clear error messages

**Default Credentials (Change Immediately!):**
- Email: `admin@apexscoop.com`
- Password: `admin123`

#### Admin Dashboard (`/admin/dashboard`)
- **Lead Statistics** - Cards showing:
  - Total Leads
  - New (uncontacted)
  - Contacted
  - Converted (closed deals)
  - Rejected
- **Lead Filtering** - Filter by status
- **Lead Management**:
  - View all leads with contact info
  - Update lead status
  - Add/edit notes
  - Delete leads
  - View submission date

## Key Features

### Lead Capture
- Google Form embedded directly on `/leads` page
- No custom form building needed
- All data goes to your Google Form
- Easy integration with your existing workflow

### Blog System
- Dynamic routing with slugs (`/blog/post-title`)
- Rich HTML content support
- Author and date metadata
- SEO-friendly URLs

### Professional Design
- Responsive layout (mobile, tablet, desktop)
- Tailwind CSS styling
- Modern color scheme (blue primary, cyan secondary)
- Clean typography and spacing
- Hover effects and transitions

### Admin Features
- JWT authentication
- Protected routes
- Real-time lead management
- Lead status workflow (new → contacted → converted/rejected)
- Note-taking for follow-ups

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.tsx              # Home page
│   │   ├── leads.tsx              # Quote page with form
│   │   ├── blog/
│   │   │   ├── index.tsx          # Blog listing
│   │   │   └── [slug].tsx         # Individual post
│   │   └── admin/
│   │       ├── login.tsx          # Admin login
│   │       └── dashboard.tsx      # Lead management
│   ├── components/
│   │   ├── Header.tsx             # Navigation header
│   │   ├── Footer.tsx             # Footer with links
│   │   └── Layout.tsx             # Page wrapper
│   ├── lib/
│   │   └── api.ts                 # API client & utilities
│   └── styles/
│       └── globals.css            # Global Tailwind styles
├── public/
│   ├── images/
│   │   ├── headshot-1.jpg         # Your photo 1
│   │   └── headshot-2.jpg         # Your photo 2
│   ├── logo.svg                   # ApexScoop logo
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── postcss.config.js
```

## Configuration

### Environment Variables

Create `.env.local` (optional - defaults are provided):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://api.apexscoop.com
```

### Tailwind Customization

Edit `tailwind.config.js` to change colors:

```js
theme: {
  extend: {
    colors: {
      primary: '#1e40af',      // Blue
      secondary: '#0891b2',    // Cyan
    },
  },
}
```

## How to Use

### For Website Visitors

1. **Home** - Learn about ApexScoop and see your credentials
2. **Blog** - Read insurance tips and educational content
3. **Get Quotes** - Fill out Google Form for quote request
4. **You'll Receive** - Email notification + follow-up from agent

### For Admin (You)

1. **Login** - Visit `/admin/login`
2. **Dashboard** - See all incoming leads
3. **Manage Leads**:
   - Click "Edit" on a lead
   - Update status (new → contacted → converted)
   - Add notes about interactions
   - Track follow-ups
4. **Filter** - View leads by status
5. **Email Notifications** - Get notified when new leads submit

## API Integration

The frontend communicates with the backend API at `/api/`:

### Lead Creation
```typescript
POST /api/leads
{
  name: string
  email: string
  phone?: string
  message?: string
}
```

### Blog Retrieval
```typescript
GET /api/blog              // Get all posts
GET /api/blog/:slug        // Get single post
```

### Admin Operations
```typescript
POST /api/auth/login       // Authenticate
GET /api/leads             // Get all leads
PATCH /api/leads/:id       // Update lead
DELETE /api/leads/:id      // Delete lead
GET /api/leads/stats       // Get statistics
```

See `backend/README.md` for complete API documentation.

## Customization

### Update Your Information

#### Home Page Content
Edit `src/pages/index.tsx` to change:
- Hero headline and description
- Benefits list
- Call-to-action text

#### Blog Posts
Create in Admin Dashboard (`/admin/dashboard`):
1. Go to backend database or admin panel
2. Create new blog post with:
   - Title
   - URL slug (e.g., `my-blog-post`)
   - Content (HTML supported)
   - Author name
   - Excerpt

#### Branding
- Logo: Replace `public/logo.svg`
- Colors: Update `tailwind.config.js`
- Fonts: Edit `globals.css`
- Photos: Replace images in `public/images/`

### Add Navigation Links
Edit `src/components/Header.tsx`:
```tsx
<Link href="/your-page">Your Page</Link>
```

## Performance Tips

- Images are optimized automatically by Next.js
- Blog posts load fast with server-side rendering
- API calls cached appropriately
- Responsive images for mobile

## SEO Optimization

The app includes:
- ✅ Dynamic page titles
- ✅ Meta descriptions
- ✅ Open Graph tags (ready to add)
- ✅ Structured data (ready to add)
- ✅ Mobile-friendly design
- ✅ Fast load times

To add more:
1. Install `next-seo` package
2. Add meta tags in `_app.tsx`
3. Create `next-sitemap.xml`

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy!

See `DEPLOYMENT.md` for detailed instructions.

### Custom Domain

After deploying to Vercel:
1. Go to project settings
2. Add custom domain `apexscoop.com`
3. Update DNS records
4. Vercel handles SSL/HTTPS

## Troubleshooting

### API Connection Issues
```
Check:
1. Backend is running (npm run dev in backend/)
2. NEXT_PUBLIC_API_URL is correct
3. CORS is enabled on backend
4. No firewall/security blocking requests
```

### Form Not Submitting
```
Check:
1. Google Form embed code is correct
2. Form is in "accepting responses" mode
3. Network tab in DevTools for errors
4. Console for JavaScript errors
```

### Admin Login Not Working
```
Check:
1. Backend API is accessible
2. Token is being stored in localStorage
3. Credentials are correct
4. Browser allows localStorage
```

### Images Not Loading
```
Check:
1. Images exist in public/images/
2. File names are correct
3. Browser cache (Ctrl+Shift+Del)
4. File permissions are readable
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build locally
- `npm run lint` - Check code quality

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Dependencies

Key packages used:
- **next** - React framework
- **react** - UI library
- **axios** - HTTP client
- **tailwindcss** - Styling
- **typescript** - Type safety

See `package.json` for complete list.

## Security

- ✅ JWT tokens stored securely
- ✅ API requests include auth tokens
- ✅ Input validation on forms
- ✅ XSS protection via React
- ✅ HTTPS in production

## Next Steps

1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Test all pages
4. Update content as needed
5. Deploy to Vercel

## Support

- See main `README.md` for overview
- See `DEPLOYMENT.md` for production setup
- See `backend/README.md` for API details
