<div align="center">

# 🌍 CodeAbroad

### *Learn to code. Land a job abroad.*

A gamified IT learning platform for Indonesian developers who dream of working in **Japan 🇯🇵**, **Germany 🇩🇪**, or **Singapore 🇸🇬**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?logo=go)](https://golang.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Demo](#) · [Docs](./docs) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## 📖 About

**CodeAbroad** is an open-source, gamified learning platform designed specifically for Indonesian developers who want to work abroad. Think of it as a **career RPG** — complete quests, gain XP, level up, and track your readiness to land a real IT job in your target country.

Unlike generic platforms like Udemy or Coursera, CodeAbroad gives you:

- 🎯 **A clear end goal** — not just "learn coding", but "get a job in Japan/Germany/Singapore"
- 🗺️ **Country-specific roadmaps** — visa info, work culture, CV format, salary expectations
- 🎮 **Gamified quests** — Main quests, side quests, and daily quests to keep you on track
- 🇮🇩 **Built for Indonesians** — Context and challenges tailored to Indonesian developers

---

## 🎮 Features

| Feature | Description |
|---------|-------------|
| 🧭 **Quest System** | Main, Side, and Daily quests with XP rewards |
| 📈 **Level & XP** | Progress from Level 1 to 50 as you complete quests |
| 🔥 **Streak Tracking** | Daily login streaks tracked via Redis |
| 🏆 **Achievements** | Unlock badges for hitting milestones |
| 📊 **Readiness Score** | See how job-ready you are for each target country |
| 🌍 **Country Tracks** | Tailored content for Japan, Germany, and Singapore |
| 👤 **Player Profile** | Public profile with GitHub, LinkedIn, and progress |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Zustand** — Client state management
- **TanStack Query** — Server state & caching
- **Axios** — HTTP client
- **Framer Motion** — Animations
- **Lucide React** — Icons

### Backend
- **Go** + **Gin** — REST API
- **Clean Architecture** — Layer separation
- **JWT** — Authentication (access + refresh tokens)
- **PostgreSQL** — Primary database
- **Redis** — Caching, sessions, streak tracking
- **Kafka** — Event-driven async processing

### Infrastructure
- **Docker** + **Docker Compose** — Containerization
- **Nginx** — Reverse proxy

---

## 🗂️ Project Structure

```
codeabroad/
├── frontend/                   # React + TypeScript app
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Page components
│       ├── store/              # Zustand state
│       ├── hooks/              # TanStack Query hooks
│       ├── services/           # Axios API calls
│       └── types/              # TypeScript types
│
├── backend/                    # Go + Gin API
│   ├── cmd/                    # Entry point
│   └── internal/
│       ├── domain/             # Entities & repository interfaces
│       ├── usecase/            # Business logic
│       ├── repository/         # DB implementations
│       ├── delivery/http/      # Gin handlers & middleware
│       └── infrastructure/     # Kafka, Redis, DB connections
│
├── docs/                       # Project documentation
│   ├── prd.md                  # Product Requirements
│   ├── erd.md                  # Database schema
│   ├── api-spec.md             # API specification
│   ├── architecture.md         # System architecture
│   └── design-system.md       # UI design guidelines
│
├── .agents/
│   └── GEMINI.md               # AI agent rules
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Go 1.22+](https://golang.org/dl/)
- [Node.js 20+](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/codeabroad.git
cd codeabroad
```

### 2. Setup Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Edit the `.env` files with your configuration.

### 3. Start Infrastructure (Docker)

```bash
docker-compose up -d
```

This starts: PostgreSQL, Redis, Kafka, and Zookeeper.

### 4. Run the Backend

```bash
cd backend
go mod download
go run cmd/main.go
```

Backend will be available at `http://localhost:8080`

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 📡 API

Base URL: `http://localhost:8080/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET` | `/users/me` | Get current user profile |
| `PATCH` | `/users/me` | Update profile |
| `POST` | `/onboarding` | Complete onboarding |
| `GET` | `/quests` | Get all quests |
| `POST` | `/quests/:id/complete` | Complete a quest |
| `GET` | `/quests/daily` | Get daily quests |
| `GET` | `/progress` | Get progress summary |
| `GET` | `/achievements` | Get all achievements |

Full API documentation: [docs/api-spec.md](./docs/api-spec.md)

---

## 🌿 Git Branching Strategy

```
main       → Production-ready code
staging    → Pre-production & integration testing
feature/*  → Individual feature development
```

- All new features must branch from `feature/*`
- Feature branches merge into `staging` via Pull Request
- `staging` merges into `main` after testing

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PRD](./docs/prd.md) | Product requirements & user stories |
| [ERD](./docs/erd.md) | Database schema & Redis keys |
| [API Spec](./docs/api-spec.md) | Full API endpoint reference |
| [Architecture](./docs/architecture.md) | System design & Kafka event flow |
| [Design System](./docs/design-system.md) | Colors, typography & UI components |

---

## 🤝 Contributing

Contributions are welcome! This is an open-source project built for the community.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request to `staging`

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and contribution guidelines.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [roadmap.sh](https://roadmap.sh) — For inspiration on structured developer roadmaps
- [Duolingo](https://duolingo.com) — For the gamification model
- The Indonesian developer community 🇮🇩

---

<div align="center">

**[⭐ Star this repo](https://github.com/YOUR_USERNAME/codeabroad)** if you find it useful!

</div>
