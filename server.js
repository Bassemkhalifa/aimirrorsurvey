// ============================================================
//  AI Survey Backend  –  Node.js + Express + MongoDB
//  Run:  node server.js
//  Then open ai-survey.html in your browser
// ============================================================

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');

const app  = express();
const PORT = 3000;

// ── MongoDB connection (local) ──────────────────────────────
//  Make sure MongoDB is running:  mongod --dbpath /data/db
const MONGO_URI = 'mongodb://127.0.0.1:27017/ai_survey';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  Connected to MongoDB  →  ai_survey'))
  .catch(err => console.error('❌  MongoDB connection error:', err));

// ── Response Schema ─────────────────────────────────────────
const responseSchema = new mongoose.Schema({
  timestamp:   { type: Date, default: Date.now },
  language:    String,
  age:         String,
  field:       String,

  // Q4 – Q20 answers (text of chosen option)
  q4_ai_usage:          String,
  q5_dependency:        String,
  q6_focus:             String,
  q7_fragmentation:     String,
  q8_creativity:        String,
  q9_cognition:         String,
  q10_view:             String,
  q11_limits:           String,
  q12_inequality:       Number,   // slider 1-5
  q13_future_city:      String,
  q14_rebellion:        String,
  q15_job:              String,
  q16_ai_boss:          String,
  q17_confidence:       String,
  q18_independence:     String,
  q19_ai_friend:        String,
  q20_empathy:          String,

  // Extra / bonus
  q21_bonus:            String,   // not scored
  open_answer:          String,   // open text question

  // Calculated
  total_raw_score:      Number,
  score_out_of_100:     Number,
  result_category:      String,
});

const SurveyResponse = mongoose.model('SurveyResponse', responseSchema);

// ── Middleware ───────────────────────────────────────────────
app.use(cors());                      // allow requests from the HTML file
app.use(express.json());
app.use(express.static('.'));         // serve ai-survey.html from same folder

// ── POST /api/response  ──────────────────────────────────────
app.post('/api/response', async (req, res) => {
  try {
    const doc = new SurveyResponse(req.body);
    await doc.save();
    console.log(`📝  New response saved  |  Score: ${req.body.score_out_of_100}  |  Lang: ${req.body.language}`);
    res.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── GET /api/responses  (returns all responses as JSON) ──────
app.get('/api/responses', async (req, res) => {
  try {
    const data = await SurveyResponse.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/responses/count ─────────────────────────────────
app.get('/api/responses/count', async (req, res) => {
  const count = await SurveyResponse.countDocuments();
  res.json({ count });
});

app.listen(PORT, () => {
  console.log(`\n🚀  Server running at  http://localhost:${PORT}`);
  console.log(`📄  Open ai-survey.html in your browser`);
  console.log(`🗄️   Robo 3T  →  connect to  mongodb://127.0.0.1:27017`);
  console.log(`             →  database: ai_survey`);
  console.log(`             →  collection: surveyresponses\n`);
});
