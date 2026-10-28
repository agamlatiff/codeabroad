-- ============================================================================
-- WEB FUNDAMENTAL (slug: 'web_fundamental') - MODULE 1
-- Title: HTML5 Semantics & Accessible Web Architecture
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CHAPTERS (3 Chapter Berurutan)
-- ----------------------------------------------------------------------------

-- Chapter 1: Semantic Elements & Hierarchy
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Semantic Tags & Document Outline',
    'Menggantikan generic div dengan elemen semantik (header, nav, main, article, section, footer) dan hierarki heading H1-H6.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Chapter 2: Accessible Forms & Validation
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Accessible Forms & Native Validation',
    'Koneksi label eksplisit, input types modern (email, tel, number), native validation, dan grouping fieldset/legend.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Chapter 3: SEO, Open Graph & WCAG a11y
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 3, 'SEO Meta Tags & WCAG Accessibility',
    'Metadata viewport & Open Graph, ARIA roles, tabindex navigation, dan standar kepatuhan aksesibilitas web global.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2. QUESTS UNTUK CHAPTER 1 (Semantic Elements & Hierarchy)
-- ----------------------------------------------------------------------------

-- Quest 1.1: Quiz
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Semantic HTML vs Div Soup',
    'Uji pemahaman tentang keunggulan tag semantik HTML5 untuk SEO dan screen reader.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Elemen HTML5 manakah yang paling tepat untuk menampung konten utama yang berdiri sendiri dan dapat didistribusikan ulang (seperti postingan blog atau berita)?",
        "options": ["<article>", "<div>", "<section>", "<aside>"],
        "answer_index": 0,
        "explanation": "<article> dirancang khusus untuk konten independen dan self-contained yang dapat dipublikasikan secara terpisah."
    }'::jsonb,
    '["Pikirkan kata yang biasa digunakan untuk artikel berita."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 1.2: Fill-in-the-Blank
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Main Navigation Semantic Tag',
    'Lengkapi pembungkus daftar navigasi menggunakan tag semantik HTML5 yang benar.',
    'main', 'fill_blank', 'easy', 50, 5, 4, 2,
    NULL, NULL, NULL,
    '{
        "prompt": "<___>\n  <ul>\n    <li><a href=\"/\">Home</a></li>\n    <li><a href=\"/docs\">Docs</a></li>\n  </ul>\n</___>",
        "correct_answers": ["nav"],
        "explanation": "Tag <nav> secara eksplisit memberi tahu browser dan search engine bahwa blok tersebut adalah menu navigasi utama."
    }'::jsonb,
    '["Singkatan dari navigation."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 1.3: Monaco Coding Challenge
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Build Semantic Blog Post Structure',
    'Susun struktur artikel semantik yang memiliki header dengan H1, paragraph konten, dan footer.',
    'main', 'code', 'easy', 70, 10, 8, 3,
    '<!-- TODO: Buat elemen <article> yang berisi: -->\n<!-- 1. <header> dengan <h1> judul "Belajar Web Abroad" -->\n<!-- 2. <p> teks deskripsi -->\n<!-- 3. <footer> teks copyright -->\n',
    '{"test_cases": [{"name": "Contains <article>", "expected": true}, {"name": "Contains <h1>", "expected": true}, {"name": "Contains <footer>", "expected": true}]}'::jsonb,
    '<article>\n  <header>\n    <h1>Belajar Web Abroad</h1>\n  </header>\n  <p>Panduan lengkap menjadi global web engineer.</p>\n  <footer>\n    <p>© 2026 CodeAbroad</p>\n  </footer>\n</article>',
    NULL,
    '["Bungkus semua bagian di dalam tag <article>."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 3. QUESTS UNTUK CHAPTER 2 (Accessible Forms & Validation)
-- ----------------------------------------------------------------------------

