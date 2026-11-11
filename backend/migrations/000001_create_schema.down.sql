-- ============================================================================
-- Migration: 000001_create_schema.down.sql
-- Description: Reversible teardown for CodeAbroad v3.0 Master Schema
-- Version: 3.0
-- Database: PostgreSQL 16 (pgcrypto)
-- ============================================================================

DROP TABLE IF EXISTS readiness_exam_attempts CASCADE;
DROP TABLE IF EXISTS user_srs_reviews CASCADE;
DROP TABLE IF EXISTS user_exercise_attempts CASCADE;
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_language_enrollments CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS grammar_points CASCADE;
DROP TABLE IF EXISTS proficiency_levels CASCADE;
DROP TABLE IF EXISTS languages CASCADE;

DROP TABLE IF EXISTS user_activity_logs CASCADE;
DROP TABLE IF EXISTS user_daily_chest_claims CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS user_inventories CASCADE;
DROP TABLE IF EXISTS badge_definitions CASCADE;
DROP TABLE IF EXISTS shop_items CASCADE;
DROP TABLE IF EXISTS user_gamification CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
