-- ============================================================================
-- Migration: 000011_update_shop_items_v3.down.sql
-- Description: Revert shop_items coaching copy
-- ============================================================================

UPDATE shop_items
SET subtitle = 'Audit portofolio GitHub dan resume teknis langsung oleh software engineer diaspora Tokyo.'
WHERE id = 'cv-review';

UPDATE shop_items
SET subtitle = 'Simulasi 1-on-1 live technical interview standar Tokyo berbahasa Jepang/Inggris via Discord.'
WHERE id = 'mock-interview';
