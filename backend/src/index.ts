import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import leadsRoutes from './routes/leads.js';
import blogRoutes from './routes/blog.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import dataRoutes from './routes/data.js';
import callsRoutes from './routes/calls.js';
import objectionsRoutes from './routes/objections.js';
import underwritingRoutes from './routes/underwriting.js';
import askRoutes from './routes/ask.js';
import { setupWebSocket } from './websocket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// REST Routes
app.use('/api/leads', leadsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api/objections', objectionsRoutes);
app.use('/api/underwriting', underwritingRoutes);
app.use('/api/ask', askRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// HTTP server with WebSocket support
const server = createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket ready at ws://localhost:${PORT}/ws`);
});

export default app;
