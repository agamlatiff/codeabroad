BEGIN;

-- ============================================================================
-- 1. Restore prior GP-JA-N4-001 & GP-JA-N4-002 rows
-- ============================================================================
UPDATE grammar_points
SET category = 'sentence_pattern',
    title = 'Bentuk Permohonan ~Te Kudasai',
    formula = '[Verba Bentuk-Te] + ください',
    formula_reading = '[Verba Bentuk-TE] + kudasai',
    explanation = 'Digunakan untuk meminta atau menginstruksikan seseorang melakukan sesuatu secara sopan dan jelas dalam situasi sehari-hari dan tempat kerja.',
    examples = '[
      {"jp": "しりょうを おくって ください。", "reading": "Shiryou o okutte kudasai.", "id": "Tolong kirimkan dokumennya."},
      {"jp": "もういちど いって ください。", "reading": "Mou ichido itte kudasai.", "id": "Tolong katakan sekali lagi."}
    ]'::jsonb,
    learning_guide = '{
      "analogy": "Bentuk-TE + ください sama seperti ungkapan sopan ''Tolong ... ya''. Di level N4, pemakaiannya melebar dari sekadar instruksi kelas hingga permohonan halus dengan penjelas alasan.",
      "when_to_use": [
        "Meminta rekan kerja memeriksa dokumen atau mengirim email",
        "Meminta bantuan saat tersesat, sakit, atau belanja",
        "Menyambung dua instruksi berurutan (isi formulir dulu, lalu tandatangan)"
      ],
      "formula_parts": [
        {"role": "verb", "text": "Verba Bentuk-TE", "label": "Bentuk -て / -で"},
        {"role": "ending", "text": "ください", "label": "Tolong lakukan"}
      ],
      "steps": [
        "Konjugasikan kata kerja ke Bentuk-TE (misal: 見せます → 見せて, 待ちます → 待って).",
        "Tambahkan ください untuk meminta secara sopan.",
        "Kalau meminta ''tolong jangan...'', gunakan Bentuk-NAI + でください (jangan ~te)."
      ],
      "breakdowns": [
        {
          "tokens": [
            {"jp": "パスポート", "role": "object", "meaning": "paspor", "reading": "pasupooto"},
            {"jp": "を", "role": "particle", "meaning": "(objek)", "reading": "o"},
            {"jp": "みせて", "role": "verb", "meaning": "tunjukkan (TE)", "reading": "misete"},
            {"jp": "ください", "role": "ending", "meaning": "tolong", "reading": "kudasai"}
          ],
          "translation": "Tolong tunjukkan paspor Anda."
        },
        {
          "tokens": [
            {"jp": "すこし", "role": "time", "meaning": "sebentar", "reading": "sukoshi"},
            {"jp": "まって", "role": "verb", "meaning": "tunggu (TE)", "reading": "matte"},
            {"jp": "ください", "role": "ending", "meaning": "tolong", "reading": "kudasai"}
          ],
          "translation": "Tolong tunggu sebentar ya."
        },
        {
          "tokens": [
            {"jp": "あした", "role": "time", "meaning": "besok", "reading": "ashita"},
            {"jp": "まで", "role": "particle", "meaning": "sampai", "reading": "made"},
            {"jp": "に", "role": "particle", "meaning": "paling lambat", "reading": "ni"},
            {"jp": "レポート", "role": "object", "meaning": "laporan", "reading": "repooto"},
            {"jp": "を", "role": "particle", "meaning": "(objek)", "reading": "o"},
            {"jp": "だして", "role": "verb", "meaning": "kumpulkan (TE)", "reading": "dashite"},
            {"jp": "ください", "role": "ending", "meaning": "tolong", "reading": "kudasai"}
          ],
          "translation": "Tolong kumpulkan laporannya paling lambat besok."
        }
      ],
      "forms": [
        {"label": "Tolong Lakukan", "jp": "すわってください", "reading": "suwatte kudasai", "id": "tolong duduk"},
        {"label": "Tolong Jangan", "jp": "すわらないでください", "reading": "suwaranaide kudasai", "id": "tolong jangan duduk"},
        {"label": "Permohonan Lembut", "jp": "てつだってくださいませんか", "reading": "tetsudatte kudasaimasen ka", "id": "maukah membantu saya?"}
      ],
      "mistakes": [
        {"wrong": "しゃしんを とらないて ください", "right": "しゃしんを とらないで ください", "why": "Bila meminta ''jangan melakukan'', setelah Bentuk-NAI memakai で (naide), bukan て."},
        {"wrong": "おちゃを もち ください", "right": "おちゃを もって ください", "why": "Setelah ください untuk kata kerja wajib Bentuk-TE, tidak bisa akar masu langsung."}
      ],
      "quiz": [
        {"question": "Bagaimana mengatakan ''Tolong tutup jendela'' (しめます = grup 2)?", "options": ["しめて ください", "しめって ください", "しまて ください", "しめんで ください"], "answer": 0, "why": "しめます (Grup 2) diubah ke Bentuk-TE dengan mengganti ます menjadi て → しめて."},
        {"question": "Cara berkata ''Tolong tunggu di kamar ini'' (まちます = menunggu) adalah:", "options": ["まいて ください", "まちて ください", "まって ください", "まんで ください"], "answer": 2, "why": "ち sebelum ます (machi-masu) pada Grup 1 berubah menjadi って → まって."},
        {"question": "Kalau ingin meminta seseorang ''Tolong JANGAN merokok'' (すいます -> すわない), pola yang tepat adalah:", "options": ["すって くださいません", "すわないで ください", "すいまて ください", "すわて ください"], "answer": 1, "why": "Permohonan larangan menggunakan Bentuk-NAI + でください."}
      ]
    }'::jsonb
