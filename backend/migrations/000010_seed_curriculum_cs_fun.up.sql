-- ============================================================================
-- CS FUNDAMENTAL (slug: 'cs_fundamental') - MODULE 1
-- Title: Data Structures I: Arrays, Strings & Hash Tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CHAPTERS (3 Chapter Berurutan)
-- ----------------------------------------------------------------------------

-- Chapter 1: Memory Layout & Arrays
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Contiguous Memory, Arrays & Two Pointers',
    'Alokasi memori array bersebelahan (contiguous), time complexity akses O(1) vs insert O(N), dan teknik Two Pointers in-place.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Chapter 2: String Parsing & Palindromes
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'String Manipulation & Sliding Window',
    'Representasi karakter/bytes di memori, sifat immutability string, validasi anagram, dan teknik window traversal.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- Chapter 3: Hash Maps & Fast Lookups
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 3, 'Hash Tables & O(1) Space-Time Tradeoff',
    'Fungsi hash, penanganan collision, lookup instan O(1), dan optimasi algoritma klasik Two Sum.'
FROM modules m
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1
ON CONFLICT (module_id, chapter_number) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2. QUESTS UNTUK CHAPTER 1 (Arrays & Two Pointers)
-- ----------------------------------------------------------------------------

-- Quest 1.1: Quiz
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Array Access Complexity',
    'Pahami kenapa membaca elemen array berdasarkan index berjalan dalam waktu konstan O(1).',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Mengapa operasi membaca elemen array berdasarkan index (misal: arr[4]) berkecepatan O(1)?",
        "options": [
            "Karena memori array contiguous sehingga alamat dihitung langsung: BaseAddress + (Index * ElementSize)",
            "Karena array selalu mengurutkan elemennya secara otomatis",
            "Karena browser/OS menyimpan salinan seluruh array di RAM cache L1",
            "Karena array mencari elemen satu per satu dari awal sampai ketemu"
        ],
        "answer_index": 0,
        "explanation": "Alokasi memori array bersifat bersebelahan (contiguous), sehingga CPU bisa menghitung pointer lokasi secara instan menggunakan aritmatika pointer sederhana."
    }'::jsonb,
    '["Pikirkan tentang rumus alamat memori langsung tanpa looping."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 1.2: Fill-in-the-Blank
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Two Pointers Traversal Fill-in',
    'Lengkapi kondisi perulangan Two-Pointer untuk membalik array dari ujung kiri dan kanan.',
    'main', 'fill_blank', 'easy', 50, 5, 4, 2,
    NULL, NULL, NULL,
    '{
        "prompt": "func Reverse(arr []int) {\n    left := 0\n    right := len(arr) - 1\n    for left ___ right {\n        arr[left], arr[right] = arr[right], arr[left]\n        left++\n        right--\n    }\n}",
        "correct_answers": ["<"],
        "explanation": "Perulangan Two-Pointer untuk reverse berjalan selama pointer kiri berada sebelum pointer kanan (left < right)."
    }'::jsonb,
    '["Pointer kiri harus lebih kecil dari pointer kanan."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 1.3: Monaco Coding Challenge
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'In-Place Array Reversal',
    'Balikkan urutan slice integer secara in-place tanpa membuat array baru (Space complexity O(1)).',
    'main', 'code', 'easy', 70, 10, 8, 3,
    'package main\n\n// TODO: Balikkan urutan slice nums secara in-place (tanpa alokasi memori tambahan)\nfunc ReverseArray(nums []int) {\n\t// Tulis kodemu di sini\n}',
    '{"test_cases": [{"name": "Reverse [1, 2, 3, 4, 5]", "expected": [5, 4, 3, 2, 1]}]}'::jsonb,
    'package main\n\nfunc ReverseArray(nums []int) {\n\ti, j := 0, len(nums)-1\n\tfor i < j {\n\t\tnums[i], nums[j] = nums[j], nums[i]\n\t\ti++\n\t\tj--\n\t}\n}',
    NULL,
    '["Gunakan dua pointer: satu dari indeks 0, satu dari len(nums)-1."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 3. QUESTS UNTUK CHAPTER 2 (String Manipulation & Sliding Window)
-- ----------------------------------------------------------------------------

