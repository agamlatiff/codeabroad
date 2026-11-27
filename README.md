<div align="center">

# Merantalk

### *Master Languages. Achieve Global Certification.*

Platform pembelajaran bahasa bergamifikasi taktil untuk pembelajar Indonesia menuju karier, beasiswa, dan sertifikasi global.  
Memadukan **Desain 3D Taktil Merantalk**, **Pengingat Ulang Otomatis (Anti Lupa)**, dan **Kurikulum Standar Internasional**:  
**JLPT Jepang (`N5–N1` • Aktif)** · **TOEFL iBT / CEFR Inggris US (`A1–C2` • Aktif)** · *Segera Hadir:* **IELTS UK** · **Goethe Jerman** · **HSK Mandarin** · **DELF Prancis**.

[![License: MIT](https://img.shields.io/badge/License-MIT-2563EB.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.25+-00ADD8?logo=go)](https://golang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Live Demo](https://img.shields.io/badge/Live-merantalk.vercel.app-10B981)](https://merantalk.vercel.app)

[Live App](https://merantalk.vercel.app) · [Engineering Workflow](.agents/skills/codeabroad-workflow/SKILL.md) · [PRD (v3.2)](.agents/docs/prd.md) · [ERD & DBML (v3.2)](.agents/docs/erd.md) · [OpenAPI 3.0](docs/api/openapi.yaml)

</div>

---

## Ringkasan Platform & Konten Aktif

**Merantalk** menjembatani keseruan gamifikasi harian dengan kedalaman tata bahasa kontras Bahasa Indonesia, **Pengingat Ulang Otomatis (Anti Lupa)** agar materi menempel lebih lama, dan simulasi kesiapan ujian resmi internasional:

| Jalur Bahasa | Status | Standar Level | Konten Produksi Saat Ini |
| :--- | :--- | :--- | :--- |
| **Jepang (`ja`)** | **Aktif Penuh** | **JLPT N5 – N1** | Papan Hiragana/Katakana/Kanji interaktif, **56** Panduan Grammar, **120** Dek Kartu Kosakata (**1.819** kartu), **76** Unit (**496** pelajaran, **4.113** soal 4 pilar) |
| **Inggris US (`en-us`)** | **Aktif Penuh** | **CEFR A1 – C2 • TOEFL iBT** | **60** Panduan Grammar ber-IPA Amerika, **60** Dek Kartu Kosakata (**900** kartu), **67** Unit (**247** pelajaran, **2.031** soal 4 pilar, **180** dek studi pengantar) |
| **Inggris UK (`en-gb`)** | Segera Hadir | CEFR A1 – C2 • IELTS | Terpisah dari `en-us` untuk ortografi British, kosakata UK, dan format IELTS Academic |
| **Jerman (`de`)** | Segera Hadir | Goethe-Zertifikat A1 – C1 | Katalog terdaftar & terkunci aman di Landing/Onboarding |
| **Mandarin (`zh`)** | Segera Hadir | HSK 1 – 6 | Katalog terdaftar & terkunci aman di Landing/Onboarding |
| **Prancis (`fr`)** | Segera Hadir | DELF / DALF A1 – C2 | Katalog terdaftar & terkunci aman di Landing/Onboarding |

**Total Bank Materi Aktif di Database Produksi:** **143 Unit** · **743 Pelajaran** · **6.144 Latihan 4 Pilar** · **116 Panduan Grammar Interaktif** · **180 Dek Kartu Kosakata (2.719 Kartu)**.

---

## Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| **Learn-Before-Quiz Study Batches** | Kartu pengantar materi bertahap (*2 Materi → Latihan → 2 Materi*) lengkap dengan audio kecepatan normal (`1.0x`) & pelan (`0.6x`), mnemonik Bahasa Indonesia, dan laci *Intip Materi* |
| **4 Pilar Kemahiran Interaktif** | `fill_blank` (*Reading*), `listening_choice` (*Listening*), `sentence_builder` (*Writing* balok kata + pengecoh), dan `speaking_repeat` (*Speaking* via Web Speech API) |
| **3-Step Interactive Grammar Studio** | Setiap poin grammar (`GP-JA-*` & `GP-EN-*`) memiliki alur *1. Pahami* (analogi Indonesia + bedah kata berwarna + jebakan umum), *2. Coba Rakit*, dan *3. Tes Cepat* 3 soal |
| **Pengingat Ulang Otomatis (Anti Lupa)** | Antrean latihan ulang otomatis untuk soal yang masih keliru (`/review`) **dan** 180 dek **Kartu Kosakata** bertingkat dengan jadwal latihan ulang adaptif agar **Ingat Lebih Lama** (`/flashcards`) |
| **Papan Aksara Jepang Interaktif** | Tabel Hiragana, Katakana, dan Kanji lengkap dengan latihan kuis per baris (`/kana/:script`) yang otomatis disembunyikan saat pengguna belajar bahasa beraksara Latin (`en-us`) |
| **Mode Coba Tanpa Login & 3-Tier Akses** | **Guest:** Unit 1 `N5` / `A1` gratis tanpa akun (progres tersimpan lokal & disinkronkan otomatis saat daftar); **Akun Gratis:** `N5–N3` & `A1–B1` penuh; **Merantalk Pro:** `N2–N1` & `B2–C2` |
| **Tes Penempatan & Readiness Mock Exam** | Tes diagnostik 15 soal saat Onboarding untuk lompat level otomatis + Ujian Simulasi Kesiapan 4 pilar (`order_index = 99`) di tiap level |
| **Misi Harian, Peti Harta & Liga Mingguan** | 3 misi harian rotasi WIB, Peti Harian bertingkat, Lencana Kehormatan Bulanan, Toko Gems (*Streak Freeze*, *2x XP Booster*), dan Liga Mingguan (`Bronze` → `Diamond`) |
| **Procedural Web Audio & Multi-Locale TTS** | Synthesizer efek suara taktil via Web Audio API (`audioService.ts`) + pelafalan otomatis `ja-JP` dan `en-US` tanpa aset MP3 eksternal berat |

---

## Tech Stack & Arsitektur

### Frontend (`frontend/`)
- **Core:** React 19 + TypeScript 5.9 (**Zero `any`** policy), Vite 8, Tailwind CSS v4
- **State & Data:** **Zustand** (`authStore`, `guestTrialStore`, `onboardingStore`, `audioStore`) + **TanStack Query v5** + `react-hook-form` + `zod`
- **Arsitektur:** **Feature-Sliced + Headless Hook Pattern** (`features/<domain>/{components,hooks,pages,services,store,types,utils}` + `shared/`)
- **UI & Aksesibilitas:** **Desain 3D Taktil Merantalk** (Royal Blue `#2563EB`), SVG Flag Illustrations (Zero Raw Emoji Policy), *skeleton* pemuatan konsisten, dan proteksi anti-*double-submit* global

### Backend (`backend/`)
- **Core:** Go 1.25+ dengan Gin Web Framework
- **Arsitektur:** **Modular Clean Architecture** per domain (`internal/app/<module>/{domain,repository,usecase,handler,helper}.go` + `internal/shared/{apperror,middleware,progression,response,router}`)
- **Autentikasi:** JWT Access Token berumur pendek (15 menit) + Rotated Refresh Token di Redis (30 hari) + **Google OAuth 2.0** (`/api/v1/auth/google`)
- **Database & Cache:** **Neon Serverless PostgreSQL 16** (`pgx/v5`, 32 tabel ternormalisasi + JSONB) & **Upstash Redis TLS** (sesi refresh token, *rate limiting*, dan *cache* kurikulum)
- **Deployment:** Vercel Serverless Go Function di region **Singapura (`sin1`)** (`backend/api/index.go` & `backend/vercel.json`) + Vercel Static SPA CDN (`frontend/vercel.json`)

---

## Struktur Proyek

```text
codeabroad/
├── .agents/
│   ├── docs/
│   │   ├── erd.md                      # Skema 32 tabel PostgreSQL 16, DBML & inventaris migrasi (v3.2)
│   │   └── prd.md                      # Product Requirements Document & alur fitur saat ini (v3.2)
│   ├── rules/                          # Aturan disiplin scope, minimal diff, dan standar teknis
│   └── skills/codeabroad-workflow/     # Panduan workflow engineering Merantalk (SKILL.md)
│
├── docs/api/
│   └── openapi.yaml                    # Kontrak REST API OpenAPI 3.0.3 lengkap (50+ endpoint)
│
├── backend/                            # Go 1.25+ Modular Clean Architecture API
│   ├── api/index.go                    # Entrypoint Vercel Serverless Function (region: sin1)
│   ├── cmd/api/main.go                 # Entrypoint server HTTP lokal / container
│   ├── config/                         # Konfigurasi environment & validasi fail-fast
│   ├── infrastructure/                 # Koneksi pool PostgreSQL (pgx/v5) & Redis (TLS)
│   ├── internal/
│   │   ├── app/                        # Modul domain: auth, user, onboarding, language,
│   │   │                               # curriculum, exercise, flashcard, gamification,
│   │   │                               # leaderboard, health
│   │   └── shared/                     # apperror, middleware, progression, response, router
│   └── migrations/                     # 17 pasang migrasi sekuensial (000001 .. 000017)
│
├── frontend/                           # React 19 + TypeScript 5.9 SPA
│   └── src/
│       ├── features/                   # Slice fitur: landing, auth, onboarding, curriculum,
│       │                               # exercise, flashcard, gamification, leaderboard,
│       │                               # pricing, user
│       └── shared/                     # UI primitives (Button3D, Skeleton, TierUpgradeBanner),
│                                       # layout (TopBar, Left/Right Sidebar, TrackSwitcher),
│                                       # audioService, tokens, constants, hooks, utils
│
└── docker-compose.yml                  # Orkestrasi PostgreSQL & Redis lokal
```

---

## Menjalankan Secara Lokal (Quickstart)

### Prasyarat
- Go `1.25+`
- Node.js `20+` & `npm`
- PostgreSQL `16+` & Redis `7+` (via Docker Compose atau Neon/Upstash)

### 1. Salin Konfigurasi Environment
```bash
cp .env.example .env
```

### 2. Jalankan PostgreSQL & Redis Lokal (Opsional jika tidak memakai cloud DB)
```bash
docker compose up -d postgres redis
```

### 3. Terapkan Migrasi Database (`000001` – `000017`)
Jalankan seluruh berkas `.up.sql` di `backend/migrations/` secara berurutan menggunakan `golang-migrate` atau `psql`.

### 4. Jalankan Backend API (`http://localhost:8080`)
```bash
cd backend
go vet ./...
go test -count=1 ./...
go run cmd/api/main.go
```

### 5. Jalankan Frontend Web (`http://localhost:5173`)
```bash
cd frontend
npm install
npx eslint .
npm run dev
```

---

## Verifikasi Kualitas (CI Gate)

Sebelum melakukan *commit* atau *deploy*, pastikan keempat gerbang verifikasi berikut lulus 100%:

```bash
# Backend
cd backend && go vet ./... && go test -count=1 ./...

# Frontend
cd frontend && npx eslint . && npm run build
```

---

## Lisensi

Merantalk dilisensikan di bawah [MIT License](LICENSE).
