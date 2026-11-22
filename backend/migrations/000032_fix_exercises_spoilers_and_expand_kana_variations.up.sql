BEGIN;

-- 1. Normalize the 20 speaking_repeat exercises that used {"exact_match": "..."} and content.phrase
UPDATE exercises
SET
  correct_answer = jsonb_build_object('expected_transcript', correct_answer->>'exact_match'),
  content = content || jsonb_build_object(
    'display_text', COALESCE(NULLIF(content->>'display_text', ''), NULLIF(content->>'phrase', ''), correct_answer->>'exact_match'),
    'audio_text',   COALESCE(NULLIF(content->>'audio_text', ''),   NULLIF(content->>'phrase', ''), correct_answer->>'exact_match')
  )
WHERE exercise_type = 'speaking_repeat'
  AND correct_answer ? 'exact_match';

-- 2. Fix unanswerable Unit 15 fill_blank ("made" vs "まで") & Unit 21 Kanji typo ("行って" vs "言って")
UPDATE exercises e
SET correct_answer = '{"selected": "まで"}'::jsonb
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-rute-transportasi-dan-sarana'
  AND e.order_index = 8
  AND e.correct_answer->>'selected' = 'made';

UPDATE exercises e
SET prompt = replace(e.prompt, 'もう一度 行って ください', 'もう一度 言って ください')
FROM lessons l
WHERE e.lesson_id = l.id
  AND l.slug = 'n5-permintaan-sopan-di-kantor'
  AND e.order_index = 11
  AND e.prompt LIKE '%もう一度 行って ください%';

