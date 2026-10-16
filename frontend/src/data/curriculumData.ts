import type { GuidebookContent } from '../components/game/UnitGuidebookModal'

export interface SequentialPartItem {
  id: string
  globalPartNumber: number
  title: string
  subtitle: string
  chipLabel: string
  category: 'code' | 'nihongo' | 'capstone'
  difficulty: 'Pemula' | 'Menengah' | 'Sulit'
  estimatedMinutes: number
  xpReward: number
  route: string
}

export interface SequentialCurriculumUnit {
  id: string
  unitNumber: number
  tag: string
  title: string
  description: string
  totalXp: number
  parts: SequentialPartItem[]
}

export interface UnitTheme {
  gradientBg: string
  border3D: string
  tagBg: string
  tagText: string
  accentGlow: string
  btnGuideBg: string
}

// ── 1. GOLANG BACKEND ENGINEERING CURRICULUM ────────────────────────────────
export const GOLANG_CURRICULUM_UNITS: SequentialCurriculumUnit[] = [
  {
    id: 'unit-1-fondasi-go',
    unitNumber: 1,
    tag: 'SINTAKS DASAR & MEMORI POINTER',
    title: 'Unit 1: Fondasi Sintaks Go & Memory Pointer',
    description:
      'Arsitektur runtime Go, alokasi memori stack vs heap, manipulasi pointer dan etika code review tim engineering.',
    totalXp: 150,
    parts: [
      {
        id: 'part-1-variabel-dan-tipe-data',
        globalPartNumber: 1,
        title: 'Variabel, Strict Typing & Memori Stack',
        subtitle: 'Deklarasi variabel, primitive types, dan alokasi stack CPU',
        chipLabel: 'GO 01',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 10,
        xpReward: 50,
        route: '/learn/part-1-variabel-dan-tipe-data',
      },
      {
        id: 'part-2-pointer-dan-struktur-data',
        globalPartNumber: 2,
        title: 'Pointer, Dereferencing & Struct Memory',
        subtitle: 'Address memory & dan *pointer mutation tanpa copy payload',
        chipLabel: 'GO 02',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/part-2-pointer-dan-struktur-data',
      },
      {
        id: 'part-3-aisatsu-onboarding-tokyo',
        globalPartNumber: 3,
        title: 'Aisatsu & Etika Code Review Tim Engineering',
        subtitle: 'Salam pagi standup, perkenalan diri & budaya Pull Request tim engineering',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/part-3-aisatsu-onboarding-tokyo',
      },
    ],
  },
  {
    id: 'unit-2-gin-rest-api',
    unitNumber: 2,
    tag: 'REST API & CLEAN ARCHITECTURE',
    title: 'Unit 2: Gin REST API & Middleware Engine',
    description:
      'Membangun RESTful API enterprise dengan Gin framework, middleware auth guard JWT, DTO validation, dan Clean Architecture.',
    totalXp: 150,
    parts: [
      {
        id: 'part-4-routing-dan-jwt-middleware',
        globalPartNumber: 4,
        title: 'Gin Radix Router & JSON Response Envelope',
        subtitle: 'Setup router engine, parameter binding, dan standard response envelope',
        chipLabel: 'GIN 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/part-4-routing-dan-jwt-middleware',
      },
      {
        id: 'part-5-jwt-claims-guard',
        globalPartNumber: 5,
        title: 'Routing & JWT Middleware Guard',
        subtitle: 'Autentikasi token claims, context propagation & role-based access',
        chipLabel: 'GIN 02',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 18,
        xpReward: 50,
        route: '/learn/part-5-jwt-claims-guard',
      },
      {
        id: 'part-6-asakai-standup-meeting',
        globalPartNumber: 6,
        title: 'Asakai (朝会) Standup & Laporan Tiket Jira',
        subtitle: 'Format laporan harian Jepang: kinou, kyou, kadai & blockers',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Menengah',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/part-6-asakai-standup-meeting',
      },
    ],
  },
  {
    id: 'unit-3-concurrency',
    unitNumber: 3,
    tag: 'GOROUTINE & CHANNEL PIPELINE',
    title: 'Unit 3: Goroutine, Channel & Concurrency Patterns',
    description:
      'Pola konkurensi CSP, worker pool pattern, buffered channels, context timeout, dan pengemasan container Docker.',
    totalXp: 150,
    parts: [
      {
        id: 'part-7-worker-pool-concurrency',
        globalPartNumber: 7,
        title: 'Worker Pool & Concurrency Pipeline',
        subtitle: 'Goroutine scheduler, buffered channels & sync.WaitGroup',
        chipLabel: 'GO 03',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/part-7-worker-pool-concurrency',
      },
      {
        id: 'part-8-multi-stage-docker-go',
        globalPartNumber: 8,
        title: 'Multi-Stage Dockerfile Go Binary (< 25MB)',
        subtitle: 'Kemas binary Go tanpa compiler overhead siap produksi cloud',
        chipLabel: '⚙️ DOCKER',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/part-8-multi-stage-docker-go',
      },
      {
        id: 'part-9-shougai-houkoku-server-down',
        globalPartNumber: 9,
        title: 'Shougai Houkoku & Incident Report Server',
        subtitle: 'Komunikasi tanggap darurat downtime & penulisan post-mortem Jepang',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/part-9-shougai-houkoku-server-down',
      },
    ],
  },
  {
    id: 'unit-4-postgres-dan-pgx',
    unitNumber: 4,
    tag: 'POSTGRESQL & PGX CONNECTION POOL',
    title: 'Unit 4: Database Pooling Pgx & Clean Architecture',
    description:
      'Database pooling Pgx, database migrations, transaksi ACID, repository pattern, dan persiapan wawancara rekrutmen Tokyo.',
    totalXp: 200,
    parts: [
      {
        id: 'part-10-pgxpool-database-transaction',
        globalPartNumber: 10,
        title: 'Pgxpool Connection Pool & Prepared Query',
        subtitle: 'Integrasi connection pool PostgreSQL, safe query & prepared statements',
        chipLabel: 'DB 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/part-10-pgxpool-database-transaction',
      },
      {
        id: 'part-11-clean-architecture-repository',
        globalPartNumber: 11,
        title: 'Clean Architecture Repository & Usecase',
        subtitle: 'Pemisahan domain model, repository interface, dan unit test mocking',
        chipLabel: 'ARCH 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 25,
        xpReward: 50,
        route: '/learn/part-11-clean-architecture-repository',
      },
      {
        id: 'part-12-simulasi-mensetsu-tokyo',
        globalPartNumber: 12,
        title: 'Simulasi Wawancara Kerja Tokyo (Mensetsu Final)',
        subtitle: 'Live coding explanation, pitching arsitektur & negosiasi gaji Tokyo',
        chipLabel: '🌸 MENSETSU',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 30,
        xpReward: 100,
        route: '/learn/part-12-simulasi-mensetsu-tokyo',
      },
    ],
  },
]

