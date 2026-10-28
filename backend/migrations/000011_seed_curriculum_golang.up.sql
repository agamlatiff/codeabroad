-- ============================================================================
-- GOLANG BACKEND (slug: 'golang') - CURRICULUM SEED (MODULES 1 TO 5)
-- ============================================================================

-- ============================================================================
-- MODULE 1: Go Syntax & Concurrency Core
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 1
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Go Syntax Foundations & Type System',
    'Penguasaan variabel, primitive types, zero values, pointers, structs, dan method receiver idiomatik di Go.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Goroutines & Channel Primitives',
    'Memulai concurrency dengan lightweight thread (Goroutine), channel buffered/unbuffered, dan directional channel.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 3, 'Synchronization & Worker Pools',
    'Pencegahan race condition dengan sync.Mutex, koordinasi sync.WaitGroup, dan arsitektur Concurrent Worker Pool.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 1 Chapter 1
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Go Zero Values Check',
    'Pahami nilai default (zero value) dari tipe data dasar di Go saat dideklarasikan tanpa inisialisasi.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Berapakah zero value untuk string, boolean, dan pointer di Go secara berturut-turut?",
        "options": ["\"\" (empty string), false, nil", "null, false, undefined", "\"\", true, 0", "\"empty\", false, nil"],
        "answer_index": 0,
        "explanation": "Di Go, string default-nya \"\", boolean default-nya false, dan pointer/slice/map/channel default-nya nil."
    }'::jsonb,
    '["Go tidak memiliki konsep undefined seperti di JavaScript."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Pointer Dereference Fill-in',
    'Lengkapi operator untuk mengambil nilai asli yang ditunjuk oleh pointer (dereferencing).',
    'main', 'fill_blank', 'easy', 50, 5, 4, 2,
    NULL, NULL, NULL,
    '{
        "prompt": "func GetValue(ptr *int) int {\n    return ___ptr\n}",
        "correct_answers": ["*"],
        "explanation": "Operator asterisk (*) digunakan untuk dereference pointer (mengambil nilai dari alamat memori)."
    }'::jsonb,
    '["Gunakan tanda bintang untuk dereference."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Developer Struct & Method',
    'Buat method Introduce() pada struct Developer yang mengembalikan string sapaan.',
    'main', 'code', 'easy', 70, 10, 8, 3,
    'package main\n\nimport "fmt"\n\ntype Developer struct {\n\tName string\n\tRole string\n}\n\n// TODO: Implement Introduce() method returning "Hi, I am [Name], a [Role]"\nfunc (d Developer) Introduce() string {\n\treturn ""\n}',
    '{"test_cases": [{"name": "Introduce Farhan", "expected": "Hi, I am Farhan, a Go Backend Engineer"}]}'::jsonb,
    'package main\n\nimport "fmt"\n\ntype Developer struct {\n\tName string\n\tRole string\n}\n\nfunc (d Developer) Introduce() string {\n\treturn fmt.Sprintf("Hi, I am %s, a %s", d.Name, d.Role)\n}',
    NULL,
    '["Gunakan fmt.Sprintf untuk format string."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 1 Chapter 2
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Goroutines & Channels Warmup',
    'Uji pemahaman dasar mengenai cara kerja lightweight thread (Goroutine) dan channel synchronization di Go.',
    'main', 'quiz', 'easy', 50, 5, 5, 1,
    NULL, NULL, NULL,
    '{
        "question": "Keyword apa yang digunakan untuk mengeksekusi function secara asynchronous di background thread Go?",
        "options": ["async", "go", "thread", "spawn"],
        "answer_index": 1,
        "explanation": "Keyword ''go'' meluncurkan eksekusi function baru sebagai lightweight goroutine yang dikelola oleh Go runtime scheduler."
    }'::jsonb,
    '["Ingat nama bahasa pemrogramannya!"]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Channel Direction Fill-in',
    'Lengkapi deklarasi channel receive-only pada parameter fungsi.',
    'main', 'fill_blank', 'easy', 60, 5, 5, 2,
    NULL, NULL, NULL,
    '{
        "prompt": "func ProcessStream(ch ___ int) {\n    val := <-ch\n}",
        "correct_answers": ["<-chan"],
        "explanation": "<-chan int mendefinisikan channel receive-only di Go."
    }'::jsonb,
    '["Tanda panah ditaruh sebelum keyword chan untuk receive-only."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 1 Chapter 3 (Sync & Boss)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Safe Counter with Mutex',
    'Implementasikan SafeCounter struct yang thread-safe menggunakan sync.Mutex.',
    'main', 'code', 'medium', 120, 15, 15, 1,
    'package main\n\nimport "sync"\n\ntype SafeCounter struct {\n\tmu    sync.Mutex\n\tcount int\n}\n\nfunc (c *SafeCounter) Inc() {\n\t// TODO: Lock and increment count\n}\n\nfunc (c *SafeCounter) Value() int {\n\t// TODO: Lock and return count\n\treturn 0\n}',
    '{"test_cases": [{"name": "Concurrent Increment", "expected": 1000}]}'::jsonb,
    'package main\n\nimport "sync"\n\ntype SafeCounter struct {\n\tmu    sync.Mutex\n\tcount int\n}\n\nfunc (c *SafeCounter) Inc() {\n\tc.mu.Lock()\n\tdefer c.mu.Unlock()\n\tc.count++\n}\n\nfunc (c *SafeCounter) Value() int {\n\tc.mu.Lock()\n\tdefer c.mu.Unlock()\n\treturn c.count\n}',
    NULL,
    '["Gunakan c.mu.Lock() dan defer c.mu.Unlock()"]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Concurrent Worker Pool',
    'Rancang worker pool concurrency yang mendistribusikan jobs ke N goroutines dan mengumpulkan hasilnya melalui channel.',
    'boss', 'code', 'hard', 250, 30, 25, 2,
    'package main\n\nfunc Worker(id int, jobs <-chan int, results chan<- int) {\n\t// TODO: Iterate over jobs channel, multiply value by 2, and send to results\n}',
    '{"test_cases": [{"name": "Process 10 Jobs across 3 Workers", "expected": 10}]}'::jsonb,
    'package main\n\nfunc Worker(id int, jobs <-chan int, results chan<- int) {\n\tfor j := range jobs {\n\t\tresults <- j * 2\n\t}\n}',
    NULL,
    '["Gunakan for j := range jobs untuk membaca hingga channel ditutup."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- MODULE 2: RESTful APIs & Middleware with Gin
