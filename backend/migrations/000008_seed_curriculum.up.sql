-- ============================================================================
-- 1. MODULES (5 Modul Komprehensif per Kurikulum)
-- ============================================================================

-- A. GOLANG BACKEND (slug: 'golang')
INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 1, 'Go Syntax & Concurrency Core',
    'Fondasi type system, pointers, structs, interfaces, dan primitives concurrency (Goroutines & Channels).'
FROM tech_stacks ts WHERE ts.slug = 'golang'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 2, 'RESTful APIs & Middleware with Gin',
    'Arsitektur routing HTTP, custom middleware JWT, request validation, dan error handling idiomatik.'
FROM tech_stacks ts WHERE ts.slug = 'golang'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 3, 'PostgreSQL & Database Engineering',
    'Connection pooling, integrasi GORM/sqlx, transactions ACID, migrations, dan optimasi query performa tinggi.'
FROM tech_stacks ts WHERE ts.slug = 'golang'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 4, 'High-Performance Caching & Messaging',
    'Strategi caching Redis (TTL & Cache Invalidation) dan asynchronous event streaming dengan Apache Kafka.'
FROM tech_stacks ts WHERE ts.slug = 'golang'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 5, 'Clean Architecture, Microservices & Docker Production',
    'Pemisahan domain 4-layer (delivery, usecase, repo, domain), Docker multi-stage build, gRPC, dan standard industri global.'
FROM tech_stacks ts WHERE ts.slug = 'golang'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;


-- B. FRONTEND REACT (slug: 'react')
INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 1, 'Modern JavaScript & TypeScript Essentials',
    'ES6+, closures, prototypes, event loop, dan integrasi tipe data TypeScript ketat (Zero any).'
FROM tech_stacks ts WHERE ts.slug = 'react'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 2, 'React Core & Component Architecture',
    'Virtual DOM, component lifecycle, hooks dasar (useState, useEffect, useMemo), dan komposisi komponen modular.'
FROM tech_stacks ts WHERE ts.slug = 'react'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 3, 'Modern UI Engineering & Duolingo 3D Tactile Systems',
    'Styling Tailwind CSS v4, desain token fisik 3D, physics button micro-interactions, dan layout responsif.'
FROM tech_stacks ts WHERE ts.slug = 'react'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 4, 'State Management & Server Cache',
    'Headless Hook Pattern, global client state dengan Zustand, serta server query/mutation caching via TanStack Query.'
FROM tech_stacks ts WHERE ts.slug = 'react'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 5, 'Next.js App Router, SSR & Production Performance',
    'Server Components, SEO optimization, lazy loading, Core Web Vitals, dan deployment produksi Vercel/Docker.'
FROM tech_stacks ts WHERE ts.slug = 'react'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;


-- C. DEVOPS & CLOUD (slug: 'devops_aws')
INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 1, 'Linux System Administration & Shell Scripting',
    'Navigasi CLI Linux, file permissions, process management (systemd), SSH hardening, dan otomasi Bash scripting.'
FROM tech_stacks ts WHERE ts.slug = 'devops_aws'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 2, 'Containerization with Docker',
    'Arsitektur kontainer, penulisan Dockerfile hemat layer, multi-stage builds, dan orkestrasi lokal Docker Compose.'
FROM tech_stacks ts WHERE ts.slug = 'devops_aws'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 3, 'Infrastructure as Code (IaC) with Terraform',
    'Deklarasi infrastruktur deklaratif HCL, manajemen state, modules reusable, dan provisioning cloud otomatis.'
FROM tech_stacks ts WHERE ts.slug = 'devops_aws'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 4, 'CI/CD Pipelines & Automated Delivery',
    'Otomatisasi pengujian dan deployment kontinu dengan GitHub Actions, security scanning, dan artifact release registry.'
FROM tech_stacks ts WHERE ts.slug = 'devops_aws'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 5, 'Kubernetes (K8s) & AWS Cloud Native',
    'Pods, Deployments, Services, Ingress Nginx, ConfigMaps/Secrets, dan arsitektur klaster AWS EKS skala enterprise.'
FROM tech_stacks ts WHERE ts.slug = 'devops_aws'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;


-- D. WEB FUNDAMENTAL (slug: 'web_fundamental')
INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 1, 'Semantic HTML5 & Accessibility (a11y)',
    'Struktur tag semantik, web accessibility WCAG, form validation native, dan meta tags SEO standar global.'
FROM tech_stacks ts WHERE ts.slug = 'web_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 2, 'Modern Responsive CSS3, Flexbox & Grid',
    'Box model, tata letak Flexbox dan CSS Grid modern, media queries, CSS variables, dan mobile-first design.'
