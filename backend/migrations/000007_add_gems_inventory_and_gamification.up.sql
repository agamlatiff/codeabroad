-- 000007_add_gems_inventory_and_gamification.up.sql
-- Adds gems currency, user inventories, badges, chest claims, coaching submissions, and populates daily quests

-- 1. Add gems column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS gems INTEGER NOT NULL DEFAULT 0;

-- 2. User Inventories (Akihabara items: streak-freeze, xp-booster, cv-review, mock-interview)
CREATE TABLE IF NOT EXISTS user_inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);
CREATE INDEX IF NOT EXISTS idx_user_inventories_user_id ON user_inventories(user_id);

-- 3. User Badges (Monthly challenges & Tokyo Guild milestones)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_key VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_key)
);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- 4. User Daily Chest Claims (3-Tier Milestones)
CREATE TABLE IF NOT EXISTS user_daily_chest_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    tier INTEGER NOT NULL,
    gems_awarded INTEGER NOT NULL,
    xp_awarded INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, claim_date, tier)
);
CREATE INDEX IF NOT EXISTS idx_user_daily_chest_claims_user_date ON user_daily_chest_claims(user_id, claim_date);

-- 5. Coaching & Mentorship Submissions (CV review & VIP mock interview)
CREATE TABLE IF NOT EXISTS coaching_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    target_role VARCHAR(100),
    github_url VARCHAR(255),
    resume_url VARCHAR(255),
    discord_handle VARCHAR(100),
    interview_language VARCHAR(50),
    focus_topic VARCHAR(100),
    preferred_time VARCHAR(100),
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'in_review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_coaching_submissions_user_id ON coaching_submissions(user_id);

-- 6. Populate starter code, acceptance criteria, and story context for Daily Quests
UPDATE quests
SET
    story_context = 'Optimalkan query SQL dengan INNER JOIN untuk menghindari pemindaian tabel penuh (full table scan) pada database PostgreSQL.',
    nihongo_notes = '{"term": "内部結合", "reading": "Naibu-ketsugō", "meaning": "INNER JOIN", "example": "効率的なクエリのために内部結合を使用します。"}'::jsonb,
    acceptance_criteria = '[{"id": "crit_1", "description": "Gunakan klausa INNER JOIN antara tabel users dan career_paths", "passed": false}, {"id": "crit_2", "description": "Pastikan hasil query mengembalikan kolom name dan slug", "passed": false}]'::jsonb,
    starter_code = '{"filename": "query.sql", "language": "sql", "content": "-- Tulis query INNER JOIN antara users u dan career_paths cp\\nSELECT u.name, cp.slug\\nFROM users u\\nINNER JOIN career_paths cp ON u.career_path_id = cp.id;\\n"}'::jsonb,
    test_suite = '{"runner": "psql -f query.sql", "test_cases": [{"name": "TestInnerJoin", "expected": "PASS"}]}'::jsonb
WHERE id = 'e0000001-0000-0000-0000-000000000001';

UPDATE quests
SET
    story_context = 'Cegah panic runtime dengan menambahkan pengecekan nil pointer sebelum mengakses memori struct.',
    nihongo_notes = '{"term": "ヌルポ", "reading": "Nuru-po", "meaning": "Null Pointer Exception / Dereference", "example": "ヌルポを防ぐためにnilチェックを徹底します。"}'::jsonb,
    acceptance_criteria = '[{"id": "crit_1", "description": "Tambahkan guard clause if u == nil return error", "passed": false}, {"id": "crit_2", "description": "Hindari akses u.Name saat pointer u bernilai nil", "passed": false}]'::jsonb,
    starter_code = '{"filename": "guard.go", "language": "go", "content": "package main\\n\\nimport (\\n\\t\"errors\"\\n\\t\"fmt\"\\n)\\n\\ntype User struct {\\n\\tName string\\n}\\n\\nfunc GetUserName(u *User) (string, error) {\\n\\tif u == nil {\\n\\t\\treturn \"\", errors.New(\"user pointer is nil\")\\n\\t}\\n\\treturn u.Name, nil\\n}\\n\\nfunc main() {\\n\\tname, _ := GetUserName(&User{Name: \"Kenji\"})\\n\\tfmt.Println(name)\\n}\\n"}'::jsonb,
    test_suite = '{"runner": "go test -v ./...", "test_cases": [{"name": "TestNilGuard", "expected": "PASS"}]}'::jsonb
WHERE id = 'e0000002-0000-0000-0000-000000000002';