-- ============================================================================

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Gin Routing & Request Binding',
    'Inisialisasi Gin engine, route groups v1/v2, path/query parameters, dan validasi data request JSON menggunakan validator v10.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 2
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Custom Middleware & JWT Authentication',
    'Arsitektur middleware interceptor, c.Next() flow control, pembuatan claims JWT HMAC-SHA256, dan validasi token pada header Bearer.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 2
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Quests Module 2
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Gin Binding Validation Tags',
    'Pahami struct tags binding bawaan Gin untuk validasi input otomatis.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Struct tag apa yang digunakan oleh Gin untuk memastikan bahwa sebuah field wajib diisi dan memiliki format email valid?",
        "options": ["binding:\"required,email\"", "validate:\"notnull,email\"", "json:\"email,required\"", "check:\"valid_email\""],
        "answer_index": 0,
        "explanation": "Gin menggunakan tag binding:\"required,email\" yang terintegrasi dengan package go-playground/validator."
    }'::jsonb,
    '["Gunakan keyword binding."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 2 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Auth Middleware with JWT Extraction',
    'Buat custom Gin middleware AuthMiddleware() yang memvalidasi Authorization Bearer token dan menyimpan userID di c.Set().',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    'package main\n\nimport (\n\t"net/http"\n\t"strings"\n\t"github.com/gin-gonic/gin"\n)\n\n// TODO: Implement AuthMiddleware\nfunc AuthMiddleware() gin.HandlerFunc {\n\treturn func(c *gin.Context) {\n\t}\n}',
    '{"test_cases": [{"name": "Rejects missing token with 401", "expected": true}]}'::jsonb,
    'package main\n\nimport (\n\t"net/http"\n\t"strings"\n\t"github.com/gin-gonic/gin"\n)\n\nfunc AuthMiddleware() gin.HandlerFunc {\n\treturn func(c *gin.Context) {\n\t\tauthHeader := c.GetHeader("Authorization")\n\t\tif authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {\n\t\t\tc.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})\n\t\t\treturn\n\t\t}\n\t\ttoken := strings.TrimPrefix(authHeader, "Bearer ")\n\t\tif token == "valid-token" {\n\t\t\tc.Set("user_id", "user-123")\n\t\t\tc.Next()\n\t\t} else {\n\t\t\tc.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})\n\t\t}\n\t}\n}',
    NULL,
    '["Periksa header Authorization dan gunakan c.AbortWithStatusJSON saat invalid."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 2 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- MODULE 3: PostgreSQL & Database Engineering
