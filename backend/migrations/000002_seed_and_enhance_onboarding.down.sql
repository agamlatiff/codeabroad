DELETE FROM countries WHERE code IN ('JP', 'DE', 'SG');
DELETE FROM career_paths WHERE slug IN ('backend', 'frontend', 'fullstack', 'devops');

ALTER TABLE users DROP COLUMN IF EXISTS primary_stack;
ALTER TABLE career_paths DROP COLUMN IF EXISTS stacks;
ALTER TABLE countries DROP COLUMN IF EXISTS badge;
ALTER TABLE countries DROP COLUMN IF EXISTS is_active;