WHERE code = 'GP-JA-N4-001';

UPDATE grammar_points
SET category = 'conjugation',
    title = 'Bentuk Progresif ~Te Iru',
    formula = '[Verba Bentuk-Te] + います',
    formula_reading = '[Verba Bentuk-TE] + imasu',
    explanation = 'Menyatakan aksi yang sedang berlangsung saat ini atau kondisi stabil yang diakibatkan oleh aksi sebelumnya.',
    examples = '[
      {"jp": "あめが ずっと ふっています。", "reading": "Ame ga zutto futte imasu.", "id": "Hujannya turun terus sejak tadi."},
      {"jp": "あの 店の まえに ひとが ならんでいます。", "reading": "Ano mise no mae ni hito ga narande imasu.", "id": "Di depan toko itu orang-orang sedang mengantre."}
    ]'::jsonb,
    learning_guide = '{
      "analogy": "～ている bukan cuma ''sedang melakukan sesuatu'', di level N4 pola ini juga menyatakan ''hasil aksi yang bekasnya masih terlihat sampai sekarang'' (misal: jendela sedang terbuka, lampu sedang menyala, sudah menikah).",
      "when_to_use": [
        "Menyatakan aktivitas yang tengah berlangsung detik ini",
        "Menyatakan kondisi hasil sebuah perubahan (pintu terkunci, baju sedang dipakai, mobil terparkir)",
        "Menjelaskan kebiasaan rutin atau pekerjaan tetap"
      ],
      "formula_parts": [
        {"role": "verb", "text": "Verba Bentuk-TE", "label": "Aksi / Perubahan"},
        {"role": "ending", "text": "います", "label": "Sedang / Kondisinya begitu"}
      ],
      "steps": [
        "Kenali jenis verba: kalau kata kerjanya berupa aksi (makan, baca) → artinya ''sedang melakukan''.",
        "Kalau kata kerjanya berupa perubahan sekejap (pintu membuka/menutup, lampu menyala, menikah, mati) → artinya ''kondisinya sekarang sudah begitu''.",
        "Untuk membedakan status tanpa pelaku, gunakan verba intransitif (aku/shimaru) dengan が: まどが あいています (jendela dalam keadaan terbuka)."
      ],
      "breakdowns": [
        {
          "tokens": [
            {"jp": "まど", "role": "subject", "meaning": "jendela", "reading": "mado"},
            {"jp": "が", "role": "particle", "meaning": "(subjek)", "reading": "ga"},
            {"jp": "あいて", "role": "verb", "meaning": "terbuka (TE)", "reading": "aite"},
            {"jp": "います", "role": "ending", "meaning": "keadaannya sedang", "reading": "imasu"}
          ],
          "translation": "Jendelanya dalam keadaan terbuka."
        },
        {
          "tokens": [
            {"jp": "きむらさん", "role": "topic", "meaning": "Sdr. Kimura", "reading": "Kimura-san"},
            {"jp": "は", "role": "particle", "meaning": "(topik)", "reading": "wa"},
            {"jp": "あかい", "role": "adjective", "meaning": "merah", "reading": "akai"},
            {"jp": "シャツ", "role": "object", "meaning": "kemeja", "reading": "shatsu"},
            {"jp": "を", "role": "particle", "meaning": "(objek)", "reading": "o"},
            {"jp": "きて", "role": "verb", "meaning": "memakai (TE)", "reading": "kite"},
            {"jp": "います", "role": "ending", "meaning": "sedang / mengenakan", "reading": "imasu"}
          ],
          "translation": "Kimura sedang mengenakan kemeja merah."
        },
        {
          "tokens": [
            {"jp": "わたし", "role": "topic", "meaning": "saya", "reading": "watashi"},
            {"jp": "は", "role": "particle", "meaning": "(topik)", "reading": "wa"},
            {"jp": "ぎんこう", "role": "place", "meaning": "bank", "reading": "ginkou"},
            {"jp": "で", "role": "particle", "meaning": "di", "reading": "de"},
            {"jp": "はたらいて", "role": "verb", "meaning": "bekerja (TE)", "reading": "hataraite"},
            {"jp": "います", "role": "ending", "meaning": "(profesi tetap)", "reading": "imasu"}
          ],
          "translation": "Saya bekerja di bank."
        }
      ],
      "forms": [
        {"label": "Keadaan Sekarang", "jp": "でんきがついています", "reading": "denki ga tsuite imasu", "id": "lampunya sedang menyala"},
        {"label": "Lampau (Tadi Sedang)", "jp": "さっきねていました", "reading": "sakki nete imashita", "id": "tadi dia sedang tidur"},
        {"label": "Belum / Tidak", "jp": "まだきていません", "reading": "mada kite imasen", "id": "belum datang"}
      ],
      "mistakes": [
        {"wrong": "めがねを かけます (saat menunjuk org berkacamata)", "right": "めがねを かけています", "why": "Menjelaskan pakaian, topi, atau kacamata yang sedang menempel di tubuh seseorang wajib memakai ～ています."},
        {"wrong": "まだ たべません (artinya belum makan)", "right": "まだ たべていません", "why": "Untuk menyatakan ''belum selesai / masih belum dilakukan hingga sekarang'', gunakan まだ ～ていません."}
      ],
      "quiz": [
        {"question": "Arti paling tepat dari kalimat ''いすが こわれています'' (こわれる = rusak) adalah:", "options": ["Kursi itu akan segera rusak", "Kursi itu sedang rusak (dalam keadaan rusak)", "Tolong perbaiki kursi itu", "Seseorang sedang merusak kursi"], "answer": 1, "why": "こわれる adalah verba perubahan keadaan, sehingga ～ています menyatakan hasilnya masih berlangsung (keadaan rusak)."},
        {"question": "Bagaimana mengatakan ''Busnya belum datang'' hingga detik ini?", "options": ["バスは まだ きません", "バスは まだ きませんでした", "バスは まだ きていません", "バスは もう きていません"], "answer": 2, "why": "Konsep ''belum ... hingga saat ini'' selalu menggunakan pola まだ + Bentuk-TE + いません."},
        {"question": "Saat menggambarkan teman yang berpenampilan memakai kacamata:", "options": ["めがねを かけています", "めがねを かけます", "めがねが あります", "めがねを きます"], "answer": 0, "why": "Verba mengenakan kacamata adalah かけます, dan kondisi memakainya memakai ～ています."}
      ]
    }'::jsonb
