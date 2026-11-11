-- ============================================================================
-- Migration: 000006_seed_gamification_and_rewards.up.sql
-- Description: Seed Master Badges and Shop Catalog Items
-- Version: CodeAbroad v3.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED MASTER BADGE DEFINITIONS
-- ----------------------------------------------------------------------------
INSERT INTO badge_definitions (id, title, description, category, icon, xp_reward) VALUES
    (
        'first_step',
        'Langkah Pertama',
        'Menyelesaikan pelajaran pertamamu di CodeAbroad.',
        'milestone',
        'sparkles',
        50
    ),
    (
        'streak_7',
        'Konsistensi Mingguan',
        'Mempertahankan api streak belajar selama 7 hari berturut-turut.',
        'streak',
        'flame',
        100
    ),
    (
        'streak_30',
        'Master Kebiasaan',
        'Mempertahankan api streak belajar selama 30 hari tanpa terputus.',
        'streak',
        'trophy',
        300
    ),
    (
        'srs_veteran',
        'Memori Gajah',
        'Menguasai 25 kartu ingatan Anki SRS secara beruntun dengan retensi tinggi.',
        'srs',
        'brain',
        150
    ),
    (
        'n5_mastery',
        'Penakluk JLPT N5',
        'Meraih skor kelulusan ≥ 80% pada evaluasi ujian sectional Unit 2.',
        'mastery',
        'medal',
        250
    ),
    (
        'multilingual_explorer',
        'Poliglot Pemula',
        'Mendaftar dan aktif mempelajari lebih dari 1 bahasa di CodeAbroad.',
        'special',
        'globe',
        100
    )
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    xp_reward = EXCLUDED.xp_reward;

-- ----------------------------------------------------------------------------
-- 2. SEED SHOP ITEMS CATALOG
-- ----------------------------------------------------------------------------
INSERT INTO shop_items (id, title, subtitle, price_gems, category, badge, is_active) VALUES
    (
        'streak-freeze',
        'Streak Freeze ❄️',
        'Perlindungan 1 hari penuh dari pemutusan streak saat Anda berhalangan hadir.',
        20,
        'protection',
        'POPULER 🔥',
        TRUE
    ),
    (
        'xp-booster',
        'XP Booster Potion 🧪',
        'Pengganda 2x XP untuk setiap latihan & kuis selama 15 menit ke depan.',
        35,
        'booster',
        'BOOSTER ⚡',
        TRUE
    ),
    (
        'cv-review',
        'Kupon Review CV Tokyo 📋',
        'Audit portofolio GitHub dan resume teknis langsung oleh software engineer diaspora Tokyo.',
        100,
        'career',
        'SPONSOR VISA 🇯🇵',
        TRUE
    ),
    (
        'mock-interview',
        'Akses VIP Mock Interview 🎙️',
        'Simulasi 1-on-1 live technical interview standar Tokyo berbahasa Jepang/Inggris via Discord.',
        150,
        'career',
        'EKSKLUSIF ⭐',
        TRUE
    )
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    price_gems = EXCLUDED.price_gems,
    category = EXCLUDED.category,
    badge = EXCLUDED.badge,
    is_active = EXCLUDED.is_active;

