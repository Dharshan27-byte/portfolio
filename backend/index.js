import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes, { seedAdmin } from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import certificateRoutes from './routes/certificates.js';
import blogRoutes from './routes/blogs.js';
import contactRoutes from './routes/contact.js';
import chatbotRoutes from './routes/chatbot.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS - Allow all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Root route
app.get('/api', (req, res) => {
  res.json({
    status: "online",
    message: "Yoga Dharshan AI Portfolio API is operational.",
    version: "1.0.0"
  });
});

// Database & Seed Init
const startServer = async () => {
  await connectDB();
  await seedAdmin();
  
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`🚀 Cyber Server is running on port ${PORT}`);
    });
  } else {
    console.log('🚀 Running in Vercel Serverless environment.');
  }
};

startServer();

export default app;