WHERE code = 'GP-JA-N4-002';

-- ============================================================================
-- 2. Restore original grammar_point_id links on the 2 placement exercises
-- ============================================================================
UPDATE exercises
SET grammar_point_id = (SELECT id FROM grammar_points WHERE code = 'GP-JA-N4-001')
WHERE id = 'b21e1078-4a3f-4d1a-b3fd-6c47ac6b39e2'::uuid;

UPDATE exercises
SET grammar_point_id = (SELECT id FROM grammar_points WHERE code = 'GP-JA-N4-002')
WHERE id = 'ef86b744-b2d6-4d15-b863-aaaa2b270258'::uuid;

-- ============================================================================
-- 3. Restore 000037 user_activity_logs_activity_type_check constraint
-- ============================================================================
DELETE FROM user_activity_logs WHERE activity_type = 'daily_chest_claimed';

ALTER TABLE user_activity_logs
    DROP CONSTRAINT IF EXISTS user_activity_logs_activity_type_check;

ALTER TABLE user_activity_logs
    ADD CONSTRAINT user_activity_logs_activity_type_check CHECK (activity_type::text = ANY (ARRAY[
        'daily_login',
        'lesson_completed',
        'srs_review_completed',
        'readiness_exam_completed',
        'daily_golden_chest_claim',
        'quest_completed',
        'daily_vocab_quest_claim',
        'onboarding_completed',
        'badge_unlocked',
        'streak_freeze_consumed',
        'leaderboard_reward_claimed',
        'xp_booster_activated',
        'monthly_badge_claimed'
    ]::text[]));

COMMIT;