-- Quest 2.1: Quiz
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Label-Input Association',
    'Pahami standar aksesibilitas menghubungkan tag label ke elemen input.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Atribut apa pada elemen <label> yang nilainya harus sama persis dengan atribut id pada elemen <input>?",
        "options": ["for", "name", "id", "target"],
        "answer_index": 0,
        "explanation": "Atribut for=\"id_input\" menghubungkan label secara programatis ke input terkait agar bisa di-fokuskan saat diklik dan dibaca oleh screen reader."
    }'::jsonb,
    '["Dalam bahasa Inggris berarti \"untuk\"."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 2.2: Fill-in-the-Blank
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Required Input Attribute',
    'Lengkapi input field agar wajib diisi sebelum form dapat di-submit ke backend.',
    'main', 'fill_blank', 'easy', 50, 5, 4, 2,
    NULL, NULL, NULL,
    '{
        "prompt": "<input type=\"email\" id=\"user-email\" name=\"email\" ___>",
        "correct_answers": ["required"],
        "explanation": "Atribut boolean ''required'' mencegah form ter-submit jika input tersebut masih kosong secara native di browser."
    }'::jsonb,
    '["Kata dalam bahasa Inggris untuk sesuatu yang wajib/diharuskan."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 2.3: Daily Habit Quest
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Daily a11y: Meaningful Alt Text',
    'Review harian standar WCAG untuk gambar pada halaman web publik.',
    'daily', 'quiz', 'easy', 40, 10, 3, 3,
    NULL, NULL, NULL,
    '{
        "question": "Jika sebuah gambar murni bersifat dekoratif (hanya pemanis background tanpa informasi esensial), bagaimana penulisan alt text yang benar sesuai WCAG?",
        "options": ["alt=\"\" (string kosong)", "Hapus atribut alt sepenuhnya", "alt=\"decorative image\"", "alt=\"image\""],
        "answer_index": 0,
        "explanation": "Memberikan alt=\"\" (empty alt) memberi sinyal kepada screen reader untuk mengabaikan gambar dekoratif tersebut tanpa menganggapnya sebagai link/konten yang hilang."
    }'::jsonb,
    '["Jangan biarkan screen reader membaca teks seperti decorative image."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 4. QUESTS UNTUK CHAPTER 3 (SEO, Open Graph & WCAG a11y)
-- ----------------------------------------------------------------------------

