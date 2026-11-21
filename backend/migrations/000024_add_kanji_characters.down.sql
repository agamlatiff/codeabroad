-- ============================================================================
-- Migration: 000024_add_kanji_characters.down.sql
-- Description: Revert JLPT N5 Kanji characters and restore hiragana/katakana constraint
-- ============================================================================

BEGIN;

DELETE FROM user_kana_progress
WHERE character IN (
    SELECT character FROM kana_characters WHERE script = 'kanji'
);

DELETE FROM kana_characters
WHERE script = 'kanji';

ALTER TABLE kana_characters
    DROP CONSTRAINT IF EXISTS kana_characters_script_check;

ALTER TABLE kana_characters
    ADD CONSTRAINT kana_characters_script_check
    CHECK (script IN ('hiragana', 'katakana'));

ALTER TABLE kana_characters
    ALTER COLUMN romaji TYPE VARCHAR(16);

COMMIT;
