-- Rollback CEFR A1-C2 American English (en-us) Grammar Points (60 rows)
DELETE FROM grammar_points
WHERE id BETWEEN 'e2000001-0000-4000-8000-000000000001'::uuid
             AND 'e2000001-0000-4000-8000-000000000060'::uuid;