// ── 2. REACT & TYPESCRIPT FRONTEND CURRICULUM ───────────────────────────────
export const FRONTEND_CURRICULUM_UNITS: SequentialCurriculumUnit[] = [
  {
    id: 'fe-unit-1-ts-react',
    unitNumber: 1,
    tag: 'TYPESCRIPT & COMPONENT ARCHITECTURE',
    title: 'Unit 1: Strict TypeScript & Component Decoupling',
    description:
      'Type safety ketat dengan TypeScript, deklarasi interface, generic props, pemisahan container vs presentation, dan onboarding Tokyo.',
    totalXp: 150,
    parts: [
      {
        id: 'fe-part-1-typescript-types',
        globalPartNumber: 1,
        title: 'Type vs Interface & Strict Generics',
        subtitle: 'Type alias, generic constraints, dan eliminasi any types',
        chipLabel: 'TS 01',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 10,
        xpReward: 50,
        route: '/learn/fe-part-1-typescript-types',
      },
      {
        id: 'fe-part-2-react-components',
        globalPartNumber: 2,
        title: 'React 19 Clean JSX & Props Decoupling',
        subtitle: 'Atomic component design, polymorphic props & layout stability',
        chipLabel: 'REACT 01',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/fe-part-2-react-components',
      },
      {
        id: 'fe-part-3-aisatsu-frontend-tokyo',
        globalPartNumber: 3,
        title: 'Aisatsu & Jikoshoukai di Tim Frontend Tokyo',
        subtitle: 'Salam pagi standup, perkenalan diri engineer web & budaya review PR',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fe-part-3-aisatsu-frontend-tokyo',
      },
    ],
  },
  {
    id: 'fe-unit-2-custom-hooks-api',
    unitNumber: 2,
    tag: 'CUSTOM HOOKS & REST API INTEGRATION',
    title: 'Unit 2: Custom Hooks, Form State & REST API',
    description:
      'Arsitektur Custom Hooks modular, konsumsi REST API aman JWT, Zod runtime schema validation, dan pelaporan Asakai.',
    totalXp: 150,
    parts: [
      {
        id: 'fe-part-4-custom-hooks',
        globalPartNumber: 4,
        title: 'Custom Hooks & State Encapsulation',
        subtitle: 'Pemisahan business logic dari UI render dengan reusable custom hooks',
        chipLabel: 'HOOKS 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fe-part-4-custom-hooks',
      },
      {
        id: 'fe-part-5-fetch-jwt-zod',
        globalPartNumber: 5,
        title: 'Fetch, JWT Token Handling & Zod Validation',
        subtitle: 'Type-safe HTTP client, automatic token refresh, dan validasi schema Zod',
        chipLabel: 'API 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 18,
        xpReward: 50,
        route: '/learn/fe-part-5-fetch-jwt-zod',
      },
      {
        id: 'fe-part-6-asakai-ui-bugs',
        globalPartNumber: 6,
        title: 'Asakai (朝会) & Komunikasi Bug UI/UX',
        subtitle: 'Menjelaskan ticket UI bug, browser compatibility, dan blocker dalam bahasa Jepang',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Menengah',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/fe-part-6-asakai-ui-bugs',
      },
    ],
  },
  {
    id: 'fe-unit-3-server-state',
    unitNumber: 3,
    tag: 'SERVER STATE & 3D DESIGN SYSTEM',
    title: 'Unit 3: TanStack Query & 3D Tactile Design Tokens',
    description:
      'Server state caching TanStack Query, optimistic UI updates, implementasi Duolingo 3D button tokens, dan dokumen spesifikasi Sekkeisho.',
    totalXp: 150,
    parts: [
      {
        id: 'fe-part-7-tanstack-query',
        globalPartNumber: 7,
        title: 'TanStack Query State Cache & Invalidation',
        subtitle: 'Query keys hierarchy, automatic refetch, dan optimistic mutation rollback',
        chipLabel: 'QUERY 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/fe-part-7-tanstack-query',
      },
      {
        id: 'fe-part-8-3d-design-system',
        globalPartNumber: 8,
        title: 'Tailwind 3D Tactile Buttons & Micro-Animations',
        subtitle: 'Elevation bevel physics, haptic feedback integration, dan responsive layout',
        chipLabel: 'UI 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fe-part-8-3d-design-system',
      },
      {
        id: 'fe-part-9-sekkeisho-ui-spec',
        globalPartNumber: 9,
        title: 'Dokumen Sekkeisho (設計書) & Review Figma UI',
        subtitle: 'Membaca spesifikasi teknis UI dan koordinasi dengan Product Designer Tokyo',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fe-part-9-sekkeisho-ui-spec',
      },
    ],
  },
  {
    id: 'fe-unit-4-nextjs-deploy',
    unitNumber: 4,
    tag: 'NEXT.JS APP ROUTER & PRODUCTION CLOUD',
    title: 'Unit 4: Next.js App Router, SSR & Cloud Deploy',
    description:
      'Next.js 15 App Router, Server Actions, streaming SSR, optimasi bundle produksi, Docker Nginx deploy, dan wawancara Tokyo.',
    totalXp: 200,
    parts: [
      {
        id: 'fe-part-10-nextjs-app-router',
        globalPartNumber: 10,
        title: 'Next.js App Router & Server Components',
        subtitle: 'RSC architecture, layout nesting, Suspense boundaries & Server Actions',
        chipLabel: 'NEXT 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 22,
        xpReward: 50,
        route: '/learn/fe-part-10-nextjs-app-router',
      },
      {
        id: 'fe-part-11-docker-nginx-deploy',
        globalPartNumber: 11,
        title: 'Production Build & Multi-Stage Docker Nginx',
        subtitle: 'Tree-shaking bundle size, gzip/brotli compression, dan Nginx reverse proxy',
        chipLabel: 'DEPLOY',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 18,
        xpReward: 50,
        route: '/learn/fe-part-11-docker-nginx-deploy',
      },
      {
        id: 'fe-part-12-mensetsu-frontend-tokyo',
        globalPartNumber: 12,
        title: 'Simulasi Wawancara Kerja Tokyo Frontend (Mensetsu)',
        subtitle: 'Presentasi arsitektur web, live coding React & negosiasi penawaran kerja Tokyo',
        chipLabel: '🌸 MENSETSU',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 30,
        xpReward: 100,
        route: '/learn/fe-part-12-mensetsu-frontend-tokyo',
      },
    ],
  },
]

