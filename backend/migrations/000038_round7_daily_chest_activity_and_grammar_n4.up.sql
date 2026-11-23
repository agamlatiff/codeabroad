BEGIN;

-- ============================================================================
-- 1. Allow 'daily_chest_claimed' in user_activity_logs_activity_type_check
-- ============================================================================
ALTER TABLE user_activity_logs
    DROP CONSTRAINT IF EXISTS user_activity_logs_activity_type_check;

ALTER TABLE user_activity_logs
    ADD CONSTRAINT user_activity_logs_activity_type_check CHECK (activity_type::text = ANY (ARRAY[
        'daily_login',
        'lesson_completed',
        'srs_review_completed',
        'readiness_exam_completed',
        'daily_golden_chest_claim',
        'daily_chest_claimed',
        'quest_completed',
        'daily_vocab_quest_claim',
        'onboarding_completed',
        'badge_unlocked',
        'streak_freeze_consumed',
        'leaderboard_reward_claimed',
        'xp_booster_activated',
        'monthly_badge_claimed'
    ]::text[]));

-- ============================================================================
-- 2. Re-point 2 N5 placement diagnostic exercises from N4-001/002 to N5-014/015
-- ============================================================================
UPDATE exercises
SET grammar_point_id = (SELECT id FROM grammar_points WHERE code = 'GP-JA-N5-014')
WHERE id = 'b21e1078-4a3f-4d1a-b3fd-6c47ac6b39e2'::uuid;

UPDATE exercises
SET grammar_point_id = (SELECT id FROM grammar_points WHERE code = 'GP-JA-N5-015')
WHERE id = 'ef86b744-b2d6-4d15-b863-aaaa2b270258'::uuid;

