# 🤖 AI Mirror Survey — Setup Guide

## 📁 Project Files
```
ai-survey-project/
├── ai-survey.html    ← The survey website (open this in browser)
├── server.js         ← Node.js backend (connects to MongoDB)
├── package.json      ← Dependencies
└── README.md         ← This file
```

---

## ⚙️ Setup (One Time Only)

### Step 1 — Install MongoDB
Download and install MongoDB Community Server:
👉 https://www.mongodb.com/try/download/community

After install, start MongoDB:
- **Windows**: It runs automatically as a service
- **Mac**: `brew services start mongodb-community`
- **Manual**: `mongod --dbpath C:/data/db`

### Step 2 — Install Robo 3T (GUI)
Download Robo 3T (now "Studio 3T Free"):
👉 https://robomongo.org/

Connect with these settings:
```
Host:     localhost
Port:     27017
Database: ai_survey
```

### Step 3 — Install Node.js
Download from: https://nodejs.org (LTS version)

### Step 4 — Install dependencies
Open terminal in this folder and run:
```bash
npm install
```

---

## 🚀 Running the Project

### Every time you want to use the survey:

**Terminal:**
```bash
node server.js
```
You should see:
```
✅  Connected to MongoDB  →  ai_survey
🚀  Server running at  http://localhost:3000
```

**Then open:** `ai-survey.html` in your browser
(or go to http://localhost:3000/ai-survey.html)

---

## 🗄️ Viewing Data in Robo 3T

1. Open Robo 3T
2. Connect to `localhost:27017`
3. Navigate to: `ai_survey` → `Collections` → `surveyresponses`
4. Each document = one completed survey

---

## 📊 Excel Download

After each survey completion, a green **"DOWNLOAD EXCEL"** button appears.
- Click it to download a `.xlsx` file for that response
- Each file is named: `AI_Survey_YYYY-MM-DD-HH-MM-SS.xlsx`

---

## 📋 Data Fields Saved

| Field | Description |
|-------|-------------|
| timestamp | When the survey was completed |
| language | `en` or `ar` |
| age | Age group selected |
| field | Field of work/study |
| q4_ai_usage | How often they use AI |
| q5_dependency | Dependency level |
| q6_focus | Focus duration |
| q7_fragmentation | Cognitive fragmentation |
| q8_creativity | Creative approach |
| q9_cognition | Perceived cognitive change |
| q10_view | View of AI |
| q11_limits | Where AI should be banned |
| q12_inequality | Inequality concern (1–5) |
| q13_future_city | Future city prediction |
| q14_rebellion | AI rebellion belief |
| q15_job | Job replacement concern |
| q16_ai_boss | Trust in AI management |
| q17_confidence | Self-confidence vs AI |
| q18_independence | Intellectual independence |
| q19_ai_friend | Openness to AI relationships |
| q20_empathy | Empathy in relationships |
| q21_bonus | Bonus question (not scored) |
| open_answer | Written open question response |
| total_raw_score | Raw points total |
| score_out_of_100 | Normalized score (0–100) |
| result_category | Final category label |

---

## ❓ Troubleshooting

**"Server offline" message in survey:**
→ Make sure you ran `node server.js` first

**MongoDB connection error:**
→ Make sure MongoDB service is running

**Excel button not working:**
→ Make sure you completed all questions first
