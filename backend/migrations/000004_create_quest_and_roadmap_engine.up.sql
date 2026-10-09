-- ============================================================================
-- Migration 000004: Create Quest and Roadmap Engine
-- ============================================================================

-- 1. Create roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_path_id UUID NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(career_path_id)
);

-- 2. Create stations table (milestone station e.g., ST 01 // GO)
CREATE TABLE IF NOT EXISTS stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    station_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    chip_label VARCHAR(50) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(roadmap_id, station_number)
);

-- 3. Create chapters table (thematic module within a station)
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(station_id, chapter_number)
);

-- 4. Extend quests table with interactive workspace metadata
ALTER TABLE quests
    ADD COLUMN IF NOT EXISTS chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS chip_label VARCHAR(50),
    ADD COLUMN IF NOT EXISTS story_context TEXT,
    ADD COLUMN IF NOT EXISTS nihongo_notes JSONB,
    ADD COLUMN IF NOT EXISTS acceptance_criteria JSONB,
    ADD COLUMN IF NOT EXISTS starter_code JSONB,
    ADD COLUMN IF NOT EXISTS test_suite JSONB;

-- 5. Extend user_quests table with code submission & test results
ALTER TABLE user_quests
    ADD COLUMN IF NOT EXISTS code_submission TEXT,
    ADD COLUMN IF NOT EXISTS tests_passed INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_tests INT DEFAULT 0;

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_stations_roadmap_id ON stations(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_chapters_station_id ON chapters(station_id);
CREATE INDEX IF NOT EXISTS idx_quests_chapter_id ON quests(chapter_id);
CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(type);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_status ON user_quests(user_id, status);

-- ============================================================================
-- CURRICULUM SEEDS: ROADMAPS, STATIONS & CHAPTERS
-- ============================================================================

-- 1. ROADMAP: Backend Go
INSERT INTO roadmaps (id, career_path_id, title, description, is_active)
SELECT 
    'a1111111-1111-1111-1111-111111111111', 
    id, 
    'Golang Backend Specialist (Tokyo Standard)', 
    'Kuasai microservices berkonkurensi tinggi, RESTful APIs dengan Gin, Clean Architecture, dan cloud readiness untuk startup teknologi Tokyo.',
    TRUE
FROM career_paths WHERE slug = 'backend'
ON CONFLICT (career_path_id) DO NOTHING;

-- 2. ROADMAP: Cloud & DevOps (Docker / AWS)
INSERT INTO roadmaps (id, career_path_id, title, description, is_active)
SELECT 
    'b2222222-2222-2222-2222-222222222222', 
    id, 
    'Cloud Native & DevOps Engineer (Tokyo Standard)', 
    'Automasi infrastruktur, optimalisasi kontainer Docker multi-stage, orkestrasi Kubernetes, dan Terraform di AWS region Tokyo.',
    TRUE
FROM career_paths WHERE slug = 'devops'
ON CONFLICT (career_path_id) DO NOTHING;

-- 3. ROADMAP: Frontend React
INSERT INTO roadmaps (id, career_path_id, title, description, is_active)
SELECT 
    'c3333333-3333-3333-3333-333333333333', 
    id, 
    'Frontend Web Engineer (Tokyo Standard)', 
    'Modern React 19, TypeScript strict mode, state management Zustand, Next.js server components, dan pengujian Vitest berkecepatan tinggi.',
    TRUE
FROM career_paths WHERE slug = 'frontend'
ON CONFLICT (career_path_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- STATIONS: GOLANG BACKEND
-- ----------------------------------------------------------------------------
INSERT INTO stations (id, roadmap_id, station_number, title, chip_label, description, order_index)
VALUES
('a1000001-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 1, 'Go Foundations & Concurrency', 'GO // 01', 'Fondasi sintaks Go, memory pointers, goroutines, dan error wrapping.', 1),
('a1000002-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111112', 2, 'REST APIs with Gin Framework', 'GIN // 02', 'Pembangunan endpoint RESTful berkecepatan tinggi dengan Gin, middleware, dan GORM.', 2),
('a1000003-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111113', 3, 'Clean Architecture & Testing', 'ARCH // 03', 'Pemisahan domain entity, usecase business logic, dan pengujian unit dengan testify mocks.', 3),
('a1000004-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111114', 4, 'Redis Caching & Reliability', 'PERF // 04', 'Cache-aside patterns, rate limiting sliding window, dan pemrosesan asinkron.', 4),
('a1000005-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111115', 5, 'Tokyo Production Readiness', 'PROD // 05', 'Structured logging, multi-stage scratch Dockerfile, dan graceful shutdown.', 5)
ON CONFLICT (roadmap_id, station_number) DO NOTHING;

-- CHAPTERS: GOLANG BACKEND (Sample Chapters)
INSERT INTO chapters (id, station_id, chapter_number, title, description, order_index)
VALUES
('c1000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 1, 'Bab 1: Structs, Pointers & Receivers', 'Pemodelan domain data menggunakan struct dan pointer receiver.', 1),
('c1000002-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000001', 2, 'Bab 2: Concurrency & Worker Pools', 'Eksekusi job paralel dengan channel dan sync.WaitGroup.', 2),
('c1000003-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000001', 3, 'Bab 3: Error Wrapping & Sentinel Errors', 'Penanganan error kontekstual berstandar enterprise.', 3),
('c1000004-0000-0000-0000-000000000004', 'a1000002-0000-0000-0000-000000000002', 1, 'Bab 1: Routing & Query Binding', 'Route grouping dan validasi query parameter.', 1),
('c1000005-0000-0000-0000-000000000005', 'a1000002-0000-0000-0000-000000000002', 2, 'Bab 2: JWT Bearer Middleware', 'Proteksi endpoint API dan injeksi claims ke context.', 2),
('c1000006-0000-0000-0000-000000000006', 'a1000002-0000-0000-0000-000000000002', 3, 'Bab 3: GORM Relations & Transactions', 'Transaksi database atomik dan relasi model.', 3)
ON CONFLICT (station_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- STATIONS: DEVOPS & DOCKER
-- ----------------------------------------------------------------------------
INSERT INTO stations (id, roadmap_id, station_number, title, chip_label, description, order_index)
VALUES
('b2000001-0000-0000-0000-000000000001', 'b2222222-2222-2222-2222-222222222222', 1, 'Linux CLI & Shell Automation', 'LINUX // 01', 'Analisis log POSIX, systemd auto-restart, dan diagnosa jaringan server.', 1),
('b2000002-0000-0000-0000-000000000002', 'b2222222-2222-2222-2222-222222222222', 2, 'Docker Containerization Mastery', 'DOCKER // 02', 'Optimalisasi Dockerfile multi-stage, container networking, dan compose orchestration.', 2),
('b2000003-0000-0000-0000-000000000003', 'b2222222-2222-2222-2222-222222222222', 3, 'CI/CD Pipeline Automation', 'CICD // 03', 'GitHub Actions workflow, scanning kerentanan, dan deployment zero-downtime.', 3),
('b2000004-0000-0000-0000-000000000004', 'b2222222-2222-2222-2222-222222222222', 4, 'Kubernetes Clusters', 'K8S // 04', 'Pods, ingress controller, konfigurasi limits, dan horizontal pod autoscaling.', 4),
('b2000005-0000-0000-0000-000000000005', 'b2222222-2222-2222-2222-222222222222', 5, 'AWS Cloud & Terraform IaC', 'AWS // 05', 'Provisioning Multi-AZ VPC, ECS Fargate, dan CloudWatch alerts.', 5)
ON CONFLICT (roadmap_id, station_number) DO NOTHING;

-- CHAPTERS: DEVOPS (Sample Chapters)
INSERT INTO chapters (id, station_id, chapter_number, title, description, order_index)
VALUES
('c2000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', 1, 'Bab 1: Log Parsing & POSIX Streams', 'Memfilter error log 5xx menggunakan awk dan sed.', 1),
('c2000002-0000-0000-0000-000000000001', 'b2000002-0000-0000-0000-000000000002', 1, 'Bab 1: Container Lifecycle & Hygiene', 'Manajemen container, prune volume dan dangling images.', 1),
('c2000003-0000-0000-0000-000000000002', 'b2000002-0000-0000-0000-000000000002', 2, 'Bab 2: Production Multi-Stage Builds', 'Memangkas image size < 45MB dengan non-root user.', 2),
('c2000004-0000-0000-0000-000000000003', 'b2000002-0000-0000-0000-000000000002', 3, 'Bab 3: Docker Compose Multi-Service', 'Orkestrasi Web, PostgreSQL, dan Redis lokal.', 3)
ON CONFLICT (station_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- STATIONS: FRONTEND REACT
-- ----------------------------------------------------------------------------
INSERT INTO stations (id, roadmap_id, station_number, title, chip_label, description, order_index)
VALUES
('c3000001-0000-0000-0000-000000000001', 'c3333333-3333-3333-3333-333333333333', 1, 'Strict TypeScript & Modern JS', 'TS // 01', 'Type generics, discriminated unions, dan validasi runtime dengan Zod.', 1),
('c3000002-0000-0000-0000-000000000002', 'c3333333-3333-3333-3333-333333333333', 2, 'React Architecture & Components', 'REACT // 02', 'Custom hooks, compound component pattern, dan modular state Zustand.', 2),
('c3000003-0000-0000-0000-000000000003', 'c3333333-3333-3333-3333-333333333333', 3, 'Next.js & Server State', 'NEXT // 03', 'Server components, streaming suspense, dan optimasi pembaruan UI.', 3),
('c3000004-0000-0000-0000-000000000004', 'c3333333-3333-3333-3333-333333333333', 4, 'Web Performance & Vitals', 'PERF // 04', 'Virtualisasi list ribuan item, code splitting, dan eliminasi CLS.', 4),
('c3000005-0000-0000-0000-000000000005', 'c3333333-3333-3333-3333-333333333333', 5, 'Testing & Accessibility a11y', 'TEST // 05', 'Unit testing Vitest, Playwright E2E, dan standar aksesibilitas WCAG 2.1 AA.', 5)
ON CONFLICT (roadmap_id, station_number) DO NOTHING;

-- CHAPTERS: REACT (Sample Chapters)
INSERT INTO chapters (id, station_id, chapter_number, title, description, order_index)
VALUES
('c3000001-0000-0000-0000-000000000001', 'c3000001-0000-0000-0000-000000000001', 1, 'Bab 1: Generics & Strict Typing', 'Pembuatan API client wrapper yang type-safe.', 1),
('c3000002-0000-0000-0000-000000000002', 'c3000002-0000-0000-0000-000000000002', 1, 'Bab 1: Custom Hooks & Isolasi Side-Effect', 'Membangun hooks reusable useDebounce dan useLocalStorage.', 1),
('c3000003-0000-0000-0000-000000000003', 'c3000002-0000-0000-0000-000000000002', 2, 'Bab 2: Accessible Compound Accordion', 'Komponen FAQ accordion fleksibel dengan navigasi keyboard.', 2)
ON CONFLICT (station_id, chapter_number) DO NOTHING;

-- ============================================================================
-- SEED QUESTS: MAIN & DAILY QUESTS
-- ============================================================================

-- 1. Main Quest: Go Gin JWT Middleware (Screen 10 / 10B SSOT)
INSERT INTO quests (
    id, title, description, type, career_path_id, difficulty, xp_reward, estimated_minutes,
    order_index, is_active, chapter_id, chip_label, story_context, nihongo_notes,
    acceptance_criteria, starter_code, test_suite
)
SELECT
    'd1000001-0000-0000-0000-000000000001',
    'Bab 2: Gin JWT Auth Middleware',
    'Implementasikan middleware autentikasi JWT pada framework Gin untuk memvalidasi token otorisasi Bearer header.',
    'main',
    cp.id,
    'intermediate',
    50,
    30,
    2,
    TRUE,
    'c1000005-0000-0000-0000-000000000005',
    'GIN // 02',
    'Fintech di Roppongi mewajibkan otorisasi ketat berbasis token untuk endpoint transaksi. Anda diminta membangun middleware Gin yang memvalidasi header Bearer JWT dan menolak permintaan tanpa token dengan HTTP 401 Unauthorized.',
    '{"term": "認可", "reading": "Nin-ka", "meaning": "Authorization", "example": "このAPIエンドポイントには認可が必要です。"}'::jsonb,
    '[
        {"id": "crit_1", "description": "Tolak request dengan HTTP 401 jika header Authorization kosong atau tidak diawali Bearer", "passed": false},
        {"id": "crit_2", "description": "Ekstrak claims JWT dan simpan user_id ke dalam gin.Context menggunakan c.Set(\"user_id\", userID)", "passed": false},
        {"id": "crit_3", "description": "Lanjutkan ke handler berikutnya via c.Next() jika token valid", "passed": false}
    ]'::jsonb,
    '{"filename": "middleware/auth.go", "language": "go", "content": "package middleware\n\nimport (\n\t\"net/http\"\n\t\"strings\"\n\t\"github.com/gin-gonic/gin\"\n)\n\nfunc AuthMiddleware(secret string) gin.HandlerFunc {\n\treturn func(c *gin.Context) {\n\t\tauthHeader := c.GetHeader(\"Authorization\")\n\t\tif authHeader == \"\" || !strings.HasPrefix(authHeader, \"Bearer \") {\n\t\t\tc.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{\"error\": \"missing token\"})\n\t\t\treturn\n\t\t}\n\n\t\t// TODO: Parse JWT dan panggil c.Set(\"user_id\", claims.UserID)\n\t\tc.Next()\n\t}\n}"}'::jsonb,
    '{"runner": "go test -v ./...", "test_cases": [{"name": "TestAuthMiddleware_MissingToken", "expected": "401 Unauthorized"}, {"name": "TestAuthMiddleware_ValidToken", "expected": "200 OK"}]}'::jsonb
FROM career_paths cp WHERE cp.slug = 'backend'
ON CONFLICT (id) DO NOTHING;

-- 2. Main Quest: Docker Multi-Stage Optimization
INSERT INTO quests (
    id, title, description, type, career_path_id, difficulty, xp_reward, estimated_minutes,
    order_index, is_active, chapter_id, chip_label, story_context, nihongo_notes,
    acceptance_criteria, starter_code, test_suite
)
SELECT
    'd2000001-0000-0000-0000-000000000001',
    'Bab 2: Docker Multi-Stage Build Optimization',
    'Ubah Dockerfile monolitik menjadi multi-stage build yang aman dengan runtime Alpine dan user non-root.',
    'main',
    cp.id,
    'intermediate',
    55,
    25,
    2,
    TRUE,
    'c2000003-0000-0000-0000-000000000002',
    'DOCKER // 02',
    'Startup di Shibuya mengalami pelambatan proses auto-scaling karena Docker image berukuran 1.2GB. Tugas Anda adalah memangkas image menjadi < 45MB menggunakan Alpine minimal base dan user non-root.',
    '{"term": "最適化", "reading": "Saitekika", "meaning": "Optimization", "example": "コンテナイメージの軽量化と最適化を行います。"}'::jsonb,
    '[
        {"id": "crit_1", "description": "Gunakan build stage terpisah (AS builder) dengan compiler Go", "passed": false},
        {"id": "crit_2", "description": "Gunakan base image ramping alpine:3.20 untuk runtime", "passed": false},
        {"id": "crit_3", "description": "Jalankan kontainer dengan non-root user (USER nonroot)", "passed": false}
    ]'::jsonb,
    '{"filename": "Dockerfile", "language": "dockerfile", "content": "FROM golang:1.23-alpine AS builder\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 GOOS=linux go build -o /bin/server .\n\nFROM alpine:3.20\nWORKDIR /app\n# TODO: Buat user non-root dan salin binary dari builder stage\nUSER 1000:1000\nCOPY --from=builder /bin/server /app/server\nEXPOSE 8080\nCMD [\"/app/server\"]"}'::jsonb,
    '{"runner": "hadolint Dockerfile", "test_cases": [{"name": "Linter_Hadolint", "expected": "0 errors"}, {"name": "ImageSizeCheck", "expected": "< 50MB"}]}'::jsonb
FROM career_paths cp WHERE cp.slug = 'devops'
ON CONFLICT (id) DO NOTHING;

-- 3. Main Quest: React Compound Accordion
INSERT INTO quests (
    id, title, description, type, career_path_id, difficulty, xp_reward, estimated_minutes,
    order_index, is_active, chapter_id, chip_label, story_context, nihongo_notes,
    acceptance_criteria, starter_code, test_suite
)
SELECT
    'd3000001-0000-0000-0000-000000000001',
    'Bab 2: Accessible Compound Accordion',
    'Bangun komponen FAQ Accordion fleksibel menggunakan Compound Component pattern dan accessibility ARIA.',
    'main',
    cp.id,
    'intermediate',
    55,
    30,
    2,
    TRUE,
    'c3000003-0000-0000-0000-000000000003',
    'REACT // 02',
    'Platform edukasi di Meguro memerlukan komponen Accordion yang modular untuk halaman FAQ. Desainer UI mengharuskan penggunaan Compound Pattern agar konten mudah disesuaikan.',
    '{"term": "再利用性", "reading": "Sai-riyō-sei", "meaning": "Reusability", "example": "コンポーネントの再利用性を高める設計を採用します。"}'::jsonb,
    '[
        {"id": "crit_1", "description": "Ekspor Accordion, Accordion.Item, Accordion.Header, dan Accordion.Body", "passed": false},
        {"id": "crit_2", "description": "Mendukung toggle expand/collapse via klik dan tombol Enter / Space", "passed": false},
        {"id": "crit_3", "description": "Sediakan atribut aria-expanded dan aria-controls dinamis", "passed": false}
    ]'::jsonb,
    '{"filename": "components/Accordion.tsx", "language": "typescript", "content": "import React, { createContext, useContext, useState } from \"react\"\n\n// Context & Compound Accordion component template\nexport const Accordion = ({ children }: { children: React.ReactNode }) => {\n  return <div className=\"space-y-2\">{children}</div>\n}"}'::jsonb,
    '{"runner": "npm test -- Accordion.test.tsx", "test_cases": [{"name": "RendersAccordionItems", "expected": "Passed"}, {"name": "KeyboardAccessibility", "expected": "Passed"}]}'::jsonb
FROM career_paths cp WHERE cp.slug = 'frontend'
ON CONFLICT (id) DO NOTHING;

-- 4. DAILY QUESTS: Rotating Pool (10 Micro-Quests)
INSERT INTO quests (id, title, description, type, difficulty, xp_reward, estimated_minutes, order_index, is_active, chip_label)
VALUES
('e0000001-0000-0000-0000-000000000001', 'Perbaiki SQL Foreign Key JOIN', 'Ubah query LEFT JOIN menjadi INNER JOIN dengan agregasi unik.', 'daily', 'beginner', 20, 5, 1, TRUE, 'SQL // D1'),
('e0000002-0000-0000-0000-000000000002', 'Tangani Nil Pointer Dereference Go', 'Tambahkan guard clause pengecekan nil sebelum dereference pointer.', 'daily', 'beginner', 20, 5, 2, TRUE, 'GO // D2'),
('e0000003-0000-0000-0000-000000000003', 'TypeScript Type Guard Predicate', 'Buat fungsi type guard isError(res: unknown): res is ApiError.', 'daily', 'beginner', 20, 5, 3, TRUE, 'TS // D3'),
('e0000004-0000-0000-0000-000000000004', 'Optimasi Urutan Layer Dockerfile', 'Pindahkan perintah COPY go.mod sebelum COPY . untuk caching efisien.', 'daily', 'beginner', 20, 5, 4, TRUE, 'DOCKER // D4'),
('e0000005-0000-0000-0000-000000000005', 'Regex Validasi Kode Pos Tokyo', 'Validasi format kode pos Jepang 〒150-0002 menggunakan regular expression.', 'daily', 'beginner', 20, 5, 5, TRUE, 'REGEX // D5'),
('e0000006-0000-0000-0000-000000000006', 'Hitung Masa Berlaku Token JWT', 'Kalkulasi sisa waktu kedaluwarsa token dari epoch exp ke detik.', 'daily', 'beginner', 20, 5, 6, TRUE, 'SEC // D6'),
('e0000007-0000-0000-0000-000000000007', 'Debounce Input Search Hook', 'Terapkan delay 300ms pada custom hook pencarian lowongan kerja.', 'daily', 'beginner', 20, 5, 7, TRUE, 'REACT // D7'),
('e0000008-0000-0000-0000-000000000008', 'Parser Penggunaan Memori Kontainer', 'Ekstrak metrik konsumsi memori dalam MB dari output docker stats.', 'daily', 'beginner', 20, 5, 8, TRUE, 'BASH // D8'),
('e0000009-0000-0000-0000-000000000009', 'Debug Error Log Bahasa Jepang', 'Terjemahkan 「接続タイムアウト」 dan konfigurasikan timeout network 10s.', 'daily', 'beginner', 20, 5, 9, TRUE, 'JP // D9'),
('e0000010-0000-0000-0000-000000000010', 'Eliminasi Layout Shift Banner (CLS)', 'Beri aspect-ratio CSS pada gambar promosi untuk menjaga skor CLS < 0.05.', 'daily', 'beginner', 20, 5, 10, TRUE, 'CSS // D10')
ON CONFLICT (id) DO NOTHING;