-- ============================================================================

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Connection Pooling & Safe Querying',
    'Konfigurasi sql.DB connection pool (SetMaxOpenConns, SetMaxIdleConns, SetConnMaxLifetime) dan prepared statements anti SQL injection.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 3
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'ACID Transactions & Repository Pattern',
    'Mengeksekusi transaksi multitable dengan db.BeginTx, rollback otomatis pada error, dan pemisahan query ke Repository layer.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 3
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Quests Module 3
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'SQL Connection Pool Exhaustion',
    'Pahami apa yang terjadi ketika koneksi database tidak ditutup (resource leak).',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Apa dampak utama jika developer lupa memanggil rows.Close() setelah mengeksekusi db.Query() di Go?",
        "options": [
            "Koneksi database tetap terbuka dan pool koneksi akhirnya habis (exhaustion), menyebabkan aplikasi hang",
            "Kompilasi aplikasi gagal secara otomatis",
            "Data di database langsung terhapus",
            "Port database otomatis diganti oleh sistem operasi"
        ],
        "answer_index": 0,
        "explanation": "rows.Close() wajib dipanggil (biasanya via defer) untuk mengembalikan koneksi yang dipakai kembali ke connection pool."
    }'::jsonb,
    '["Koneksi tidak pernah dikembalikan ke pool."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 3 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Atomic Balance Transfer Transaction',
    'Tulis fungsi TransferFunds(ctx, fromID, toID, amount) yang melakukan transfer saldo antarakun secara atomik di dalam db.BeginTx.',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    'package main\n\nimport (\n\t"context"\n\t"database/sql"\n)\n\n// TODO: Implement TransferFunds with atomic BeginTx and rollback\nfunc TransferFunds(ctx context.Context, db *sql.DB, fromID, toID string, amount int) error {\n\treturn nil\n}',
    '{"test_cases": [{"name": "Atomic transaction commit/rollback", "expected": true}]}'::jsonb,
    'package main\n\nimport (\n\t"context"\n\t"database/sql"\n)\n\nfunc TransferFunds(ctx context.Context, db *sql.DB, fromID, toID string, amount int) error {\n\ttx, err := db.BeginTx(ctx, nil)\n\tif err != nil {\n\t\treturn err\n\t}\n\tdefer tx.Rollback()\n\n\t_, err = tx.ExecContext(ctx, "UPDATE accounts SET balance = balance - $1 WHERE id = $2", amount, fromID)\n\tif err != nil {\n\t\treturn err\n\t}\n\t_, err = tx.ExecContext(ctx, "UPDATE accounts SET balance = balance + $1 WHERE id = $2", amount, toID)\n\tif err != nil {\n\t\treturn err\n\t}\n\treturn tx.Commit()\n}',
    NULL,
    '["Gunakan defer tx.Rollback() dan panggil tx.Commit() di baris terakhir."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 3 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- MODULE 4: High-Performance Caching & Messaging
