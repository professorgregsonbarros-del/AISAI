# AI-SAI Teacher Hub

**Plataforma educacional inteligente para professores que utilizam a metodologia Sala de Aula Invertida (SAI).**

> The AI guides — the teacher decides. / A IA guia — o professor decide.

---

## What is this?

AI-SAI Teacher Hub is a web platform that helps teachers plan, execute, and reflect on **Flipped Classroom** (Sala de Aula Invertida) lessons with the support of Artificial Intelligence.

The key difference from other AI tools: **the AI never just generates a ready-made lesson plan**. Instead, it acts as a pedagogical assistant — asking questions, understanding your classroom context, and co-constructing the plan with you. The teacher remains the protagonist.

---

## Who is it for?

- Teachers in **basic education** (K-12)
- **Higher education** professors
- **Pre-service teachers** in initial training programs

All UI is in **Brazilian Portuguese**.

---

## Core Features

### 1. Conversational AI Lesson Plan Generator
The AI asks follow-up questions before generating anything:
- *"Seus alunos já tiveram contato com esse conteúdo?"*
- *"Quais recursos eles têm acesso em casa?"*
- *"Qual o tempo disponível para a aula?"*

After 3–5 exchanges, it generates a structured plan with 3 phases:
- **Pré-Aula** — what students do before class (videos, readings, activities)
- **Aula Presencial** — how to use class time for active learning
- **Avaliação Formativa** — how to assess understanding during the process

Every section is editable inline — the teacher adapts the suggestion to their reality.

### 2. Material Generator
Generate and edit:
| Material | Description |
|----------|-------------|
| **Quiz Diagnóstico** | 5 multiple-choice questions to assess prior knowledge |
| **Resumo** | Structured summary with sections and examples |
| **Roteiro de Vídeo** | Timestamped script for educational videos |
| **Atividade Colaborativa** | Step-by-step group activity with instructions |

All materials are **editable inline** — never static PDFs.

### 3. Teacher Dashboard
A single page with 4 tabs:
- **Meus Planos** — all lesson plans with status (draft / complete), search, and filters
- **Materiais** — all generated materials organized by type
- **Reflexões** — reflection entries with AI suggestions
- **Trilhas** — micro-content training cards

### 4. Contextual Training Trails (Trilhas Formativas)
Instead of a linear course that nobody finishes, training content appears **contextually** during the workflow:
- Building the pre-class phase → shows a 2-min card: *"Why pre-class is critical in SAI"*
- Setting up assessment → shows *"Formative vs summative assessment"*

Available topics cover SAI methodology fundamentals and ethical AI use in education.

### 5. Teacher Reflection Module
After applying a lesson, teachers log:
- What worked
- Difficulties encountered
- Suggested improvements

The AI analyzes the reflection and generates specific, encouraging suggestions for the next application. Over time, this builds a portfolio of professional development.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL via Prisma ORM v5 (Railway) |
| AI | Claude API (`claude-sonnet-4`) |
| Auth | JWT (bcrypt + jsonwebtoken) |

---

## Project Structure

```
ai-sai/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── pages/             # Landing, Login, Register, Dashboard
│       ├── components/
│       │   ├── layout/        # Navbar, Footer, TabLayout
│       │   ├── auth/          # LoginForm, RegisterForm
│       │   ├── lesson-plan/   # ConversationalPlanner, PlanEditor
│       │   ├── materials/     # MaterialGenerator, MaterialEditor
│       │   ├── trails/        # MicroContentCard, TrailsList
│       │   └── reflection/    # ReflectionModule
│       ├── context/           # AuthContext (JWT state)
│       ├── services/          # api.ts (all API calls)
│       └── types/             # Shared TypeScript interfaces
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── routes/            # auth, plans, materials, reflections, trails
│   │   ├── middleware/        # JWT authentication
│   │   └── services/         # ai.ts (Claude API)
│   └── prisma/
│       ├── schema.prisma      # Database schema
│       └── seed.ts            # Training trail content
│
├── .env.example               # Environment variables template
└── package.json               # Root workspace with dev/build scripts
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A [Railway](https://railway.app) PostgreSQL database
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd ai-sai

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Install root dependencies
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://user:password@host:port/aisai
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=your-secret-key-here
PORT=3001
```

### 3. Set up the database

```bash
# Push the schema to your Railway PostgreSQL
npm run db:push

# Seed the training trail content
npm run db:seed
```

### 4. Run the application

```bash
# Runs both frontend (port 5173) and backend (port 3001)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:client` | Run Vite dev server only (port 5173) |
| `npm run dev:server` | Run Express server only (port 3001) |
| `npm run build` | Build both client and server for production |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed training trail content |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create teacher account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/plans/chat` | Send message to AI, get response |
| GET | `/api/plans` | List lesson plans |
| GET | `/api/plans/:id` | Get plan details |
| PUT | `/api/plans/:id` | Update plan |
| DELETE | `/api/plans/:id` | Delete plan |
| POST | `/api/materials/generate` | Generate material with AI |
| GET | `/api/materials` | List materials |
| PUT | `/api/materials/:id` | Update material |
| POST | `/api/reflections` | Create reflection |
| GET | `/api/reflections` | List reflections |
| POST | `/api/reflections/:id/suggest` | Get AI suggestion |
| GET | `/api/trails` | Get training content |

---

## Design Principles

1. **AI as guide, not generator** — the teacher is always the pedagogical decision-maker
2. **Dialogue over forms** — lesson plans emerge from conversation, not checkboxes
3. **Inline editing** — every AI suggestion can be edited directly in the interface
4. **Contextual learning** — training content appears when it's relevant, not as a separate course
5. **Reflection loop** — the platform improves with the teacher, lesson by lesson

---

## License

Private project — all rights reserved.

---

*AI-SAI Teacher Hub · Created: March 31, 2026*
