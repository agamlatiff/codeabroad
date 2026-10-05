-- Migration 000003: Add timeline and language level to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS target_timeline VARCHAR(50) DEFAULT '1_year',
ADD COLUMN IF NOT EXISTS language_level VARCHAR(50) DEFAULT 'none';