-- ============================================================================
-- 3. Upgrade GP-JA-N4-001 & GP-JA-N4-002 to distinct JLPT N4 grammar patterns
-- ============================================================================
UPDATE grammar_points
SET category = 'sentence_pattern',
    title = 'Permohonan Sangat Sopan (～ていただけませんか)',
    formula = '[Verba Bentuk-Te] + いただけませんか',
    formula_reading = '[Verba-te] + itadakemasen ka',
    explanation = 'Digunakan untuk meminta tolong kepada atasan, guru, klien, atau orang yang belum akrab dengan tingkat kesopanan jauh lebih tinggi daripada ～てください.',
    examples = '[
      {"jp": "もう いちど せつめいして いただけませんか。", "reading": "Mou ichido setsumei shite itadakemasen ka.", "id": "Bersediakah Anda menjelaskannya sekali lagi?"},
      {"jp": "すみませんが、しゃしんを とって いただけませんか。", "reading": "Sumimasen ga, shashin o totte itadakemasen ka.", "id": "Maaf, bisakah Anda tolong mengambilkan foto?"},
      {"jp": "この しりょうを チェックして いただけませんか。", "reading": "Kono shiryou o chekku shite itadakemasen ka.", "id": "Apakah Anda berkenan memeriksa dokumen ini?"}
    ]'::jsonb,
    learning_guide = '{
      "analogy": "Jika ～てください itu \"Tolong ... ya\" (kadang terasa seperti instruksi langsung), maka ～ていただけませんか setara dengan \"Bersediakah / Maukah Bapak/Ibu berkenan membantu ...?\" yang sangat santun di lingkungan kerja JLPT N4.",
      "when_to_use": [
        "Meminta tolong kepada atasan, guru, atau klien di lingkungan kerja",
        "Meminta bantuan orang asing atau orang yang lebih tua secara sangat hormat",
        "Meminta penjelasan ulang, koreksi dokumen, atau izin dengan nada merendah"
      ],
      "formula_parts": [
        {"role": "verb", "text": "Verba Bentuk-TE", "label": "Tindakan yang diminta (-て / -で)"},
        {"role": "ending", "text": "いただけませんか", "label": "Bersediakah Anda? (sangat sopan)"}
      ],
      "steps": [
        "Awali dengan kata pembuka sopan seperti すみませんが (Maaf mengganggu, ...).",
        "Ubah kata kerja inti ke Bentuk-TE (misal: おしえます → おしえて, みます → みて).",
        "Tambahkan いただけませんか di akhir kalimat dengan intonasi bertanya yang lembut."
      ],
      "breakdowns": [
        {
          "tokens": [
            {"jp": "もういちど", "role": "time", "meaning": "sekali lagi", "reading": "mou ichido"},
            {"jp": "せつめいして", "role": "verb", "meaning": "jelaskan (TE)", "reading": "setsumei shite"},
            {"jp": "いただけませんか", "role": "ending", "meaning": "bersediakah Anda", "reading": "itadakemasen ka"}
          ],
          "translation": "Bersediakah Anda menjelaskannya sekali lagi?"
        },
        {
          "tokens": [
            {"jp": "すみませんが、", "role": "connector", "meaning": "maaf mengganggu,", "reading": "sumimasen ga,"},
            {"jp": "しゃしん", "role": "object", "meaning": "foto", "reading": "shashin"},
            {"jp": "を", "role": "particle", "meaning": "(objek)", "reading": "o"},
            {"jp": "とって", "role": "verb", "meaning": "ambilkan (TE)", "reading": "totte"},
            {"jp": "いただけませんか", "role": "ending", "meaning": "maukah Anda", "reading": "itadakemasen ka"}
          ],
          "translation": "Maaf, maukah Anda tolong mengambilkan foto?"
        },
        {
          "tokens": [
            {"jp": "この しりょう", "role": "object", "meaning": "dokumen ini", "reading": "kono shiryou"},
            {"jp": "を", "role": "particle", "meaning": "(objek)", "reading": "o"},
            {"jp": "チェックして", "role": "verb", "meaning": "periksa (TE)", "reading": "chekku shite"},
            {"jp": "いただけませんか", "role": "ending", "meaning": "berkenankah Anda", "reading": "itadakemasen ka"}
          ],
          "translation": "Apakah Anda berkenan memeriksa dokumen ini?"
        }
      ],
      "forms": [
        {"label": "Sangat Sopan (Umum)", "jp": "おしえて いただけませんか", "reading": "oshiete itadakemasen ka", "id": "Bersediakah Anda mengajarkannya?"},
        {"label": "Sopan Halus", "jp": "おしえて いただけますか", "reading": "oshiete itadakemasu ka", "id": "Bisakah Anda mengajarkannya?"},
        {"label": "Sopan Standar (N5)", "jp": "おしえて ください", "reading": "oshiete kudasai", "id": "Tolong ajarkan."}
      ],
      "mistakes": [
        {"wrong": "せんせい、ペンを かして ください", "right": "せんせい、すみませんが、ペンを かして いただけませんか", "why": "Kepada atasan atau guru, ～てください terdengar seperti instruksi langsung. Pakai ～ていただけませんか agar lebih menghormati."},
        {"wrong": "てつだいます いただけませんか", "right": "てつだって いただけませんか", "why": "Sebelum いただけませんか kata kerja wajib berbentuk TE (てつだって), tidak boleh bentuk -ます."}
      ],
      "quiz": [
        {
          "question": "Saat meminta manajer memeriksa laporan dengan sangat sopan (みます → Bentuk-TE: みて), kalimat mana yang tepat?",
          "options": ["レポートを みて いただけませんか。", "レポートを みます いただけませんか。", "レポートを みた いただけませんか。", "レポートを みない いただけませんか。"],
          "answer": 0,
          "why": "Pola permohonan sangat sopan memakai [Verba Bentuk-TE] + いただけませんか, jadi みます menjadi みて + いただけませんか."
        },
        {
          "question": "Bagaimana berkata \"Bersediakah Anda menunggu sebentar?\" kepada tamu dengan sangat santun? (まちます = menunggu)",
          "options": ["まちて いただけませんか。", "まって いただけませんか。", "まいて いただけませんか。", "まちます いただけませんか。"],
          "answer": 1,
          "why": "Kata kerja Grup 1 berakhiran ち sebelum ます (machimasu) berubah menjadi って di Bentuk-TE → まって いただけませんか."
        },
        {
          "question": "Manakah ungkapan yang paling sopan saat meminta senior mengajari cara memakai mesin kantor?",
          "options": ["つかいかたを おしえて！", "つかいかたを おしえる。", "つかいかたを おしえて いただけませんか。", "つかいかたを おしえませんでしたか。"],
          "answer": 2,
          "why": "Kepada senior atau atasan di tempat kerja Jepang, [Verba Bentuk-TE] + いただけませんか adalah standar permohonan santun N4."
        }
      ]
    }'::jsonb
