# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-SAI Teacher Hub — an educational web platform for teachers using the Flipped Classroom methodology (Sala de Aula Invertida / SAI) with AI assistance. The platform helps teachers plan, execute, and evaluate flipped classroom lessons via a conversational AI pedagogical assistant.

**All UI text is in Brazilian Portuguese.**

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + TypeScript (`client/`)
- **Backend:** Node.js + Express + TypeScript (`server/`)
- **Database:** PostgreSQL via Prisma ORM v5 (hosted on Railway)
- **AI:** Claude API via `@anthropic-ai/sdk`
- **Auth:** JWT (bcrypt + jsonwebtoken)

## Development Commands

```bash
# Install all dependencies
cd client && npm install && cd ../server && npm install && cd ..

# Run both frontend and backend concurrently
npm run dev

# Run individually
npm run dev:client   # Vite dev server on :5173
npm run dev:server   # Express server on :3001 (tsx watch)

# Build
npm run build        # Builds both server and client

# Database
npm run db:push      # Push schema to Railway PostgreSQL
npm run db:migrate   # Run migrations
npm run db:seed      # Seed trail content (trilhas formativas)
```

## Architecture

```
client/src/
  pages/           # Landing, Login, Register, Dashboard
  components/
    auth/          # LoginForm, RegisterForm
    layout/        # Navbar, Footer, TabLayout
    dashboard/     # PlansList
    lesson-plan/   # ConversationalPlanner, PlanEditor (core feature)
    materials/     # MaterialGenerator, MaterialEditor (inline editing)
    trails/        # MicroContentCard, TrailsList
    reflection/    # ReflectionModule
  context/         # AuthContext (JWT auth state)
  services/        # api.ts (axios instance with all API calls)
  types/           # Shared TypeScript interfaces

server/src/
  routes/          # auth, plans, materials, reflections, trails
  middleware/      # JWT auth middleware
  services/        # ai.ts (Claude API integration)
  prisma/          # schema.prisma, seed.ts
```

## Key Design Decisions

- **Conversational AI planner** (not a form): The AI asks follow-up questions before generating a structured plan. The teacher remains the protagonist.
- **Tabbed dashboard**: Plans, Materials, Reflections, Trails as tabs — not separate pages.
- **Inline editing**: All generated materials (quizzes, summaries, video scripts, activities) are editable inline, never static PDFs.
- **Contextual micro-content**: Training trails appear during workflow (e.g., while building pre-class phase), not as a linear course.
- **Prisma v5** (not v7): Using v5 for traditional schema.prisma `url = env("DATABASE_URL")` support.

## Environment Variables (.env at project root)

```
DATABASE_URL=postgresql://...  (Railway PostgreSQL)
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=...
PORT=3001
```
