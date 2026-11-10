-- ============================================================================
-- Migration: 000002_seed_languages_and_levels.down.sql
-- Description: Reversible rollback for seeded language tracks and levels
-- Version: CodeAbroad v3.0
-- ============================================================================

DELETE FROM languages 
WHERE code IN ('ja', 'en-gb', 'en-us', 'de', 'zh', 'fr');

