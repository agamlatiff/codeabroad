-- ============================================================================
-- Migration: 000005_seed_expand_jlpt_n5_curriculum_and_mock_exam.down.sql
-- Description: Reversible rollback for expanded JLPT N5 exercises and mock exam
-- Version: CodeAbroad v3.0
-- ============================================================================

-- Delete Mock Exam questions in Unit 2 Lesson 1
DELETE FROM exercises 
WHERE lesson_id = 'b0000001-0000-0000-0000-000000000003'::uuid;

-- Delete expanded exercises in Unit 1 Lesson 1 (order 3 & 4)
DELETE FROM exercises 
WHERE lesson_id = 'b0000001-0000-0000-0000-000000000001'::uuid 
  AND order_index IN (3, 4);

-- Delete expanded exercises in Unit 1 Lesson 2 (order 2, 3 & 4)
DELETE FROM exercises 
WHERE lesson_id = 'b0000001-0000-0000-0000-000000000002'::uuid 
  AND order_index IN (2, 3, 4);