// ── 3. DEVOPS & CLOUD INFRASTRUCTURE CURRICULUM ─────────────────────────────
export const DEVOPS_CURRICULUM_UNITS: SequentialCurriculumUnit[] = [
  {
    id: 'devops-unit-1-linux-automation',
    unitNumber: 1,
    tag: 'LINUX OS & AUTOMATION SCRIPTING',
    title: 'Unit 1: Linux Kernel, Systemd & Bash Automation',
    description:
      'Arsitektur sistem operasi Linux, manajemen file permission, proses daemon systemd, cron automation, dan onboarding Tokyo.',
    totalXp: 150,
    parts: [
      {
        id: 'devops-part-1-linux-permissions',
        globalPartNumber: 1,
        title: 'Linux Permissions, Sudoers & User Groups',
        subtitle: 'Chmod, chown, sticky bits, sudo privileges, dan SSH key auth hardening',
        chipLabel: 'LINUX 01',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 10,
        xpReward: 50,
        route: '/learn/devops-part-1-linux-permissions',
      },
      {
        id: 'devops-part-2-bash-scripting',
        globalPartNumber: 2,
        title: 'Shell Scripting, Pipes & Systemd Daemons',
        subtitle: 'Automasi Bash, handling log streams, dan membuat service unit systemd',
        chipLabel: 'BASH 01',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/devops-part-2-bash-scripting',
      },
      {
        id: 'devops-part-3-aisatsu-sysadmin-tokyo',
        globalPartNumber: 3,
        title: 'Aisatsu & Etika Onboarding Sysadmin Tokyo',
        subtitle: 'Salam pagi, etika eskalasi hak akses root & perkenalan diri tim infra',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/devops-part-3-aisatsu-sysadmin-tokyo',
      },
    ],
  },
  {
    id: 'devops-unit-2-docker-containers',
    unitNumber: 2,
    tag: 'DOCKER CONTAINERIZATION & NETWORKING',
    title: 'Unit 2: Multi-Stage Dockerfile & Multi-Service Compose',
    description:
      'Containerization modern, optimasi build cache, security vulnerability scan, Docker Compose networking, dan Shougai Houkoku.',
    totalXp: 150,
    parts: [
      {
        id: 'devops-part-4-multistage-dockerfile',
        globalPartNumber: 4,
        title: 'Multi-Stage Dockerfile & Image Hardening',
        subtitle: 'Non-root user execution, alpine distroless base, dan minimal size < 30MB',
        chipLabel: 'DOCKER 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/devops-part-4-multistage-dockerfile',
      },
      {
        id: 'devops-part-5-docker-compose-mesh',
        globalPartNumber: 5,
        title: 'Docker Compose Multi-Container Network',
        subtitle: 'Orkestrasi multi-service: App, PostgreSQL, Redis, dan volume persistent storage',
        chipLabel: 'DOCKER 02',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 18,
        xpReward: 50,
        route: '/learn/devops-part-5-docker-compose-mesh',
      },
      {
        id: 'devops-part-6-shougai-houkoku-infra',
        globalPartNumber: 6,
        title: 'Shougai Houkoku (障害報告) & Komunikasi Insiden Server',
        subtitle: 'Menulis post-mortem downtime, root cause analysis & komunikasi darurat di Slack',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Menengah',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/devops-part-6-shougai-houkoku-infra',
      },
    ],
  },
  {
    id: 'devops-unit-3-cicd-actions',
    unitNumber: 3,
    tag: 'CI/CD AUTOMATION & RELEASE GATES',
    title: 'Unit 3: GitHub Actions & Automated Testing Pipeline',
    description:
      'Pipeline CI/CD otomatis, automated testing gates, linting, security vulnerability audit, Docker registry push, dan dokumen SLA.',
    totalXp: 150,
    parts: [
      {
        id: 'devops-part-7-github-actions-workflow',
        globalPartNumber: 7,
        title: 'GitHub Actions Matrix & Testing Gate',
        subtitle: 'Workflow triggers, environment secrets, automated unit/integration test gate',
        chipLabel: 'CI/CD 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/devops-part-7-github-actions-workflow',
      },
      {
        id: 'devops-part-8-container-registry-release',
        globalPartNumber: 8,
        title: 'Container Registry Push & Semantic Tagging',
        subtitle: 'Push image ke GitHub Packages / AWS ECR dengan semantic versioning tag',
        chipLabel: 'CI/CD 02',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/devops-part-8-container-registry-release',
      },
      {
        id: 'devops-part-9-sla-target-review',
        globalPartNumber: 9,
        title: 'Review Dokumen Sekkeisho & SLA 99.99%',
        subtitle: 'Membaca spesifikasi SLA ketersediaan server dan koordinasi jadwal maintenance',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/devops-part-9-sla-target-review',
      },
    ],
  },
  {
    id: 'devops-unit-4-k8s-observability',
    unitNumber: 4,
    tag: 'KUBERNETES & OBSERVABILITY MESH',
    title: 'Unit 4: Kubernetes Pods, Prometheus & SRE Interview',
    description:
      'Arsitektur cluster Kubernetes, manifest Pod & Ingress, Prometheus metrics, Grafana dashboards, dan simulasi wawancara kerja Tokyo.',
    totalXp: 200,
    parts: [
      {
        id: 'devops-part-10-kubernetes-manifests',
        globalPartNumber: 10,
        title: 'Kubernetes Pods, Deployment & Ingress Routing',
        subtitle: 'YAML manifests, rolling update deployment, horizontal pod autoscaling (HPA)',
        chipLabel: 'K8S 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 22,
        xpReward: 50,
        route: '/learn/devops-part-10-kubernetes-manifests',
      },
      {
        id: 'devops-part-11-prometheus-grafana-metrics',
        globalPartNumber: 11,
        title: 'Prometheus & Grafana Observability Dashboards',
        subtitle: 'Scraping metrics, alerting rules, memory saturation & request latency monitoring',
        chipLabel: 'OBS 01',
        category: 'code',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/devops-part-11-prometheus-grafana-metrics',
      },
      {
        id: 'devops-part-12-mensetsu-devops-tokyo',
        globalPartNumber: 12,
        title: 'Simulasi Wawancara Kerja Tokyo SRE/Cloud (Mensetsu)',
        subtitle: 'Troubleshooting arsitektur skenario outage & wawancara bilingual tim infra Tokyo',
        chipLabel: '🌸 MENSETSU',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 30,
        xpReward: 100,
        route: '/learn/devops-part-12-mensetsu-devops-tokyo',
      },
    ],
  },
]

