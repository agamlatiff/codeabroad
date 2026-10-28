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


-- D. WEB FOUNDAMENTALS (slug: 'web_fundamental')
INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 1, 'HTML5 Semantics & Accessible Web Architecture',
    'Struktur DOM semantik, form validation, SEO tags, dan standar aksesibilitas WCAG tingkat internasional.'
FROM tech_stacks ts WHERE ts.slug = 'web_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 2, 'CSS3 Modern Layouts: Flexbox, Grid & Responsive Design',
    'Box model, layout fluid, media queries, CSS custom properties (variables), dan animasi CSS modern.'
FROM tech_stacks ts WHERE ts.slug = 'web_fundamental'
ON CONFLICT (tech_stack_id, module_number) DO NOTHING;

INSERT INTO modules (tech_stack_id, module_number, title, description)
SELECT ts.id, 3, 'JavaScript Core Engine & DOM Manipulation',
    'Variabel let/const, types, hoisting, scope chain, event handling, dan manipulasi dinamis elemen HTML.'
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
