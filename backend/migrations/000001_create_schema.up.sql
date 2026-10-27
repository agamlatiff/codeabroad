CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tech_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_path_id UUID REFERENCES career_paths(id) ON DELETE CASCADE,
    slug VARCHAR(50) UNIQUE NOT NULL,   
    label VARCHAR(100) NOT NULL,        
    badge VARCHAR(50),                 
    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_career_path_id ON tech_stacks(career_path_id);


CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    career_path_id UUID REFERENCES career_paths(id) ON DELETE SET NULL,
    country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
    tech_stack_id UUID REFERENCES tech_stacks(id) ON DELETE SET NULL,
    is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_career_path_id ON user_profiles(career_path_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_country_id ON user_profiles(country_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tech_stack_id ON user_profiles(tech_stack_id);


CREATE TABLE IF NOT EXISTS user_gamification(
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

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tech_stack_id UUID NOT NULL REFERENCES tech_stacks(id) ON DELETE CASCADE,
    module_number INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_modules_tech_stack_number UNIQUE (tech_stack_id, module_number)
);

CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_chapters_module_number UNIQUE(module_id, chapter_number)
);

CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,

    type VARCHAR(20) NOT NULL DEFAULT 'main' CHECK (type IN ('main', 'boss', 'daily')),
    format VARCHAR(20) NOT NULL DEFAULT 'code' CHECK (format IN ('code', 'quiz', 'fill_blank')),
    difficulty VARCHAR(20) NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    
    xp_reward INT NOT NULL DEFAULT 50,
    gems_reward INT NOT NULL DEFAULT 0,
    estimated_minutes INT NOT NULL DEFAULT 15,
    order_index INT NOT NULL DEFAULT 0,

    starter_code TEXT,
    test_suite TEXT,
    solution_code TEXT,

    quiz_data JSONB,
    hints JSONB,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_quests_chapter_order UNIQUE (chapter_id, order_index)
);

CREATE TABLE IF NOT EXISTS user_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed')),

    code_submission TEXT,
    tests_passed INT NOT NULL DEFAULT 0,
    total_tests INT NOT NULL DEFAULT 0,

    completed_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_quests_user_quest UNIQUE (user_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_user_quests_user_status ON user_quests(user_id, status);

CREATE TABLE IF NOT EXISTS user_inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_inventories_user_item UNIQUE (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_key VARCHAR(100) NOT NULL,
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
        'quest_completed', 
        'daily_vocab_quest_claim', 
        'daily_golden_chest_claim'
    )),

    xp_earned INT NOT NULL DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_created ON user_activity_logs(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS vocabularies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id VARCHAR(2) NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
    term VARCHAR(100) NOT NULL,

    reading VARCHAR(150) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    audio_url VARCHAR(255),

    example_sentence TEXT NOT NULL,       
    example_translation TEXT NOT NULL,  

    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'A1',
    position INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocabularies_category ON vocabularies(category);