WHERE code = 'GP-JA-N4-001';

UPDATE grammar_points
SET category = 'sentence_pattern',
    title = 'Keadaan Hasil Aksi Disengaja (～てあります)',
    formula = '[Nomina] が [Verba Transitif Bentuk-Te] + あります',
    formula_reading = '[Nomina] ga [Verba-te] + arimasu',
    explanation = 'Menyatakan suatu benda kini berada dalam keadaan tertentu karena sebelumnya seseorang sengaja melakukan aksi tersebut (memakai verba transitif dengan penanda subjek が).',
    examples = '[
      {"jp": "まどが あけて あります。", "reading": "Mado ga akete arimasu.", "id": "Jendelanya sudah dibuka (sengaja dibuka seseorang sebelumnya)."},
      {"jp": "つくえの うえに メモが おいて あります。", "reading": "Tsukue no ue ni memo ga oite arimasu.", "id": "Di atas meja sudah diletakkan memo."},
      {"jp": "パーティーの りょうりは もう つくって あります。", "reading": "Paatii no ryouri wa mou tsukutte arimasu.", "id": "Masakan untuk pesta sudah selesai disiapkan."}
    ]'::jsonb,
    learning_guide = '{
      "analogy": "Bedakan antara \"jendela terbuka\" begitu saja (～ている) dan \"jendela sengaja dibuka sebelumnya agar sejuk\" (～てある). Di level N4, pola ini dipakai untuk menekankan persiapan atau hasil tindakan manusia.",
      "when_to_use": [
        "Menjelaskan kondisi benda yang sengaja diatur (jadwal tertulis di papan, pintu dibuka)",
        "Melaporkan persiapan yang telah tuntas dikerjakan sebelum acara atau rapat",
        "Menyorot benda hasil aksi dengan partikel が tanpa perlu menyebut siapa pelakunya"
      ],
      "formula_parts": [
        {"role": "subject", "text": "Nomina (Benda)", "label": "Benda yang tampak keadaannya"},
        {"role": "particle", "text": "が / は", "label": "Penanda subjek keadaan"},
        {"role": "verb", "text": "Verba Transitif Bentuk-TE", "label": "Aksi yang disengaja (-て / -で)"},
        {"role": "ending", "text": "あります", "label": "Sudah dalam keadaan begitu"}
      ],
      "steps": [
        "Pilih verba transitif (他動詞, verba yang biasa berpasangan dengan を) seperti あけます, おきます, かきます.",
        "Ubah partikel を menjadi が (atau は jika sudah menjadi topik) karena kalimat fokus pada kondisi benda.",
        "Ubah verba transitif ke Bentuk-TE lalu sambungkan dengan あります."
      ],
      "breakdowns": [
        {
          "tokens": [
            {"jp": "まど", "role": "subject", "meaning": "jendela", "reading": "mado"},
            {"jp": "が", "role": "particle", "meaning": "(subjek)", "reading": "ga"},
            {"jp": "あけて", "role": "verb", "meaning": "dibuka (TE)", "reading": "akete"},
            {"jp": "あります", "role": "ending", "meaning": "kondisinya sudah begitu", "reading": "arimasu"}
          ],
          "translation": "Jendelanya sudah dibuka (sengaja dibuka sebelumnya)."
        },
        {
          "tokens": [
            {"jp": "つくえの うえ", "role": "place", "meaning": "atas meja", "reading": "tsukue no ue"},
            {"jp": "に", "role": "particle", "meaning": "di", "reading": "ni"},
            {"jp": "メモ", "role": "subject", "meaning": "memo", "reading": "memo"},
            {"jp": "が", "role": "particle", "meaning": "(subjek)", "reading": "ga"},
            {"jp": "おいて", "role": "verb", "meaning": "diletakkan (TE)", "reading": "oite"},
            {"jp": "あります", "role": "ending", "meaning": "sudah tersedia di sana", "reading": "arimasu"}
          ],
          "translation": "Di atas meja sudah diletakkan memo."
        },
        {
          "tokens": [
            {"jp": "パーティーの りょうり", "role": "topic", "meaning": "masakan pesta", "reading": "paatii no ryouri"},
            {"jp": "は", "role": "particle", "meaning": "(topik)", "reading": "wa"},
            {"jp": "もう", "role": "time", "meaning": "sudah", "reading": "mou"},
            {"jp": "つくって", "role": "verb", "meaning": "dibuat (TE)", "reading": "tsukutte"},
            {"jp": "あります", "role": "ending", "meaning": "sudah beres disiapkan", "reading": "arimasu"}
          ],
          "translation": "Masakan untuk pesta sudah selesai disiapkan."
        }
      ],
      "forms": [
        {"label": "Sudah Disiapkan", "jp": "エアコンが つけて あります", "reading": "eakon ga tsukete arimasu", "id": "AC sengaja sudah dinyalakan."},
        {"label": "Sudah Selesai (もう)", "jp": "にもつは もう おくって あります", "reading": "nimotsu wa mou okutte arimasu", "id": "Barangnya sudah dikirimkan."},
        {"label": "Belum Disiapkan", "jp": "まだ かいて ありません", "reading": "mada kaite arimasen", "id": "Belum dituliskan."}
      ],
      "mistakes": [
        {"wrong": "かべに カレンダーが かかって あります", "right": "かべに カレンダーが かけて あります", "why": "～てあります wajib memakai verba transitif (かけます = menggantungkan), sedangkan intransitif (かかります) memakai ～ています."},
        {"wrong": "つくえに ほんを おいて あります", "right": "つくえに ほんが おいて あります", "why": "Pada pola ～てあります, benda tidak ditandai を melainkan が (atau は) karena yang disorot adalah kondisi benda tersebut."}
      ],
      "quiz": [
        {
          "question": "Partikel mana yang tepat untuk pola ～てあります berikut? 「こくばんに なまえ ___ かいて あります。」",
          "options": ["を", "が", "へ", "から"],
          "answer": 1,
          "why": "Walaupun かきます adalah verba transitif, pada pola ～てあります subjek keadaan ditandai dengan が (atau は), bukan を."
        },
        {
          "question": "Pilih kalimat yang benar untuk \"Pintu sengaja sudah dibuka sebelumnya\" (あけます = membuka [transitif]):",
          "options": ["ドアが あけて あります。", "ドアが あいて あります。", "ドアを あいて あります。", "ドアが あけて います。"],
          "answer": 0,
          "why": "Pola hasil aksi disengaja menggabungkan verba transitif Bentuk-TE (あけて) + あります dengan subjek bertanda が."
        },
        {
          "question": "Arti yang paling tepat dari 「ひこうきの チケットは もう よやくして あります。」 adalah:",
          "options": ["Saya akan segera memesan tiket pesawat.", "Tiket pesawatnya sudah dipesan sebelumnya (sudah siap).", "Tolong pesankan tiket pesawat sekarang.", "Tiket pesawatnya tidak jadi dipesan."],
          "answer": 1,
          "why": "もう + [Verba Transitif Bentuk-TE] + あります berarti persiapannya (pemesanan tiket) sudah tuntas dan siap digunakan."
        }
      ]
    }'::jsonb
WHERE code = 'GP-JA-N4-002';

COMMIT;
