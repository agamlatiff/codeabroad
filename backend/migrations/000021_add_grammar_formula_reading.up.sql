-- ============================================================================
-- Migration: 000021_add_grammar_formula_reading.up.sql
-- Description: Add human-friendly Romaji readings (`formula_reading`) to all 56
--              JLPT N5-N1 grammar formulas (handling wa/e/o particle exceptions).
-- ============================================================================

ALTER TABLE grammar_points
    ADD COLUMN IF NOT EXISTS formula_reading TEXT NOT NULL DEFAULT '';

UPDATE grammar_points AS gp
SET formula_reading = v.formula_reading
FROM (VALUES
    ('GP-JA-N5-001', '[Topik / Subjek] + wa + [Predikat] + desu'),
    ('GP-JA-N5-002', '[Predikat] + dewa arimasen deshita'),
    ('GP-JA-N5-003', '[Kata Benda 1] + no + [Kata Benda 2]'),
    ('GP-JA-N5-004', '[Objek] + o + [Verba Transitif]'),
    ('GP-JA-N5-005', '[Tempat] + ni / e + ikimasu / kimasu'),
    ('GP-JA-N5-006', '[Akar Kata Kerja] + masu / masen'),
    ('GP-JA-N5-007', '[Sarana/Alat] + de / [Tempat] + de + [Verba]'),
    ('GP-JA-N5-008', '[Angka Jam / Hari] + ni + [Verba]'),
    ('GP-JA-N5-009', '[Tempat] ni [Benda/Orang] ga arimasu / imasu'),
    ('GP-JA-N5-010', '[Benda A] to [Benda B] / [Benda A] ya [Benda B] nado'),
    ('GP-JA-N5-011', '[Adjektiva-I (buang -i)] + kunai desu / katta desu'),
    ('GP-JA-N5-012', '[A] wa [B] yori [Adjektiva] desu'),
    ('GP-JA-N5-013', '[Akar Verba] + masen ka / mashou'),
    ('GP-JA-N5-014', '[Verba Bentuk-TE] + kudasai'),
    ('GP-JA-N5-015', '[Verba Bentuk-TE] + imasu'),
    ('GP-JA-N5-016', '[Akar Verba] + tai desu / [Tempat] e [Akar Verba] ni ikimasu'),
    ('GP-JA-N4-001', '[Verba Bentuk-TE] + kudasai'),
    ('GP-JA-N4-002', '[Verba Bentuk-TE] + imasu'),
    ('GP-JA-N4-003', '[Verba Bentuk-Nai (buang -i)] + kereba narimasen'),
    ('GP-JA-N4-004', '[Akar Verba Potensial] + masu'),
    ('GP-JA-N4-005', '[Verba Bentuk-TE] + agemasu / kuremasu'),
    ('GP-JA-N4-006', '[Verba Bentuk-TA / Bentuk-NAI] + hou ga ii desu'),
    ('GP-JA-N4-007', '[Bentuk Biasa] + node, [Akibat]'),
    ('GP-JA-N4-008', '[Verba/Sifat Bentuk Lampau Biasa] + ra, [Hasil]'),
    ('GP-JA-N4-009', '[Verba Bentuk-TE] + okimasu'),
    ('GP-JA-N4-010', 'o + [Stem] + shimasu'),
    ('GP-JA-N3-001', '[Kamus Verba / Bentuk-NAI] + you ni suru'),
    ('GP-JA-N3-002', '[Kamus Verba] + koto ni naru'),
    ('GP-JA-N3-003', '[Nomina + no / Bentuk Biasa] + okage de'),
    ('GP-JA-N3-004', '[Nomina + no / Bentuk Biasa] + sei de'),
    ('GP-JA-N3-005', '[Nomina] + ni taishite'),
    ('GP-JA-N3-006', '[Keadaan Sekarang] + uchi ni'),
    ('GP-JA-N3-007', '[Bentuk Biasa] + hazu desu'),
    ('GP-JA-N3-008', '[Verba Pasif] + masu'),
    ('GP-JA-N3-009', '[Verba Bentuk-TA] + bakari desu'),
    ('GP-JA-N3-010', '[Nomina] + ni yotte'),
    ('GP-JA-N2-001', '[Nomina / Kamus Verba] + ni atatte'),
    ('GP-JA-N2-002', '[Nomina / Kamus Verba] + ni tomonatte'),
    ('GP-JA-N2-003', '[Nomina] + ni kagirazu'),
    ('GP-JA-N2-004', '[Kamus Verba] + wake ni wa ikanai'),
    ('GP-JA-N2-005', '[Bentuk-NAI] (tanpa nai) + zaru o enai'),
    ('GP-JA-N2-006', '[Nomina / Bentuk Biasa] + ni mo kakawarazu'),
    ('GP-JA-N2-007', '[Bentuk-TA / Nomina + no] + ue de'),
    ('GP-JA-N2-008', '[Stem Verba] + tsutsu aru'),
    ('GP-JA-N2-009', '[Stem Verba] + kanenai'),
    ('GP-JA-N2-010', 'o + [Stem] + ni naru / Verba Khusus'),
    ('GP-JA-N1-001', '[Nomina / Kamus Verba] + ni itatte'),
    ('GP-JA-N1-002', '[Nomina] + o yoginaku sareru'),
    ('GP-JA-N1-003', '[Nomina / Bentuk Biasa] + to wa ie'),
    ('GP-JA-N1-004', '[Nomina] + o motte'),
    ('GP-JA-N1-005', '[Akar Kata Sifat-Na] + kiwamarinai'),
    ('GP-JA-N1-006', '[Nomina / Bentuk Biasa] + nari ni'),
    ('GP-JA-N1-007', '[Bentuk-NAI] (tanpa nai) + zu ni wa okanai'),
    ('GP-JA-N1-008', '[Nomina / Verba Kamus] + to mo naru to'),
    ('GP-JA-N1-009', '[Nomina + no] + ikan ni yorazu / ikan ni kakawarazu'),
    ('GP-JA-N1-010', '[Nomina / Verba Kamus] + ni taru')
) AS v(code, formula_reading)
WHERE gp.code = v.code;
