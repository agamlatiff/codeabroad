-- ============================================================================
-- Migration: 000006_seed_gamification_and_rewards.down.sql
-- Description: Reversible rollback for master badges and shop catalog items
-- Version: CodeAbroad v3.0
-- ============================================================================

DELETE FROM shop_items 
WHERE id IN ('streak-freeze', 'xp-booster', 'cv-review', 'mock-interview');

DELETE FROM badge_definitions 
WHERE id IN ('first_step', 'streak_7', 'streak_30', 'srs_veteran', 'n5_mastery', 'multilingual_explorer');

