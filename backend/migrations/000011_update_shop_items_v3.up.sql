-- ============================================================================
-- Migration: 000011_update_shop_items_v3.up.sql
-- Description: Align shop_items coaching copy with CodeAbroad v3.0 Language Mastery
-- ============================================================================

UPDATE shop_items
SET subtitle = 'Audit CV, Rirekisho/Lebenslauf, dan kesiapan berkas kerja global oleh mentor berpengalaman.'
WHERE id = 'cv-review';

UPDATE shop_items
SET subtitle = 'Simulasi 1-on-1 live interview & Keigo standar perusahaan global berbahasa Jepang/Inggris via Discord.'
WHERE id = 'mock-interview';
