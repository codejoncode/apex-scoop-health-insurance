import db from './src/db.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT INTO admin_users (email, password_hash, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
      ['admin@apexscoop.com', hashedPassword, 'Admin']
    );
    console.log('✓ Admin user created');

    // Create sample blog posts
    const blogPosts = [
      {
        title: 'Understanding Life Insurance: A Beginner\'s Guide',
        slug: 'understanding-life-insurance',
        excerpt: 'Learn the basics of life insurance and why it matters for your family\'s financial security.',
        content: `
          <h2>What is Life Insurance?</h2>
          <p>Life insurance is a contract between you and an insurance company. You pay regular premiums, and the insurer promises to pay a death benefit to your beneficiaries if you pass away.</p>

          <h2>Types of Life Insurance</h2>
          <p><strong>Term Life Insurance:</strong> Provides coverage for a specific period (10, 20, or 30 years). It's affordable and straightforward.</p>
          <p><strong>Permanent Life Insurance:</strong> Covers you for life as long as premiums are paid. It includes whole life and universal life options.</p>

          <h2>Why You Need It</h2>
          <ul>
            <li>Replace lost income for your family</li>
            <li>Cover outstanding debts</li>
            <li>Fund children's education</li>
            <li>Leave a legacy</li>
          </ul>
        `,
      },
      {
        title: 'How Much Life Insurance Do You Need?',
        slug: 'how-much-life-insurance',
        excerpt: 'Calculate the right coverage amount for your family\'s needs and peace of mind.',
        content: `
          <h2>Determining Your Coverage Amount</h2>
          <p>The right amount of life insurance depends on several factors:</p>

          <h2>Key Factors</h2>
          <ul>
            <li>Your income and dependents</li>
            <li>Outstanding debts (mortgage, loans)</li>
            <li>Future expenses (education, living costs)</li>
            <li>Your savings and investments</li>
          </ul>

          <h2>Common Rule of Thumb</h2>
          <p>Many experts recommend having 10-12 times your annual income in coverage. This ensures your family can maintain their lifestyle.</p>

          <p>Contact us today for a personalized calculation!</p>
        `,
      },
      {
        title: 'Health & Accident Insurance: Protection Beyond Life',
        slug: 'health-accident-insurance',
        excerpt: 'Discover how health and accident insurance complements your life insurance coverage.',
        content: `
          <h2>What is Health Insurance?</h2>
          <p>Health insurance covers medical expenses from doctor visits to hospital stays, helping protect your finances from healthcare costs.</p>

          <h2>What is Accident Insurance?</h2>
          <p>Accident insurance provides coverage for injuries from accidents, filling gaps in your health insurance with lump sum benefits.</p>

          <h2>Why Both Matter</h2>
          <p>Combined with life insurance, health and accident coverage creates a comprehensive safety net for you and your family.</p>

          <h2>Get Protected Today</h2>
          <p>Let's review your current coverage and ensure you have comprehensive protection.</p>
        `,
      },
    ];

    for (const post of blogPosts) {
      await db.query(
        'INSERT INTO blog_posts (title, slug, content, excerpt, author, published) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING',
        [post.title, post.slug, post.content, post.excerpt, 'ApexScoop', true]
      );
    }
    console.log('✓ Blog posts created');

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