-- 3. Remove exact Japanese answer spoilers from sentence_builder prompts while keeping meaning cue & Ujian prefix
UPDATE exercises e
SET prompt =
  COALESCE((regexp_match(e.prompt, '^(Ujian [^:]+:\s*)'))[1], '') ||
  CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(e.correct_answer) AS t(tok)
      WHERE char_length(trim(t.tok)) > 1
    )
    THEN 'Susun huruf menjadi kata "'
    ELSE 'Susun potongan kata menjadi kalimat "'
  END ||
  replace(
    trim(BOTH '"' FROM trim(COALESCE(
      NULLIF(trim(e.content->>'target_translation'), ''),
      NULLIF(trim((regexp_match(e.prompt, '\(([^()]+)\)'))[1]), ''),
      'arti berikut'
    ))),
    '"',
    ''''
  ) || '":'
WHERE e.exercise_type = 'sentence_builder'
  AND jsonb_typeof(e.correct_answer) = 'array'
  AND jsonb_array_length(e.correct_answer) > 0
  AND replace(e.prompt, ' ', '') LIKE '%' || replace(array_to_string(ARRAY(SELECT jsonb_array_elements_text(e.correct_answer)), ''), ' ', '') || '%';

-- 4. Expand kana_characters with 25 Dakuten/Handakuten + 33 Yoon for Hiragana and Katakana (116 rows total)
INSERT INTO kana_characters (
  character, script, romaji, row_group, row_order, col_order,
  mnemonic, example_word, example_reading, example_meaning
)
VALUES
  -- ======================== HIRAGANA DAKUTEN & HANDAKUTEN (25) ========================
  -- Row 12: G (が–ご)
  ('が', 'hiragana', 'ga', 'g', 12, 1, 'Huruf か (ka) ditambah 2 titik tenten kanan atas berubah menjadi bunyi tebal "GA".', 'がくせい', 'gakusei', 'pelajar / mahasiswa'),
  ('ぎ', 'hiragana', 'gi', 'g', 12, 2, 'Huruf き (ki) ditambah 2 titik tenten berubah menjadi "GI".', 'ぎんこう', 'ginkou', 'bank'),
  ('ぐ', 'hiragana', 'gu', 'g', 12, 3, 'Huruf く (ku) ditambah 2 titik tenten menjadi "GU".', 'ぐあい', 'guai', 'kondisi tubuh'),
  ('げ', 'hiragana', 'ge', 'g', 12, 4, 'Huruf け (ke) ditambah 2 titik tenten menjadi "GE".', 'げんき', 'genki', 'sehat / bersemangat'),
  ('ご', 'hiragana', 'go', 'g', 12, 5, 'Huruf こ (ko) ditambah 2 titik tenten menjadi "GO".', 'ごはん', 'gohan', 'nasi / makanan'),

  -- Row 13: Z / J (ざ–ぞ)
  ('ざ', 'hiragana', 'za', 'z', 13, 1, 'Huruf さ (sa) ditambah 2 titik tenten berubah menjadi "ZA".', 'ざっし', 'zasshi', 'majalah'),
  ('じ', 'hiragana', 'ji', 'z', 13, 2, 'Huruf し (shi) ditambah 2 titik tenten dibaca "JI" (paling sering dipakai).', 'じかん', 'jikan', 'waktu / jam'),
  ('ず', 'hiragana', 'zu', 'z', 13, 3, 'Huruf す (su) ditambah 2 titik tenten dibaca "ZU".', 'ちず', 'chizu', 'peta'),
  ('ぜ', 'hiragana', 'ze', 'z', 13, 4, 'Huruf せ (se) ditambah 2 titik tenten menjadi "ZE".', 'ぜんぜん', 'zenzen', 'sama sekali'),
  ('ぞ', 'hiragana', 'zo', 'z', 13, 5, 'Huruf そ (so) ditambah 2 titik tenten menjadi "ZO".', 'かぞく', 'kazoku', 'keluarga'),

  -- Row 14: D (だ–ど)
  ('だ', 'hiragana', 'da', 'd', 14, 1, 'Huruf た (ta) ditambah 2 titik tenten berubah menjadi "DA".', 'だいがく', 'daigaku', 'universitas'),
  ('ぢ', 'hiragana', 'ji (di)', 'd', 14, 2, 'Huruf ち (chi) + tenten dibaca "JI" (jarang dipakai, muncul di kata majemuk/ketik keyboard "di").', 'はなぢ', 'hanaji', 'mimisan'),
  ('づ', 'hiragana', 'zu (du)', 'd', 14, 3, 'Huruf つ (tsu) + tenten dibaca "ZU" (jarang dipakai, ketik keyboard "du").', 'つづく', 'tsuzuku', 'berlanjut'),
  ('で', 'hiragana', 'de', 'd', 14, 4, 'Huruf て (te) ditambah 2 titik tenten berubah menjadi "DE".', 'でんわ', 'denwa', 'telepon'),
  ('ど', 'hiragana', 'do', 'd', 14, 5, 'Huruf と (to) ditambah 2 titik tenten berubah menjadi "DO".', 'どこ', 'doko', 'di mana'),

  -- Row 15: B (ば–ぼ)
  ('ば', 'hiragana', 'ba', 'b', 15, 1, 'Huruf は (ha) ditambah 2 titik tenten berbunyi tebal "BA".', 'かばん', 'kaban', 'tas'),
  ('び', 'hiragana', 'bi', 'b', 15, 2, 'Huruf ひ (hi) ditambah 2 titik tenten menjadi "BI".', 'びょういん', 'byouin', 'rumah sakit'),
  ('ぶ', 'hiragana', 'bu', 'b', 15, 3, 'Huruf ふ (fu) ditambah 2 titik tenten menjadi "BU".', 'ぶたにく', 'butaniku', 'daging babi'),
  ('べ', 'hiragana', 'be', 'b', 15, 4, 'Huruf へ (he) ditambah 2 titik tenten menjadi "BE".', 'べんきょう', 'benkyou', 'belajar'),
  ('ぼ', 'hiragana', 'bo', 'b', 15, 5, 'Huruf ほ (ho) ditambah 2 titik tenten menjadi "BO".', 'ぼうし', 'boushi', 'topi'),

  -- Row 16: P (ぱ–ぽ)
  ('ぱ', 'hiragana', 'pa', 'p', 16, 1, 'Huruf は (ha) dengan lingkaran kecil (handakuten / maru) dibaca tegas "PA".', 'ぱん', 'pan', 'roti'),
  ('ぴ', 'hiragana', 'pi', 'p', 16, 2, 'Huruf ひ (hi) dengan lingkaran kecil maru menjadi "PI".', 'えんぴつ', 'enpitsu', 'pensil'),
  ('ぷ', 'hiragana', 'pu', 'p', 16, 3, 'Huruf ふ (fu) dengan lingkaran kecil maru menjadi "PU".', 'いっぷん', 'ippun', 'satu menit'),
  ('ぺ', 'hiragana', 'pe', 'p', 16, 4, 'Huruf へ (he) dengan lingkaran kecil maru menjadi "PE".', 'ぺこぺこ', 'pekopeko', 'sangat lapar'),
  ('ぽ', 'hiragana', 'po', 'p', 16, 5, 'Huruf ほ (ho) dengan lingkaran kecil maru menjadi "PO".', 'さんぽ', 'sanpo', 'jalan santai'),

  -- ======================== HIRAGANA YOON (33) ========================
  -- Row 17: KY
  ('きゃ', 'hiragana', 'kya', 'ky', 17, 1, 'Gabungan き (ki) + huruf kecil ゃ (ya) dilebur cepat menjadi satu suku kata "KYA".', 'おきゃく', 'okyaku', 'tamu / pelanggan'),
  ('きゅ', 'hiragana', 'kyu', 'ky', 17, 3, 'Gabungan き (ki) + huruf kecil ゅ (yu) dilebur cepat menjadi "KYU".', 'きゅう', 'kyuu', 'sembilan'),
  ('きょ', 'hiragana', 'kyo', 'ky', 17, 5, 'Gabungan き (ki) + huruf kecil ょ (yo) dilebur cepat menjadi "KYO".', 'きょう', 'kyou', 'hari ini'),

  -- Row 18: SH
  ('しゃ', 'hiragana', 'sha', 'sh', 18, 1, 'Gabungan し (shi) + huruf kecil ゃ (ya) dilebur menjadi "SHA".', 'かいしゃ', 'kaisha', 'perusahaan'),
  ('しゅ', 'hiragana', 'shu', 'sh', 18, 3, 'Gabungan し (shi) + huruf kecil ゅ (yu) dilebur menjadi "SHU".', 'しゅみ', 'shumi', 'hobi'),
  ('しょ', 'hiragana', 'sho', 'sh', 18, 5, 'Gabungan し (shi) + huruf kecil ょ (yo) dilebur menjadi "SHO".', 'じしょ', 'jisho', 'kamus'),

  -- Row 19: CH
  ('ちゃ', 'hiragana', 'cha', 'ch', 19, 1, 'Gabungan ち (chi) + huruf kecil ゃ (ya) dilebur menjadi "CHA".', 'おちゃ', 'ocha', 'teh hijau'),
  ('ちゅ', 'hiragana', 'chu', 'ch', 19, 3, 'Gabungan ち (chi) + huruf kecil ゅ (yu) dilebur menjadi "CHU".', 'ちゅうごく', 'chuugoku', 'Tiongkok'),
  ('ちょ', 'hiragana', 'cho', 'ch', 19, 5, 'Gabungan ち (chi) + huruf kecil ょ (yo) dilebur menjadi "CHO".', 'ちょっと', 'chotto', 'sebentar / sedikit'),

  -- Row 20: NY
  ('にゃ', 'hiragana', 'nya', 'ny', 20, 1, 'Gabungan に (ni) + huruf kecil ゃ (ya) dilebur menjadi "NYA".', 'にゃんこ', 'nyanko', 'kucing manis'),
  ('にゅ', 'hiragana', 'nyu', 'ny', 20, 3, 'Gabungan に (ni) + huruf kecil ゅ (yu) dilebur menjadi "NYU".', 'にゅういん', 'nyuuin', 'rawat inap'),
  ('にょ', 'hiragana', 'nyo', 'ny', 20, 5, 'Gabungan に (ni) + huruf kecil ょ (yo) dilebur menjadi "NYO".', 'にょうぼう', 'nyoubou', 'istri'),

  -- Row 21: HY
  ('ひゃ', 'hiragana', 'hya', 'hy', 21, 1, 'Gabungan ひ (hi) + huruf kecil ゃ (ya) dilebur menjadi "HYA".', 'ひゃく', 'hyaku', 'seratus'),
  ('ひゅ', 'hiragana', 'hyu', 'hy', 21, 3, 'Gabungan ひ (hi) + huruf kecil ゅ (yu) dilebur menjadi "HYU".', 'ひゅうが', 'hyuuga', 'sinar hangat'),
  ('ひょ', 'hiragana', 'hyo', 'hy', 21, 5, 'Gabungan ひ (hi) + huruf kecil ょ (yo) dilebur menjadi "HYO".', 'ひょう', 'hyou', 'tabel / daftar'),

  -- Row 22: MY
  ('みゃ', 'hiragana', 'mya', 'my', 22, 1, 'Gabungan み (mi) + huruf kecil ゃ (ya) dilebur menjadi "MYA".', 'みゃく', 'myaku', 'denyut nadi'),
  ('みゅ', 'hiragana', 'myu', 'my', 22, 3, 'Gabungan み (mi) + huruf kecil ゅ (yu) dilebur menjadi "MYU".', 'みゅうじっく', 'myuujikku', 'musik'),
  ('みょ', 'hiragana', 'myo', 'my', 22, 5, 'Gabungan み (mi) + huruf kecil ょ (yo) dilebur menjadi "MYO".', 'みょうじ', 'myouji', 'nama marga'),

  -- Row 23: RY
  ('りゃ', 'hiragana', 'rya', 'ry', 23, 1, 'Gabungan り (ri) + huruf kecil ゃ (ya) dilebur menjadi "RYA".', 'りゃくご', 'ryakugo', 'singkatan kata'),
  ('りゅ', 'hiragana', 'ryu', 'ry', 23, 3, 'Gabungan り (ri) + huruf kecil ゅ (yu) dilebur menjadi "RYU".', 'りゅうがく', 'ryuugaku', 'studi luar negeri'),
  ('りょ', 'hiragana', 'ryo', 'ry', 23, 5, 'Gabungan り (ri) + huruf kecil ょ (yo) dilebur menjadi "RYO".', 'りょこう', 'ryokou', 'wisata / perjalanan'),

  -- Row 24: GY
  ('ぎゃ', 'hiragana', 'gya', 'gy', 24, 1, 'Gabungan ぎ (gi) + huruf kecil ゃ (ya) dilebur menjadi "GYA".', 'ぎゃく', 'gyaku', 'kebalikan'),
  ('ぎゅ', 'hiragana', 'gyu', 'gy', 24, 3, 'Gabungan ぎ (gi) + huruf kecil ゅ (yu) dilebur menjadi "GYU".', 'ぎゅうにゅう', 'gyuunyuu', 'susu sapi'),
  ('ぎょ', 'hiragana', 'gyo', 'gy', 24, 5, 'Gabungan ぎ (gi) + huruf kecil ょ (yo) dilebur menjadi "GYO".', 'きんぎょ', 'kingyo', 'ikan mas koki'),

  -- Row 25: J
  ('じゃ', 'hiragana', 'ja', 'j', 25, 1, 'Gabungan じ (ji) + huruf kecil ゃ (ya) dilebur menjadi "JA".', 'じゃあね', 'jaa ne', 'sampai jumpa lagi'),
  ('じゅ', 'hiragana', 'ju', 'j', 25, 3, 'Gabungan じ (ji) + huruf kecil ゅ (yu) dilebur menjadi "JU".', 'じゅぎょう', 'jugyou', 'jam pelajaran'),
  ('じょ', 'hiragana', 'jo', 'j', 25, 5, 'Gabungan じ (ji) + huruf kecil ょ (yo) dilebur menjadi "JO".', 'じょうず', 'jouzu', 'mahir / pandai'),

  -- Row 26: BY
  ('びゃ', 'hiragana', 'bya', 'by', 26, 1, 'Gabungan び (bi) + huruf kecil ゃ (ya) dilebur menjadi "BYA".', 'さんびゃく', 'sanbyaku', 'tiga ratus'),
  ('びゅ', 'hiragana', 'byu', 'by', 26, 3, 'Gabungan び (bi) + huruf kecil ゅ (yu) dilebur menjadi "BYU".', 'ごびゅう', 'gobyuu', 'kekeliruan'),
  ('びょ', 'hiragana', 'byo', 'by', 26, 5, 'Gabungan び (bi) + huruf kecil ょ (yo) dilebur menjadi "BYO".', 'びょうき', 'byouki', 'sakit / penyakit'),

  -- Row 27: PY
  ('ぴゃ', 'hiragana', 'pya', 'py', 27, 1, 'Gabungan ぴ (pi) + huruf kecil ゃ (ya) dilebur menjadi "PYA".', 'ろっぴゃく', 'roppyaku', 'enam ratus'),
  ('ぴゅ', 'hiragana', 'pyu', 'py', 27, 3, 'Gabungan ぴ (pi) + huruf kecil ゅ (yu) dilebur menjadi "PYU".', 'ぴゅあ', 'pyua', 'murni'),
  ('ぴょ', 'hiragana', 'pyo', 'py', 27, 5, 'Gabungan ぴ (pi) + huruf kecil ょ (yo) dilebur menjadi "PYO".', 'はっぴょう', 'happyou', 'presentasi / pengumuman'),

  -- ======================== KATAKANA DAKUTEN & HANDAKUTEN (25) ========================
  -- Row 12: G (ガ–ゴ)
  ('ガ', 'katakana', 'ga', 'g', 12, 1, 'Katakana カ (ka) + 2 titik tenten berubah menjadi "GA".', 'ガイド', 'gaido', 'pemandu wisata'),
  ('ギ', 'katakana', 'gi', 'g', 12, 2, 'Katakana キ (ki) + 2 titik tenten menjadi "GI".', 'ギター', 'gitaa', 'gitar'),
  ('グ', 'katakana', 'gu', 'g', 12, 3, 'Katakana ク (ku) + 2 titik tenten menjadi "GU".', 'グラス', 'gurasu', 'gelas'),
  ('ゲ', 'katakana', 'ge', 'g', 12, 4, 'Katakana ケ (ke) + 2 titik tenten menjadi "GE".', 'ゲーム', 'geemu', 'permainan / gim'),
  ('ゴ', 'katakana', 'go', 'g', 12, 5, 'Katakana コ (ko) + 2 titik tenten menjadi "GO".', 'ゴミ', 'gomi', 'sampah'),

  -- Row 13: Z / J (ザ–ゾ)
  ('ザ', 'katakana', 'za', 'z', 13, 1, 'Katakana サ (sa) + 2 titik tenten berubah menjadi "ZA".', 'ピザ', 'piza', 'pizza'),
  ('ジ', 'katakana', 'ji', 'z', 13, 2, 'Katakana シ (shi) + 2 titik tenten menjadi "JI".', 'ジュース', 'juusu', 'jus buah'),
  ('ズ', 'katakana', 'zu', 'z', 13, 3, 'Katakana ス (su) + 2 titik tenten menjadi "ZU".', 'ズボン', 'zubon', 'celana panjang'),
  ('ゼ', 'katakana', 'ze', 'z', 13, 4, 'Katakana セ (se) + 2 titik tenten menjadi "ZE".', 'ゼロ', 'zero', 'angka nol'),
  ('ゾ', 'katakana', 'zo', 'z', 13, 5, 'Katakana ソ (so) + 2 titik tenten menjadi "ZO".', 'ゾーン', 'zoon', 'zona'),

  -- Row 14: D (ダ–ド)
  ('ダ', 'katakana', 'da', 'd', 14, 1, 'Katakana タ (ta) + 2 titik tenten menjadi "DA".', 'ダンス', 'dansu', 'tarian'),
  ('ヂ', 'katakana', 'ji (di)', 'd', 14, 2, 'Katakana チ (chi) + 2 titik tenten dibaca "JI" (jarang dipakai, ketik "di").', 'ヂャン', 'jan', 'bunyi letupan'),
  ('ヅ', 'katakana', 'zu (du)', 'd', 14, 3, 'Katakana ツ (tsu) + 2 titik tenten dibaca "ZU" (jarang dipakai, ketik "du").', 'オヅ', 'ozu', 'ejaan tradisional'),
  ('デ', 'katakana', 'de', 'd', 14, 4, 'Katakana テ (te) + 2 titik tenten menjadi "DE".', 'デパート', 'depaato', 'toserba'),
  ('ド', 'katakana', 'do', 'd', 14, 5, 'Katakana ト (to) + 2 titik tenten menjadi "DO".', 'ドア', 'doa', 'pintu'),

  -- Row 15: B (バ–ボ)
  ('バ', 'katakana', 'ba', 'b', 15, 1, 'Katakana ハ (ha) + 2 titik tenten berubah menjadi "BA".', 'バス', 'basu', 'bus'),
  ('ビ', 'katakana', 'bi', 'b', 15, 2, 'Katakana ヒ (hi) + 2 titik tenten menjadi "BI".', 'ビール', 'biiru', 'bir'),
  ('ブ', 'katakana', 'bu', 'b', 15, 3, 'Katakana フ (fu) + 2 titik tenten menjadi "BU".', 'ブログ', 'burogu', 'blog'),
  ('ベ', 'katakana', 'be', 'b', 15, 4, 'Katakana ヘ (he) + 2 titik tenten menjadi "BE".', 'ベッド', 'beddo', 'tempat tidur'),
  ('ボ', 'katakana', 'bo', 'b', 15, 5, 'Katakana ホ (ho) + 2 titik tenten menjadi "BO".', 'ボタン', 'botan', 'tombol / kancing'),

  -- Row 16: P (パ–ポ)
  ('パ', 'katakana', 'pa', 'p', 16, 1, 'Katakana ハ (ha) + lingkaran kecil maru dibaca tegas "PA".', 'パソコン', 'pasokon', 'komputer / laptop'),
  ('ピ', 'katakana', 'pi', 'p', 16, 2, 'Katakana ヒ (hi) + lingkaran kecil maru dibaca "PI".', 'ピンク', 'pinku', 'merah muda'),
  ('プ', 'katakana', 'pu', 'p', 16, 3, 'Katakana フ (fu) + lingkaran kecil maru dibaca "PU".', 'プレゼント', 'purezento', 'hadiah'),
  ('ペ', 'katakana', 'pe', 'p', 16, 4, 'Katakana ヘ (he) + lingkaran kecil maru dibaca "PE".', 'ペン', 'pen', 'pulpen'),
  ('ポ', 'katakana', 'po', 'p', 16, 5, 'Katakana ホ (ho) + lingkaran kecil maru dibaca "PO".', 'ポスト', 'posuto', 'kotak pos'),

  -- ======================== KATAKANA YOON (33) ========================
  -- Row 17: KY
  ('キャ', 'katakana', 'kya', 'ky', 17, 1, 'Gabungan キ (ki) + huruf kecil ャ (ya) menjadi "KYA".', 'キャンプ', 'kyanpu', 'berkemah'),
  ('キュ', 'katakana', 'kyu', 'ky', 17, 3, 'Gabungan キ (ki) + huruf kecil ュ (yu) menjadi "KYU".', 'バーベキュー', 'baabekyuu', 'barbeku'),
  ('キョ', 'katakana', 'kyo', 'ky', 17, 5, 'Gabungan キ (ki) + huruf kecil ョ (yo) menjadi "KYO".', 'キョリ', 'kyori', 'jarak serapan'),

  -- Row 18: SH
  ('シャ', 'katakana', 'sha', 'sh', 18, 1, 'Gabungan シ (shi) + huruf kecil ャ (ya) menjadi "SHA".', 'シャワー', 'shawaa', 'pancuran mandi'),
  ('シュ', 'katakana', 'shu', 'sh', 18, 3, 'Gabungan シ (shi) + huruf kecil ュ (yu) menjadi "SHU".', 'ジュース', 'juusu', 'jus'),
  ('ショ', 'katakana', 'sho', 'sh', 18, 5, 'Gabungan シ (shi) + huruf kecil ョ (yo) menjadi "SHO".', 'ショッピング', 'shoppingu', 'belanja'),

  -- Row 19: CH
  ('チャ', 'katakana', 'cha', 'ch', 19, 1, 'Gabungan チ (chi) + huruf kecil ャ (ya) menjadi "CHA".', 'チャンス', 'chansu', 'kesempatan'),
  ('チュ', 'katakana', 'chu', 'ch', 19, 3, 'Gabungan チ (chi) + huruf kecil ュ (yu) menjadi "CHU".', 'チューリップ', 'chuurippu', 'bunga tulip'),
  ('チョ', 'katakana', 'cho', 'ch', 19, 5, 'Gabungan チ (chi) + huruf kecil ョ (yo) menjadi "CHO".', 'チョコレート', 'chokoreeto', 'cokelat'),

  -- Row 20: NY
  ('ニャ', 'katakana', 'nya', 'ny', 20, 1, 'Gabungan ニ (ni) + huruf kecil ャ (ya) menjadi "NYA".', 'ニャンコ', 'nyanko', 'kucing'),
  ('ニュ', 'katakana', 'nyu', 'ny', 20, 3, 'Gabungan ニ (ni) + huruf kecil ュ (yu) menjadi "NYU".', 'ニュース', 'nyuusu', 'berita'),
  ('ニョ', 'katakana', 'nyo', 'ny', 20, 5, 'Gabungan ニ (ni) + huruf kecil ョ (yo) menjadi "NYO".', 'カミニョ', 'kaminyo', 'jalur serapan'),

  -- Row 21: HY
  ('ヒャ', 'katakana', 'hya', 'hy', 21, 1, 'Gabungan ヒ (hi) + huruf kecil ャ (ya) menjadi "HYA".', 'ヒャク', 'hyaku', 'seratus'),
  ('ヒュ', 'katakana', 'hyu', 'hy', 21, 3, 'Gabungan ヒ (hi) + huruf kecil ュ (yu) menjadi "HYU".', 'ヒューマン', 'hyuuman', 'manusia'),
  ('ヒョ', 'katakana', 'hyo', 'hy', 21, 5, 'Gabungan ヒ (hi) + huruf kecil ョ (yo) menjadi "HYO".', 'ヒョウ', 'hyou', 'macan tutul'),

  -- Row 22: MY
  ('ミャ', 'katakana', 'mya', 'my', 22, 1, 'Gabungan ミ (mi) + huruf kecil ャ (ya) menjadi "MYA".', 'ミャンマー', 'myanmaa', 'Myanmar'),
  ('ミュ', 'katakana', 'myu', 'my', 22, 3, 'Gabungan ミ (mi) + huruf kecil ュ (yu) menjadi "MYU".', 'ミュージアム', 'myuujiamu', 'museum'),
  ('ミョ', 'katakana', 'myo', 'my', 22, 5, 'Gabungan ミ (mi) + huruf kecil ョ (yo) menjadi "MYO".', 'ミョウジ', 'myouji', 'nama keluarga'),

  -- Row 23: RY
  ('リャ', 'katakana', 'rya', 'ry', 23, 1, 'Gabungan リ (ri) + huruf kecil ャ (ya) menjadi "RYA".', 'リャク', 'ryaku', 'ringkasan'),
  ('リュ', 'katakana', 'ryu', 'ry', 23, 3, 'Gabungan リ (ri) + huruf kecil ュ (yu) menjadi "RYU".', 'リュック', 'ryukku', 'tas ransel'),
  ('リョ', 'katakana', 'ryo', 'ry', 23, 5, 'Gabungan リ (ri) + huruf kecil ョ (yo) menjadi "RYO".', 'リョコウ', 'ryokou', 'perjalanan'),

  -- Row 24: GY
  ('ギャ', 'katakana', 'gya', 'gy', 24, 1, 'Gabungan ギ (gi) + huruf kecil ャ (ya) menjadi "GYA".', 'ギャラリー', 'gyararii', 'galeri'),
  ('ギュ', 'katakana', 'gyu', 'gy', 24, 3, 'Gabungan ギ (gi) + huruf kecil ュ (yu) menjadi "GYU".', 'フィギュア', 'figyua', 'figur / patung'),
  ('ギョ', 'katakana', 'gyo', 'gy', 24, 5, 'Gabungan ギ (gi) + huruf kecil ョ (yo) menjadi "GYO".', 'ギョウザ', 'gyouza', 'pangsit gyoza'),

  -- Row 25: J
  ('ジャ', 'katakana', 'ja', 'j', 25, 1, 'Gabungan ジ (ji) + huruf kecil ャ (ya) menjadi "JA".', 'ジャケット', 'jaketto', 'jaket'),
  ('ジュ', 'katakana', 'ju', 'j', 25, 3, 'Gabungan ジ (ji) + huruf kecil ュ (yu) menjadi "JU".', 'ジュース', 'juusu', 'jus'),
  ('ジョ', 'katakana', 'jo', 'j', 25, 5, 'Gabungan ジ (ji) + huruf kecil ョ (yo) menjadi "JO".', 'ジョギング', 'jogingu', 'lari santai'),

  -- Row 26: BY
  ('ビャ', 'katakana', 'bya', 'by', 26, 1, 'Gabungan ビ (bi) + huruf kecil ャ (ya) menjadi "BYA".', 'ビャク', 'byaku', 'ejaan serapan'),
  ('ビュ', 'katakana', 'byu', 'by', 26, 3, 'Gabungan ビ (bi) + huruf kecil ュ (yu) menjadi "BYU".', 'インタビュー', 'intabyuu', 'wawancara'),
  ('ビョ', 'katakana', 'byo', 'by', 26, 5, 'Gabungan ビ (bi) + huruf kecil ョ (yo) menjadi "BYO".', 'ビョウイン', 'byouin', 'rumah sakit'),

  -- Row 27: PY
  ('ピャ', 'katakana', 'pya', 'py', 27, 1, 'Gabungan ピ (pi) + huruf kecil ャ (ya) menjadi "PYA".', 'ピャオ', 'pyao', 'tiket serapan'),
  ('ピュ', 'katakana', 'pyu', 'py', 27, 3, 'Gabungan ピ (pi) + huruf kecil ュ (yu) menjadi "PYU".', 'コンピューター', 'konpyuutaa', 'komputer'),
  ('ピョ', 'katakana', 'pyo', 'py', 27, 5, 'Gabungan ピ (pi) + huruf kecil ョ (yo) menjadi "PYO".', 'ピョン', 'pyon', 'melompat')
ON CONFLICT (character) DO NOTHING;

COMMIT;
