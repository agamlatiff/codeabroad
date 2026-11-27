-- Rollback American English (en-us) Flashcard Decks & Cards (cascades to flashcard_cards)
DELETE FROM flashcard_decks WHERE language_code = 'en-us' AND jlpt_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
