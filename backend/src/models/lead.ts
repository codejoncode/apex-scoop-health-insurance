import db from '../db.js';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export const LeadModel = {
  async create(data: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status'>) {
    const result = await db.query(
      'INSERT INTO leads (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.name, data.email, data.phone || null, data.message || null]
    );
    return result.rows[0] as Lead;
  },

  async findAll(status?: string) {
    let query = 'SELECT * FROM leads ORDER BY created_at DESC';
    const params = [];

    if (status) {
      query = 'SELECT * FROM leads WHERE status = $1 ORDER BY created_at DESC';
      params.push(status);
    }

    const result = await db.query(query, params);
    return result.rows as Lead[];
  },

  async findById(id: number) {
    const result = await db.query('SELECT * FROM leads WHERE id = $1', [id]);
    return result.rows[0] as Lead | undefined;
  },

  async updateStatus(id: number, status: Lead['status'], notes?: string) {
    const result = await db.query(
      'UPDATE leads SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, notes || null, id]
    );
    return result.rows[0] as Lead;
  },

  async updateNotes(id: number, notes: string) {
    const result = await db.query(
      'UPDATE leads SET notes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [notes, id]
    );
    return result.rows[0] as Lead;
  },

  async delete(id: number) {
    await db.query('DELETE FROM leads WHERE id = $1', [id]);
  },

  async count() {
    const result = await db.query('SELECT COUNT(*) FROM leads');
    return parseInt(result.rows[0].count, 10);
  },
};