-- Quest 2.1: Quiz
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'String Immutability Concept',
    'Pahami implikasi performa memori dari modifikasi string di bahasa pemrograman modern.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Pada bahasa seperti Go, Java, atau Python, string bersifat immutable. Apa yang terjadi di memori saat kita melakukan string concatenation (s += \"a\") di dalam loop 10.000 kali?",
        "options": [
            "Memori membuat string baru dan menyalin seluruh karakter setiap iterasi (O(N^2) time & memory overhead)",
            "Karakter langsung ditambahkan di ujung string lama tanpa alokasi baru (O(1))",
            "Compiler otomatis mengubahnya menjadi pointer tanpa menggunakan RAM tambahan",
            "Program akan langsung panic/crash karena string tidak boleh diubah"
        ],
        "answer_index": 0,
        "explanation": "Karena immutable, setiap operasi concat membuat alokasi string baru dan menyalin karakter sebelumnya, sehingga boros memori. Solusi idiomatik adalah menggunakan strings.Builder atau byte buffer."
    }'::jsonb,
    '["Pikirkan konsekuensi pembuatan objek baru berulang-ulang."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 2.2: Fill-in-the-Blank
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Valid Palindrome Condition',
    'Lengkapi kondisi perbandingan karakter untuk mengecek apakah kata adalah palindrome.',
    'main', 'fill_blank', 'easy', 50, 5, 4, 2,
    NULL, NULL, NULL,
    '{
        "prompt": "func IsPalindrome(s string) bool {\n    l, r := 0, len(s)-1\n    for l < r {\n        if s[l] ___ s[r] {\n            return false\n        }\n        l++\n        r--\n    }\n    return true\n}",
        "correct_answers": ["!="],
        "explanation": "Jika karakter di pointer kiri tidak sama dengan karakter di pointer kanan (s[l] != s[r]), maka string tersebut bukan palindrome."
    }'::jsonb,
    '["Gunakan operator tidak sama dengan."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 2.3: Daily Habit Quest
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Daily Big-O: Nested Loops Trap',
    'Evaluasi kompleksitas waktu algoritma brute-force bersarang pada array 100.000 data.',
    'daily', 'quiz', 'easy', 40, 10, 3, 3,
    NULL, NULL, NULL,
    '{
        "question": "Jika sebuah fungsi memiliki dua buah nested for loop (loop bersarang) yang keduanya mengiterasi array sepanjang N, berapakah Big-O Time Complexity-nya?",
        "options": ["O(N^2) - Quadratic", "O(N) - Linear", "O(log N) - Logarithmic", "O(2N)"],
        "answer_index": 0,
        "explanation": "Nested loop di mana setiap elemen N dibandingkan dengan N elemen lainnya memiliki kompleksitas O(N * N) = O(N^2)."
    }'::jsonb,
    '["N dikalikan dengan N."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 4. QUESTS UNTUK CHAPTER 3 (Hash Tables & O(1) Lookups)
-- ----------------------------------------------------------------------------

-- Quest 3.1: Coding Challenge (Two Sum dengan Hash Map)
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Two Sum - Fast Hash Lookup',
    'Temukan dua index angka dalam slice nums yang jika dijumlahkan menghasilkan target, dengan kompleksitas O(N).',
    'main', 'code', 'medium', 120, 15, 15, 1,
    'package main\n\n// TODO: Kembalikan slice [index1, index2] yang jika nums[index1] + nums[index2] == target\n// Gunakan map[int]int untuk mencapai performa O(N)\nfunc TwoSum(nums []int, target int) []int {\n\treturn nil\n}',
    '{"test_cases": [{"name": "nums=[2,7,11,15], target=9", "expected": [0, 1]}]}'::jsonb,
    'package main\n\nfunc TwoSum(nums []int, target int) []int {\n\tseen := make(map[int]int)\n\tfor i, num := range nums {\n\t\tcomplement := target - num\n\t\tif idx, ok := seen[complement]; ok {\n\t\t\treturn []int{idx, i}\n\t\t}\n\t\tseen[num] = i\n\t}\n\treturn nil\n}',
    NULL,
    '["Hitung complement = target - num, lalu cek apakah complement sudah ada di dalam hash map."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- Quest 3.2: Boss Challenge Quest
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Frequency Map & Anagram Validator',
    'Selesaikan tantangan interview algoritma: Valid Anagram. Periksa apakah dua string s dan t memiliki frekuensi karakter yang identik.',
    'boss', 'code', 'hard', 250, 30, 20, 2,
    'package main\n\n// TODO: Kembalikan true jika t adalah anagram dari s (semua huruf dan frekuensinya sama persis)\nfunc IsAnagram(s string, t string) bool {\n\treturn false\n}',
    '{"test_cases": [{"name": "anagram vs nagaram", "expected": true}, {"name": "rat vs car", "expected": false}]}'::jsonb,
    'package main\n\nfunc IsAnagram(s string, t string) bool {\n\tif len(s) != len(t) {\n\t\treturn false\n\t}\n\tcounts := make(map[rune]int)\n\tfor _, ch := range s {\n\t\tcounts[ch]++\n\t}\n\tfor _, ch := range t {\n\t\tcounts[ch]--\n\t\tif counts[ch] < 0 {\n\t\t\treturn false\n\t\t}\n\t}\n\treturn true\n}',
    NULL,
    '["Gunakan map[rune]int untuk menghitung frekuensi setiap karakter di s, lalu kurangi saat membaca karakter di t."]'::jsonb
