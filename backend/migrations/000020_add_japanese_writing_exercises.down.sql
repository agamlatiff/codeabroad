-- Rollback Migration 000020: Remove seeded writing_trace & free_typing exercises and restore original CHECK constraint.
BEGIN;

DELETE FROM exercises WHERE id::text LIKE 'd2000001-0000-4000-8000-%';

ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_exercise_type_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_exercise_type_check
  CHECK (exercise_type IN ('sentence_builder', 'fill_blank', 'listening_choice', 'speaking_repeat', 'dialogue_roleplay'));

COMMIT;