UPDATE quests
SET
    story_context = 'Terapkan TypeScript Custom Type Guard (type predicate) untuk memvalidasi response API yang tidak diketahui tipe datanya.',
    nihongo_notes = '{"term": "型ガード", "reading": "Kata-gādo", "meaning": "Type Guard", "example": "型ガードを使って実行時の安全性を確保します。"}'::jsonb,
    acceptance_criteria = '[{"id": "crit_1", "description": "Definisikan return type predicate: res is ApiError", "passed": false}, {"id": "crit_2", "description": "Validasi keberadaan properti message bertipe string", "passed": false}]'::jsonb,
    starter_code = '{"filename": "guard.ts", "language": "typescript", "content": "export interface ApiError {\\n  message: string\\n  code: number\\n}\\n\\nexport function isApiError(res: unknown): res is ApiError {\\n  return typeof res === \"object\" && res !== null && \"message\" in res && \"code\" in res\\n}\\n"}'::jsonb,
    test_suite = '{"runner": "npm test", "test_cases": [{"name": "TestTypeGuard", "expected": "PASS"}]}'::jsonb
WHERE id = 'e0000003-0000-0000-0000-000000000003';

UPDATE quests
SET
    story_context = 'Ubah urutan layer Dockerfile agar dependency caching berfungsi maksimal saat build berulang.',
    nihongo_notes = '{"term": "キャッシュ", "reading": "Kyasshu", "meaning": "Cache Layer", "example": "ビルド時間を短縮するためにキャッシュを活用します。"}'::jsonb,
    acceptance_criteria = '[{"id": "crit_1", "description": "Pindahkan COPY go.mod go.sum sebelum COPY .", "passed": false}, {"id": "crit_2", "description": "Jalankan go mod download sebelum build binary", "passed": false}]'::jsonb,
    starter_code = '{"filename": "Dockerfile", "language": "dockerfile", "content": "FROM golang:1.23-alpine\\nWORKDIR /app\\nCOPY go.mod go.sum ./\\nRUN go mod download\\nCOPY . .\\nRUN go build -o server .\\nCMD [\"./server\"]\\n"}'::jsonb,
    test_suite = '{"runner": "docker build -t app:test .", "test_cases": [{"name": "TestCacheOrder", "expected": "PASS"}]}'::jsonb
WHERE id = 'e0000004-0000-0000-0000-000000000004';

UPDATE quests
SET
    story_context = 'Validasi format kode pos Jepang 7 digit dengan tanda hubung 〒150-0002 menggunakan regular expression.',
    nihongo_notes = '{"term": "郵便番号", "reading": "Yūbin-bangō", "meaning": "Kode Pos", "example": "日本の郵便番号は3桁ハイフン4桁です。"}'::jsonb,
    acceptance_criteria = '[{"id": "crit_1", "description": "Cocokkan pola ^〒?\\d{3}-\\d{4}$", "passed": false}, {"id": "crit_2", "description": "Tolak format tanpa tanda hubung atau digit tidak valid", "passed": false}]'::jsonb,
    starter_code = '{"filename": "postal.go", "language": "go", "content": "package main\\n\\nimport (\\n\\t\"regexp\"\\n)\\n\\nvar postalRegex = regexp.MustCompile(`^(〒)?\\\\d{3}-\\\\d{4}$`)\\n\\nfunc IsValidTokyoPostalCode(code string) bool {\\n\\treturn postalRegex.MatchString(code)\\n}\\n"}'::jsonb,
    test_suite = '{"runner": "go test -v ./...", "test_cases": [{"name": "TestPostalCode", "expected": "PASS"}]}'::jsonb
WHERE id = 'e0000005-0000-0000-0000-000000000005';

UPDATE quests
SET
    story_context = 'Hitung sisa masa aktif token autentikasi JWT dalam detik berdasarkan claims exp timestamp.',
    nihongo_notes = '{"term": "有効期限", "reading": "Yūkō-kigen", "meaning": "Expiration Date / TTL", "example": "アクセストークンの有効期限を確認します。"}'::jsonb,
    acceptance_criteria = '[{"id": "crit_1", "description": "Kurangi exp claim dengan current unix timestamp", "passed": false}, {"id": "crit_2", "description": "Return 0 jika token sudah kedaluwarsa", "passed": false}]'::jsonb,
    starter_code = '{"filename": "jwt_ttl.go", "language": "go", "content": "package main\\n\\nimport \"time\"\\n\\nfunc GetTokenTTLSeconds(expUnix int64) int64 {\\n\\tnow := time.Now().Unix()\\n\\tif expUnix <= now {\\n\\t\\treturn 0\\n\\t}\\n\\treturn expUnix - now\\n}\\n"}'::jsonb,
    test_suite = '{"runner": "go test -v ./...", "test_cases": [{"name": "TestTokenTTL", "expected": "PASS"}]}'::jsonb
