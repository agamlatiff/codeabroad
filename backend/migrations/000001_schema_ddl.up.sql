-- Merantalk Core Database Schema (DDL)
--
-- PostgreSQL database dump
--


-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';




--
-- Name: badge_definitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.badge_definitions (
    id character varying(100) NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    category character varying(50) NOT NULL,
    icon character varying(100),
    xp_reward integer DEFAULT 50 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT badge_definitions_xp_reward_check CHECK ((xp_reward >= 0))
);


--
-- Name: coaching_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coaching_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(50) NOT NULL,
    target_role character varying(120),
    github_url character varying(500),
    resume_url character varying(500),
    discord_handle character varying(100),
    interview_language character varying(50),
    focus_topic character varying(120),
    preferred_time character varying(120),
    notes text,
    status character varying(30) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: daily_quest_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_quest_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(64) NOT NULL,
    slot_category character varying(32) NOT NULL,
    title character varying(160) NOT NULL,
    chip_label character varying(48) NOT NULL,
    metric_type character varying(48) NOT NULL,
    target_value integer DEFAULT 1 NOT NULL,
    xp_reward integer DEFAULT 30 NOT NULL,
    route character varying(120) DEFAULT '/curriculum'::character varying NOT NULL,
    icon_name character varying(48) DEFAULT 'book-open'::character varying NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: exercises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    grammar_point_id uuid,
    skill_pillar character varying(20) NOT NULL,
    exercise_type character varying(30) NOT NULL,
    prompt text NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    correct_answer jsonb DEFAULT '{}'::jsonb NOT NULL,
    acceptable_answers jsonb,
    diagnostic_rubric jsonb,
    explanation text NOT NULL,
    order_index integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT exercises_exercise_type_check CHECK (((exercise_type)::text = ANY (ARRAY[('sentence_builder'::character varying)::text, ('fill_blank'::character varying)::text, ('listening_choice'::character varying)::text, ('speaking_repeat'::character varying)::text, ('dialogue_roleplay'::character varying)::text]))),
    CONSTRAINT exercises_skill_pillar_check CHECK (((skill_pillar)::text = ANY (ARRAY[('reading'::character varying)::text, ('listening'::character varying)::text, ('writing'::character varying)::text, ('speaking'::character varying)::text])))
);


--
-- Name: flashcard_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flashcard_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deck_id uuid NOT NULL,
    front_text text NOT NULL,
    reading text DEFAULT ''::text NOT NULL,
    back_meaning text NOT NULL,
    part_of_speech character varying(48) DEFAULT ''::character varying NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: flashcard_decks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flashcard_decks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    language_code character varying(16) NOT NULL,
    title character varying(160) NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    category character varying(64) NOT NULL,
    icon_name character varying(64) DEFAULT 'cards'::character varying NOT NULL,
    accent_color character varying(32) DEFAULT 'blue'::character varying NOT NULL,
    jlpt_level character varying(16) DEFAULT 'N5'::character varying NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    slug character varying(120) NOT NULL
);


--
-- Name: grammar_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grammar_points (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    level_id uuid NOT NULL,
    code character varying(30) NOT NULL,
    category character varying(30) NOT NULL,
    title character varying(100) NOT NULL,
    formula text NOT NULL,
    explanation text NOT NULL,
    order_index integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    examples jsonb DEFAULT '[]'::jsonb NOT NULL,
    formula_reading text DEFAULT ''::text NOT NULL,
    learning_guide jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT grammar_points_category_check CHECK (((category)::text = ANY (ARRAY[('tense'::character varying)::text, ('conjugation'::character varying)::text, ('particle'::character varying)::text, ('honorific'::character varying)::text, ('sentence_pattern'::character varying)::text])))
);


--
-- Name: kana_characters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kana_characters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "character" character varying(8) NOT NULL,
    script character varying(16) NOT NULL,
    romaji character varying(48) NOT NULL,
    row_group character varying(16) NOT NULL,
    row_order integer NOT NULL,
    col_order integer NOT NULL,
    mnemonic text NOT NULL,
    example_word character varying(64) DEFAULT ''::character varying NOT NULL,
    example_reading character varying(64) DEFAULT ''::character varying NOT NULL,
    example_meaning character varying(120) DEFAULT ''::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT kana_characters_script_check CHECK (((script)::text = ANY (ARRAY[('hiragana'::character varying)::text, ('katakana'::character varying)::text, ('kanji'::character varying)::text])))
);


