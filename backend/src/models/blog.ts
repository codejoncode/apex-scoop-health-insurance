import db from '../db.js';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  image_url?: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export const BlogPostModel = {
  async create(data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const result = await db.query(
      'INSERT INTO blog_posts (title, slug, content, excerpt, author, image_url, published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [data.title, data.slug, data.content, data.excerpt, data.author, data.image_url || null, data.published]
    );
    return result.rows[0] as BlogPost;
  },

  async findAll(published = true) {
    let query = 'SELECT * FROM blog_posts';
    const params = [];

    if (published) {
      query += ' WHERE published = $1';
      params.push(true);
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    return result.rows as BlogPost[];
  },

  async findBySlug(slug: string) {
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = true',
      [slug]
    );
    return result.rows[0] as BlogPost | undefined;
  },

  async findById(id: number) {
    const result = await db.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    return result.rows[0] as BlogPost | undefined;
  },

  async update(id: number, data: Partial<BlogPost>) {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    values.push(id);
    const result = await db.query(
      `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] as BlogPost;
  },

  async delete(id: number) {
    await db.query('DELETE FROM blog_posts WHERE id = $1', [id]);
  },
};
