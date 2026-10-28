-- Rollback all chapters and quests for cs_fundamental
DELETE FROM quests WHERE chapter_id IN (
    SELECT c.id FROM chapters c
    JOIN modules m ON c.module_id = m.id
    JOIN tech_stacks ts ON m.tech_stack_id = ts.id
    WHERE ts.slug = 'cs_fundamental'
);

DELETE FROM chapters WHERE module_id IN (
    SELECT m.id FROM modules m
    JOIN tech_stacks ts ON m.tech_stack_id = ts.id
    WHERE ts.slug = 'cs_fundamental'
);