WHERE id = 'e0000006-0000-0000-0000-000000000006';

-- 7. Seed Sayembara Boss (Mercari Spec & Rakuten Symphony)
INSERT INTO quests (
    id, title, description, type, difficulty, xp_reward, estimated_minutes,
    order_index, is_active, chip_label, story_context, nihongo_notes,
    acceptance_criteria, starter_code, test_suite
)
VALUES
(
    'b1000001-0000-0000-0000-000000000001',
    'High-Concurrency Worker Pool Engine',
    'Pipeline pemrosesan concurrent beban tinggi dengan Goroutines, Channels, context timeout, dan graceful shutdown anti-memory leak.',
    'boss',
    'advanced',
    250,
    45,
    1,
    TRUE,
    'CAPSTONE // S-RANK',
    'Platform pemrosesan backend memproses jutaan event transaksi per menit. Bangun worker pool Go yang efisien dengan concurrency pool worker dan error handling channel.',
    '{"term": "並行処理", "reading": "Heikō-shori", "meaning": "Concurrency / Parallel Processing", "example": "Goroutineを使って並行処理を最適化します。"}'::jsonb,
    '[{"id": "crit_1", "description": "Batasi jumlah concurrent workers menggunakan buffered channel worker pool", "passed": false}, {"id": "crit_2", "description": "Terapkan context.WithTimeout untuk mencegah worker hanging", "passed": false}, {"id": "crit_3", "description": "Tutup results channel setelah semua job selesai diproses via sync.WaitGroup", "passed": false}]'::jsonb,
    '{"filename": "worker_pool.go", "language": "go", "content": "package main\\n\\nimport (\\n\\t\"context\"\\n\\t\"sync\"\\n\\t\"time\"\\n)\\n\\ntype Job struct {\\n\\tID   int\\n\\tData string\\n}\\n\\ntype Result struct {\\n\\tJobID  int\\n\\tOutput string\\n\\tErr    error\\n}\\n\\nfunc RunWorkerPool(ctx context.Context, workers int, jobs []Job) []Result {\\n\\t// TODO: Implementasi worker pool\\n\\treturn nil\\n}\\n"}'::jsonb,
    '{"runner": "go test -v ./...", "test_cases": [{"name": "TestWorkerPoolConcurrency", "expected": "PASS"}]}'::jsonb
),
(
    'b1000002-0000-0000-0000-000000000002',
    'Fullstack Microservices Clean Architecture Capstone',
    'Implementasi RESTful API end-to-end dengan unit test coverage >80%, OpenAPI spec, dan scratch minimal Docker image.',
    'boss',
    'advanced',
    500,
    60,
    2,
    TRUE,
    'CAPSTONE // S-RANK',
    'Divisi engineering membutuhkan backend microservice dengan arsitektur terisolasi antara domain layer, usecase interface, dan HTTP handler.',
    '{"term": "クリーンアーキテクチャ", "reading": "Kurīn-ākitekucha", "meaning": "Clean Architecture", "example": "依存性の逆転原則に基づきクリーンアーキテクチャを適用します。"}'::jsonb,
    '[{"id": "crit_1", "description": "Pisahkan domain repository interface dari implementasi database konkret", "passed": false}, {"id": "crit_2", "description": "Gunakan dependency injection saat menginisialisasi usecase", "passed": false}, {"id": "crit_3", "description": "Capai unit test coverage minimal 80% pada logic handler", "passed": false}]'::jsonb,
    '{"filename": "clean_arch.go", "language": "go", "content": "package main\\n\\nimport \"context\"\\n\\ntype UserRepository interface {\\n\\tFindByID(ctx context.Context, id string) (*User, error)\\n}\\n\\ntype UserUsecase struct {\\n\\trepo UserRepository\\n}\\n\\nfunc NewUserUsecase(repo UserRepository) *UserUsecase {\\n\\treturn &UserUsecase{repo: repo}\\n}\\n"}'::jsonb,
    '{"runner": "go test -cover ./...", "test_cases": [{"name": "TestCleanArchitectureCoverage", "expected": "> 80%"}]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    xp_reward = EXCLUDED.xp_reward,
    chip_label = EXCLUDED.chip_label,
    story_context = EXCLUDED.story_context,
    nihongo_notes = EXCLUDED.nihongo_notes,
    acceptance_criteria = EXCLUDED.acceptance_criteria,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite;
