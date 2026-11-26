DELETE FROM units WHERE level_id IN (SELECT pl.id FROM proficiency_levels pl JOIN languages l ON l.id = pl.language_id WHERE l.code = 'ja' AND pl.code = 'N4');