-- Quest 3.1: Coding Challenge (SEO & Meta Tags)
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Responsive Viewport & OG Meta Tags',
    'Tulis meta tags standar untuk responsive mobile viewport dan Open Graph title pada tag <head>.',
    'main', 'code', 'medium', 100, 15, 12, 1,
    '<!-- TODO: Tulis meta tag responsive viewport dan og:title -->\n<meta name="viewport" content="...">\n<meta property="og:title" content="...">',
    '{"test_cases": [{"name": "Viewport width=device-width", "expected": true}, {"name": "OG Title defined", "expected": true}]}'::jsonb,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta property="og:title" content="CodeAbroad Global Developer">',
    NULL,
    '["Viewport content memerlukan width=device-width, initial-scale=1.0"]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 3.2: Boss Challenge Quest
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Accessible Registration Form',
    'Rancang formulir pendaftaran kerja global yang 100% accessible: label terhubung dengan for/id, input types valid, dan tombol submit.',
    'boss', 'code', 'hard', 250, 30, 20, 2,
    '<form action="/register" method="POST">\n  <!-- TODO: Buat form dengan label & input untuk: Full Name, Email (required), dan Submit button -->\n</form>',
    '{"test_cases": [{"name": "Form has email input", "expected": true}, {"name": "All inputs have matching labels", "expected": true}, {"name": "Submit button present", "expected": true}]}'::jsonb,
    '<form action="/register" method="POST">\n  <div>\n    <label for="full-name">Full Name</label>\n    <input type="text" id="full-name" name="name" required>\n  </div>\n  <div>\n    <label for="email">Work Email</label>\n    <input type="email" id="email" name="email" required>\n  </div>\n  <button type="submit">Daftar Sekarang</button>\n</form>',
    NULL,
    '["Pastikan setiap input memiliki id yang cocok dengan atribut for pada label-nya."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- WEB FUNDAMENTAL - MODULE 2: CSS3 Modern Layouts: Flexbox, Grid & Responsive
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 2
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Flexbox Architecture & 1D Layouts',
    'Penguasaan main-axis vs cross-axis, justify-content, align-items, flex-grow, flex-shrink, dan flex-wrap.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 2
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'CSS Grid & Responsive Media Queries',
    'Tata letak 2 dimensi menggunakan CSS Grid, grid-template-columns, repeat(), auto-fit, minmax(), dan media queries mobile-first.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 2
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 2 Chapter 1 (Flexbox)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Flexbox Axis Alignment',
    'Pahami perbedaan perataan elemen di main-axis vs cross-axis pada flex container.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Properti CSS apa yang digunakan untuk meratakan elemen flex di sepanjang sumbu utama (main axis)?",
        "options": ["justify-content", "align-items", "align-content", "flex-direction"],
        "answer_index": 0,
        "explanation": "justify-content mengatur perataan sepanjang main axis, sedangkan align-items mengatur perataan sepanjang cross axis."
    }'::jsonb,
    '["Pikirkan kata \"justify\" seperti pada teks dokumen."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 2 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Centering Elements with Flexbox',
    'Tulis properti CSS untuk membuat sebuah kartu modal berada tepat di tengah layar secara horizontal dan vertikal.',
    'main', 'code', 'easy', 70, 10, 8, 2,
    '.container {
  display: flex;
  /* TODO: Buat item di tengah horizontal dan vertikal */
}',
    '{"test_cases": [{"name": "justify-content center", "expected": true}, {"name": "align-items center", "expected": true}]}'::jsonb,
    '.container {
  display: flex;
  justify-content: center;
  align-items: center;
}',
    NULL,
    '["Gunakan kombinasi justify-content: center dan align-items: center."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 2 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 2 Chapter 2 (CSS Grid & Responsive)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Mobile-First Media Query',
    'Lengkapi deklarasi media query untuk styling layar desktop (lebar minimal 768px).',
    'main', 'fill_blank', 'easy', 50, 5, 4, 1,
    NULL, NULL, NULL,
    '{
        "prompt": "@media (___-width: 768px) {\\n  .grid { display: grid; }\\n}",
        "correct_answers": ["min"],
        "explanation": "Dalam strategi mobile-first, kita menggunakan min-width untuk menerapkan style tambahan pada layar yang lebih besar."
    }'::jsonb,
    '["Gunakan kebalikan dari max."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 2 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Responsive 3-Column Card Layout',
    'Rancang layout kartu produk yang responsif: 1 kolom di mobile dan otomatis menjadi 3 kolom di desktop menggunakan CSS Grid.',
    'boss', 'code', 'hard', 250, 30, 20, 2,
    '.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* TODO: Tambahkan media query min-width 768px agar grid-template-columns menjadi repeat(3, 1fr) */',
    '{"test_cases": [{"name": "Contains min-width 768px", "expected": true}, {"name": "repeat(3, 1fr)", "expected": true}]}'::jsonb,
    '.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}',
    NULL,
    '["Gunakan @media (min-width: 768px) lalu ubah grid-template-columns."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 2 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- WEB FUNDAMENTAL - MODULE 3: JavaScript Core Engine & DOM Manipulation
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 3
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Variables, Scopes & Closures',
    'Memahami let vs const vs var, function scope vs block scope, lexical scoping, dan pembuatan closures untuk enkapsulasi state.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 3
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'DOM Traversal & Event Delegation',
    'Query selector, pembuatan & modifikasi elemen dinamis, siklus event bubbling & capturing, serta optimasi event delegation.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 3
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 3 Chapter 1 (Scopes & Closures)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Let vs Var Scope Hoisting',
    'Pahami perbedaan fundamental perilaku hoisting antara keyword var dan let di JavaScript.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Mengapa mengakses variabel let sebelum baris deklarasinya menghasilkan ReferenceError (Temporal Dead Zone), sedangkan var menghasilkan undefined?",
        "options": [
            "Karena variabel let tidak diinisialisasi nilai apapun saat hoisting sampai eksekusi mencapai deklarasi aslinya",
            "Karena let tidak di-hoist sama sekali oleh engine JavaScript",
            "Karena let disimpan langsung di disk bukan di RAM",
            "Karena let hanya dapat digunakan di dalam function"
        ],
        "answer_index": 0,
        "explanation": "Variabel let dan const tetap di-hoist, namun berada dalam Temporal Dead Zone (TDZ) dan belum diinisialisasi sehingga memicu ReferenceError jika diakses duluan."
    }'::jsonb,
    '["Pikirkan tentang konsep Temporal Dead Zone (TDZ)."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 3 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Create a Counter Closure Function',
    'Buat function createCounter() yang mengembalikan function increment dan mempertahankan state nilai privat secara closure.',
    'main', 'code', 'medium', 100, 15, 12, 2,
    'function createCounter() {
  let count = 0;
  // TODO: Kembalikan fungsi yang menambah count sebesar 1 dan mengembalikannya
}',
    '{"test_cases": [{"name": "Counter increments", "expected": 1}]}'::jsonb,
    'function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}',
    NULL,
    '["Kembalikan anonymous function yang mengakses variabel count di parent scope."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 3 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 3 Chapter 2 (DOM & Event Delegation)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Todo List with Event Delegation',
    'Pasang satu event listener tunggal pada elemen <ul> untuk menangani event klik pada semua elemen <li> di dalamnya menggunakan e.target.',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    'const todoList = document.querySelector("#todo-list");

