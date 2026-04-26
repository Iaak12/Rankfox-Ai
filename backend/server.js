const express = require('express');
const dotenv = require('dotenv');

// Load env vars FIRST so controllers can access them
dotenv.config();

const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentRoutes = require('./routes/contentRoutes');
const faqRoutes = require('./routes/faqRoutes');
const seoRoutes = require('./routes/seoRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  'https://rankfox-ai.vercel.app',       // production Vercel
  'https://rankfox-ai-git-main-iaak12.vercel.app', // Vercel git branch preview
  process.env.FRONTEND_URL,              // from Render env var
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman / curl) or matching/vercel preview URLs
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)        // any Vercel preview deployment
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/seo', seoRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('RankFox API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
