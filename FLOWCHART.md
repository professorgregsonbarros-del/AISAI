# AI-SAI Teacher Hub — Fluxo do Sistema

## Milestone 1 — Plataforma Completa (Days 1-7)

```
사용자
  │
  ▼
[Landing Page]
  │ 회원가입/로그인
  ▼
[Auth] ──── JWT 토큰 발급 ────► [localStorage]
  │
  ▼
[Dashboard] ◄─────────────────────────────────┐
  │                                            │
  ├── 탭 1: Planos ──► [PlansList]             │
  │         │          검색/필터               │
  │         │          플랜 목록               │
  │         │                                  │
  │         ▼                                  │
  │    [ConversationalPlanner]                 │
  │         │                                  │
  │         │ 교사가 주제/레벨 입력             │
  │         ▼                                  │
  │    [Claude API] ◄── ANTHROPIC_API_KEY      │
  │         │                                  │
  │         │ AI가 질문 반복 (대화형)           │
  │         ▼                                  │
  │    [PlanEditor] ── 수업 계획 저장 ──► [PostgreSQL]
  │         │                                  │
  ├── 탭 2: Materiais                          │
  │         │                                  │
  │         ▼                                  │
  │    [MaterialGenerator]                     │
  │         │ 플랜 선택                        │
  │         ▼                                  │
  │    [Claude API] ── 퀴즈/요약/영상스크립트/활동 생성
  │         │                                  │
  │         ▼                                  │
  │    [MaterialEditor] ── 인라인 수정 ──► [PostgreSQL]
  │         │                                  │
  ├── 탭 3: Reflexões                          │
  │         │                                  │
  │         ▼                                  │
  │    [ReflectionModule]                      │
  │         │ 교사가 수업 후 반성 기록          │
  │         ▼                                  │
  │    [Claude API] ── AI 개선 제안 생성        │
  │         │                                  │
  │         ▼                                  │
  │    저장 ──────────────────────────► [PostgreSQL]
  │                                            │
  └── 탭 4: Trilhas                            │
            │                                  │
            ▼                                  │
       [TrailsList]                            │
            │ 컨텍스트별 마이크로 콘텐츠        │
            ▼                                  │
       [MicroContentCard] ────────────────────►┘
```

---

## Milestone 2 — Polimento + Deploy (Days 8-10)

```
[PlansList]
  │ 플랜 상세 열기
  ▼
[PlanEditor readOnly]
  │ "Exportar PDF" 클릭
  ▼
[html2canvas] ── 화면 캡처
  │
  ▼
[jsPDF] ── A4 PDF 생성 ── 자동 다운로드

[MaterialEditor]
  │ "Exportar PDF" 클릭 (각 자료 카드)
  ▼
[html2canvas + jsPDF] ── 자료별 PDF 다운로드

[PlansList]
  │
  ├── 검색창 입력 ──► API GET /plans?search=...
  └── 필터 선택 ──► API GET /plans?status=draft|complete

[Railway 배포]
  │
  ├── Dockerfile ── 빌드
  │     ├── client/dist (React 정적 파일)
  │     └── server/dist (Express 컴파일)
  │
  └── Express ── production 모드
        ├── /api/* ──► API 라우트
        └── /* ──────► client/dist/index.html
```

---

## 데이터 흐름 요약

```
브라우저 ──► axios (Bearer Token) ──► Express API
                                          │
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                         PostgreSQL   Claude API   JWT 검증
                         (Prisma)    (Anthropic)  (middleware)
```

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | React 18 + Vite + Tailwind CSS + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (Railway) + Prisma ORM |
| AI | Claude API (`claude-sonnet-4-5`) |
| Auth | JWT + bcryptjs |
| PDF | jsPDF + html2canvas |
| Deploy | Railway (Dockerfile) |

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/auth/register | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/auth/me | 현재 유저 정보 |
| POST | /api/auth/make-admin | 어드민 권한 부여 |
| GET | /api/plans | 플랜 목록 (검색/필터) |
| POST | /api/plans | 플랜 생성 |
| POST | /api/plans/chat | AI 대화형 플랜 생성 |
| GET | /api/plans/:id | 플랜 상세 |
| PUT | /api/plans/:id | 플랜 수정 |
| DELETE | /api/plans/:id | 플랜 삭제 |
| GET | /api/materials | 자료 목록 |
| POST | /api/materials/generate | AI 자료 생성 |
| PUT | /api/materials/:id | 자료 수정 |
| DELETE | /api/materials/:id | 자료 삭제 |
| GET | /api/reflections | 반성 목록 |
| POST | /api/reflections | 반성 생성 |
| POST | /api/reflections/:id/suggest | AI 개선 제안 |
| GET | /api/trails | 트레일 목록 |
| POST | /api/trails | 트레일 생성 (어드민) |
| PUT | /api/trails/:id | 트레일 수정 (어드민) |
| DELETE | /api/trails/:id | 트레일 삭제 (어드민) |
| GET | /api/trails/admin/users | 전체 유저 목록 (어드민) |
| GET | /api/trails/admin/plans | 전체 플랜 목록 (어드민) |

---

## 환경 변수 (Railway Variables)

| 변수 | 설명 |
|------|------|
| DATABASE_URL | PostgreSQL 연결 문자열 |
| ANTHROPIC_API_KEY | Claude API 키 |
| JWT_SECRET | JWT 서명 비밀키 |
| ADMIN_SECRET | 어드민 권한 부여용 비밀키 |
| NODE_ENV | production |

---

_Criado em: 31 de março de 2026_