// TODO: Pasang click listener pada todoList menggunakan Event Delegation
todoList.addEventListener("click", (e) => {
  // Periksa jika yang diklik adalah tombol delete dengan class "btn-delete"
});',
    '{"test_cases": [{"name": "Event delegation on ul", "expected": true}]}'::jsonb,
    'const todoList = document.querySelector("#todo-list");

todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const item = e.target.closest("li");
    if (item) item.remove();
  }
});',
    NULL,
    '["Gunakan e.target.classList.contains() dan closest(\"li\")."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 3 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- WEB FUNDAMENTAL - MODULE 4: Asynchronous JavaScript & Web APIs
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 4
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Promises, Async/Await & Event Loop',
    'Mekanisme Call Stack, Web APIs, Microtask Queue vs Macrotask Queue, chaining Promise, dan sintaks async/await modern.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 4
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Fetch API & Browser Storage',
    'Mengirim HTTP request asinkron dengan Fetch API, parsing respons JSON, serta manajemen persistensi data via LocalStorage.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 4
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 4 Chapter 1 (Async/Await)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Event Loop Microtask Priority',
    'Uji pemahaman urutan eksekusi synchronous, Promise microtask, dan setTimeout macrotask.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Manakah yang dieksekusi lebih dulu saat call stack kosong: callback Promise.then() (microtask) atau callback setTimeout() (macrotask)?",
        "options": [
            "Promise.then() (microtask queue selalu dikosongkan sebelum macrotask berikutnya)",
            "setTimeout() selalu lebih diprioritaskan oleh browser",
            "Keduanya berjalan bersamaan secara multithread",
            "Urutannya acak tergantung CPU browser"
        ],
        "answer_index": 0,
        "explanation": "Event Loop akan selalu menghabiskan semua antrean di Microtask Queue (termasuk Promise callbacks) sebelum mengambil satu tugas dari Macrotask Queue."
    }'::jsonb,
    '["Microtask memiliki prioritas lebih tinggi daripada Macrotask."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 4 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Fetch User Profile Data',
    'Tulis fungsi asynchronous fetchUser(url) yang mengambil data profil dari REST API dan mengembalikan JSON.',
    'main', 'code', 'medium', 100, 15, 10, 2,
    'async function fetchUser(url) {
  // TODO: Gunakan await fetch(url) dan return res.json()
}',
    '{"test_cases": [{"name": "Returns parsed json", "expected": true}]}'::jsonb,
    'async function fetchUser(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  return await res.json();
}',
    NULL,
    '["Gunakan const res = await fetch(url) lalu return await res.json()."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 4 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 4 Chapter 2 (Storage & Boss)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Persistent Theme Manager with LocalStorage',
    'Bangun fungsi setTheme(theme) dan getTheme() yang menyimpan preferensi tema (dark/light) pengguna secara persisten di LocalStorage.',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    '// TODO: Implementasikan setTheme dan getTheme menggunakan localStorage
