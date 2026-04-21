import { Response } from 'express';
import { BlogPostModel } from '../models/blog.js';
import { AuthRequest } from '../middleware/auth.js';

export const blogController = {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const posts = await BlogPostModel.findAll();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  },

  async getBySlug(req: AuthRequest, res: Response) {
    try {
      const post = await BlogPostModel.findBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const post = await BlogPostModel.create(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const post = await BlogPostModel.update(parseInt(req.params.id), req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await BlogPostModel.delete(parseInt(req.params.id));
      res.json({ message: 'Blog post deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  },
};
