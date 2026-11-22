BEGIN;

-- ============================================================================
-- 1. Gamification schema extensions (XP Booster expiry + Monthly Badge claims)
-- ============================================================================
ALTER TABLE user_gamification
  ADD COLUMN IF NOT EXISTS xp_booster_expires_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS user_monthly_badge_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month_key VARCHAR(7) NOT NULL,
  badge_key VARCHAR(64) NOT NULL,
  completed_count INT NOT NULL DEFAULT 0,
  xp_awarded INT NOT NULL DEFAULT 150,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, month_key)
);

CREATE INDEX IF NOT EXISTS idx_user_monthly_badge_claims_user
  ON user_monthly_badge_claims (user_id, month_key);

-- ============================================================================
-- 2. Finding #1: Convert Kana flashcard readings to Modified Hepburn Romaji
--    and add Romaji readings to Huruf Kanji cards
-- ============================================================================
CREATE OR REPLACE FUNCTION pg_temp.kana_lookup(tok TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE tok
    -- 2-character Hiragana Yoon & extended digrams
    WHEN 'きゃ' THEN 'kya' WHEN 'きゅ' THEN 'kyu' WHEN 'きょ' THEN 'kyo'
    WHEN 'しゃ' THEN 'sha' WHEN 'しゅ' THEN 'shu' WHEN 'しょ' THEN 'sho'
    WHEN 'ちゃ' THEN 'cha' WHEN 'ちゅ' THEN 'chu' WHEN 'ちょ' THEN 'cho'
    WHEN 'にゃ' THEN 'nya' WHEN 'にゅ' THEN 'nyu' WHEN 'にょ' THEN 'nyo'
    WHEN 'ひゃ' THEN 'hya' WHEN 'ひゅ' THEN 'hyu' WHEN 'ひょ' THEN 'hyo'
    WHEN 'みゃ' THEN 'mya' WHEN 'みゅ' THEN 'myu' WHEN 'みょ' THEN 'myo'
    WHEN 'りゃ' THEN 'rya' WHEN 'りゅ' THEN 'ryu' WHEN 'りょ' THEN 'ryo'
    WHEN 'ぎゃ' THEN 'gya' WHEN 'ぎゅ' THEN 'gyu' WHEN 'ぎょ' THEN 'gyo'
    WHEN 'じゃ' THEN 'ja'  WHEN 'じゅ' THEN 'ju'  WHEN 'じょ' THEN 'jo'
    WHEN 'ぢゃ' THEN 'ja'  WHEN 'ぢゅ' THEN 'ju'  WHEN 'ぢょ' THEN 'jo'
    WHEN 'びゃ' THEN 'bya' WHEN 'びゅ' THEN 'byu' WHEN 'びょ' THEN 'byo'
    WHEN 'ぴゃ' THEN 'pya' WHEN 'ぴゅ' THEN 'pyu' WHEN 'ぴょ' THEN 'pyo'
    WHEN 'てぃ' THEN 'ti'  WHEN 'でぃ' THEN 'di'
    WHEN 'とぅ' THEN 'tu'  WHEN 'どぅ' THEN 'du'
    WHEN 'てゅ' THEN 'tyu' WHEN 'でゅ' THEN 'dyu'
    WHEN 'ふぁ' THEN 'fa'  WHEN 'ふぃ' THEN 'fi'  WHEN 'ふぇ' THEN 'fe' WHEN 'ふぉ' THEN 'fo'
    WHEN 'うぃ' THEN 'wi'  WHEN 'うぇ' THEN 'we'  WHEN 'うぉ' THEN 'wo'
    WHEN 'しぇ' THEN 'she' WHEN 'じぇ' THEN 'je'  WHEN 'ちぇ' THEN 'che'

    -- 2-character Katakana Yoon & extended digrams
    WHEN 'キャ' THEN 'kya' WHEN 'キュ' THEN 'kyu' WHEN 'キョ' THEN 'kyo'
    WHEN 'シャ' THEN 'sha' WHEN 'シュ' THEN 'shu' WHEN 'ショ' THEN 'sho'
    WHEN 'チャ' THEN 'cha' WHEN 'チュ' THEN 'chu' WHEN 'チョ' THEN 'cho'
    WHEN 'ニャ' THEN 'nya' WHEN 'ニュ' THEN 'nyu' WHEN 'ニョ' THEN 'nyo'
    WHEN 'ヒャ' THEN 'hya' WHEN 'ヒュ' THEN 'hyu' WHEN 'ヒョ' THEN 'hyo'
    WHEN 'ミャ' THEN 'mya' WHEN 'ミュ' THEN 'myu' WHEN 'ミョ' THEN 'myo'
    WHEN 'リャ' THEN 'rya' WHEN 'リュ' THEN 'ryu' WHEN 'リョ' THEN 'ryo'
    WHEN 'ギャ' THEN 'gya' WHEN 'ギュ' THEN 'gyu' WHEN 'ギョ' THEN 'gyo'
    WHEN 'ジャ' THEN 'ja'  WHEN 'ジュ' THEN 'ju'  WHEN 'ジョ' THEN 'jo'
    WHEN 'ヂャ' THEN 'ja'  WHEN 'ヂュ' THEN 'ju'  WHEN 'ヂョ' THEN 'jo'
    WHEN 'ビャ' THEN 'bya' WHEN 'ビュ' THEN 'byu' WHEN 'ビョ' THEN 'byo'
    WHEN 'ピャ' THEN 'pya' WHEN 'ピュ' THEN 'pyu' WHEN 'ピョ' THEN 'pyo'
    WHEN 'ティ' THEN 'ti'  WHEN 'ディ' THEN 'di'
    WHEN 'トゥ' THEN 'tu'  WHEN 'ドゥ' THEN 'du'
    WHEN 'テュ' THEN 'tyu' WHEN 'デュ' THEN 'dyu'
    WHEN 'ファ' THEN 'fa'  WHEN 'フィ' THEN 'fi'  WHEN 'フェ' THEN 'fe' WHEN 'フォ' THEN 'fo'
    WHEN 'ヴァ' THEN 'va'  WHEN 'ヴィ' THEN 'vi'  WHEN 'ヴェ' THEN 've' WHEN 'ヴォ' THEN 'vo'
    WHEN 'ウィ' THEN 'wi'  WHEN 'ウェ' THEN 'we'  WHEN 'ウォ' THEN 'wo'
    WHEN 'シェ' THEN 'she' WHEN 'ジェ' THEN 'je'  WHEN 'チェ' THEN 'che'
    WHEN 'ツァ' THEN 'tsa' WHEN 'ツィ' THEN 'tsi' WHEN 'ツェ' THEN 'tse' WHEN 'ツォ' THEN 'tso'
    WHEN 'クァ' THEN 'kwa'

    -- Single Hiragana
    WHEN 'あ' THEN 'a'   WHEN 'い' THEN 'i'   WHEN 'う' THEN 'u'   WHEN 'え' THEN 'e'  WHEN 'お' THEN 'o'
    WHEN 'か' THEN 'ka'  WHEN 'き' THEN 'ki'  WHEN 'く' THEN 'ku'  WHEN 'け' THEN 'ke' WHEN 'こ' THEN 'ko'
    WHEN 'が' THEN 'ga'  WHEN 'ぎ' THEN 'gi'  WHEN 'ぐ' THEN 'gu'  WHEN 'げ' THEN 'ge' WHEN 'ご' THEN 'go'
    WHEN 'さ' THEN 'sa'  WHEN 'し' THEN 'shi' WHEN 'す' THEN 'su'  WHEN 'せ' THEN 'se' WHEN 'そ' THEN 'so'
    WHEN 'ざ' THEN 'za'  WHEN 'じ' THEN 'ji'  WHEN 'ず' THEN 'zu'  WHEN 'ぜ' THEN 'ze' WHEN 'ぞ' THEN 'zo'
    WHEN 'た' THEN 'ta'  WHEN 'ち' THEN 'chi' WHEN 'つ' THEN 'tsu' WHEN 'て' THEN 'te' WHEN 'と' THEN 'to'
    WHEN 'だ' THEN 'da'  WHEN 'ぢ' THEN 'ji'  WHEN 'づ' THEN 'zu'  WHEN 'で' THEN 'de' WHEN 'ど' THEN 'do'
    WHEN 'な' THEN 'na'  WHEN 'に' THEN 'ni'  WHEN 'ぬ' THEN 'nu'  WHEN 'ね' THEN 'ne' WHEN 'の' THEN 'no'
    WHEN 'は' THEN 'ha'  WHEN 'ひ' THEN 'hi'  WHEN 'ふ' THEN 'fu'  WHEN 'へ' THEN 'he' WHEN 'ほ' THEN 'ho'
    WHEN 'ば' THEN 'ba'  WHEN 'び' THEN 'bi'  WHEN 'ぶ' THEN 'bu'  WHEN 'べ' THEN 'be' WHEN 'ぼ' THEN 'bo'
    WHEN 'ぱ' THEN 'pa'  WHEN 'ぴ' THEN 'pi'  WHEN 'ぷ' THEN 'pu'  WHEN 'ぺ' THEN 'pe' WHEN 'ぽ' THEN 'po'
    WHEN 'ま' THEN 'ma'  WHEN 'み' THEN 'mi'  WHEN 'む' THEN 'mu'  WHEN 'め' THEN 'me' WHEN 'も' THEN 'mo'
    WHEN 'や' THEN 'ya'  WHEN 'ゆ' THEN 'yu'  WHEN 'よ' THEN 'yo'
    WHEN 'ら' THEN 'ra'  WHEN 'り' THEN 'ri'  WHEN 'る' THEN 'ru'  WHEN 'れ' THEN 're' WHEN 'ろ' THEN 'ro'
    WHEN 'わ' THEN 'wa'  WHEN 'を' THEN 'o'   WHEN 'ゐ' THEN 'wi'  WHEN 'ゑ' THEN 'we'
    WHEN 'ゔ' THEN 'vu'
    WHEN 'ぁ' THEN 'a'   WHEN 'ぃ' THEN 'i'   WHEN 'ぅ' THEN 'u'   WHEN 'ぇ' THEN 'e'  WHEN 'ぉ' THEN 'o'
    WHEN 'ゃ' THEN 'ya'  WHEN 'ゅ' THEN 'yu'  WHEN 'ょ' THEN 'yo'  WHEN 'ゎ' THEN 'wa'

    -- Single Katakana
    WHEN 'ア' THEN 'a'   WHEN 'イ' THEN 'i'   WHEN 'ウ' THEN 'u'   WHEN 'エ' THEN 'e'  WHEN 'オ' THEN 'o'
    WHEN 'カ' THEN 'ka'  WHEN 'キ' THEN 'ki'  WHEN 'ク' THEN 'ku'  WHEN 'ケ' THEN 'ke' WHEN 'コ' THEN 'ko'
    WHEN 'ガ' THEN 'ga'  WHEN 'ギ' THEN 'gi'  WHEN 'グ' THEN 'gu'  WHEN 'ゲ' THEN 'ge' WHEN 'ゴ' THEN 'go'
    WHEN 'サ' THEN 'sa'  WHEN 'シ' THEN 'shi' WHEN 'ス' THEN 'su'  WHEN 'セ' THEN 'se' WHEN 'ソ' THEN 'so'
    WHEN 'ザ' THEN 'za'  WHEN 'ジ' THEN 'ji'  WHEN 'ズ' THEN 'zu'  WHEN 'ゼ' THEN 'ze' WHEN 'ゾ' THEN 'zo'
    WHEN 'タ' THEN 'ta'  WHEN 'チ' THEN 'chi' WHEN 'ツ' THEN 'tsu' WHEN 'テ' THEN 'te' WHEN 'ト' THEN 'to'
    WHEN 'ダ' THEN 'da'  WHEN 'ヂ' THEN 'ji'  WHEN 'ヅ' THEN 'zu'  WHEN 'デ' THEN 'de' WHEN 'ド' THEN 'do'
    WHEN 'ナ' THEN 'na'  WHEN 'ニ' THEN 'ni'  WHEN 'ヌ' THEN 'nu'  WHEN 'ネ' THEN 'ne' WHEN 'ノ' THEN 'no'
    WHEN 'ハ' THEN 'ha'  WHEN 'ヒ' THEN 'hi'  WHEN 'フ' THEN 'fu'  WHEN 'ヘ' THEN 'he' WHEN 'ホ' THEN 'ho'
    WHEN 'バ' THEN 'ba'  WHEN 'ビ' THEN 'bi'  WHEN 'ブ' THEN 'bu'  WHEN 'ベ' THEN 'be' WHEN 'ボ' THEN 'bo'
    WHEN 'パ' THEN 'pa'  WHEN 'ピ' THEN 'pi'  WHEN 'プ' THEN 'pu'  WHEN 'ペ' THEN 'pe' WHEN 'ポ' THEN 'po'
    WHEN 'マ' THEN 'ma'  WHEN 'ミ' THEN 'mi'  WHEN 'ム' THEN 'mu'  WHEN 'メ' THEN 'me' WHEN 'モ' THEN 'mo'
    WHEN 'ヤ' THEN 'ya'  WHEN 'ユ' THEN 'yu'  WHEN 'ヨ' THEN 'yo'
    WHEN 'ラ' THEN 'ra'  WHEN 'リ' THEN 'ri'  WHEN 'ル' THEN 'ru'  WHEN 'レ' THEN 're' WHEN 'ロ' THEN 'ro'
    WHEN 'ワ' THEN 'wa'  WHEN 'ヲ' THEN 'o'   WHEN 'ヰ' THEN 'wi'  WHEN 'ヱ' THEN 'we'
    WHEN 'ヴ' THEN 'vu'
    WHEN 'ァ' THEN 'a'   WHEN 'ィ' THEN 'i'   WHEN 'ゥ' THEN 'u'   WHEN 'ェ' THEN 'e'  WHEN 'ォ' THEN 'o'
    WHEN 'ャ' THEN 'ya'  WHEN 'ュ' THEN 'yu'  WHEN 'ョ' THEN 'yo'  WHEN 'ヮ' THEN 'wa'
    ELSE NULL
  END;
$$;

CREATE OR REPLACE FUNCTION pg_temp.kana_to_romaji(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  s TEXT := COALESCE(input_text, '');
  n INT := char_length(s);
  i INT := 1;
  c TEXT;
  c2 TEXT;
  r1 TEXT;
  r2 TEXT;
  r_next TEXT;
  last_ch TEXT;
  out_text TEXT := '';
BEGIN
  WHILE i <= n LOOP
    c := substr(s, i, 1);

    IF c IN ('っ', 'ッ') THEN
      r_next := NULL;
      IF i + 1 <= n THEN
        IF i + 2 <= n THEN
          r_next := pg_temp.kana_lookup(substr(s, i + 1, 2));
        END IF;
        IF r_next IS NULL THEN
          r_next := pg_temp.kana_lookup(substr(s, i + 1, 1));
        END IF;
      END IF;
      IF r_next IS NOT NULL THEN
        IF left(r_next, 2) = 'ch' THEN
          out_text := out_text || 't';
        ELSIF left(r_next, 1) ~ '^[bcdfghjklmnpqrstvwxyz]$' THEN
          out_text := out_text || left(r_next, 1);
        END IF;
      END IF;
      i := i + 1;

    ELSIF c IN ('ん', 'ン') THEN
      r_next := NULL;
      IF i + 1 <= n THEN
        IF i + 2 <= n THEN
          r_next := pg_temp.kana_lookup(substr(s, i + 1, 2));
        END IF;
        IF r_next IS NULL THEN
          r_next := pg_temp.kana_lookup(substr(s, i + 1, 1));
        END IF;
      END IF;
      IF r_next IS NOT NULL AND left(r_next, 1) IN ('a', 'i', 'u', 'e', 'o', 'y') THEN
        out_text := out_text || 'n''';
      ELSE
        out_text := out_text || 'n';
      END IF;
      i := i + 1;

    ELSIF c = 'ー' THEN
      IF char_length(out_text) > 0 THEN
        last_ch := right(out_text, 1);
        IF last_ch IN ('a', 'e', 'i', 'o', 'u') THEN
          out_text := out_text || last_ch;
        END IF;
      END IF;
      i := i + 1;

    ELSE
      r2 := NULL;
      IF i + 1 <= n THEN
        c2 := substr(s, i, 2);
        r2 := pg_temp.kana_lookup(c2);
      END IF;

      IF r2 IS NOT NULL THEN
        out_text := out_text || r2;
        i := i + 2;
      ELSE
        r1 := pg_temp.kana_lookup(c);
        IF r1 IS NOT NULL THEN
          out_text := out_text || r1;
        ELSE
          out_text := out_text || c;
        END IF;
        i := i + 1;
      END IF;
    END IF;
  END LOOP;

  RETURN out_text;
END;
$$;

-- Convert all non-character vocabulary flashcards whose reading is still in Kana
UPDATE flashcard_cards
SET reading = trim(replace(pg_temp.kana_to_romaji(reading), '・', ' · '))
WHERE LOWER(part_of_speech) NOT LIKE '%huruf%'
  AND reading ~ '[ぁ-んァ-ンー]';

-- Enrich Huruf Kanji cards with Romaji reading alongside Kun/On Kana
UPDATE flashcard_cards
SET reading = CASE
  WHEN position('•' IN reading) > 0 THEN
    trim(pg_temp.kana_to_romaji(trim(split_part(reading, '•', 1)))) || ' • ' || trim(reading)
  WHEN reading ~ '[一-龯]' THEN
    trim(reading) || ' • ' || trim(replace(pg_temp.kana_to_romaji(trim(split_part(reading, '/', 1))), '・', ' · '))
  ELSE
    trim(reading) || ' • ' || trim(replace(pg_temp.kana_to_romaji(reading), '・', ' · '))
  END
WHERE LOWER(part_of_speech) = 'huruf kanji'
  AND reading ~ '[ぁ-んァ-ンー]';

-- ============================================================================
-- 3. Finding #6: Fix 76 sentence_builder Japanese prompt leaks,
--    3 contradictory prompts, and 2 single-token checkpoint exercises
-- ============================================================================
UPDATE exercises
SET content = content || '{"target_translation": "1.000 Yen"}'::jsonb
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u9-kosakata-harga-dan-mata-uang')
  AND order_index = 3;

UPDATE exercises
SET prompt = CASE
  WHEN prompt ~ '^(Ujian|Simulasi Akhir)' THEN
    regexp_replace(prompt, '^((?:Ujian|Simulasi Akhir)[^:]*:).*', '\1')
    || ' Susun kalimat bahasa Jepang untuk "' || trim(content->>'target_translation') || '":'
  ELSE
    'Susun kalimat bahasa Jepang untuk "' || trim(content->>'target_translation') || '":'
END
WHERE exercise_type = 'sentence_builder'
  AND prompt ~ '[ぁ-んァ-ン一-龯]{3,}'
  AND COALESCE(trim(content->>'target_translation'), '') <> '';

UPDATE exercises
SET
  correct_answer = '["てつだい", "ましょう", "か"]'::jsonb,
  content = '{"romaji": "Tetsudaimashou ka", "tokens": ["てつだい", "ましょう", "か", "ません"], "target_translation": "Bolehkah saya bantu?"}'::jsonb
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u14-checkpoint')
  AND order_index = 6;

UPDATE exercises
SET
  correct_answer = '["お", "大事", "に"]'::jsonb,
  content = '{"romaji": "Odaiji ni", "tokens": ["お", "大事", "に", "で"], "target_translation": "Lekas sembuh"}'::jsonb
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u24-checkpoint')
  AND order_index = 9;

-- ============================================================================
-- 4. Finding #7: Fix 5 remaining fill_blank spoiler / ambiguous exercises
-- ============================================================================
UPDATE exercises
SET content = content || '{"sentence_template": "Partikel penanda [blank] langsung"}'::jsonb
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u4-deret-r-w-n-tuntas-46')
  AND order_index = 4;

UPDATE exercises
SET content = (content - 'translation') || '{"sentence_template": "にほんご が [blank] すき です。(paling suka)"}'::jsonb
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-u20-kata-sifat-na-dan-komparasi')
  AND order_index = 8;

UPDATE exercises
SET prompt = 'Review Total Aksara: lengkapi kalimat berikut dengan Kanji untuk "sekolah":'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit30-review-aksara-kanji')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Review Bentuk-NAI + Kanji Tubuh: pilih Kanji yang berarti "tangan" untuk melengkapi kalimat berikut:'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-unit24-review-kanji-tubuh')
  AND order_index = 1;

UPDATE exercises
SET prompt = 'Pada kata 病院 (byouin = rumah sakit), 病 berarti sakit. Apa makna Kanji 院?'
WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'n5-tubuh-dan-keluhan-sakit')
  AND order_index = 4;

-- ============================================================================
-- 5. Finding #8: Replace legacy "CodeAbroad" branding in badge_definitions
-- ============================================================================
UPDATE badge_definitions
SET description = REPLACE(description, 'CodeAbroad', 'Merantalk')
WHERE description LIKE '%CodeAbroad%';

COMMIT;
