import { Response } from 'express';
import { z } from 'zod';
import { LeadModel } from '../models/lead.js';
import { emailService } from '../services/emailService.js';
import { AuthRequest } from '../middleware/auth.js';

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export const leadsController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const validated = createLeadSchema.parse(req.body);
      const lead = await LeadModel.create(validated);

      // Send email notification
      try {
        await emailService.sendNewLeadNotification(lead);
      } catch (emailError) {
        console.error('Failed to send email, but lead was created:', emailError);
      }

      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create lead' });
      }
    }
  },

  async getAll(req: AuthRequest, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const leads = await LeadModel.findAll(status);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  },

  async getOne(req: AuthRequest, res: Response) {
    try {
      const lead = await LeadModel.findById(parseInt(req.params.id));
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lead' });
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status, notes } = req.body;
      const lead = await LeadModel.updateStatus(
        parseInt(req.params.id),
        status,
        notes
      );
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update lead' });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await LeadModel.delete(parseInt(req.params.id));
      res.json({ message: 'Lead deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete lead' });
    }
  },

  async getStats(req: AuthRequest, res: Response) {
    try {
      const total = await LeadModel.count();
      const all = await LeadModel.findAll();

      const stats = {
        total,
        new: all.filter(l => l.status === 'new').length,
        contacted: all.filter(l => l.status === 'contacted').length,
        converted: all.filter(l => l.status === 'converted').length,
        rejected: all.filter(l => l.status === 'rejected').length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },
};
