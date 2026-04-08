require('dotenv').config();
const express = require('express');
const cors = require('cors');
const factCheckService = require('./services/factCheckService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FactCheck AI Backend is running',
    timestamp: new Date().toISOString(),
    activeApis: {
      primary: process.env.NVIDIA_API_KEY ? 'NVIDIA NIM' : 'Not configured',
      fallback: process.env.GEMINI_API_KEY ? 'Google Gemini' : 'Not configured',
      sources: process.env.GOOGLE_FACTCHECK_API_KEY ? 'Google Fact Check' : 'Not configured'
    }
  });
});

// Fact-check endpoint
app.post('/api/fact-check', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Please provide a valid claim to fact-check'
      });
    }

    const trimmedQuery = query.trim();
    console.log(`🔍 Fact-checking: "${trimmedQuery}"`);
    
    const result = await factCheckService.verifyClaim(trimmedQuery);
    
    // Add metadata
    result.timestamp = new Date().toISOString();
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ Fact-check error:', error.message);
    
    // Return graceful fallback response
    res.status(200).json({
      query: req.body.query || 'Unknown claim',
      verdict: 'unverified',
      errorPercentage: 50,
      explanation: 'Our fact-checking service is temporarily unavailable. Please try again in a moment.',
      sources: [],
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('═'.repeat(50));
  console.log(`✅ FactCheck AI Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoint: POST http://localhost:${PORT}/api/fact-check`);
  console.log(`💚 Health Check: GET http://localhost:${PORT}/api/health`);
  console.log('═'.repeat(50));
  
  // Log API status
  if (process.env.NVIDIA_API_KEY) {
    console.log('🎮 NVIDIA NIM API: Configured (Primary)');
  } else {
    console.log('⚠️  NVIDIA NIM API: Not configured');
  }
  
  if (process.env.GEMINI_API_KEY) {
    console.log('🤖 Google Gemini API: Configured (Fallback)');
  } else {
    console.log('⚠️  Google Gemini API: Not configured');
  }
  
  if (process.env.GOOGLE_FACTCHECK_API_KEY) {
    console.log('📚 Google Fact Check Tools: Configured');
  } else {
    console.log('⚠️  Google Fact Check Tools: Not configured - Sources may be limited');
  }
});