--
-- Name: languages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.languages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(50) NOT NULL,
    supported_scripts jsonb DEFAULT '["latin"]'::jsonb NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: leaderboard_weekly_rewards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leaderboard_weekly_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    season_year integer NOT NULL,
    season_week integer NOT NULL,
    division character varying(32) NOT NULL,
    rank integer NOT NULL,
    weekly_xp integer DEFAULT 0 NOT NULL,
    gems_awarded integer NOT NULL,
    claimed_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT leaderboard_weekly_rewards_division_check CHECK (((division)::text = ANY ((ARRAY['bronze'::character varying, 'silver'::character varying, 'gold'::character varying, 'diamond'::character varying])::text[]))),
    CONSTRAINT leaderboard_weekly_rewards_gems_awarded_check CHECK ((gems_awarded > 0)),
    CONSTRAINT leaderboard_weekly_rewards_rank_check CHECK (((rank >= 1) AND (rank <= 3)))
);


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_id uuid NOT NULL,
    title character varying(100) NOT NULL,
    xp_reward integer DEFAULT 15 NOT NULL,
    order_index integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    slug character varying(160) NOT NULL,
    icon_name character varying(48) DEFAULT 'book-open'::character varying NOT NULL,
    short_title character varying(48) DEFAULT ''::character varying NOT NULL,
    CONSTRAINT lessons_xp_reward_check CHECK ((xp_reward >= 0))
);


--
-- Name: proficiency_levels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proficiency_levels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    language_id uuid NOT NULL,
    code character varying(30) NOT NULL,
    name character varying(50) NOT NULL,
    tier character varying(20) DEFAULT 'beginner'::character varying NOT NULL,
    official_exam_name character varying(50) NOT NULL,
    passing_score_percent integer DEFAULT 60 NOT NULL,
    order_index integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT proficiency_levels_passing_score_percent_check CHECK (((passing_score_percent >= 1) AND (passing_score_percent <= 100))),
    CONSTRAINT proficiency_levels_tier_check CHECK (((tier)::text = ANY (ARRAY[('beginner'::character varying)::text, ('intermediate'::character varying)::text, ('advanced'::character varying)::text])))
);


--
-- Name: readiness_exam_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.readiness_exam_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    level_id uuid NOT NULL,
    reading_score integer NOT NULL,
    listening_score integer NOT NULL,
    writing_score integer NOT NULL,
    speaking_score integer NOT NULL,
    overall_score integer NOT NULL,
    is_passed boolean NOT NULL,
    analysis_report jsonb DEFAULT '{}'::jsonb NOT NULL,
    attempted_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT readiness_exam_attempts_listening_score_check CHECK (((listening_score >= 0) AND (listening_score <= 100))),
    CONSTRAINT readiness_exam_attempts_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100))),
    CONSTRAINT readiness_exam_attempts_reading_score_check CHECK (((reading_score >= 0) AND (reading_score <= 100))),
    CONSTRAINT readiness_exam_attempts_speaking_score_check CHECK (((speaking_score >= 0) AND (speaking_score <= 100))),
    CONSTRAINT readiness_exam_attempts_writing_score_check CHECK (((writing_score >= 0) AND (writing_score <= 100)))
);


--
-- Name: shop_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shop_items (
    id character varying(50) NOT NULL,
    title character varying(100) NOT NULL,
    subtitle text NOT NULL,
    price_gems integer NOT NULL,
    category character varying(50) NOT NULL,
    badge character varying(50),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT shop_items_price_gems_check CHECK ((price_gems >= 0))
);


--
-- Name: units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.units (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    level_id uuid NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    unit_type character varying(20) DEFAULT 'curriculum'::character varying NOT NULL,
    order_index integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT units_unit_type_check CHECK (((unit_type)::text = ANY (ARRAY[('curriculum'::character varying)::text, ('diagnostic_exam'::character varying)::text])))
);