FROM chapters c
JOIN modules m ON c.module_id = m.id
JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 1 AND c.chapter_number = 3
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- CS FUNDAMENTAL - MODULE 2: Data Structures II: Linked Lists, Stacks & Queues
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 2
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Singly & Doubly Linked Lists',
    'Arsitektur simpul node dan pointer, traversal traversal O(N), penyisipan O(1) di awal, dan manipulasi linked list in-place.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 2
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Stacks (LIFO) & Queues (FIFO)',
    'Prinsip Last-In First-Out pada Stack, First-In First-Out pada Queue, evaluasi ekspresi postfix, dan validasi tanda kurung.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 2
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 2 Chapter 1 (Linked Lists)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Linked List vs Array Complexity',
    'Bandingkan karakteristik alokasi memori dan time complexity antara Linked List dan Array dinamis.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Berapakah kompleksitas waktu menyisipkan elemen di posisi paling depan (prepend) pada Singly Linked List vs Array?",
        "options": [
            "Linked List: O(1) | Array: O(N) karena harus menggeser seluruh elemen",
            "Linked List: O(N) | Array: O(1)",
            "Keduanya sama-sama O(1)",
            "Keduanya sama-sama O(N)"
        ],
        "answer_index": 0,
        "explanation": "Pada Linked List, menyisipkan di awal cukup mengarahkan pointer Next node baru ke Head lama (O(1)). Pada Array, semua elemen harus digeser satu indeks ke kanan (O(N))."
    }'::jsonb,
    '["Array harus menggeser posisi semua elemen yang sudah ada."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 2 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Reverse a Singly Linked List',
    'Balikkan arah pointer seluruh node pada Singly Linked List dan kembalikan head yang baru.',
    'main', 'code', 'medium', 120, 15, 15, 2,
    'package main

type ListNode struct {
	Val  int
	Next *ListNode
}

// TODO: Balikkan linked list dan return new head
func ReverseList(head *ListNode) *ListNode {
	return nil
}',
    '{"test_cases": [{"name": "Reverses 1->2->3", "expected": 3}]}'::jsonb,
    'package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func ReverseList(head *ListNode) *ListNode {
	var prev *ListNode
	curr := head
	for curr != nil {
		nextTemp := curr.Next
		curr.Next = prev
		prev = curr
		curr = nextTemp
	}
	return prev
}',
    NULL,
    '["Gunakan tiga pointer: prev, curr, dan nextTemp."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 2 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 2 Chapter 2 (Stacks & Boss Stage)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Valid Parentheses with Stack',
    'Tantangan wawancara teknis standar: Periksa apakah kombinasi tanda kurung (), {}, [] pada string s tersusun valid menggunakan struktur data Stack.',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    'package main

// TODO: Periksa validitas string tanda kurung menggunakan Stack
func IsValidParentheses(s string) bool {
	return false
}',
    '{"test_cases": [{"name": "()[]{} is valid", "expected": true}, {"name": "(] is invalid", "expected": false}]}'::jsonb,
    'package main

