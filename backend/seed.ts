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

    // Seed script types
    const scriptTypes = [
      { name: 'Life Insurance Cold Call', description: 'Standard cold call script for life insurance' },
      { name: 'Health Insurance Follow-up', description: 'Follow-up script for health insurance prospects' },
      { name: 'Accident Insurance Presentation', description: 'Presentation script for accident coverage' },
    ];
    for (const type of scriptTypes) {
      await db.query(
        'INSERT INTO script_types (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [type.name, type.description]
      );
    }
    console.log('✓ Script types created');

    // Seed call outcomes
    const outcomes = [
      { name: 'Rejected', description: 'Call was rejected by prospect' },
      { name: 'Presentation Accepted', description: 'Prospect accepted the presentation' },
      { name: 'Insurance Sold', description: 'Insurance policy was sold' },
      { name: 'Insurance Offer Rejected', description: 'Offer was rejected' },
      { name: 'Not Qualified', description: 'Prospect did not qualify' },
    ];
    for (const outcome of outcomes) {
      await db.query(
        'INSERT INTO call_outcomes (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [outcome.name, outcome.description]
      );
    }
    console.log('✓ Call outcomes created');

    // Seed diseases
    const diseases = [
      { name: 'Diabetes', description: 'A condition that affects blood sugar levels', qualifications: 'May qualify for supplemental health coverage', restrictions: 'Some restrictions on coverage amounts' },
      { name: 'Heart Disease', description: 'Conditions affecting the heart', qualifications: 'Qualifies for accident and health coverage', restrictions: 'Higher premiums may apply' },
      { name: 'Cancer', description: 'Malignant growth or tumor', qualifications: 'May qualify for supplemental coverage', restrictions: 'Waiting periods may apply' },
    ];
    for (const disease of diseases) {
      await db.query(
        'INSERT INTO diseases (name, description, qualifications, restrictions) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING',
        [disease.name, disease.description, disease.qualifications, disease.restrictions]
      );
    }
    console.log('✓ Diseases created');

    // Seed insurance types
    const insuranceTypes = [
      { name: 'Term Life', description: 'Temporary life insurance coverage', details: 'Provides coverage for a specific term (10, 20, 30 years). Affordable premiums, no cash value buildup.' },
      { name: 'Whole Life', description: 'Permanent life insurance', details: 'Lifetime coverage with cash value accumulation. Premiums are fixed and guaranteed.' },
      { name: 'Accident Insurance', description: 'Coverage for accidental injuries', details: 'Pays benefits for injuries from accidents, including death, dismemberment, and disability.' },
      { name: 'Supplemental Health', description: 'Additional health coverage', details: 'Covers gaps in primary health insurance, including deductibles, copays, and hospital stays.' },
    ];
    for (const type of insuranceTypes) {
      await db.query(
        'INSERT INTO insurance_types (name, description, details) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
        [type.name, type.description, type.details]
      );
    }
    console.log('✓ Insurance types created');

    // Seed qualification rules
    const rules = [
      { min_age: 18, max_age: 45, min_weight: 100, max_weight: 250, min_height: 60, max_height: 78, bmi_min: 18.5, bmi_max: 30, category: 'Preferred' },
      { min_age: 46, max_age: 60, min_weight: 120, max_weight: 300, min_height: 60, max_height: 78, bmi_min: 20, bmi_max: 35, category: 'Standard' },
      { min_age: 61, max_age: 75, min_weight: 130, max_weight: 350, min_height: 60, max_height: 78, bmi_min: 22, bmi_max: 40, category: 'Substandard' },
    ];
    for (const rule of rules) {
      await db.query(
        'INSERT INTO qualification_rules (min_age, max_age, min_weight, max_weight, min_height, max_height, bmi_min, bmi_max, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
        [rule.min_age, rule.max_age, rule.min_weight, rule.max_weight, rule.min_height, rule.max_height, rule.bmi_min, rule.bmi_max, rule.category]
      );
    }
    console.log('✓ Qualification rules created');

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