--
-- Name: user_activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activity_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type character varying(50) NOT NULL,
    xp_earned integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_activity_logs_activity_type_check CHECK (((activity_type)::text = ANY (ARRAY['daily_login'::text, 'lesson_completed'::text, 'srs_review_completed'::text, 'readiness_exam_completed'::text, 'daily_golden_chest_claim'::text, 'daily_chest_claimed'::text, 'quest_completed'::text, 'daily_vocab_quest_claim'::text, 'onboarding_completed'::text, 'badge_unlocked'::text, 'streak_freeze_consumed'::text, 'leaderboard_reward_claimed'::text, 'xp_booster_activated'::text, 'monthly_badge_claimed'::text])))
);


--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    badge_key character varying(100) NOT NULL,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_daily_chest_claims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_daily_chest_claims (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    claim_date date DEFAULT ((now() AT TIME ZONE 'Asia/Jakarta'::text))::date NOT NULL,
    tier integer NOT NULL,
    gems_awarded integer DEFAULT 0 NOT NULL,
    xp_awarded integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_daily_chest_claims_tier_check CHECK ((tier = ANY (ARRAY[1, 2, 3])))
);


--
-- Name: user_daily_quest_claims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_daily_quest_claims (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quest_template_id uuid NOT NULL,
    claim_date_wib character varying(10) NOT NULL,
    xp_awarded integer DEFAULT 0 NOT NULL,
    claimed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_exercise_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_exercise_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    is_correct boolean NOT NULL,
    selected_answer jsonb DEFAULT '{}'::jsonb NOT NULL,
    time_spent_seconds integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_exercise_attempts_time_spent_seconds_check CHECK ((time_spent_seconds >= 0))
);


--
-- Name: user_flashcard_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_flashcard_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    card_id uuid NOT NULL,
    ease_factor double precision DEFAULT 2.5 NOT NULL,
    interval_days integer DEFAULT 0 NOT NULL,
    repetitions integer DEFAULT 0 NOT NULL,
    next_review_at timestamp with time zone DEFAULT now() NOT NULL,
    last_reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_gamification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_gamification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    current_level integer DEFAULT 1 NOT NULL,
    streak integer DEFAULT 0 NOT NULL,
    gems integer DEFAULT 0 NOT NULL,
    last_active_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    xp_booster_expires_at timestamp with time zone,
    CONSTRAINT chk_user_gamification_gems_non_negative CHECK ((gems >= 0)),
    CONSTRAINT chk_user_gamification_level_min_one CHECK ((current_level >= 1)),
    CONSTRAINT chk_user_gamification_streak_non_negative CHECK ((streak >= 0)),
    CONSTRAINT chk_user_gamification_xp_non_negative CHECK ((xp >= 0))
);


--
-- Name: user_grammar_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_grammar_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    grammar_point_id uuid NOT NULL,
    quiz_score integer DEFAULT 0 NOT NULL,
    correct_count integer DEFAULT 0 NOT NULL,
    total_questions integer DEFAULT 3 NOT NULL,
    attempts_count integer DEFAULT 1 NOT NULL,
    is_understood boolean DEFAULT false NOT NULL,
    understood_at timestamp with time zone,
    next_review_at timestamp with time zone,
    last_attempted_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_grammar_progress_attempts_count_check CHECK ((attempts_count >= 1)),
    CONSTRAINT user_grammar_progress_correct_count_check CHECK ((correct_count >= 0)),
    CONSTRAINT user_grammar_progress_quiz_score_check CHECK (((quiz_score >= 0) AND (quiz_score <= 100))),
    CONSTRAINT user_grammar_progress_total_questions_check CHECK ((total_questions > 0))
);


--
-- Name: user_inventories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_inventories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    item_id character varying(50) NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_inventories_quantity_check CHECK ((quantity >= 0))
);


--
-- Name: user_kana_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_kana_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    "character" character varying(8) NOT NULL,
    practice_count integer DEFAULT 0 NOT NULL,
    correct_count integer DEFAULT 0 NOT NULL,
    mastery_score integer DEFAULT 0 NOT NULL,
    is_mastered boolean DEFAULT false NOT NULL,
    last_practiced_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_language_enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_language_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    language_id uuid NOT NULL,
    current_level_id uuid,
    initial_placement_type character varying(30) DEFAULT 'zero_beginner'::character varying NOT NULL,
    placement_score_percent integer,
    is_active boolean DEFAULT true NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_language_enrollments_initial_placement_type_check CHECK (((initial_placement_type)::text = ANY (ARRAY[('zero_beginner'::character varying)::text, ('placement_test'::character varying)::text, ('manual_select'::character varying)::text]))),
    CONSTRAINT user_language_enrollments_placement_score_percent_check CHECK (((placement_score_percent >= 0) AND (placement_score_percent <= 100)))
);