func IsValidParentheses(s string) bool {
	stack := []rune{}
	pair := map[rune]rune{")": "(", "}": "{", "]": "["}
	for _, ch := range s {
		if open, ok := pair[ch]; ok {
			if len(stack) == 0 || stack[len(stack)-1] != open {
				return false
			}
			stack = stack[:len(stack)-1]
		} else {
			stack = append(stack, ch)
		}
	}
	return len(stack) == 0
}',
    NULL,
    '["Push karakter pembuka ke slice stack, dan pop saat bertemu karakter penutup yang cocok."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 2 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- CS FUNDAMENTAL - MODULE 3: Trees, Graphs & Traversal Algorithms
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 3
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Binary Search Trees (BST)',
    'Invarian BST (kiri < root < kanan), rekursi traversal (In-Order, Pre-Order, Post-Order), dan operasi pencarian bernilai O(log N).'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 3
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Graph Traversal: BFS & DFS',
    'Representasi graf adjacency list, traversal Breadth-First Search (Queue) mencari jalur terpendek, dan Depth-First Search (Rekursi).'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 3
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 3 Chapter 1 (Trees)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'BST In-Order Traversal Property',
    'Pahami keistimewaan traversal in-order pada struktur data Binary Search Tree.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Jika kita melakukan In-Order Traversal (Kiri -> Root -> Kanan) pada sebuah Binary Search Tree yang valid, bagaimana urutan nilai yang dihasilkan?",
        "options": [
            "Selalu terurut menaik (sorted ascending) dari kecil ke besar",
            "Selalu terurut menurun (sorted descending)",
            "Acak sesuai urutan waktu insert node",
            "Hanya menampilkan node daun (leaf nodes)"
        ],
        "answer_index": 0,
        "explanation": "In-Order traversal mengunjungi anak kiri terlebih dahulu, lalu root, lalu anak kanan, sehingga nilainya pasti terurut menaik (sorted ascending)."
    }'::jsonb,
    '["Kiri selalu lebih kecil, kanan selalu lebih besar."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 3 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 3 Chapter 2 (Graphs & Boss Stage)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Maximum Depth of Binary Tree',
    'Tulis algoritma rekursif untuk menghitung kedalaman maksimum (tinggi) dari sebuah binary tree.',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    'package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// TODO: Kembalikan kedalaman maksimum tree
func MaxDepth(root *TreeNode) int {
	return 0
}',
    '{"test_cases": [{"name": "MaxDepth of height 3", "expected": 3}]}'::jsonb,
    'package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func MaxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	leftDepth := MaxDepth(root.Left)
	rightDepth := MaxDepth(root.Right)
	if leftDepth > rightDepth {
		return leftDepth + 1
	}
	return rightDepth + 1
}',
    NULL,
    '["Base case: jika root nil return 0. Recursive case: 1 + max(left, right)."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 3 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- CS FUNDAMENTAL - MODULE 4: Algorithm Design: Sorting, Binary Search & Pointers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 4
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Divide & Conquer: Binary Search & Sorting',
    'Prinsip pembagian ruang pencarian Binary Search O(log N), rekursi Merge Sort, dan partisi pivot Quick Sort.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 4
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'Sliding Window & Greedy Strategies',
    'Optimasi array berturut-turut dengan jendela geser, algoritma Kadane (Max Subarray), dan strategi keputusan lokal Greedy.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 4
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 4 Chapter 1 (Binary Search)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Binary Search Implementation',
    'Implementasikan algoritma Binary Search klasik untuk menemukan indeks target di dalam slice angka yang telah terurut.',
    'main', 'code', 'medium', 120, 15, 12, 1,
    'package main

// TODO: Return indeks target jika ditemukan, atau -1 jika tidak ada dalam nums (O(log N))
func BinarySearch(nums []int, target int) int {
	return -1
}',
    '{"test_cases": [{"name": "Search 9 in [-1,0,3,5,9,12]", "expected": 4}]}'::jsonb,
    'package main

func BinarySearch(nums []int, target int) int {
	low, high := 0, len(nums)-1
	for low <= high {
		mid := low + (high-low)/2
		if nums[mid] == target {
			return mid
		} else if nums[mid] < target {
			low = mid + 1
		} else {
			high = mid - 1
		}
	}
	return -1
}',
    NULL,
    '["Hitung mid = low + (high-low)/2 untuk mencegah integer overflow."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 4 AND c.chapter_number = 1
ON CONFLICT (chapter_id, order_index) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 4 Chapter 2 (Kadane & Boss)
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: Maximum Subarray Sum (Kadane)',
    'Temukan jumlah total terbesar dari contiguous subarray yang ada di dalam slice nums dalam kompleksitas O(N).',
    'boss', 'code', 'hard', 250, 30, 20, 1,
    'package main

// TODO: Implementasikan Kadane Algorithm untuk Maximum Subarray Sum
func MaxSubArray(nums []int) int {
	return 0
}',
    '{"test_cases": [{"name": "MaxSubArray [-2,1,-3,4,-1,2,1,-5,4]", "expected": 6}]}'::jsonb,
    'package main