// ── 4. FUNDAMENTAL PROGRAMMING CURRICULUM ────────────────────────────────────
export const FUNDAMENTAL_CURRICULUM_UNITS: SequentialCurriculumUnit[] = [
  {
    id: 'fund-unit-1-cpu-memory',
    unitNumber: 1,
    tag: 'CPU ARCHITECTURE & MEMORY POINTERS',
    title: 'Unit 1: Arsitektur CPU, Stack vs Heap & Pointers',
    description:
      'Pahami cara CPU dan RAM mengeksekusi kode, alokasi memori stack vs heap, referensi pointer, dan etika sapaan Aisatsu kantor Tokyo.',
    totalXp: 150,
    parts: [
      {
        id: 'fund-part-1-stack-heap',
        globalPartNumber: 1,
        title: 'Memori Stack vs Heap & Pointer Address',
        subtitle: 'Struktur memori fisik komputer, register CPU, dan pointer reference',
        chipLabel: 'CS 01',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 10,
        xpReward: 50,
        route: '/learn/fund-part-1-stack-heap',
      },
      {
        id: 'fund-part-2-primitives-struct',
        globalPartNumber: 2,
        title: 'Tipe Data Primitif, Struct & Memory Alignment',
        subtitle: 'Integer sizes, memory padding, byte alignment, dan composite struct',
        chipLabel: 'CS 02',
        category: 'code',
        difficulty: 'Pemula',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/fund-part-2-primitives-struct',
      },
      {
        id: 'fund-part-3-aisatsu-fundamental',
        globalPartNumber: 3,
        title: 'Aisatsu & Jikoshoukai Dasar Kantor Tokyo',
        subtitle: 'Salam pagi, perkenalan diri junior engineer & budaya kerja tim Tokyo',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fund-part-3-aisatsu-fundamental',
      },
    ],
  },
  {
    id: 'fund-unit-2-data-structures',
    unitNumber: 2,
    tag: 'DATA STRUCTURES & BIG-O ALGORITHMS',
    title: 'Unit 2: Hash Map, Kompleksitas Big-O & Call Stack',
    description:
      'Kuasai struktur data kunci (Dynamic Array, Hash Map), analisis kompleksitas Big-O O(1) vs O(N), call stack, dan Asakai standup.',
    totalXp: 150,
    parts: [
      {
        id: 'fund-part-4-array-hashmap',
        globalPartNumber: 4,
        title: 'Dynamic Array & Hash Map Collision Handling',
        subtitle: 'Hashing function, bucket collision resolution, dan lookup time O(1)',
        chipLabel: 'ALGO 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fund-part-4-array-hashmap',
      },
      {
        id: 'fund-part-5-recursion-callstack',
        globalPartNumber: 5,
        title: 'Recursion, Call Stack & Analisis Big-O',
        subtitle: 'Stack frame anatomy, stack overflow guards, dan asymptotic complexity',
        chipLabel: 'ALGO 02',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 18,
        xpReward: 50,
        route: '/learn/fund-part-5-recursion-callstack',
      },
      {
        id: 'fund-part-6-asakai-daily-standup',
        globalPartNumber: 6,
        title: 'Asakai (朝会) Standup Meeting & Laporan Tiket',
        subtitle: 'Melaporkan progres tiket koding dan kendala teknis dalam bahasa Jepang',
        chipLabel: '🌸 NIHONGO',
        category: 'nihongo',
        difficulty: 'Menengah',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/fund-part-6-asakai-daily-standup',
      },
    ],
  },
  {
    id: 'fund-unit-3-git-http',
    unitNumber: 3,
    tag: 'COLLABORATIVE GIT & HTTP PROTOCOL',
    title: 'Unit 3: Git Collaborative, Protokol HTTP & Wawancara',
    description:
      'Alat kolaborasi wajib engineer: Branching Git, Pull Request code review, Client-Server HTTP handshake, dan simulasi interview.',
    totalXp: 200,
    parts: [
      {
        id: 'fund-part-7-git-collaborative',
        globalPartNumber: 7,
        title: 'Git Collaborative, Branching & Merge Conflicts',
        subtitle: 'Git tree model, feature branch workflow, dan penyelesaian merge conflict',
        chipLabel: 'GIT 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fund-part-7-git-collaborative',
      },
      {
        id: 'fund-part-8-http-client-server',
        globalPartNumber: 8,
        title: 'Protokol Client-Server & HTTP Handshake',
        subtitle: 'Format request/response HTTP, status codes 200/400/500, dan JSON payload',
        chipLabel: 'HTTP 01',
        category: 'code',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/fund-part-8-http-client-server',
      },
      {
        id: 'fund-part-9-simulasi-mensetsu-fundamental',
        globalPartNumber: 9,
        title: 'Simulasi Wawancara Fondasi IT Tokyo (Mensetsu)',
        subtitle: 'Pertanyaan logika dasar koding, pemahaman pointer & motivasi kerja di Tokyo',
        chipLabel: '🌸 MENSETSU',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 25,
        xpReward: 100,
        route: '/learn/fund-part-9-simulasi-mensetsu-fundamental',
      },
    ],
  },
]