-- ============================================================================

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Redis In-Memory Caching Strategies',
    'Integrasi go-redis client, pola Cache-Aside (Lazy Loading), TTL expiration, dan invalidasi cache terdistribusi.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 4
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Kafka Event Streaming & Async Consumers',
    'Pub/Sub asynchronous dengan Apache Kafka / RabbitMQ, consumer groups, penanganan pesan idempotent, dan retry dead-letter queues.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 4
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Quests Module 4
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Cache-Aside Read Flow',
    'Pahami alur pembacaan data yang benar pada pola Cache-Aside di sistem high-traffic.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Pada pola Cache-Aside, apa yang harus dilakukan aplikasi pertama kali saat menerima request pembacaan data?",
        "options": [
            "Cek cache Redis lebih dulu; jika miss, baca dari PostgreSQL lalu tulis hasilnya ke Redis dengan TTL",
            "Langsung baca dari PostgreSQL tanpa memeriksa cache",
            "Tulis data dummy ke database sebelum memeriksa cache",
            "Hapus seluruh isi Redis setiap ada user yang membaca"
        ],
        "answer_index": 0,
        "explanation": "Cache-Aside memeriksa Redis lebih dulu (cache hit). Jika tidak ada (cache miss), baru membaca database dan mengisikannya ke cache dengan TTL."
    }'::jsonb,
    '["Cek cache dulu, kalau tidak ada baru fallback ke database."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 4 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Idempotent Event Consumer',
    'Cegah pemrosesan ganda pada Kafka consumer dengan membuat fungsi ProcessEventIdempotent() yang mencatat messageID di Redis.',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    'package main\n\n// TODO: Kembalikan true jika event baru berhasil diproses, atau false jika event sudah pernah diproses sebelumnya\nfunc ProcessEventIdempotent(msgID string, processedMap map[string]bool) bool {\n\treturn false\n}',
    '{"test_cases": [{"name": "First time true, second time false", "expected": true}]}'::jsonb,
    'package main\n\nfunc ProcessEventIdempotent(msgID string, processedMap map[string]bool) bool {\n\tif processedMap[msgID] {\n\t\treturn false\n\t}\n\tprocessedMap[msgID] = true\n\treturn true\n}',
    NULL,
    '["Periksa apakah messageID sudah ada di map/set sebelum memproses."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 4 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- MODULE 5: Clean Architecture, Microservices & Docker Production
-- ============================================================================

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Clean Architecture 4-Layer Separation',
    'Pemisahan dependensi 4 layer (Domain, Repository, Usecase, Delivery HTTP/gRPC), Dependency Inversion Principle, dan isolasi bisnis logic murni.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 5
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Docker Multi-Stage & Cloud Deployment',
    'Optimasi Dockerfile multi-stage build Go binary (dari golang:alpine ke scratch/distroless), non-root user security, dan graceful shutdown.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 5
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Quests Module 5
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Clean Architecture Inversion Principle',
    'Pahami arah aliran dependensi pada arsitektur Clean Architecture di Go.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Menurut aturan Clean Architecture, layer manakah yang TIDAK BOLEH mengimpor package eksternal apapun (bebas dari framework Gin, GORM, Redis)?",
        "options": [
            "Domain Layer (Entities & Repository Interfaces)",
            "Delivery Layer (HTTP Handlers)",
            "Repository Layer (Postgres Database)",
            "Infrastructure Layer"
        ],
        "answer_index": 0,
        "explanation": "Domain Layer adalah inti terdalam dari bisnis. Dia murni berisi struct data dan interface contracts tanpa dependensi ke library atau database pihak ketiga."
    }'::jsonb,
    '["Layer paling inti dan terlindungi dari perubahan library luar."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 5 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Production Multi-Stage Dockerfile',
    'Susun Dockerfile multi-stage production untuk Go yang mengompilasi binary di stage builder lalu menyalin binary ke image minimal alpine/scratch.',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    '# TODO: Buat Dockerfile multi-stage build\n# Stage 1: Build binary dengan golang:1.23-alpine as builder\n# Stage 2: Run binary di alpine minimal',
    '{"test_cases": [{"name": "Contains AS builder", "expected": true}, {"name": "Copies binary from builder", "expected": true}]}'::jsonb,
    'FROM golang:1.23-alpine AS builder\nWORKDIR /app\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 GOOS=linux go build -o main .\n\nFROM alpine:latest\nRUN apk --no-cache add ca-certificates\nWORKDIR /root/\nCOPY --from=builder /app/main .\nEXPOSE 8080\nCMD ["./main"]',
    NULL,
    '["Gunakan FROM golang:... AS builder lalu COPY --from=builder /app/main . di stage kedua."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 5 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;
