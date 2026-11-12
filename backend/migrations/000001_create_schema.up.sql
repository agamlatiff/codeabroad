-- ============================================================================
-- Migration: 000001_create_schema.up.sql
-- Description: CodeAbroad v3.0 Master Schema (Auth, Gamification, Language Mastery, Anki SRS & Diagnostics)
-- Version: 3.0
-- Database: PostgreSQL 16 (pgcrypto)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. IDENTITY & AUTHENTICATION (Pillar 1: Auth Core)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- 2. PROFILE & PREFERENCES (Pillar 2: Application Profile)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    daily_goal_minutes INT NOT NULL DEFAULT 15 CHECK (daily_goal_minutes IN (5, 15, 30, 45)),
    preferred_roadmap_view VARCHAR(20) NOT NULL DEFAULT 'map' CHECK (preferred_roadmap_view IN ('map', 'syllabus')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- ----------------------------------------------------------------------------
-- 3. GAMIFICATION & INVENTORY (Pillar 3: High-Concurrency Game Loop)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_gamification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp INT NOT NULL DEFAULT 0,
    current_level INT NOT NULL DEFAULT 1,
    streak INT NOT NULL DEFAULT 0,
    gems INT NOT NULL DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_gamification_xp ON user_gamification(xp DESC);

CREATE TABLE IF NOT EXISTS badge_definitions (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    xp_reward INT NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shop_items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle TEXT NOT NULL,
    price_gems INT NOT NULL CHECK (price_gems >= 0),
    category VARCHAR(50) NOT NULL,
    badge VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(50) NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_inventories_user_item UNIQUE (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_key VARCHAR(100) NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_badges_user_key UNIQUE (user_id, badge_key)
);

CREATE TABLE IF NOT EXISTS user_daily_chest_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    tier INT NOT NULL CHECK (tier IN (1, 2, 3)),
    gems_awarded INT NOT NULL DEFAULT 0,
    xp_awarded INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_daily_chest_claims UNIQUE (user_id, claim_date, tier)
);

CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
        'daily_login', 
        'lesson_completed', 
        'srs_review_completed', 
        'readiness_exam_completed', 
        'daily_golden_chest_claim',
        'quest_completed',
        'daily_vocab_quest_claim'
    )),
    xp_earned INT NOT NULL DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_created ON user_activity_logs(user_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. UNIVERSAL LANGUAGE CURRICULUM MASTER DOMAIN
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    supported_scripts JSONB NOT NULL DEFAULT '["latin"]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);

CREATE TABLE IF NOT EXISTS proficiency_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    tier VARCHAR(20) NOT NULL DEFAULT 'beginner' CHECK (tier IN ('beginner', 'intermediate', 'advanced')),
    official_exam_name VARCHAR(50) NOT NULL,
    passing_score_percent INT NOT NULL DEFAULT 60 CHECK (passing_score_percent BETWEEN 1 AND 100),
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_proficiency_levels_lang_code UNIQUE (language_id, code)
);

CREATE INDEX IF NOT EXISTS idx_proficiency_levels_lang_order ON proficiency_levels(language_id, order_index);
CREATE INDEX IF NOT EXISTS idx_proficiency_levels_tier ON proficiency_levels(tier);

CREATE TABLE IF NOT EXISTS grammar_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id UUID NOT NULL REFERENCES proficiency_levels(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('tense', 'conjugation', 'particle', 'honorific', 'sentence_pattern')),
    title VARCHAR(100) NOT NULL,
    formula TEXT NOT NULL,
    explanation TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_grammar_points_level_code UNIQUE (level_id, code)
);

CREATE INDEX IF NOT EXISTS idx_grammar_points_level_order ON grammar_points(level_id, order_index);
CREATE INDEX IF NOT EXISTS idx_grammar_points_category ON grammar_points(category);

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id UUID NOT NULL REFERENCES proficiency_levels(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    unit_type VARCHAR(20) NOT NULL DEFAULT 'curriculum' CHECK (unit_type IN ('curriculum', 'diagnostic_exam')),
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_units_level_order ON units(level_id, order_index);
CREATE INDEX IF NOT EXISTS idx_units_type ON units(unit_type);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    xp_reward INT NOT NULL DEFAULT 15 CHECK (xp_reward >= 0),
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lessons_unit_order ON lessons(unit_id, order_index);

CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    grammar_point_id UUID REFERENCES grammar_points(id) ON DELETE SET NULL,
    skill_pillar VARCHAR(20) NOT NULL CHECK (skill_pillar IN ('reading', 'listening', 'writing', 'speaking')),
    exercise_type VARCHAR(30) NOT NULL CHECK (exercise_type IN ('sentence_builder', 'fill_blank', 'listening_choice', 'speaking_repeat', 'dialogue_roleplay')),
    prompt TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    correct_answer JSONB NOT NULL DEFAULT '{}'::jsonb,
    acceptable_answers JSONB,
    diagnostic_rubric JSONB,
    explanation TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_lesson_order ON exercises(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_exercises_grammar_point ON exercises(grammar_point_id);
CREATE INDEX IF NOT EXISTS idx_exercises_pillar ON exercises(skill_pillar);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(exercise_type);

-- ----------------------------------------------------------------------------
-- 5. USER PROGRESS, ANKI SRS & DIAGNOSTIC MOCK EXAMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_language_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    current_level_id UUID REFERENCES proficiency_levels(id) ON DELETE SET NULL,
    initial_placement_type VARCHAR(30) NOT NULL DEFAULT 'zero_beginner' CHECK (initial_placement_type IN ('zero_beginner', 'placement_test', 'manual_select')),
    placement_score_percent INT CHECK (placement_score_percent BETWEEN 0 AND 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_language_enrollments UNIQUE (user_id, language_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lang_enrollments_user_active ON user_language_enrollments(user_id, is_active);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    score INT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
    is_skipped BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_lesson_progress UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id, is_completed);

CREATE TABLE IF NOT EXISTS user_exercise_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    selected_answer JSONB NOT NULL DEFAULT '{}'::jsonb,
    time_spent_seconds INT NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_ex ON user_exercise_attempts(user_id, exercise_id, is_correct);
CREATE INDEX IF NOT EXISTS idx_attempts_user_created ON user_exercise_attempts(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_srs_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    interval_days INT NOT NULL DEFAULT 1 CHECK (interval_days >= 1),
    repetition_count INT NOT NULL DEFAULT 0 CHECK (repetition_count >= 0),
    ease_factor DECIMAL(4,2) NOT NULL DEFAULT 2.50 CHECK (ease_factor >= 1.30),
    next_review_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT uq_user_srs_reviews UNIQUE (user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_srs_user_due ON user_srs_reviews(user_id, next_review_at);

CREATE TABLE IF NOT EXISTS readiness_exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level_id UUID NOT NULL REFERENCES proficiency_levels(id) ON DELETE CASCADE,
    reading_score INT NOT NULL CHECK (reading_score BETWEEN 0 AND 100),
    listening_score INT NOT NULL CHECK (listening_score BETWEEN 0 AND 100),
    writing_score INT NOT NULL CHECK (writing_score BETWEEN 0 AND 100),
    speaking_score INT NOT NULL CHECK (speaking_score BETWEEN 0 AND 100),
    overall_score INT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    is_passed BOOLEAN NOT NULL,
    analysis_report JSONB NOT NULL DEFAULT '{}'::jsonb,
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readiness_exam_user_level ON readiness_exam_attempts(user_id, level_id, attempted_at DESC);

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
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaching_user_created ON coaching_submissions(user_id, created_at DESC);