--
-- Name: user_lesson_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_lesson_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    is_skipped boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_lesson_progress_score_check CHECK (((score >= 0) AND (score <= 100)))
);


--
-- Name: user_monthly_badge_claims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_monthly_badge_claims (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    month_key character varying(7) NOT NULL,
    badge_key character varying(64) NOT NULL,
    completed_count integer DEFAULT 0 NOT NULL,
    xp_awarded integer DEFAULT 150 NOT NULL,
    claimed_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_oauth_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_oauth_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    provider character varying(50) NOT NULL,
    provider_user_id character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    bio text,
    is_onboarded boolean DEFAULT false NOT NULL,
    daily_goal_minutes integer DEFAULT 15 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    has_seen_roadmap_tour boolean DEFAULT false NOT NULL,
    avatar_url text,
    CONSTRAINT user_profiles_daily_goal_minutes_check CHECK ((daily_goal_minutes = ANY (ARRAY[5, 15, 30, 45])))
);


--
-- Name: user_srs_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_srs_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    interval_days integer DEFAULT 1 NOT NULL,
    repetition_count integer DEFAULT 0 NOT NULL,
    ease_factor numeric(4,2) DEFAULT 2.50 NOT NULL,
    next_review_at timestamp with time zone DEFAULT now() NOT NULL,
    last_reviewed_at timestamp with time zone,
    CONSTRAINT user_srs_reviews_ease_factor_check CHECK ((ease_factor >= 1.30)),
    CONSTRAINT user_srs_reviews_interval_days_check CHECK ((interval_days >= 1)),
    CONSTRAINT user_srs_reviews_repetition_count_check CHECK ((repetition_count >= 0))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    subscription_tier character varying(16) DEFAULT 'free'::character varying NOT NULL,
    subscription_expires_at timestamp with time zone,
    CONSTRAINT users_subscription_tier_check CHECK (((subscription_tier)::text = ANY ((ARRAY['free'::character varying, 'pro'::character varying])::text[])))
);


--
-- Name: badge_definitions badge_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.badge_definitions
    ADD CONSTRAINT badge_definitions_pkey PRIMARY KEY (id);


--
-- Name: coaching_submissions coaching_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_submissions
    ADD CONSTRAINT coaching_submissions_pkey PRIMARY KEY (id);


--
-- Name: daily_quest_templates daily_quest_templates_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_quest_templates
    ADD CONSTRAINT daily_quest_templates_code_key UNIQUE (code);


--
-- Name: daily_quest_templates daily_quest_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_quest_templates
    ADD CONSTRAINT daily_quest_templates_pkey PRIMARY KEY (id);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: flashcard_cards flashcard_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flashcard_cards
    ADD CONSTRAINT flashcard_cards_pkey PRIMARY KEY (id);


--
-- Name: flashcard_decks flashcard_decks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flashcard_decks
    ADD CONSTRAINT flashcard_decks_pkey PRIMARY KEY (id);


--
-- Name: grammar_points grammar_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammar_points
    ADD CONSTRAINT grammar_points_pkey PRIMARY KEY (id);


--
-- Name: kana_characters kana_characters_character_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kana_characters
    ADD CONSTRAINT kana_characters_character_key UNIQUE ("character");


--
-- Name: kana_characters kana_characters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kana_characters
    ADD CONSTRAINT kana_characters_pkey PRIMARY KEY (id);


--
-- Name: languages languages_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_code_key UNIQUE (code);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: leaderboard_weekly_rewards leaderboard_weekly_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leaderboard_weekly_rewards
    ADD CONSTRAINT leaderboard_weekly_rewards_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: proficiency_levels proficiency_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proficiency_levels
    ADD CONSTRAINT proficiency_levels_pkey PRIMARY KEY (id);