// ── 5. TECH NIHONGO (BAHASA JEPANG IT TOKYO) CURRICULUM ─────────────────────
export const NIHONGO_CURRICULUM_UNITS: SequentialCurriculumUnit[] = [
  {
    id: 'nihongo-unit-1-survival-onboarding',
    unitNumber: 1,
    tag: 'SURVIVAL TOKYO & ONBOARDING KANTOR',
    title: 'Unit 1: Aisatsu, Jikoshoukai & Kehidupan di Tokyo',
    description:
      'Salam harian kantor IT, perkenalan diri profesional engineer, pesan makanan di konbini, dan navigasi kereta Yamanote.',
    totalXp: 150,
    parts: [
      {
        id: 'nihongo-part-1-aisatsu-harian',
        globalPartNumber: 1,
        title: 'Aisatsu & Salam Hormat Kantor IT',
        subtitle: 'Ohayou gozaimasu, Otsukaresama desu, Osaki ni shitsurei shimasu',
        chipLabel: '🌸 AISATSU',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 10,
        xpReward: 50,
        route: '/learn/nihongo-part-1-aisatsu-harian',
      },
      {
        id: 'nihongo-part-2-jikoshoukai-engineer',
        globalPartNumber: 2,
        title: 'Jikoshoukai Profil Software Engineer',
        subtitle: 'Memperkenalkan tech stack, pengalaman koding & latar belakang dari Indonesia',
        chipLabel: '🌸 PROFIL',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 12,
        xpReward: 50,
        route: '/learn/nihongo-part-2-jikoshoukai-engineer',
      },
      {
        id: 'nihongo-part-3-seikatsu-yamanote',
        globalPartNumber: 3,
        title: 'Navigasi Kereta Yamanote, Suica & Konbini',
        subtitle: 'Beli kartu transportasi, tanya arah platform stasiun, dan pesan makanan',
        chipLabel: '🌸 SEIKATSU',
        category: 'nihongo',
        difficulty: 'Pemula',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/nihongo-part-3-seikatsu-yamanote',
      },
    ],
  },
  {
    id: 'nihongo-unit-2-asakai-pr-slack',
    unitNumber: 2,
    tag: 'ASAKAI STANDUP & PULL REQUEST REVIEW',
    title: 'Unit 2: Pola Laporan Asakai, Kosakata Bug & PR Review',
    description:
      'Pola komunikasi standup morning meeting, istilah Slack (Jissou, Fuguai, Kakunin), dan menulis review Pull Request yang sopan.',
    totalXp: 150,
    parts: [
      {
        id: 'nihongo-part-4-pola-asakai',
        globalPartNumber: 4,
        title: 'Pola Laporan Asakai Standup (Kinou/Kyou/Kadai)',
        subtitle: 'Lancar menyampaikan 3 poin: yang selesai kemarin, target hari ini, dan blocker',
        chipLabel: '🌸 ASAKAI',
        category: 'nihongo',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/nihongo-part-4-pola-asakai',
      },
      {
        id: 'nihongo-part-5-istilah-slack-fuguai',
        globalPartNumber: 5,
        title: 'Istilah Teknis Slack: Jissou, Fuguai & Kakunin',
        subtitle: 'Chatting profesional di Slack: laporan bug, konfirmasi spec & release announcement',
        chipLabel: '🌸 SLACK IT',
        category: 'nihongo',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/nihongo-part-5-istilah-slack-fuguai',
      },
      {
        id: 'nihongo-part-6-etika-pr-review',
        globalPartNumber: 6,
        title: 'Review Pull Request & Etika Git Review',
        subtitle: 'Komentar PR sopan: saran refactoring, apresiasi kode, dan LGTM approval',
        chipLabel: '🌸 GIT KEIGO',
        category: 'nihongo',
        difficulty: 'Menengah',
        estimatedMinutes: 15,
        xpReward: 50,
        route: '/learn/nihongo-part-6-etika-pr-review',
      },
    ],
  },
  {
    id: 'nihongo-unit-3-sekkeisho-mensetsu',
    unitNumber: 3,
    tag: 'DOKUMEN SEKKEISHO & WAWANCARA MENSETSU',
    title: 'Unit 3: Membaca Sekkeisho & Simulasi Wawancara Kerja',
    description:
      'Membaca dokumen spesifikasi teknis Sekkeisho, menjelaskan arsitektur saat live coding, dan tanya jawab wawancara kerja Tokyo.',
    totalXp: 200,
    parts: [
      {
        id: 'nihongo-part-7-membaca-sekkeisho',
        globalPartNumber: 7,
        title: 'Membaca Dokumen Sekkeisho (設計書) & Spec API',
        subtitle: 'Kuasai kosakata requirement: Youken Teigi, Kihon Sekkei, Shousai Sekkei',
        chipLabel: '🌸 SEKKEISHO',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/nihongo-part-7-membaca-sekkeisho',
      },
      {
        id: 'nihongo-part-8-live-coding-explanation',
        globalPartNumber: 8,
        title: 'Menjelaskan Logika Kode saat Live Coding',
        subtitle: 'Frasa Jepang untuk menjelaskan algorithmic approach, complexity & trade-off',
        chipLabel: '🌸 LIVE CODE',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 20,
        xpReward: 50,
        route: '/learn/nihongo-part-8-live-coding-explanation',
      },
      {
        id: 'nihongo-part-9-mensetsu-final-interview',
        globalPartNumber: 9,
        title: 'Simulasi Wawancara Kerja Tokyo (Mensetsu Final)',
        subtitle: 'Tanya jawab Shibou Douki, etika wawancara formal & negosiasi sponsor visa',
        chipLabel: '🌸 MENSETSU',
        category: 'nihongo',
        difficulty: 'Sulit',
        estimatedMinutes: 30,
        xpReward: 100,
        route: '/learn/nihongo-part-9-mensetsu-final-interview',
      },
    ],
  },
]

// ── 6. CURRICULUM TRACKS MAP (SSOT) ─────────────────────────────────────────
export const CURRICULUM_TRACKS_MAP: Record<string, SequentialCurriculumUnit[]> = {
  golang: GOLANG_CURRICULUM_UNITS,
  backend: GOLANG_CURRICULUM_UNITS,
  frontend: FRONTEND_CURRICULUM_UNITS,
  react: FRONTEND_CURRICULUM_UNITS,
  devops: DEVOPS_CURRICULUM_UNITS,
  devops_aws: DEVOPS_CURRICULUM_UNITS,
  fundamental: FUNDAMENTAL_CURRICULUM_UNITS,
  nihongo: NIHONGO_CURRICULUM_UNITS,
}