FROM tech_stacks ts WHERE ts.slug = 'web_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 3, 'JavaScript Core & DOM Manipulation',
    'Tipe data primitif vs referensi, fungsi, scope & hoisting, manipulasi DOM dinamis, dan event listener.'
FROM tech_stacks ts WHERE ts.slug = 'web_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 4, 'Asynchronous JavaScript & Web APIs',
    'Mekanisme Event Loop, Callbacks, Promises, Async/Await, dan komunikasi data API menggunakan Fetch/Axios.'
FROM tech_stacks ts WHERE ts.slug = 'web_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 5, 'HTTP Protocol, Web Security & Git Essentials',
    'Metode HTTP (GET/POST/PUT/DELETE), status codes, CORS, Cookies vs LocalStorage, dan version control Git dasar.'
FROM tech_stacks ts WHERE ts.slug = 'web_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;


-- E. CS & ALGORITHM (slug: 'cs_fundamental')
INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 1, 'Data Structures I: Arrays, Strings & Hash Tables',
    'Operasi memori contiguous, string manipulation, dan mekanisme hashing (O(1) lookups & collision resolution).'
FROM tech_stacks ts WHERE ts.slug = 'cs_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 2, 'Data Structures II: Linked Lists, Stacks & Queues',
    'Singly/Doubly linked lists, prinsip LIFO Stack, FIFO Queue, dan implementasinya pada real-world problem.'
FROM tech_stacks ts WHERE ts.slug = 'cs_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 3, 'Trees, Graphs & Traversal Algorithms',
    'Binary Search Tree (BST), Breadth-First Search (BFS), Depth-First Search (DFS), dan representasi graf adjacency list.'
FROM tech_stacks ts WHERE ts.slug = 'cs_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 4, 'Algorithm Design: Sorting, Binary Search & Pointers',
    'Two-pointer technique, Sliding Window, Binary Search (O(log N)), dan algoritma sorting efisien (Merge/Quick sort).'
FROM tech_stacks ts WHERE ts.slug = 'cs_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 5, 'Big-O Complexity & System Design Foundations',
    'Analisis Time and Space Complexity, prinsip skalabilitas sistem, caching, load balancing, dan CAP Theorem.'
FROM tech_stacks ts WHERE ts.slug = 'cs_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

-- ============================================================================
-- 2. CHAPTERS (3 Chapter Berurutan untuk Module 1 Golang)
-- ============================================================================

-- Chapter 1: Dasar Sintaks & Type System
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Go Syntax Foundations & Type System',
    'Penguasaan variabel, primitive types, zero values, pointers, structs, dan method receiver idiomatik di Go.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Chapter 2: Goroutines & Channels
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Goroutines & Channel Primitives',
    'Memulai concurrency dengan lightweight thread (Goroutine), channel buffered/unbuffered, dan directional channel.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Chapter 3: Concurrency Control & Boss Stage
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 3, 'Synchronization & Worker Pools',
    'Pencegahan race condition dengan sync.Mutex, koordinasi sync.WaitGroup, dan arsitektur Concurrent Worker Pool.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;


-- ============================================================================
-- 3. QUESTS (8 Quest Interaktif Terdistribusi di 3 Chapter)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUESTS UNTUK CHAPTER 1 (Syntax & Types)
-- ----------------------------------------------------------------------------

-- Quest 1.1: Quiz
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
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 1.2: Fill-in-the-Blank
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
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 1.3: Monaco Coding Challenge
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
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ----------------------------------------------------------------------------
-- QUESTS UNTUK CHAPTER 2 (Goroutines & Channels)
-- ----------------------------------------------------------------------------

-- Quest 2.1: Quiz
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
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 2.2: Fill-in-the-Blank
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
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 2.3: Daily Habit Quest
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Daily Code Review: Nil Channel Trap',
    'Pahami apa yang terjadi ketika membaca dari uninitialized (nil) channel.',
    'daily', 'quiz', 'easy', 40, 10, 3, 3,
    NULL, NULL, NULL,
    '{
        "question": "Apa efek membaca dari channel nil (belum di-make) di Go?",
        "options": ["Panic runtime", "Return 0 langsung", "Block selamanya (deadlock jika tidak ada goroutine lain)", "Kompilasi error"],
        "answer_index": 2,
        "explanation": "Membaca atau menulis ke nil channel di Go akan memblokir goroutine selamanya tanpa panic."
    }'::jsonb,
    '["Channel nil tidak memicu panic seketika, melainkan hang/block."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ----------------------------------------------------------------------------
-- QUESTS UNTUK CHAPTER 3 (Synchronization & Boss Stage)
-- ----------------------------------------------------------------------------

-- Quest 3.1: Coding Challenge (Mutex)
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
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 3.2: Boss Challenge Quest
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
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'golang' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;