--
-- Name: readiness_exam_attempts readiness_exam_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readiness_exam_attempts
    ADD CONSTRAINT readiness_exam_attempts_pkey PRIMARY KEY (id);


--
-- Name: shop_items shop_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shop_items
    ADD CONSTRAINT shop_items_pkey PRIMARY KEY (id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: grammar_points uq_grammar_points_level_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammar_points
    ADD CONSTRAINT uq_grammar_points_level_code UNIQUE (level_id, code);


--
-- Name: leaderboard_weekly_rewards uq_leaderboard_weekly_rewards_user_season; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leaderboard_weekly_rewards
    ADD CONSTRAINT uq_leaderboard_weekly_rewards_user_season UNIQUE (user_id, season_year, season_week);


--
-- Name: proficiency_levels uq_proficiency_levels_lang_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proficiency_levels
    ADD CONSTRAINT uq_proficiency_levels_lang_code UNIQUE (language_id, code);


--
-- Name: user_badges uq_user_badges_user_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT uq_user_badges_user_key UNIQUE (user_id, badge_key);


--
-- Name: user_daily_chest_claims uq_user_daily_chest_claims; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_daily_chest_claims
    ADD CONSTRAINT uq_user_daily_chest_claims UNIQUE (user_id, claim_date, tier);


--
-- Name: user_inventories uq_user_inventories_user_item; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_inventories
    ADD CONSTRAINT uq_user_inventories_user_item UNIQUE (user_id, item_id);


--
-- Name: user_language_enrollments uq_user_language_enrollments; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_enrollments
    ADD CONSTRAINT uq_user_language_enrollments UNIQUE (user_id, language_id);


--
-- Name: user_lesson_progress uq_user_lesson_progress; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT uq_user_lesson_progress UNIQUE (user_id, lesson_id);


--
-- Name: user_oauth_accounts uq_user_oauth_provider_uid; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_oauth_accounts
    ADD CONSTRAINT uq_user_oauth_provider_uid UNIQUE (provider, provider_user_id);


--
-- Name: user_oauth_accounts uq_user_oauth_user_provider; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_oauth_accounts
    ADD CONSTRAINT uq_user_oauth_user_provider UNIQUE (user_id, provider);


--
-- Name: user_srs_reviews uq_user_srs_reviews; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_srs_reviews
    ADD CONSTRAINT uq_user_srs_reviews UNIQUE (user_id, exercise_id);


--
-- Name: user_activity_logs user_activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_logs
    ADD CONSTRAINT user_activity_logs_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- Name: user_daily_chest_claims user_daily_chest_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_daily_chest_claims
    ADD CONSTRAINT user_daily_chest_claims_pkey PRIMARY KEY (id);


--
-- Name: user_daily_quest_claims user_daily_quest_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_daily_quest_claims
    ADD CONSTRAINT user_daily_quest_claims_pkey PRIMARY KEY (id);


--
-- Name: user_daily_quest_claims user_daily_quest_claims_user_id_quest_template_id_claim_dat_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_daily_quest_claims
    ADD CONSTRAINT user_daily_quest_claims_user_id_quest_template_id_claim_dat_key UNIQUE (user_id, quest_template_id, claim_date_wib);


--
-- Name: user_exercise_attempts user_exercise_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_attempts
    ADD CONSTRAINT user_exercise_attempts_pkey PRIMARY KEY (id);


--
-- Name: user_flashcard_progress user_flashcard_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_flashcard_progress
    ADD CONSTRAINT user_flashcard_progress_pkey PRIMARY KEY (id);


--
-- Name: user_flashcard_progress user_flashcard_progress_user_id_card_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_flashcard_progress
    ADD CONSTRAINT user_flashcard_progress_user_id_card_id_key UNIQUE (user_id, card_id);


--
-- Name: user_gamification user_gamification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_gamification
    ADD CONSTRAINT user_gamification_pkey PRIMARY KEY (id);


--
-- Name: user_gamification user_gamification_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_gamification
    ADD CONSTRAINT user_gamification_user_id_key UNIQUE (user_id);


--
-- Name: user_grammar_progress user_grammar_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_grammar_progress
    ADD CONSTRAINT user_grammar_progress_pkey PRIMARY KEY (id);


--
-- Name: user_grammar_progress user_grammar_progress_user_id_grammar_point_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_grammar_progress
    ADD CONSTRAINT user_grammar_progress_user_id_grammar_point_id_key UNIQUE (user_id, grammar_point_id);


--
-- Name: user_inventories user_inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_inventories
    ADD CONSTRAINT user_inventories_pkey PRIMARY KEY (id);


--
-- Name: user_kana_progress user_kana_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_kana_progress
    ADD CONSTRAINT user_kana_progress_pkey PRIMARY KEY (id);


--
-- Name: user_kana_progress user_kana_progress_user_id_character_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_kana_progress
    ADD CONSTRAINT user_kana_progress_user_id_character_key UNIQUE (user_id, "character");


--
-- Name: user_language_enrollments user_language_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_enrollments
    ADD CONSTRAINT user_language_enrollments_pkey PRIMARY KEY (id);


--
-- Name: user_lesson_progress user_lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT user_lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: user_monthly_badge_claims user_monthly_badge_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_monthly_badge_claims
    ADD CONSTRAINT user_monthly_badge_claims_pkey PRIMARY KEY (id);


--
-- Name: user_monthly_badge_claims user_monthly_badge_claims_user_id_month_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_monthly_badge_claims
    ADD CONSTRAINT user_monthly_badge_claims_user_id_month_key_key UNIQUE (user_id, month_key);


--
-- Name: user_oauth_accounts user_oauth_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_oauth_accounts
    ADD CONSTRAINT user_oauth_accounts_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_profiles user_profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_username_key UNIQUE (username);


--
-- Name: user_srs_reviews user_srs_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_srs_reviews
    ADD CONSTRAINT user_srs_reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_attempts_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_user_created ON public.user_exercise_attempts USING btree (user_id, created_at DESC);


--
-- Name: idx_attempts_user_ex; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_attempts_user_ex ON public.user_exercise_attempts USING btree (user_id, exercise_id, is_correct);


--
-- Name: idx_coaching_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coaching_user_created ON public.coaching_submissions USING btree (user_id, created_at DESC);


--
-- Name: idx_exercises_grammar_point; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_grammar_point ON public.exercises USING btree (grammar_point_id);


--
-- Name: idx_exercises_lesson_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_lesson_order ON public.exercises USING btree (lesson_id, order_index);


--
-- Name: idx_exercises_pillar; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_pillar ON public.exercises USING btree (skill_pillar);


--
-- Name: idx_exercises_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_exercises_type ON public.exercises USING btree (exercise_type);


--
-- Name: idx_flashcard_cards_deck_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flashcard_cards_deck_order ON public.flashcard_cards USING btree (deck_id, sort_order);


--
-- Name: idx_flashcard_cards_deck_sort_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flashcard_cards_deck_sort_created ON public.flashcard_cards USING btree (deck_id, sort_order, created_at);


--
-- Name: idx_flashcard_decks_lang_level_sort_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flashcard_decks_lang_level_sort_id ON public.flashcard_decks USING btree (language_code, jlpt_level, sort_order, id);


--
-- Name: idx_flashcard_decks_lang_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flashcard_decks_lang_order ON public.flashcard_decks USING btree (language_code, sort_order);


--
-- Name: idx_flashcard_decks_lang_sort_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_flashcard_decks_lang_sort_id ON public.flashcard_decks USING btree (language_code, sort_order, id);


--
-- Name: idx_grammar_points_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grammar_points_category ON public.grammar_points USING btree (category);


--
-- Name: idx_grammar_points_level_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grammar_points_level_order ON public.grammar_points USING btree (level_id, order_index);


--
-- Name: idx_kana_script_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kana_script_order ON public.kana_characters USING btree (script, row_order, col_order);


--
-- Name: idx_languages_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_languages_active ON public.languages USING btree (is_active);


--
-- Name: idx_leaderboard_weekly_rewards_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leaderboard_weekly_rewards_user ON public.leaderboard_weekly_rewards USING btree (user_id, season_year DESC, season_week DESC);


--
-- Name: idx_lessons_unit_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_unit_order ON public.lessons USING btree (unit_id, order_index);


--
-- Name: idx_proficiency_levels_lang_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_proficiency_levels_lang_order ON public.proficiency_levels USING btree (language_id, order_index);


--
-- Name: idx_proficiency_levels_tier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_proficiency_levels_tier ON public.proficiency_levels USING btree (tier);


--
-- Name: idx_readiness_exam_user_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_readiness_exam_user_level ON public.readiness_exam_attempts USING btree (user_id, level_id, attempted_at DESC);


--
-- Name: idx_srs_user_due; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_srs_user_due ON public.user_srs_reviews USING btree (user_id, next_review_at);


--
-- Name: idx_units_level_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_units_level_order ON public.units USING btree (level_id, order_index);


--
-- Name: idx_units_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_units_type ON public.units USING btree (unit_type);


--
-- Name: idx_user_activity_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activity_logs_created_at ON public.user_activity_logs USING btree (created_at DESC);


--
-- Name: idx_user_activity_logs_lesson_completed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activity_logs_lesson_completed ON public.user_activity_logs USING btree (user_id, ((metadata ->> 'lesson_id'::text)), created_at DESC) WHERE ((activity_type)::text = 'lesson_completed'::text);


--
-- Name: idx_user_activity_logs_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activity_logs_user_created ON public.user_activity_logs USING btree (user_id, created_at DESC);


--
-- Name: idx_user_activity_logs_user_type_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_activity_logs_user_type_created ON public.user_activity_logs USING btree (user_id, activity_type, created_at DESC);


--
-- Name: idx_user_daily_quest_claims_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_daily_quest_claims_user_date ON public.user_daily_quest_claims USING btree (user_id, claim_date_wib);


--
-- Name: idx_user_flashcard_progress_due; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_flashcard_progress_due ON public.user_flashcard_progress USING btree (user_id, next_review_at);


--
-- Name: idx_user_flashcard_progress_user_next_review; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_flashcard_progress_user_next_review ON public.user_flashcard_progress USING btree (user_id, next_review_at);


--
-- Name: idx_user_gamification_xp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_gamification_xp ON public.user_gamification USING btree (xp DESC);


--
-- Name: idx_user_grammar_progress_review; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_grammar_progress_review ON public.user_grammar_progress USING btree (user_id, next_review_at);


--
-- Name: idx_user_grammar_progress_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_grammar_progress_user ON public.user_grammar_progress USING btree (user_id);


--
-- Name: idx_user_kana_progress_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_kana_progress_user ON public.user_kana_progress USING btree (user_id);


--
-- Name: idx_user_lang_enrollments_user_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_lang_enrollments_user_active ON public.user_language_enrollments USING btree (user_id, is_active);


--
-- Name: idx_user_lesson_progress_completed_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_lesson_progress_completed_active ON public.user_lesson_progress USING btree (user_id, completed_at DESC) WHERE ((is_completed = true) AND (is_skipped = false));


--
-- Name: idx_user_lesson_progress_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_lesson_progress_user ON public.user_lesson_progress USING btree (user_id, is_completed);


--
-- Name: idx_user_monthly_badge_claims_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_monthly_badge_claims_user ON public.user_monthly_badge_claims USING btree (user_id, month_key);


--
-- Name: idx_user_oauth_accounts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_oauth_accounts_user_id ON public.user_oauth_accounts USING btree (user_id);


--
-- Name: uq_flashcard_decks_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_flashcard_decks_slug ON public.flashcard_decks USING btree (slug);


--
-- Name: uq_lessons_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_lessons_slug ON public.lessons USING btree (slug);


--
-- Name: uq_user_active_language; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_user_active_language ON public.user_language_enrollments USING btree (user_id) WHERE (is_active = true);


--
-- Name: coaching_submissions coaching_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coaching_submissions
    ADD CONSTRAINT coaching_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: exercises exercises_grammar_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_grammar_point_id_fkey FOREIGN KEY (grammar_point_id) REFERENCES public.grammar_points(id) ON DELETE SET NULL;


--
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: flashcard_cards flashcard_cards_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flashcard_cards
    ADD CONSTRAINT flashcard_cards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.flashcard_decks(id) ON DELETE CASCADE;


--
-- Name: grammar_points grammar_points_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grammar_points
    ADD CONSTRAINT grammar_points_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.proficiency_levels(id) ON DELETE CASCADE;


--
-- Name: leaderboard_weekly_rewards leaderboard_weekly_rewards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leaderboard_weekly_rewards
    ADD CONSTRAINT leaderboard_weekly_rewards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- Name: proficiency_levels proficiency_levels_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proficiency_levels
    ADD CONSTRAINT proficiency_levels_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: readiness_exam_attempts readiness_exam_attempts_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readiness_exam_attempts
    ADD CONSTRAINT readiness_exam_attempts_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.proficiency_levels(id) ON DELETE CASCADE;


--
-- Name: readiness_exam_attempts readiness_exam_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.readiness_exam_attempts
    ADD CONSTRAINT readiness_exam_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: units units_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.proficiency_levels(id) ON DELETE CASCADE;


--
-- Name: user_activity_logs user_activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity_logs
    ADD CONSTRAINT user_activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_badge_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_key_fkey FOREIGN KEY (badge_key) REFERENCES public.badge_definitions(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_daily_chest_claims user_daily_chest_claims_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_daily_chest_claims
    ADD CONSTRAINT user_daily_chest_claims_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_daily_quest_claims user_daily_quest_claims_quest_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_daily_quest_claims
    ADD CONSTRAINT user_daily_quest_claims_quest_template_id_fkey FOREIGN KEY (quest_template_id) REFERENCES public.daily_quest_templates(id) ON DELETE CASCADE;


--
-- Name: user_daily_quest_claims user_daily_quest_claims_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_daily_quest_claims
    ADD CONSTRAINT user_daily_quest_claims_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_exercise_attempts user_exercise_attempts_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_attempts
    ADD CONSTRAINT user_exercise_attempts_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;


--
-- Name: user_exercise_attempts user_exercise_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_exercise_attempts
    ADD CONSTRAINT user_exercise_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_flashcard_progress user_flashcard_progress_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_flashcard_progress
    ADD CONSTRAINT user_flashcard_progress_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.flashcard_cards(id) ON DELETE CASCADE;


--
-- Name: user_flashcard_progress user_flashcard_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_flashcard_progress
    ADD CONSTRAINT user_flashcard_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_gamification user_gamification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_gamification
    ADD CONSTRAINT user_gamification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_grammar_progress user_grammar_progress_grammar_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_grammar_progress
    ADD CONSTRAINT user_grammar_progress_grammar_point_id_fkey FOREIGN KEY (grammar_point_id) REFERENCES public.grammar_points(id) ON DELETE CASCADE;


--
-- Name: user_grammar_progress user_grammar_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_grammar_progress
    ADD CONSTRAINT user_grammar_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_inventories user_inventories_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_inventories
    ADD CONSTRAINT user_inventories_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.shop_items(id) ON DELETE CASCADE;


--
-- Name: user_inventories user_inventories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_inventories
    ADD CONSTRAINT user_inventories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_kana_progress user_kana_progress_character_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_kana_progress
    ADD CONSTRAINT user_kana_progress_character_fkey FOREIGN KEY ("character") REFERENCES public.kana_characters("character") ON DELETE CASCADE;


--
-- Name: user_kana_progress user_kana_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_kana_progress
    ADD CONSTRAINT user_kana_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_language_enrollments user_language_enrollments_current_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_enrollments
    ADD CONSTRAINT user_language_enrollments_current_level_id_fkey FOREIGN KEY (current_level_id) REFERENCES public.proficiency_levels(id) ON DELETE SET NULL;


--
-- Name: user_language_enrollments user_language_enrollments_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_enrollments
    ADD CONSTRAINT user_language_enrollments_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- Name: user_language_enrollments user_language_enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_language_enrollments
    ADD CONSTRAINT user_language_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_lesson_progress user_lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT user_lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: user_lesson_progress user_lesson_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_lesson_progress
    ADD CONSTRAINT user_lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_monthly_badge_claims user_monthly_badge_claims_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_monthly_badge_claims
    ADD CONSTRAINT user_monthly_badge_claims_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_oauth_accounts user_oauth_accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_oauth_accounts
    ADD CONSTRAINT user_oauth_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_srs_reviews user_srs_reviews_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_srs_reviews
    ADD CONSTRAINT user_srs_reviews_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;


--
-- Name: user_srs_reviews user_srs_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_srs_reviews
    ADD CONSTRAINT user_srs_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
