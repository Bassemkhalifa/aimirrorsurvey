/**
 * AI Mirror Survey — Backend Server
 * Node.js + Express + MongoDB Atlas (Mongoose)
 *
 * Install:  npm install express mongoose cors
 * Run:      node server.js
 *
 * Endpoints:
 *   POST /api/response          — save one survey response
 *   GET  /api/responses         — get all responses (admin only via token)
 *   POST /api/responses/delete  — delete responses by index array
 */

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MongoDB Atlas Connection ──────────────────────────────────
// ⚠️  ضع هنا الـ connection string الخاص بك من MongoDB Atlas
// الصيغة: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ai_mirror_survey?retryWrites=true&w=majority
const MONGO_URI = 'mongodb+srv://khlyfhbasm71_db_user:kIJ00PKcJGognZaV@cluster0.6ibcc7y.mongodb.net/';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => console.log('✅  MongoDB Atlas connected'))
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

// ── Schema ────────────────────────────────────────────────────
const responseSchema = new mongoose.Schema({
  timestamp:        String,
  language:         String,
  age:              String,
  field:            String,
  q4_ai_usage:      String,
  q5_dependency:    String,
  q6_focus:         String,
  q7_fragmentation: String,
  q8_creativity:    String,
  q9_cognition:     String,
  q10_view:         String,
  q11_limits:       String,
  q12_inequality:   Number,
  q13_future_city:  String,
  q14_rebellion:    String,
  q15_job:          String,
  q16_ai_boss:      String,
  q17_confidence:   String,
  q18_independence: String,
  q19_ai_friend:    String,
  q20_empathy:      String,
  q21_bonus:        String,
  open_answer:      String,
  total_raw_score:  Number,
  score_out_of_100: Number,
  result_category:  String
}, { timestamps: true });

const Response = mongoose.model('Response', responseSchema);

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static('.'));  // serve index.html from same folder

// ── Admin token (must match ADMIN_TOKEN in index.html) ────────
const ADMIN_TOKEN = 'SURVEY2025';

function requireAdmin(req, res, next) {
  const token = req.query.token || req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ── Routes ────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Save a new response (public — no token needed)
app.post('/api/response', async (req, res) => {
  try {
    const doc = new Response(req.body);
    await doc.save();
    const count = await Response.countDocuments();
    res.json({ ok: true, count });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// Get all responses — requires admin token
// e.g. GET /api/responses?token=SURVEY2025
app.get('/api/responses', requireAdmin, async (req, res) => {
  try {
    const all = await Response.find({}).sort({ createdAt: 1 }).lean();
    const clean = all.map(({ _id, __v, createdAt, updatedAt, ...rest }) => rest);
    res.json(clean);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Delete responses by index — requires admin token
app.post('/api/responses/delete', requireAdmin, async (req, res) => {
  try {
    const { indices } = req.body;
    if (!Array.isArray(indices) || indices.length === 0) {
      return res.status(400).json({ error: 'No indices provided' });
    }
    const all = await Response.find({}).sort({ createdAt: 1 }).lean();
    const toDelete = indices
      .filter(i => i >= 0 && i < all.length)
      .map(i => all[i]._id);

    await Response.deleteMany({ _id: { $in: toDelete } });
    res.json({ ok: true, deleted: toDelete.length });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete responses' });
  }
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running on port ${PORT}`);
});