// ── 7. DUOLINGO 3D TACTILE THEMES PER TRACK ─────────────────────────────────
export const TRACK_UNIT_THEMES: Record<string, Record<number, UnitTheme>> = {
  golang: {
    1: {
      gradientBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
      border3D: 'border-b-[5px] border-blue-900',
      tagBg: 'bg-blue-500/30 border border-blue-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-blue-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    2: {
      gradientBg: 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700',
      border3D: 'border-b-[5px] border-emerald-900',
      tagBg: 'bg-emerald-500/30 border border-emerald-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-emerald-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    3: {
      gradientBg: 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700',
      border3D: 'border-b-[5px] border-purple-900',
      tagBg: 'bg-purple-500/30 border border-purple-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-purple-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    4: {
      gradientBg: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700',
      border3D: 'border-b-[5px] border-amber-900',
      tagBg: 'bg-amber-500/30 border border-amber-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-amber-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
  },
  frontend: {
    1: {
      gradientBg: 'bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700',
      border3D: 'border-b-[5px] border-cyan-900',
      tagBg: 'bg-cyan-500/30 border border-cyan-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-cyan-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    2: {
      gradientBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700',
      border3D: 'border-b-[5px] border-blue-900',
      tagBg: 'bg-blue-500/30 border border-blue-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-blue-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    3: {
      gradientBg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700',
      border3D: 'border-b-[5px] border-indigo-900',
      tagBg: 'bg-indigo-500/30 border border-indigo-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-indigo-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    4: {
      gradientBg: 'bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800',
      border3D: 'border-b-[5px] border-emerald-900',
      tagBg: 'bg-emerald-500/30 border border-emerald-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-emerald-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
  },
  devops: {
    1: {
      gradientBg: 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700',
      border3D: 'border-b-[5px] border-orange-900',
      tagBg: 'bg-orange-500/30 border border-orange-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-orange-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    2: {
      gradientBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-700',
      border3D: 'border-b-[5px] border-blue-900',
      tagBg: 'bg-blue-500/30 border border-blue-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-blue-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    3: {
      gradientBg: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800',
      border3D: 'border-b-[5px] border-purple-900',
      tagBg: 'bg-purple-500/30 border border-purple-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-purple-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    4: {
      gradientBg: 'bg-gradient-to-r from-slate-700 via-slate-800 to-indigo-900',
      border3D: 'border-b-[5px] border-slate-900',
      tagBg: 'bg-slate-500/30 border border-slate-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-slate-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
  },
  fundamental: {
    1: {
      gradientBg: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700',
      border3D: 'border-b-[5px] border-indigo-900',
      tagBg: 'bg-indigo-500/30 border border-indigo-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-indigo-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    2: {
      gradientBg: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700',
      border3D: 'border-b-[5px] border-blue-900',
      tagBg: 'bg-blue-500/30 border border-blue-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-blue-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    3: {
      gradientBg: 'bg-gradient-to-r from-slate-700 via-slate-800 to-indigo-900',
      border3D: 'border-b-[5px] border-slate-900',
      tagBg: 'bg-slate-500/30 border border-slate-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-slate-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
  },
  nihongo: {
    1: {
      gradientBg: 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700',
      border3D: 'border-b-[5px] border-rose-900',
      tagBg: 'bg-rose-500/30 border border-rose-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-rose-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    2: {
      gradientBg: 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700',
      border3D: 'border-b-[5px] border-amber-900',
      tagBg: 'bg-amber-500/30 border border-amber-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-amber-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
    3: {
      gradientBg: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-800',
      border3D: 'border-b-[5px] border-purple-900',
      tagBg: 'bg-purple-500/30 border border-purple-300/30 text-white',
      tagText: 'text-white',
      accentGlow: 'ring-purple-500/15',
      btnGuideBg: 'bg-white/15 hover:bg-white/25 text-white border-white/25',
    },
  },
}

// ── 8. COMPREHENSIVE GUIDEBOOK DATA PER UNIT ─────────────────────────────────
export const COMPREHENSIVE_GUIDEBOOK_DATA: Record<string, GuidebookContent> = {
  // Golang Guidebooks
  'unit-1-fondasi-go': {
    unitNumber: 1,
    unitTag: 'SINTAKS DASAR & MEMORI POINTER',
    title: 'Unit 1: Fondasi Sintaks Go & Memory Pointer',
    summary:
      'Go mengalokasikan variabel pada stack secara default dan memindahkannya ke heap hanya saat lolos analisis escape (escape analysis). Memahami pointer (& dan *) sangat penting untuk menghindari alokasi payload berlebih saat memanggil fungsi atau method.',
    codeSnippetTitle: 'Manipulasi Pointer & Alokasi Memori Tanpa Copy',
    codeSnippet: `package main\n\nimport "fmt"\n\ntype TokyoEngineer struct {\n    Name  string\n    Track string\n    Level int\n}\n\nfunc promoteLevel(eng *TokyoEngineer) {\n    // Dereferencing pointer langsung memodifikasi nilai memori asli\n    eng.Level++\n}\n\nfunc main() {\n    dev := TokyoEngineer{Name: "Kodi", Track: "Go Backend", Level: 1}\n    promoteLevel(&dev)\n    fmt.Println(dev.Level) // Output: 2 (zero payload copy)\n}`,
    codeExplanation:
      'Dengan meneruskan address &dev ke fungsi promoteLevel, kita menghindari overhead copy struct pada memori stack CPU.',
    nihongoTerms: [
      { term: '朝会 (Asakai)', reading: 'あさかい', meaning: 'Daily Standup Meeting pagi hari' },
      { term: '実装 (Jissou)', reading: 'じっそう', meaning: 'Implementasi / Coding fitur' },
      { term: '修正 (Shuusei)', reading: 'しゅうせい', meaning: 'Perbaikan bug / Revisi kode' },
    ],
    tokyoIndustryTip:
      'Di code review perusahaan Tokyo (seperti Mercari atau Rakuten), selalu utamakan pointer receiver untuk method yang memodifikasi state struct atau struct berukuran besar.',
  },
  'unit-2-gin-rest-api': {
    unitNumber: 2,
    unitTag: 'REST API & CLEAN ARCHITECTURE',
    title: 'Unit 2: Gin REST API & Middleware Engine',
    summary:
      'Gin menggunakan Radix Tree Routing berkecepatan tinggi dengan memory footprint yang minimal. Middleware chaining memungkinkan authentication guard JWT dan graceful error recovery sebelum request sampai ke controller layer.',
    codeSnippetTitle: 'Standard Gin Router & JWT Auth Middleware',
    codeSnippet: `func AuthGuard(secret string) gin.HandlerFunc {\n    return func(c *gin.Context) {\n        auth := c.GetHeader("Authorization")\n        if !strings.HasPrefix(auth, "Bearer ") {\n            c.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})\n            return\n        }\n        token := strings.TrimPrefix(auth, "Bearer ")\n        claims, err := parseJWT(token, secret)\n        if err != nil {\n            c.AbortWithStatusJSON(401, gin.H{"error": "Invalid Token"})\n            return\n        }\n        c.Set("userID", claims.UserID)\n        c.Next()\n    }\n}`,
    codeExplanation:
      'Fungsi c.AbortWithStatusJSON() menghentikan pipeline middleware seketika, mencegah unauthorized request menyentuh logic handler.',
    nihongoTerms: [
      { term: '本番環境 (Honban Kankyou)', reading: 'ほんばんかんきょう', meaning: 'Production Environment' },
      { term: '不具合 (Fuguai)', reading: 'ふぐあい', meaning: 'Bug / Defect sistem' },
      { term: '確認 (Kakunin)', reading: 'かくにん', meaning: 'Konfirmasi / Verification' },
    ],
    tokyoIndustryTip:
      'Selalu gunakan standard response envelope (success, message, data, error) agar mudah diintegrasikan dengan frontend TypeScript web app.',
  },
  'unit-3-concurrency': {
    unitNumber: 3,
    unitTag: 'GOROUTINE & CHANNEL PIPELINE',
    title: 'Unit 3: Goroutine, Channel & Concurrency Patterns',
    summary:
      'Concurrency di Go menganut prinsip CSP (Communicating Sequential Processes): Jangan berkomunikasi dengan membagi memori, melainkan bagikan memori dengan berkomunikasi melalui Channels.',
    codeSnippetTitle: 'Worker Pool Pattern dengan Buffered Channels',
    codeSnippet: `func worker(id int, jobs <-chan int, results chan<- int) {\n    for j := range jobs {\n        results <- j * 2\n    }\n}\n\nfunc main() {\n    jobs := make(chan int, 100)\n    results := make(chan int, 100)\n    for w := 1; w <= 3; w++ {\n        go worker(w, jobs, results)\n    }\n}`,
    codeExplanation:
      'Buffered channel mencegah blocking yang tidak diinginkan dan membatasi jumlah goroutine simultan agar tidak terjadi memory leak.',
    nihongoTerms: [
      { term: '共有 (Kyouyuu)', reading: 'きょうゆう', meaning: 'Share / Berbagi informasi' },
      { term: '同期 (Douki)', reading: 'どうき', meaning: 'Synchronous' },
      { term: '非同期 (Hidouki)', reading: 'ひどうき', meaning: 'Asynchronous' },
    ],
    tokyoIndustryTip:
      'Tes wawancara teknis senior backend di Tokyo kerap menguji penanganan context.Context timeout dan pencegahan goroutine leak.',
  },
  'unit-4-postgres-dan-pgx': {
    unitNumber: 4,
    unitTag: 'POSTGRESQL & PGX CONNECTION POOL',
    title: 'Unit 4: Database Pooling Pgx & Clean Architecture',
    summary:
      'Menggunakan pgxpool untuk mengelola koneksi database secara efisien dengan prepared statements, database migrations, dan pemisahan layer Entity, Repository, Usecase, dan Handler.',
    codeSnippetTitle: 'Clean Architecture Repository Interface & Pgxpool',
    codeSnippet: `type UserRepository interface {\n    GetByID(ctx context.Context, id string) (*domain.User, error)\n}\n\ntype pgUserRepo struct {\n    pool *pgxpool.Pool\n}\n\nfunc (r *pgUserRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {\n    var u domain.User\n    err := r.pool.QueryRow(ctx, "SELECT id, name FROM users WHERE id=$1", id).Scan(&u.ID, &u.Name)\n    return &u, err\n}`,
    codeExplanation:
      'Interface repository mengisolasi business logic usecase dari query SQL mentah sehingga mudah diuji coba dengan unit test mock.',
    nihongoTerms: [
      { term: '設計書 (Sekkeisho)', reading: 'せっけいしょ', meaning: 'Dokumen Spesifikasi Desain' },
      { term: '要件定義 (Youken Teigi)', reading: 'ようけんていぎ', meaning: 'Definisi Kebutuhan Sistem' },
      { term: '面接 (Mensetsu)', reading: 'めんせつ', meaning: 'Wawancara Kerja Tokyo' },
    ],
    tokyoIndustryTip:
      'Saat wawancara kerja di Tokyo, recruiter sangat mengapresiasi pemahaman Clean Architecture dan arsitektur anti-tight-coupling.',
  },

  // Frontend React Guidebooks
  'fe-unit-1-ts-react': {
    unitNumber: 1,
    unitTag: 'TYPESCRIPT & COMPONENT ARCHITECTURE',
    title: 'Unit 1: Strict TypeScript & Component Decoupling',
    summary:
      'TypeScript strict typing mencegah bug runtime pada fase kompilasi. Dengan generic constraints dan type unions, Anda membangun arsitektur komponen React yang reusable tanpa dependensi kaku.',
    codeSnippetTitle: 'Generic Props Component & Discriminated Union',
    codeSnippet: `type ButtonProps<T extends React.ElementType> = {\n  as?: T\n  variant: 'primary' | 'secondary' | 'danger'\n  children: React.ReactNode\n} & React.ComponentPropsWithoutRef<T>\n\nexport const TactileButton = <T extends React.ElementType = 'button'>({\n  as,\n  variant,\n  children,\n  ...props\n}: ButtonProps<T>) => {\n  const Component = as || 'button'\n  return <Component className={\`btn btn-\${variant}\`} {...props}>{children}</Component>\n}`,
    codeExplanation:
      'Polymorphic component memungkinkan button dirender sebagai tag <button> atau <Link> dengan full type safety.',
    nihongoTerms: [
      { term: '画面 (Gamen)', reading: 'がめん', meaning: 'Screen / UI Tampilan' },
      { term: '共通化 (Kyoutsuuka)', reading: 'きょうつうか', meaning: 'Standardisasi / Komponen Bersama' },
      { term: '仕様 (Shiyou)', reading: 'しよう', meaning: 'Spesifikasi Fitur' },
    ],
    tokyoIndustryTip:
      'Tim frontend Tokyo sangat menghargai zero-warning strict TypeScript config (noImplicitAny, strictNullChecks).',
  },
  'fe-unit-2-custom-hooks-api': {
    unitNumber: 2,
    unitTag: 'CUSTOM HOOKS & REST API INTEGRATION',
    title: 'Unit 2: Custom Hooks, Form State & REST API',
    summary:
      'Pisahkan logika bisnis dan data fetching dari tampilan JSX dengan Custom Hooks. Padukan dengan Zod schema parsing untuk memvalidasi JSON response sebelum dikonsumsi state komponen.',
    codeSnippetTitle: 'Type-Safe Data Fetching Custom Hook',
    codeSnippet: `export const useUserQuests = (userId: string) => {\n  const [quests, setQuests] = useState<Quest[]>([])\n  const [isLoading, setIsLoading] = useState(true)\n\n  useEffect(() => {\n    const fetchQuests = async () => {\n      try {\n        const res = await api.get(\`/users/\${userId}/quests\`)\n        const validated = QuestListSchema.parse(res.data)\n        setQuests(validated)\n      } finally {\n        setIsLoading(false)\n      }\n    }\n    fetchQuests()\n  }, [userId])\n\n  return { quests, isLoading }\n}`,
    codeExplanation:
      'Zod schema parsing memverifikasi bahwa struktur data dari backend 100% cocok dengan type contract yang diharapkan frontend.',
    nihongoTerms: [
      { term: '通信 (Tsuushin)', reading: 'つうしん', meaning: 'Koneksi / Data Communication' },
      { term: '取得 (Shutoku)', reading: 'しゅとく', meaning: 'Fetch / Mengambil Data' },
      { term: '更新 (Koushin)', reading: 'こうしん', meaning: 'Update / Memperbarui State' },
    ],
    tokyoIndustryTip:
      'Gunakan custom hook untuk setiap modul domain utama agar UI komponen tetap bersih dan berfokus murni pada layout dan accessibility.',
  },

  // DevOps Guidebooks
  'devops-unit-1-linux-automation': {
    unitNumber: 1,
    unitTag: 'LINUX OS & AUTOMATION SCRIPTING',
    title: 'Unit 1: Linux Kernel, Systemd & Bash Automation',
    summary:
      'Server cloud di Tokyo berjalan di atas Linux (Debian/Ubuntu/RHEL). Menguasai izin akses POSIX, automasi Bash shell, dan pengelolaan daemon process via systemd adalah syarat mutlak SRE dan DevOps engineer.',
    codeSnippetTitle: 'Systemd Service Unit & Bash Automation',
    codeSnippet: `[Unit]\nDescription=CodeAbroad Production API Daemon\nAfter=network.target postgresql.service\n\n[Service]\nType=simple\nUser=deploy\nWorkingDirectory=/opt/codeabroad\nExecStart=/opt/codeabroad/api\nRestart=always\nRestartSec=5\nEnvironmentFile=/etc/codeabroad/api.env\n\n[Install]\nWantedBy=multi-user.target`,
    codeExplanation:
      'Systemd otomatis me-restart aplikasi jika terjadi panic atau crash, serta mengisolasi eksekusi di bawah user non-root.',
    nihongoTerms: [
      { term: '障害 (Shougai)', reading: 'しょうがい', meaning: 'Outage / Incident Server' },
      { term: '保守 (Hoshu)', reading: 'ほしゅ', meaning: 'Maintenance / Pemeliharaan' },
      { term: '権限 (Kengen)', reading: 'けんげん', meaning: 'Permission / Hak Akses' },
    ],
    tokyoIndustryTip:
      'Selalu patuhi prinsip Least Privilege saat mengatur sudoers dan SSH keys di infrastruktur server perusahaan Jepang.',
  },

  // Fundamental Guidebooks
  'fund-unit-1-cpu-memory': {
    unitNumber: 1,
    unitTag: 'CPU ARCHITECTURE & MEMORY POINTERS',
    title: 'Unit 1: Arsitektur CPU, Stack vs Heap & Pointers',
    summary:
      'Memahami bagaimana instruksi program dieksekusi di register CPU dan bagaimana memori fisik dialokasikan (stack untuk alokasi cepat otomatis, heap untuk alokasi dinamis). Fondasi ini membedakan engineer kelas dunia dari sekadar pengetik kode.',
    codeSnippetTitle: 'Stack vs Heap Memory Visualization',
    codeSnippet: `// Stack Allocation (Fixed size, auto-reclaimed)\nfunc calculateArea(width, height int) int {\n    area := width * height // Dialokasikan di CPU Stack frame\n    return area\n}\n\n// Heap Allocation (Dynamic size, persistent across frames)\nfunc createBuffer(size int) *[]byte {\n    buf := make([]byte, size) // Lolos escape analysis -> pindah ke Heap\n    return &buf\n}`,
    codeExplanation:
      'Stack frame dibersihkan otomatis seketika saat fungsi selesai, sedangkan Heap memerlukan garbage collection atau manual deallocation.',
    nihongoTerms: [
      { term: '基本 (Kihon)', reading: 'きほん', meaning: 'Dasar / Fundamental' },
      { term: '理解 (Rikai)', reading: 'りかい', meaning: 'Pemahaman Konseptual' },
      { term: '挨拶 (Aisatsu)', reading: 'あいさつ', meaning: 'Salam Sapaan' },
    ],
    tokyoIndustryTip:
      'Wawancara teknis perusahaan teknologi top Tokyo selalu menguji pemahaman memori komputer di putaran pertama.',
  },

  // Tech Nihongo Guidebooks
  'nihongo-unit-1-survival-onboarding': {
    unitNumber: 1,
    unitTag: 'SURVIVAL TOKYO & ONBOARDING KANTOR',
    title: 'Unit 1: Aisatsu, Jikoshoukai & Kehidupan di Tokyo',
    summary:
      'Etika kerja dan salam sapaan adalah gerbang utama adaptasi budaya di Tokyo. Menyapa rekan kerja dengan sopan membangun rasa percaya (shinrai) yang sangat dihargai di lingkungan engineering Jepang.',
    codeSnippetTitle: 'Pola Jikoshoukai (Perkenalan Diri) Software Engineer',
    codeSnippet: `Hajimemashite. Agam to moushimasu.\nIndonesia kara mairimashita.\nKore made wa Golang to React wo tsukatte, Web sabisu no kaihatsu wo shiteorimashita.\nTokyo de minasan to issho ni hataraku koto ga dekite, totemo kouei desu.\nSeiippai ganbarimasu node, douzo yoroshiku onegai itashimasu.`,
    codeExplanation:
      'Pola ini menggunakan bahasa sopan (Keigo/Kenjougo) yang menyatakan nama, asal negara, spesialisasi teknis, dan komitmen bekerja keras.',
    nihongoTerms: [
      { term: 'よろしくお願いします', reading: 'よろしくおねがいします', meaning: 'Mohon bimbingan dan kerja samanya' },
      { term: 'お疲れ様です', reading: 'おつかれさまです', meaning: 'Terima kasih atas kerja kerasnya' },
      { term: '失礼します', reading: 'しつれいします', meaning: 'Permisi / Mohon maaf mengganggu' },
    ],
    tokyoIndustryTip:
      'Ucapkan "Ohayou gozaimasu" saat tiba di kantor terlepas jam berapa Anda masuk kerja.',
  },
}