function setTheme(theme) {
}

function getTheme() {
}',
    '{"test_cases": [{"name": "Stores and retrieves theme", "expected": true}]}'::jsonb,
    'function setTheme(theme) {
  localStorage.setItem("app_theme", theme);
}

function getTheme() {
  return localStorage.getItem("app_theme") || "light";
}',
    NULL,
    '["Gunakan localStorage.setItem() dan localStorage.getItem()."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 4 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- WEB FUNDAMENTAL - MODULE 5: HTTP Protocol, Web Security & Git Essentials
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 5
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'HTTP Protocol, Status Codes & CORS',
    'Arsitektur request/response HTTP, status codes 2xx/4xx/5xx, header Authorization Bearer, dan kebijakan CORS browser.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 5
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Web Security (XSS/CSRF) & Git Collaboration',
    'Pencegahan injeksi XSS, perlindungan token CSRF, serta alur kerja Git cabang fitur (branch, pull request, merge conflict).'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 5
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 5 Chapter 1 (HTTP & Headers)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'HTTP Status Codes Discrimination',
    'Pahami perbedaan kode respons HTTP standar dalam pengembangan API web internasional.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Status code HTTP manakah yang paling tepat dikembalikan ketika user belum login (tidak membawa token autentikasi valid)?",
        "options": ["401 Unauthorized", "403 Forbidden", "404 Not Found", "400 Bad Request"],
        "answer_index": 0,
        "explanation": "401 Unauthorized menandakan user belum terautentikasi (unauthenticated), sedangkan 403 Forbidden menandakan user sudah login namun tidak memiliki hak akses izin."
    }'::jsonb,
    '["401 untuk autentikasi yang kurang/tidak ada."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 5 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 5 Chapter 2 (Security & Boss Stage)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Daily Git: Rebase vs Merge',
    'Evaluasi kebiasaan harian tim teknik global dalam merapikan riwayat commit sebelum mengajukan Pull Request.',
    'daily', 'quiz', 'easy', 40, 10, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Apa keuntungan utama melakukan git rebase ke branch main sebelum membuka Pull Request?",
        "options": [
            "Menghasilkan riwayat commit yang bersih, linier tanpa merge-commit yang tidak perlu",
            "Otomatis menghapus semua konflik kode tanpa perlu diperiksa developer",
            "Mempercepat kecepatan internet saat push ke GitHub",
            "Mengubah repository menjadi private"
        ],
        "answer_index": 0,
        "explanation": "Git rebase memindahkan basis cabang fitur ke commit terbaru di main sehingga riwayat commit menjadi linier dan mudah di-audit."
    }'::jsonb,
    '["Linear history yang rapi dan mudah dibaca."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 5 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Sanitize Untrusted HTML Input',
    'Cegah serangan Stored XSS dengan membuat fungsi sanitizeText() yang meng-escape karakter berbahaya (<, >, &, ", '''') sebelum dimasukkan ke DOM.',
    'boss', 'code', 'hard', 250, 30, 20, 2,
    'function sanitizeText(str) {
  // TODO: Gantikan karakter <, >, &, ", '''' dengan entity HTML yang aman
}',
    '{"test_cases": [{"name": "Sanitizes <script>", "expected": true}]}'::jsonb,
    'function sanitizeText(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/''/g, "&#039;");
}',
    NULL,
    '["Gunakan replace() dengan regex global untuk mengonversi simbol ke kode entitas HTML."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'web_fundamental' AND m.module_number = 5 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;
