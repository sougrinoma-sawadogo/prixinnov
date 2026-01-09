import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import authRoutes from './routes/authRoutes.js';
import candidatureRoutes from './routes/candidatureRoutes.js';
import structureRoutes from './routes/structureRoutes.js';
import objectifRoutes from './routes/objectifRoutes.js';
import pieceJointeRoutes from './routes/pieceJointeRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';

// Import database connection
import { sequelize } from './config/database.js';

// Import error handler
import { errorHandler } from './middleware/errorHandler.js';

// Import email service
import { verifyEmailConfig } from './services/emailService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      // Allow requests with no origin (like mobile apps, curl, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      // Allow all localhost and 127.0.0.1 origins with any port
      if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/)) {
        return callback(null, true);
      }
    }
    
    // Get allowed origins from environment or use defaults
    const allowedOrigins = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : ['http://localhost:5173', 'http://127.0.0.1:5173'];
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked: ${origin} not in allowed list`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Prix de l\'Innovation MEF API is running',
    timestamp: new Date().toISOString()
  });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidatures', candidatureRoutes);
app.use('/api/structures', structureRoutes);
app.use('/api/objectifs', objectifRoutes);
app.use('/api/pieces-jointes', pieceJointeRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/pdf', pdfRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Verify email configuration
    await verifyEmailConfig();

    // Sync database (in development only)
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: true });
      console.log('📊 Database models loaded.');
    }

    const HOST = process.env.HOST || '0.0.0.0';
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on ${HOST}:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api`);
      if (HOST === '0.0.0.0') {
        console.log(`🌐 Server is accessible from all network interfaces`);
      }
    });

    // Handle server errors (e.g., port already in use)
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`   Please stop the process using port ${PORT} or set a different PORT in your .env file.`);
        console.error(`   To find and kill the process on Windows, run:`);
        console.error(`   netstat -ano | findstr :${PORT}`);
        console.error(`   taskkill /PID <PID> /F`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    if (error.name === 'SequelizeConnectionRefusedError' || error.original?.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to PostgreSQL database.');
      console.error(`   Connection refused at ${error.original?.address || '127.0.0.1'}:${error.original?.port || '5432'}`);
      console.error('');
      console.error('📋 To fix this, you have two options:');
      console.error('');
      console.error('   1. Start PostgreSQL with Docker (Recommended):');
      console.error('      docker-compose up -d postgres');
      console.error('');
      console.error('   2. Install and start PostgreSQL locally:');
      console.error('      - Install PostgreSQL 15+ from https://www.postgresql.org/download/');
      console.error('      - Start the PostgreSQL service');
      console.error('      - Create the database: CREATE DATABASE prixddi_db;');
      console.error('');
      console.error('   Make sure PostgreSQL is running before starting the server.');
    } else {
      console.error('❌ Unable to start server:', error);
    }
    process.exit(1);
  }
};

startServer();

export default app;

