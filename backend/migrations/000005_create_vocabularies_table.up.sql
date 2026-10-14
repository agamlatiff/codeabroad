-- ============================================================================
-- Migration 000005: Create Vocabularies Table and Seed Tokyo IT Bank
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabularies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_path_id UUID REFERENCES career_paths(id) ON DELETE SET NULL,
    term VARCHAR(100) NOT NULL,
    reading VARCHAR(150) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    example_ja TEXT NOT NULL,
    example_id TEXT NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'N3',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocabularies_category ON vocabularies(category);
CREATE INDEX IF NOT EXISTS idx_vocabularies_order_index ON vocabularies(order_index);

-- Seed Initial Curated IT Tokyo Workplace Vocabularies
INSERT INTO vocabularies (id, term, reading, meaning, category, example_ja, example_id, difficulty_level, order_index)
VALUES
(
    'v1000001-0000-0000-0000-000000000001',
    '挨拶',
    'あいさつ • Aisatsu',
    'Sapaan Pagi & Etika Kantor',
    'Etika Kantor',
    'Minasan, ohayou gozaimasu! Kyou mo yoroshiku onegaishimasu.',
    'Selamat pagi semuanya! Mohon kerja samanya hari ini juga.',
    'N4',
    1
),
(
    'v1000002-0000-0000-0000-000000000002',
    '実装',
    'じっそう • Jissou',
    'Implementasi Fitur (Feature Development)',
    'Pengembangan',
    'Kono kinou no jissou wa kyoujuu ni kanryou shimasu.',
    'Implementasi fitur ini akan selesai hari ini.',
    'N3',
    2
),
(
    'v1000003-0000-0000-0000-000000000003',
    '結合テスト',
    'けつごうてすと • Ketsugou Tesuto',
    'Uji Integrasi (Integration Testing)',
    'Pengujian QA',
    'Ashita kara API no ketsugou tesuto wo kaishi shimasu.',
    'Mulai besok kita akan memulai uji integrasi API.',
    'N3',
    3
),
(
    'v1000004-0000-0000-0000-000000000004',
    '認可',
    'にんか • Ninka',
    'Otorisasi & Keamanan Middleware',
    'Security',
    'JWT token ni yoru ninka shori wo tsuika shimashita.',
    'Saya telah menambahkan proses otorisasi menggunakan JWT token.',
    'N3',
    4
),
(
    'v1000005-0000-0000-0000-000000000005',
    '並行処理',
    'へいこうしょり • Heikou Shori',
    'Pemrosesan Konkuren (Concurrency)',
    'Arsitektur Backend',
    'Goroutine to channel wo tsukatta heikou shori wo sekkei shimasu.',
    'Saya merancang pemrosesan konkuren menggunakan Goroutine dan channel.',
    'N2',
    5
),
(
    'v1000006-0000-0000-0000-000000000006',
    '本番環境',
    'ほんばんかんきょう • Honban Kankyou',
    'Lingkungan Produksi (Production Env)',
    'DevOps & Cloud',
    'Honban kankyou he no depuroi mae ni fuka tesuto wo okonaimasu.',
    'Kami melakukan load testing sebelum deploy ke lingkungan produksi.',
    'N3',
    6
),
(
    'v1000007-0000-0000-0000-000000000007',
    '朝会',
    'あさかい • Asakai',
    'Rapat Standup Pagi (Daily Standup)',
    'Etika Kantor',
    'Maiasa 9-ji kara no asakai de shinchoku wo kyouyuu shimasu.',
    'Kami berbagi progres kerja di rapat standup setiap pagi jam 9.',
    'N4',
    7
),
(
    'v1000008-0000-0000-0000-000000000008',
    '修正',
    'しゅうせい • Shuusei',
    'Perbaikan Bug & Revisi Kode',
    'Pengembangan',
    'Kenshutsu sareta bagu no shuusei komitto wo push shimashita.',
    'Saya telah melakukan push commit perbaikan bug yang ditemukan.',
    'N3',
    8
)
ON CONFLICT (id) DO NOTHING;