func MaxSubArray(nums []int) int {
	maxSum := nums[0]
	currentSum := nums[0]
	for i := 1; i < len(nums); i++ {
		if currentSum + nums[i] > nums[i] {
			currentSum += nums[i]
		} else {
			currentSum = nums[i]
		}
		if currentSum > maxSum {
			maxSum = currentSum
		}
	}
	return maxSum
}',
    NULL,
    '["currentSum = max(nums[i], currentSum + nums[i])."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 4 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;


-- ============================================================================
-- CS FUNDAMENTAL - MODULE 5: Big-O Complexity & System Design Foundations
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Chapters untuk Module 5
-- ----------------------------------------------------------------------------
INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 1, 'Space-Time Complexity & Amortized Analysis',
    'Analisis Big-O waktu dan memori, amortized cost penambahan kapasitas dynamic array, dan deteksi memory leaks.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 5
ON CONFLICT (module_id, chapter_number) DO NOTHING;

INSERT INTO chapters (module_id, chapter_number, title, description)
SELECT m.id, 2, 'System Scalability, Caching & CAP Theorem',
    'Prinsip penskalaan horizontal vs vertikal, cache-aside pattern, load balancers, dan teorema CAP pada sistem terdistribusi.'
FROM modules m JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 5
ON CONFLICT (module_id, chapter_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Quests untuk Module 5 Chapter 1 & 2
-- ----------------------------------------------------------------------------
INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'CAP Theorem Core Decisions',
    'Pahami trade-off arsitektur database terdistribusi ketika terjadi network partition.',
    'main', 'quiz', 'easy', 40, 5, 3, 1,
    NULL, NULL, NULL,
    '{
        "question": "Berdasarkan Teorema CAP, apa yang harus dipilih oleh sistem terdistribusi ketika terjadi Partisi Jaringan (Partition Tolerance / P)?",
        "options": [
            "Memilih antara Konsistensi Data (Consistency) ATAU Ketersediaan Sistem (Availability)",
            "Sistem dapat menjamin ketiganya sekaligus (C, A, dan P)",
            "Sistem harus otomatis dimatikan sepenuhnya",
            "Data otomatis terhapus dari semua replica node"
        ],
        "answer_index": 0,
        "explanation": "Pada sistem terdistribusi riil di mana network failure pasti bisa terjadi (P), arsitektur wajib memilih trade-off antara CP (konsistensi kuat) atau AP (tetap tersedia dengan eventual consistency)."
    }'::jsonb,
    '["Pilih antara konsisten atau selalu online saat jaringan terputus."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 5 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;

INSERT INTO quests (
    chapter_id, title, description, type, format, difficulty,
    xp_reward, gems_reward, estimated_minutes, order_index,
    starter_code, test_suite, solution_code, quiz_data, hints
)
SELECT c.id, 'Boss: LRU Cache Implementation',
    'Rancang struktur data Least Recently Used (LRU) Cache dengan kapasitas terbatas yang mengembalikan get() dan put() secara efisien.',
    'boss', 'code', 'hard', 250, 30, 25, 2,
    'package main

type LRUCache struct {
	capacity int
	items    map[int]int
}

func Constructor(capacity int) LRUCache {
	return LRUCache{capacity: capacity, items: make(map[int]int)}
}

func (this *LRUCache) Get(key int) int {
	// TODO: Ambil nilai jika ada, atau return -1
	return -1
}

func (this *LRUCache) Put(key int, value int) {
	// TODO: Masukkan data baru
}',
    '{"test_cases": [{"name": "LRU put and get", "expected": true}]}'::jsonb,
    'package main

type LRUCache struct {
	capacity int
	items    map[int]int
}

func Constructor(capacity int) LRUCache {
	return LRUCache{capacity: capacity, items: make(map[int]int)}
}

func (this *LRUCache) Get(key int) int {
	if val, ok := this.items[key]; ok {
		return val
	}
	return -1
}

func (this *LRUCache) Put(key int, value int) {
	this.items[key] = value
}',
    NULL,
    '["Kombinasikan hash map dengan doubly linked list untuk implementasi O(1)."]'::jsonb
FROM chapters c JOIN modules m ON c.module_id = m.id JOIN tech_stacks ts ON m.tech_stack_id = ts.id
WHERE ts.slug = 'cs_fundamental' AND m.module_number = 5 AND c.chapter_number = 2
ON CONFLICT (chapter_id, order_index) DO NOTHING;
