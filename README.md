# AI CX Reply Assistant — Backend

Backend REST API and RAG engine for the AI-Powered Customer Experience (CX) Reply Assistant, built with **Node.js**, **Express**, and **TypeScript**.

---

## 🛠️ Tech Stack
- **Runtime:** Node.js (v24+)
- **Framework:** Express
- **Language:** TypeScript
- **Architecture:** Controller-Service-Repository pattern with strict error handling middleware

---

## 📌 Features Built

### 1. Knowledge Base & Multi-Brand Isolation (src/repositories/knowledgeBaseRepository.ts)
- Configured with multiple distinct brands:
  - **Apex Retail:** Consumer Electronics (7-day refund window, standard 3-5 day shipping).
  - **GlowBotanics Skincare:** Beauty & Cosmetics (48-hour photo requirement for broken bottles).
  - **AeroFit Nutrition:** Health Supplements.
- Policies covering: Return, Refund, Shipping, and Order Cancellation.
- Enforces strict brand isolation so Brand A's knowledge is never used for Brand B.

### 2. Knowledge Retrieval Service (src/services/retrievalService.ts)
- Decoupled RAG retrieval engine.
- Filters queries by randId.
- Implements keyword relevance scoring, English stop-word filtering, and threshold matching (score >= 6) to prevent irrelevant matches.

### 3. AI Service & Guardrails Engine (src/services/aiService.ts)
- **Intent & Sentiment Classifier:** Detects intents (*Refund Request, Damaged Item, Shipping Inquiry, Cancellation*) and sentiments (*Neutral, Frustrated, Positive, Concerned*).
- **Safety Guardrails:**
  - **Policy Enforcement:** Flags out-of-policy requests (e.g. 20 days vs 7-day refund cutoff), refuses false promises, and recommends escalation.
  - **Hallucination Prevention:** For unverified questions (e.g. CEO personal phone number), returns 0 sources and politely refuses without inventing facts.
  - **Timeline Inquiries:** Answers refund banking processing times (3-5 business days).
- **Dual AI Mode:**
  - Supports live OpenAI Responses API (POST /v1/responses) and Chat Completions (POST /v1/chat/completions).
  - Graceful deterministic fallback when upstream API quotas expire or during offline evaluation.

### 4. Conversation & Audit Logging (src/repositories/interactionLogRepository.ts)
- Manages conversation threads for Indian profiles (*Aarav Sharma, Priya Patel, Rohan Verma, Ananya Iyer*) with INR order metadata.
- Audit logs store: customerMessage, etrievedContext, iGeneratedReply, gentEditedReply, inalResponse, and 	imestamp.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/health | Backend status, uptime, and mock mode indicator |
| GET | /api/conversations | List all active customer conversations |
| GET | /api/conversations/:id | Get conversation detail, messages, and order info |
| POST | /api/conversations/:id/reply | Send agent reply into conversation thread |
| POST | /api/ai/generate-reply | Generate AI reply via RAG pipeline for a conversation |
| POST | /api/ai/analyze-message | Analyze intent, sentiment, and retrieve KB for any text |
| GET | /api/knowledge-base | Retrieve brand policies |
| POST | /api/knowledge-base | Create a new brand policy entry |
| PUT | /api/knowledge-base/:id | Update an existing policy |
| DELETE | /api/knowledge-base/:id | Delete a policy |
| GET | /api/dashboard/stats | Dashboard conversation and reply metrics |

---

## 🚀 Getting Started

### 1. Install Dependencies
`ash
npm install
`

### 2. Configure Environment
Create a .env file from .env.example:
`env
PORT=3000
FRONTEND_URL=http://localhost:5173
AI_API_KEY=
AI_MODEL=gpt-4o-mini
AI_MOCK_MODE=true
`

### 3. Run Development Server
`ash
npm run dev
`
Server runs at: http://localhost:3000

### 4. Build & Start Production Server
`ash
npm run build
npm start
`
