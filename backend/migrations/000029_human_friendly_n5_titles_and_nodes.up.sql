-- Migration 000029: Human-friendly beginner titles/descriptions for JLPT N5 (30 Units + Mock Exam, 211 Lessons)
BEGIN;

UPDATE units SET title = 'Hiragana Dasar: Vokal & Baris K', description = 'Mulai dari nol dengan 10 huruf Hiragana pertama, baca kata pendek pertamamu, dan latih sapaan awal.' WHERE id = 'a0000002-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Vokal & Baris K', title = 'Mengenal 5 Vokal (A-I-U-E-O) & Huruf Baris K' WHERE id = 'b0000002-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Kata Pertama', title = 'Membaca Kata Sederhana Pertamamu (Ie, Aoi, Kao)' WHERE id = 'b0000026-0000-0000-0000-000000000102';
UPDATE lessons SET short_title = 'Bedakan Huruf Mirip', title = 'Membedakan Bunyi Vokal & Huruf Mirip (A vs O)' WHERE id = 'b0000027-0000-0000-0000-000001000003';
UPDATE lessons SET short_title = 'Kata Sehari-hari', title = 'Kosakata Harian dari Vokal & Baris K (Aki, Ike, Koko)' WHERE id = 'b0000027-0000-0000-0000-000001000004';
UPDATE lessons SET short_title = 'Frasa & Sapaan Awal', title = 'Ungkapan Sapaan & Frasa Pendek untuk Pemula' WHERE id = 'b0000001-0000-0000-0000-000000000008';
UPDATE lessons SET short_title = 'Praktik Sapaan', title = 'Praktik Bicara, Dengar & Tulis Kata Pertama' WHERE id = 'b0000026-0000-0000-0000-000000000104';
UPDATE lessons SET short_title = 'Tes Unit 1', title = 'Tes Akhir Unit 1: 10 Huruf Pertama & Kosakata' WHERE id = 'b0000027-0000-0000-0000-000001000007';

UPDATE units SET title = 'Lanjut Hiragana (S–N), Salam & Menunjuk Benda', description = 'Kenali huruf baris S, T, dan N, ucapkan salam sehari-hari, serta tunjuk benda di dekatmu.' WHERE id = 'a0000026-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Lanjut Baris S–N', title = 'Mengulang Vokal-K & Lanjut Huruf Baris S, T, dan N' WHERE id = 'b0000026-0000-0000-0000-000000000201';
UPDATE lessons SET short_title = 'Kata Gabungan Awal', title = 'Membaca Kata dari Baris A sampai N (Asa, Sushi, Inu, Neko)' WHERE id = 'b0000026-0000-0000-0000-000000000202';
UPDATE lessons SET short_title = 'Bunyi Unik S-T', title = 'Trik Mengingat Bunyi Unik Shi, Chi, dan Tsu' WHERE id = 'b0000027-0000-0000-0000-000002000003';
UPDATE lessons SET short_title = 'Hewan & Benda Dekat', title = 'Kosakata Hewan Peliharaan & Benda Harian' WHERE id = 'b0000027-0000-0000-0000-000002000004';
UPDATE lessons SET short_title = 'Salam & Menunjuk', title = 'Ucapan Salam Harian & Menunjuk Benda (Kore / Sore)' WHERE id = 'b0000002-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Praktik Salam', title = 'Praktik Mengucapkan Salam & Menunjuk Benda' WHERE id = 'b0000026-0000-0000-0000-000000000204';
UPDATE lessons SET short_title = 'Tes Unit 2', title = 'Tes Akhir Unit 2: 25 Huruf Hiragana & Salam' WHERE id = 'b0000027-0000-0000-0000-000002000007';

UPDATE units SET title = 'Lanjut Hiragana (H–Y) & Memperkenalkan Diri', description = 'Pelajari huruf baris H, M, dan Y agar bisa menyebut nama sendiri dan memperkenalkan diri dengan sopan.' WHERE id = 'a0000026-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Lanjut Baris H–Y', title = 'Lanjut Huruf Baris H, M, dan Y (Mengenal Bunyi Fu)' WHERE id = 'b0000026-0000-0000-0000-000000000301';
UPDATE lessons SET short_title = 'Kosakata H–Y', title = 'Kata Harian dari Baris H-M-Y (Hana, Mimi, Yama, Watashi)' WHERE id = 'b0000026-0000-0000-0000-000000000302';
UPDATE lessons SET short_title = 'Bedakan Bunyi Fu', title = 'Trik Bunyi Fu & Membedakan Huruf Mirip Ha vs Ho' WHERE id = 'b0000027-0000-0000-0000-000003000003';
UPDATE lessons SET short_title = 'Kata Identitas Diri', title = 'Kosakata Perkenalan & Sapaan Siang (Watashi, Konnichiwa)' WHERE id = 'b0000027-0000-0000-0000-000003000004';
UPDATE lessons SET short_title = 'Perkenalkan Diri', title = 'Menyusun Kalimat Perkenalan Pertama (... Wa ... Desu)' WHERE id = 'b0000001-0000-0000-0000-000000000001';
UPDATE lessons SET short_title = 'Kenalkan Diri', title = 'Praktik Memperkenalkan Diri Secara Lisan & Tulis' WHERE id = 'b0000026-0000-0000-0000-000000000304';
UPDATE lessons SET short_title = 'Tes Unit 3', title = 'Tes Akhir Unit 3: 38 Huruf & Kalimat Perkenalan' WHERE id = 'b0000027-0000-0000-0000-000003000007';

UPDATE units SET title = 'Tuntas 46 Hiragana, Negara & Kewarganegaraan', description = 'Tuntaskan seluruh 46 huruf dasar Hiragana sambil belajar menyebut asal negara dan menunjuk benda jauh.' WHERE id = 'a0000026-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Lanjut Baris R–N', title = 'Menuntaskan Huruf Baris R, W, dan N' WHERE id = 'b0000026-0000-0000-0000-000000000401';
UPDATE lessons SET short_title = 'Negara & Kebangsaan', title = 'Kosakata Nama Negara, Bahasa & Kebangsaan (-Jin)' WHERE id = 'b0000026-0000-0000-0000-000000000402';
UPDATE lessons SET short_title = 'Tuntas 46 Huruf', title = 'Bunyi Sengau N & Partikel Penanda Objek Wo (O)' WHERE id = 'b0000027-0000-0000-0000-000004000003';
UPDATE lessons SET short_title = 'Kosakata Profesi Awal', title = 'Kosakata Lengkap Profesi Sekolah & Negara (Sensei, Gakusei)' WHERE id = 'b0000027-0000-0000-0000-000004000004';
UPDATE lessons SET short_title = 'Tunjuk Benda Jauh', title = 'Membedakan Kata Tunjuk Dekat, Agak Jauh & Jauh (Kore, Sore, Are)' WHERE id = 'b0000026-0000-0000-0000-000000000403';
UPDATE lessons SET short_title = 'Praktik 46 Hiragana', title = 'Praktik Membaca, Menulis & Mengucap 46 Hiragana' WHERE id = 'b0000026-0000-0000-0000-000000000404';
UPDATE lessons SET short_title = 'Tes Unit 4', title = 'Tes Akhir Unit 4: Tuntas 46 Huruf Hiragana' WHERE id = 'b0000027-0000-0000-0000-000004000007';

UPDATE units SET title = 'Bunyi Variasi Hiragana, Kalimat Tanya & Ujian Tahap 1', description = 'Kuasai tanda bunyi ganda dan gabungan Hiragana, buat kalimat tanya dan sangkal, lalu taklukkan Ujian Tahap 1.' WHERE id = 'a0000026-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Bunyi Variasi Huruf', title = 'Mengenal Tanda Petik (Tenten), Bulat (Maru) & Huruf Kecil' WHERE id = 'b0000026-0000-0000-0000-000000000501';
UPDATE lessons SET short_title = 'Kata Bunyi Variasi', title = 'Membaca Kata dengan Bunyi Variasi (Gakkou, Ocha, Kitte)' WHERE id = 'b0000026-0000-0000-0000-000000000502';
UPDATE lessons SET short_title = 'Konsonan Ganda', title = 'Cara Membaca Konsonan Ganda (Tsu Kecil) & Bunyi Gabungan' WHERE id = 'b0000027-0000-0000-0000-000005000003';
UPDATE lessons SET short_title = 'Kosakata Tempat', title = 'Kosakata Tempat & Benda Bunyi Variasi (Byouin, Kippu, Zasshi)' WHERE id = 'b0000027-0000-0000-0000-000005000004';
UPDATE lessons SET short_title = 'Kalimat Tanya & Bukan', title = 'Membuat Kalimat Tanya (Ka), Jawaban Bukan & Kata Juga (Mo)' WHERE id = 'b0000001-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Persiapan Ujian T1', title = 'Latihan Gabungan Seluruh Hiragana Menjelang Ujian Tahap 1' WHERE id = 'b0000027-0000-0000-0000-000005000006';
UPDATE lessons SET short_title = 'Ujian Tahap 1', title = 'Ujian Evaluasi Tahap 1: Fondasi Huruf & Kalimat Awal' WHERE id = 'b0000026-0000-0000-0000-000000000504';

UPDATE units SET title = 'Benda Sekitar, Menunjuk Barang & Kepemilikan', description = 'Kenali 5 Kanji benda yang paling sering ditemui serta cara menyebut barang milik sendiri atau orang lain.' WHERE id = 'a0000001-0000-0000-0000-000000000001';
UPDATE lessons SET short_title = 'Kanji Benda Awal', title = 'Mengenal 5 Kanji Dasar Pertama (Buku, Nama, Depan, Apa, Saya)' WHERE id = 'b0000026-0000-0000-0000-000000000601';
UPDATE lessons SET short_title = 'Barang Sekitar Kita', title = 'Kosakata Benda Sehari-hari & Kata Tunjuk Sebelum Benda' WHERE id = 'b0000001-0000-0000-0000-000000000010';
UPDATE lessons SET short_title = 'Pola Tunjuk Barang', title = 'Menunjuk Benda Secara Langsung (Kono, Sono, Ano + Benda)' WHERE id = 'b0000027-0000-0000-0000-000006000003';
UPDATE lessons SET short_title = 'Benda Ruang Belajar', title = 'Kosakata Perlengkapan Meja & Ruang Belajar (Jam, Payung, Kursi)' WHERE id = 'b0000027-0000-0000-0000-000006000004';
UPDATE lessons SET short_title = 'Nyatakan Kepemilikan', title = 'Menyatakan Pemilik & Asal Benda dengan Kata Sambung No' WHERE id = 'b0000001-0000-0000-0000-000000000011';
UPDATE lessons SET short_title = 'Praktik Benda Sekitar', title = 'Praktik Menanyakan Pemilik Benda di Sekitarmu' WHERE id = 'b0000026-0000-0000-0000-000000000604';
UPDATE lessons SET short_title = 'Tes Unit 6', title = 'Tes Akhir Unit 6: Kata Tunjuk Barang & Kepemilikan' WHERE id = 'b0000027-0000-0000-0000-000006000007';

UPDATE units SET title = 'Keluarga, Profesi & Panggilan Sopan', description = 'Pelajari cara mengenalkan anggota keluarga dan membedakan panggilan untuk keluarga sendiri maupun orang lain.' WHERE id = 'a0000026-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Kanji Anggota Keluarga', title = 'Mengenal 8 Kanji Manusia & Keluarga (Orang, Ayah, Ibu, Anak)' WHERE id = 'b0000026-0000-0000-0000-000000000701';
UPDATE lessons SET short_title = 'Keluarga & Panggilan', title = 'Kosakata Keluarga Sendiri vs Keluarga Orang Lain' WHERE id = 'b0000018-0000-0000-0000-000000000001';
UPDATE lessons SET short_title = 'Gelar Panggilan Sopan', title = 'Kapan Memakai Akhiran San, Sama, Chan, dan Kun' WHERE id = 'b0000027-0000-0000-0000-000007000003';
UPDATE lessons SET short_title = 'Profesi & Kerabat', title = 'Kosakata Profesi Kerja & Saudara (Karyawan, Kakak)' WHERE id = 'b0000027-0000-0000-0000-000007000004';
UPDATE lessons SET short_title = 'Kenalkan Keluargamu', title = 'Menyusun Kalimat Tentang Keluarga & Pekerjaan Secara Sopan' WHERE id = 'b0000026-0000-0000-0000-000000000703';
UPDATE lessons SET short_title = 'Kenalkan Keluarga', title = 'Praktik Menceritakan Anggota Keluarga & Profesinya' WHERE id = 'b0000026-0000-0000-0000-000000000704';
UPDATE lessons SET short_title = 'Tes Unit 7', title = 'Tes Akhir Unit 7: Keluarga, Profesi & Panggilan Sopan' WHERE id = 'b0000027-0000-0000-0000-000007000007';

UPDATE units SET title = 'Katakana Dasar, Nama Negara & Angka 1–100', description = 'Mulai membaca huruf Katakana untuk kata serapan asing sekaligus menyebut nama negara, usia, dan angka 1–100.' WHERE id = 'a0000026-0000-0000-0000-000000000008';
UPDATE lessons SET short_title = 'Katakana Awal A–To', title = 'Mengenal Huruf Katakana Bagian 1 (Baris A sampai To)' WHERE id = 'b0000026-0000-0000-0000-000000000801';
UPDATE lessons SET short_title = 'Nama Negara Asing', title = 'Membaca Nama Negara dalam Katakana & Kanji Angka 1–5' WHERE id = 'b0000026-0000-0000-0000-000000000802';
UPDATE lessons SET short_title = 'Tanda Vokal Panjang', title = 'Cara Membaca Garis Panjang Katakana & Kata Serapan' WHERE id = 'b0000027-0000-0000-0000-000008000003';
UPDATE lessons SET short_title = 'Angka 1 sampai 10', title = 'Menghafal & Membaca Kanji Angka Dasar 1 sampai 10' WHERE id = 'b0000027-0000-0000-0000-000008000004';
UPDATE lessons SET short_title = 'Umur & Angka 1–100', title = 'Menyebut Angka 1–100, Usia (-Sai) & Asal Negara' WHERE id = 'b0000001-0000-0000-0000-000000000009';
UPDATE lessons SET short_title = 'Praktik Negara & Umur', title = 'Praktik Tanya Jawab Asal Negara & Usia' WHERE id = 'b0000026-0000-0000-0000-000000000804';
UPDATE lessons SET short_title = 'Tes Unit 8', title = 'Tes Akhir Unit 8: Katakana Awal, Negara & Angka' WHERE id = 'b0000027-0000-0000-0000-000008000007';

UPDATE units SET title = 'Angka Besar, Harga Belanja & Cara Hitung Benda', description = 'Pahami angka ratusan hingga puluhan ribu agar bisa menanyakan harga barang dan menghitung jumlah benda.' WHERE id = 'a0000026-0000-0000-0000-000000000009';
UPDATE lessons SET short_title = 'Angka Ratusan & Ribuan', title = 'Mengenal Kanji Ratusan, Ribuan, Puluhan Ribu & Yen' WHERE id = 'b0000026-0000-0000-0000-000000000901';
UPDATE lessons SET short_title = 'Cara Hitung Benda', title = 'Satuan Hitung Benda Harian (Buah, Orang, Lembar, Batang, Buku)' WHERE id = 'b0000001-0000-0000-0000-000000000018';
UPDATE lessons SET short_title = 'Hitung 1–10 Asli', title = 'Cara Hitung Umum 1 sampai 10 Benda (Hitotsu–Too)' WHERE id = 'b0000027-0000-0000-0000-000009000003';
UPDATE lessons SET short_title = 'Kosakata Belanja', title = 'Kosakata Harga, Kasir & Mata Uang Yen (Ikura, En)' WHERE id = 'b0000027-0000-0000-0000-000009000004';
UPDATE lessons SET short_title = 'Tanya Harga Barang', title = 'Menanyakan Harga (Ikura) & Memesan Jumlah Barang' WHERE id = 'b0000026-0000-0000-0000-000000000903';
UPDATE lessons SET short_title = 'Praktik Belanja', title = 'Praktik Percakapan Tanya Harga & Hitung Belanjaan' WHERE id = 'b0000026-0000-0000-0000-000000000904';
UPDATE lessons SET short_title = 'Tes Unit 9', title = 'Tes Akhir Unit 9: Angka Besar, Harga & Satuan Benda' WHERE id = 'b0000027-0000-0000-0000-000009000007';

UPDATE units SET title = 'Jam, Hari, Jadwal Harian & Ujian Tahap 2', description = 'Sebutkan jam, menit, nama hari dalam seminggu, dan rentang jadwal kerja lalu ikuti Ujian Tahap 2.' WHERE id = 'a0000026-0000-0000-0000-000000000010';
UPDATE lessons SET short_title = '7 Kanji Nama Hari', title = 'Mengenal 7 Kanji Unsur Alam untuk Nama Hari (Senin–Minggu)' WHERE id = 'b0000001-0000-0000-0000-000000000014';
UPDATE lessons SET short_title = 'Jam, Menit & Tanggal', title = 'Kosakata Menyebut Jam, Menit & Tanggal di Kalender' WHERE id = 'b0000001-0000-0000-0000-000000000006';
UPDATE lessons SET short_title = 'Trik Menit & Setengah', title = 'Menyebut Menit (Fun/Pun) & Jam Setengah (Han)' WHERE id = 'b0000027-0000-0000-0000-000010000003';
UPDATE lessons SET short_title = 'Jam Mulai & Selesai', title = 'Kosakata Jam Kerja & Rentang Waktu (Kara ... Made)' WHERE id = 'b0000027-0000-0000-0000-000010000004';
UPDATE lessons SET short_title = 'Cerita Jadwal Waktu', title = 'Menggunakan Penanda Waktu (Ni) dalam Jadwal Harian' WHERE id = 'b0000018-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Persiapan Ujian T2', title = 'Latihan Gabungan Angka, Belanja & Waktu untuk Ujian Tahap 2' WHERE id = 'b0000027-0000-0000-0000-000010000006';
UPDATE lessons SET short_title = 'Ujian Tahap 2', title = 'Ujian Evaluasi Tahap 2: Identitas, Angka & Jadwal' WHERE id = 'b0000026-0000-0000-0000-000000001004';

UPDATE units SET title = 'Lanjut Katakana, Menu Kafe & Memesan Makanan', description = 'Baca daftar menu kafe berbahasa Katakana dan gunakan penanda objek agar lancar memesan makan serta minum.' WHERE id = 'a0000001-0000-0000-0000-000000000003';
UPDATE lessons SET short_title = 'Katakana Na–Ho', title = 'Lanjut Membaca Huruf Katakana Bagian 2 (Baris Na sampai Ho)' WHERE id = 'b0000026-0000-0000-0000-000000001101';
UPDATE lessons SET short_title = 'Menu Kafe & Minuman', title = 'Kosakata Makanan, Minuman & Pesanan Populer di Kafe' WHERE id = 'b0000001-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Baca Menu Katakana', title = 'Latihan Membaca Menu Kafe Asli Berhuruf Katakana' WHERE id = 'b0000027-0000-0000-0000-000011000003';
UPDATE lessons SET short_title = 'Penanda Objek (Wo)', title = 'Mengenal Penanda Objek Kalimat (Wo / O) dengan Kata Kerja' WHERE id = 'b0000027-0000-0000-0000-000011000004';
UPDATE lessons SET short_title = 'Kalimat Pesan Menu', title = 'Menyusun Kalimat Memesan & Membeli Makanan di Kafe' WHERE id = 'b0000001-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Pesan di Kafe', title = 'Praktik Membaca Menu & Memesan Makanan di Kafe' WHERE id = 'b0000026-0000-0000-0000-000000001104';
UPDATE lessons SET short_title = 'Tes Unit 11', title = 'Tes Akhir Unit 11: Katakana Kafe & Penanda Objek' WHERE id = 'b0000027-0000-0000-0000-000011000007';

UPDATE units SET title = 'Rutinitas Harian & Aktivitas Sehari-hari', description = 'Ceritakan kegiatan harianmu dari bangun tidur hingga malam, baik yang dilakukan maupun yang tidak dilakukan.' WHERE id = 'a0000026-0000-0000-0000-000000000012';
UPDATE lessons SET short_title = 'Kanji Aktivitas Awal', title = 'Mengenal 6 Kanji Aksi (Makan, Minum, Lihat, Dengar, Baca, Tulis)' WHERE id = 'b0000026-0000-0000-0000-000000001201';
UPDATE lessons SET short_title = 'Kata Kerja Harian', title = 'Kosakata Kata Kerja Rutinitas Sopan (-Masu)' WHERE id = 'b0000001-0000-0000-0000-000000000012';
UPDATE lessons SET short_title = 'Trik 6 Kanji Aksi', title = 'Membedakan Makna & Bacaan 6 Kanji Aktivitas Sehari-hari' WHERE id = 'b0000027-0000-0000-0000-000012000003';
UPDATE lessons SET short_title = 'Sarapan s/d Makan Malam', title = 'Kosakata Waktu Makan & Kebiasaan Setiap Hari (Mainichi)' WHERE id = 'b0000027-0000-0000-0000-000012000004';
UPDATE lessons SET short_title = 'Tidak & Seberapa Sering', title = 'Kalimat Tidak Melakukan (-Masen) & Kata Keterangan Frekuensi' WHERE id = 'b0000018-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Cerita Rutinitas', title = 'Praktik Menceritakan Jadwal & Kebiasaan Harianmu' WHERE id = 'b0000026-0000-0000-0000-000000001204';
UPDATE lessons SET short_title = 'Tes Unit 12', title = 'Tes Akhir Unit 12: Kata Kerja Harian & Frekuensi' WHERE id = 'b0000027-0000-0000-0000-000012000007';

UPDATE units SET title = 'Tempat Aktivitas, Alat & Bahasa Sehari-hari', description = 'Jelaskan di mana kamu beraktivitas, alat apa yang digunakan, serta dalam bahasa apa kamu berkomunikasi.' WHERE id = 'a0000026-0000-0000-0000-000000000013';
UPDATE lessons SET short_title = 'Kanji Tempat & De', title = 'Mengenal Kanji Sekolah/Toko & Penanda Tempat Aksi (De)' WHERE id = 'b0000026-0000-0000-0000-000000001301';
UPDATE lessons SET short_title = 'Alat & Bahasa Harian', title = 'Kosakata Lokasi, Alat Makan & Bahasa (Sumpit, Bahasa Jepang)' WHERE id = 'b0000026-0000-0000-0000-000000001302';
UPDATE lessons SET short_title = 'Pakai Alat & Bahasa', title = 'Menyebut Alat & Bahasa Pengantar dengan De (Memakai Sumpit)' WHERE id = 'b0000027-0000-0000-0000-000013000003';
UPDATE lessons SET short_title = 'Tempat Aktivitas Umum', title = 'Kosakata Tempat Beraktivitas (Perpustakaan, Restoran, Mal)' WHERE id = 'b0000027-0000-0000-0000-000013000004';
UPDATE lessons SET short_title = 'Beda Di: De vs Ni', title = 'Membedakan ''Di'' untuk Beraktivitas (De) vs Waktu/Lokasi (Ni)' WHERE id = 'b0000026-0000-0000-0000-000000001303';
UPDATE lessons SET short_title = 'Praktik Tempat & Alat', title = 'Praktik Menjelaskan Lokasi Kegiatan & Alat yang Dipakai' WHERE id = 'b0000026-0000-0000-0000-000000001304';
UPDATE lessons SET short_title = 'Tes Unit 13', title = 'Tes Akhir Unit 13: Penanda Tempat & Alat (De vs Ni)' WHERE id = 'b0000027-0000-0000-0000-000013000007';

UPDATE units SET title = 'Mengajak Teman, Menawarkan Bantuan & Kata Sambung', description = 'Ajak teman atau rekan kerja melakukan sesuatu dengan sopan, tawarkan bantuan, dan sambung kalimatmu agar mengalir.' WHERE id = 'a0000026-0000-0000-0000-000000000014';
UPDATE lessons SET short_title = 'Pola Ajakan Sopan', title = 'Mengulang Penanda Kalimat & Mulai Mengajak (-Masenka)' WHERE id = 'b0000026-0000-0000-0000-000000001401';
UPDATE lessons SET short_title = 'Kosakata Tawar Bantu', title = 'Kosakata Ajakan, Tawarkan Bantuan & Kata Penghubung' WHERE id = 'b0000026-0000-0000-0000-000000001402';
UPDATE lessons SET short_title = 'Biar Saya Bantu', title = 'Menawarkan Bantuan dengan Sopan (-Mashouka) & Responnya' WHERE id = 'b0000027-0000-0000-0000-000014000003';
UPDATE lessons SET short_title = 'Kata Sambung Alami', title = 'Menghubungkan Dua Kalimat (Lalu, Setelah Itu, Baiklah)' WHERE id = 'b0000027-0000-0000-0000-000014000004';
UPDATE lessons SET short_title = 'Kalimat Ajak Teman', title = 'Membedakan Ajakan Halus (-Masenka) & Ayo Lakukan (-Mashou)' WHERE id = 'b0000001-0000-0000-0000-000000000013';
UPDATE lessons SET short_title = 'Praktik Ajak Teman', title = 'Praktik Mengajak Teman & Menawarkan Bantuan Sehari-hari' WHERE id = 'b0000026-0000-0000-0000-000000001404';
UPDATE lessons SET short_title = 'Tes Unit 14', title = 'Tes Akhir Unit 14: Ajakan Sopan & Tawar Bantuan' WHERE id = 'b0000027-0000-0000-0000-000014000007';

UPDATE units SET title = 'Transportasi, Arah Pergi, Rute & Ujian Tahap 3', description = 'Ceritakan cara berangkat naik transportasi, tujuan pergi, bersama siapa, dan ikuti Ujian Tahap 3.' WHERE id = 'a0000001-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Kanji Pergi & Stasiun', title = 'Mengenal Kanji Pergi, Datang, Stasiun & Arah Tujuan (He/E)' WHERE id = 'b0000001-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Kendaraan & Jalan Kaki', title = 'Kosakata Transportasi, Jalan Kaki & Pergi Bersama Teman (To)' WHERE id = 'b0000001-0000-0000-0000-000000000015';
UPDATE lessons SET short_title = 'Kata Kerja Pergi-Pulang', title = 'Pola Arah Tujuan dengan Pergi, Datang, dan Pulang' WHERE id = 'b0000027-0000-0000-0000-000015000003';
UPDATE lessons SET short_title = 'Naik Kereta & Bus', title = 'Kosakata Kendaraan Komuter (Kereta, Bus, Shinkansen)' WHERE id = 'b0000027-0000-0000-0000-000015000004';
UPDATE lessons SET short_title = 'Rute & Jarak Perjalanan', title = 'Menyebut Rute Dari-Ke (Kara...Made) & Moda Transportasi' WHERE id = 'b0000018-0000-0000-0000-000000000004';
UPDATE lessons SET short_title = 'Persiapan Ujian T3', title = 'Latihan Gabungan Aktivitas Harian & Perjalanan untuk Ujian 3' WHERE id = 'b0000027-0000-0000-0000-000015000006';
UPDATE lessons SET short_title = 'Ujian Tahap 3', title = 'Ujian Evaluasi Tahap 3: Rutinitas, Tempat & Perjalanan' WHERE id = 'b0000026-0000-0000-0000-000000001504';

UPDATE units SET title = 'Katakana Fasilitas Kota & Menyatakan Keberadaan', description = 'Baca nama fasilitas kota dalam Katakana dan nyatakan ada atau tidak adanya benda serta makhluk hidup.' WHERE id = 'a0000001-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Katakana Ma–Ro', title = 'Lanjut Membaca Huruf Katakana Bagian 3 (Baris Ma sampai Ro)' WHERE id = 'b0000026-0000-0000-0000-000000001601';
UPDATE lessons SET short_title = 'Fasilitas Umum Kota', title = 'Kosakata Tempat Umum di Kota & Makhluk Hidup' WHERE id = 'b0000001-0000-0000-0000-000000000019';
UPDATE lessons SET short_title = 'Katakana Kota Modern', title = 'Membaca Nama Gedung & Fasilitas Kota dalam Katakana' WHERE id = 'b0000027-0000-0000-0000-000016000003';
UPDATE lessons SET short_title = 'Ada: Benda vs Orang', title = 'Membedakan Arimasu (Benda Mati) vs Imasu (Orang & Hewan)' WHERE id = 'b0000027-0000-0000-0000-000016000004';
UPDATE lessons SET short_title = 'Lokasi Benda & Orang', title = 'Menyusun Kalimat Menyatakan Lokasi Keberadaan Benda & Orang' WHERE id = 'b0000001-0000-0000-0000-000000000016';
UPDATE lessons SET short_title = 'Tanya Fasilitas Kota', title = 'Praktik Menanyakan Letak Fasilitas Kota & Keberadaan' WHERE id = 'b0000026-0000-0000-0000-000000001604';
UPDATE lessons SET short_title = 'Tes Unit 16', title = 'Tes Akhir Unit 16: Katakana Kota & Arimasu vs Imasu' WHERE id = 'b0000027-0000-0000-0000-000016000007';

UPDATE units SET title = 'Letak Benda di Ruangan & Menyebutkan Daftar', description = 'Jelaskan posisi benda secara detail seperti di atas, bawah, atau sebelah, dan sebutkan beberapa barang sekaligus.' WHERE id = 'a0000026-0000-0000-0000-000000000017';
UPDATE lessons SET short_title = 'Kanji Posisi Awal', title = 'Mengenal Kanji Arah Posisi Dasar (Atas, Bawah, Dalam, Depan)' WHERE id = 'b0000026-0000-0000-0000-000000001701';
UPDATE lessons SET short_title = 'Letak Benda di Ruang', title = 'Kosakata Posisi Benda (Di Atas, Bawah, Samping, Antara)' WHERE id = 'b0000001-0000-0000-0000-000000000017';
UPDATE lessons SET short_title = '8 Kanji Posisi Ruang', title = 'Menguasai 8 Kanji Posisi & Arah (Kanan, Kiri, Belakang, Tengah)' WHERE id = 'b0000027-0000-0000-0000-000017000003';
UPDATE lessons SET short_title = 'Posisi Dekat & Seberang', title = 'Kosakata Letak Sekitar (Di Sebelah, Dekat, Sisi, Di Antara)' WHERE id = 'b0000027-0000-0000-0000-000017000004';
UPDATE lessons SET short_title = 'Denah & Daftar Barang', title = 'Membedakan Daftar Lengkap (To) vs Sebagian (Ya) di Denah' WHERE id = 'b0000018-0000-0000-0000-000000000005';
UPDATE lessons SET short_title = 'Jelaskan Letak Benda', title = 'Praktik Mendeskripsikan Posisi Benda dalam Ruangan' WHERE id = 'b0000026-0000-0000-0000-000000001704';
UPDATE lessons SET short_title = 'Tes Unit 17', title = 'Tes Akhir Unit 17: Posisi Ruangan & Daftar Barang' WHERE id = 'b0000027-0000-0000-0000-000017000007';

UPDATE units SET title = 'Tuntas 46 Katakana & Menggambarkan Benda (Sifat-I)', description = 'Selesaikan seluruh 46 huruf Katakana tanpa tertukar huruf mirip sambil belajar menggambarkan sifat benda.' WHERE id = 'a0000001-0000-0000-0000-000000000006';
UPDATE lessons SET short_title = 'Katakana Wa–N', title = 'Menuntaskan Huruf Katakana Bagian Akhir (Baris Wa sampai N)' WHERE id = 'b0000026-0000-0000-0000-000000001801';
UPDATE lessons SET short_title = 'Kata Sifat-I Populer', title = 'Kosakata Kata Sifat Berakhiran I & Lawan Katanya' WHERE id = 'b0000026-0000-0000-0000-000000001802';
UPDATE lessons SET short_title = 'Bedakan Huruf Kembar', title = 'Trik Jitu Membedakan Katakana Mirip (Shi vs Tsu & So vs N)' WHERE id = 'b0000027-0000-0000-0000-000018000003';
UPDATE lessons SET short_title = 'Sifat Benda Harian', title = 'Kosakata Sifat Benda Sehari-hari (Besar, Mahal, Baru)' WHERE id = 'b0000027-0000-0000-0000-000018000004';
UPDATE lessons SET short_title = 'Kalimat Sifat-I', title = 'Menyusun Kalimat Positif & Tidak untuk Kata Sifat-I (-Kunai)' WHERE id = 'b0000001-0000-0000-0000-000000000020';
UPDATE lessons SET short_title = 'Deskripsikan Benda', title = 'Praktik Membaca 46 Katakana & Menggambarkan Benda' WHERE id = 'b0000026-0000-0000-0000-000000001804';
UPDATE lessons SET short_title = 'Tes Unit 18', title = 'Tes Akhir Unit 18: Tuntas 46 Katakana & Kata Sifat-I' WHERE id = 'b0000027-0000-0000-0000-000018000007';

UPDATE units SET title = 'Belanja Baju, Warna & Cara Memakai Pakaian', description = 'Sebutkan warna serta jenis pakaian, pahami kata kerja memakai baju atau topi yang berbeda, dan tanyakan pilihan barang.' WHERE id = 'a0000026-0000-0000-0000-000000000019';
UPDATE lessons SET short_title = 'Kanji Warna & Harga', title = 'Mengenal Kanji Warna & Harga (Merah, Biru, Mahal, Murah)' WHERE id = 'b0000026-0000-0000-0000-000000001901';
UPDATE lessons SET short_title = 'Jenis Pakaian Harian', title = 'Kosakata Pakaian & Kata Memakai Khusus Atas vs Bawah' WHERE id = 'b0000026-0000-0000-0000-000000001902';
UPDATE lessons SET short_title = 'Bentuk Tidak Sifat-I', title = 'Mengubah Kata Sifat-I Jadi ''Tidak ...'' & Pengecualian Ii' WHERE id = 'b0000027-0000-0000-0000-000019000003';
UPDATE lessons SET short_title = 'Warna & Cara Pakai', title = 'Kosakata Warna, Pakaian & Aksesoris (Topi, Sepatu, Kacamata)' WHERE id = 'b0000027-0000-0000-0000-000019000004';
UPDATE lessons SET short_title = 'Pilih Barang di Toko', title = 'Menanyakan ''Yang Mana / Seperti Apa'' (Dono / Donna) Saat Belanja' WHERE id = 'b0000018-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Belanja Baju', title = 'Praktik Percakapan Memilih Warna & Pakaian di Toko' WHERE id = 'b0000026-0000-0000-0000-000000001904';
UPDATE lessons SET short_title = 'Tes Unit 19', title = 'Tes Akhir Unit 19: Negasi Sifat-I, Warna & Pakaian' WHERE id = 'b0000027-0000-0000-0000-000019000007';

UPDATE units SET title = 'Ngobrolin Cuaca, Kesukaan, Perbandingan & Ujian Tahap 4', description = 'Ceritakan cuaca dan 4 musim, ungkapkan hal favorit serta perbandingan dua hal, lalu hadapi Ujian Tahap 4.' WHERE id = 'a0000026-0000-0000-0000-000000000020';
UPDATE lessons SET short_title = 'Kenali Kata Sifat-Na', title = 'Mengenal Kata Sifat-Na & Bedanya dengan Kata Sifat-I (Kirei)' WHERE id = 'b0000001-0000-0000-0000-000000000021';
UPDATE lessons SET short_title = 'Cuaca & Lampau Sifat', title = 'Kosakata Cuaca & Mengubah Kata Sifat ke Bentuk Lampau' WHERE id = 'b0000001-0000-0000-0000-000000000022';
UPDATE lessons SET short_title = 'Sifat-Na & Bandingkan', title = 'Memakai Sifat-Na Sebelum Benda & Membandingkan (Yori / Hou)' WHERE id = 'b0000027-0000-0000-0000-000020000003';
UPDATE lessons SET short_title = 'Cuaca & 4 Musim', title = 'Kosakata Musim Panas-Dingin & Suasana Kota di Jepang' WHERE id = 'b0000027-0000-0000-0000-000020000004';
UPDATE lessons SET short_title = 'Kesukaan & Pilihan', title = 'Mengungkapkan Kesukaan (Suki) & Memilih Mana yang Lebih Unggul' WHERE id = 'b0000001-0000-0000-0000-000000000023';
UPDATE lessons SET short_title = 'Persiapan Ujian T4', title = 'Latihan Gabungan Keberadaan, Pakaian, Cuaca & Sifat untuk Ujian 4' WHERE id = 'b0000027-0000-0000-0000-000020000006';
UPDATE lessons SET short_title = 'Ujian Tahap 4', title = 'Ujian Evaluasi Tahap 4: Ruang, Keberadaan & Kata Sifat' WHERE id = 'b0000018-0000-0000-0000-000000000008';

UPDATE units SET title = 'Minta Tolong dengan Sopan & Menanyakan Arah Jalan', description = 'Pelajari cara mengubah kata kerja menjadi bentuk sambung untuk meminta tolong dan memberi petunjuk jalan.' WHERE id = 'a0000001-0000-0000-0000-000000000007';
UPDATE lessons SET short_title = 'Kenali Bentuk Sambung', title = 'Mengenal Perubahan Kata Kerja Bentuk-Te (Tiga Kelompok Kata Kerja)' WHERE id = 'b0000001-0000-0000-0000-000000000024';
UPDATE lessons SET short_title = 'Kosakata Arah Jalan', title = 'Kosakata Belok, Menyeberang & Sudut Jalan (Magaru, Wataru)' WHERE id = 'b0000026-0000-0000-0000-000000002102';
UPDATE lessons SET short_title = 'Trik 3 Kelompok Te', title = 'Pola Praktis Mengubah Kata Kerja Kelompok 1, 2 & 3 ke Bentuk-Te' WHERE id = 'b0000027-0000-0000-0000-000021000003';
UPDATE lessons SET short_title = 'Landmark & Rambu', title = 'Kosakata Petunjuk Jalan Lengkap (Lampu Lalu Lintas, Sudut)' WHERE id = 'b0000027-0000-0000-0000-000021000004';
UPDATE lessons SET short_title = 'Minta Tolong & Arah', title = 'Meminta Tolong dengan Sopan (-Te Kudasai) & Menunjukkan Arah' WHERE id = 'b0000018-0000-0000-0000-000000000006';
UPDATE lessons SET short_title = 'Tanya Arah Jalan', title = 'Praktik Menanyakan & Memberikan Petunjuk Jalan dalam Bahasa Jepang' WHERE id = 'b0000026-0000-0000-0000-000000002104';
UPDATE lessons SET short_title = 'Tes Unit 21', title = 'Tes Akhir Unit 21: Bentuk-Te, Permintaan & Arah Jalan' WHERE id = 'b0000027-0000-0000-0000-000021000007';

UPDATE units SET title = 'Urutan Aktivitas & Kegiatan yang Sedang Berlangsung', description = 'Ceritakan dua kegiatan berurutan dan jelaskan apa yang sedang kamu lakukan atau kondisi yang sedang berlangsung.' WHERE id = 'a0000026-0000-0000-0000-000000000022';
UPDATE lessons SET short_title = 'Kata Kerja Kondisi', title = 'Mengulang Bentuk-Te & Kata Kerja Status (Tinggal, Kenal, Punya)' WHERE id = 'b0000026-0000-0000-0000-000000002201';
UPDATE lessons SET short_title = 'Urutan Setelah (Tekara)', title = 'Menyambung Kegiatan Berurutan (''Setelah Ini, Lalu Itu'')' WHERE id = 'b0000001-0000-0000-0000-000000000027';
UPDATE lessons SET short_title = 'Sedang & Kondisi Tetap', title = 'Membedakan Arti ''Sedang Melakukan'' vs Kondisi (-Te Imasu)' WHERE id = 'b0000027-0000-0000-0000-000022000003';
UPDATE lessons SET short_title = 'Rangkaian Kegiatan', title = 'Kosakata Kegiatan Beruntun Sepanjang Hari (-Te / -Tekara)' WHERE id = 'b0000027-0000-0000-0000-000022000004';
UPDATE lessons SET short_title = 'Kalimat Sedang Lakukan', title = 'Menyusun Kalimat Tentang Aktivitas yang Sedang Berlangsung' WHERE id = 'b0000001-0000-0000-0000-000000000025';
UPDATE lessons SET short_title = 'Cerita Aktivitas', title = 'Praktik Menceritakan Urutan Aktivitas & Kegiatan Saat Ini' WHERE id = 'b0000026-0000-0000-0000-000000002204';
UPDATE lessons SET short_title = 'Tes Unit 22', title = 'Tes Akhir Unit 22: Urutan Kegiatan & Sedang Berlangsung' WHERE id = 'b0000027-0000-0000-0000-000022000007';

UPDATE units SET title = 'Meminta Izin, Rambu Larangan & Aturan Umum', description = 'Tanyakan apakah sesuatu diperbolehkan, pahami larangan di tempat umum, dan minta seseorang agar tidak melakukan hal tertentu.' WHERE id = 'a0000026-0000-0000-0000-000000000023';
UPDATE lessons SET short_title = 'Bentuk Tidak (Nai)', title = 'Mengenal Perubahan Kata Kerja Bentuk-Nai (Kelompok 1 sampai 3)' WHERE id = 'b0000026-0000-0000-0000-000000002301';
UPDATE lessons SET short_title = 'Minta Izin (-Te Mo Ii)', title = 'Kosakata Aturan Umum & Cara Meminta Izin Secara Sopan' WHERE id = 'b0000001-0000-0000-0000-000000000026';
UPDATE lessons SET short_title = 'Larangan & Bentuk-Nai', title = 'Menyatakan Dilarang (-Te Wa Ikemasen) & Mengulang Bentuk-Nai' WHERE id = 'b0000027-0000-0000-0000-000023000003';
UPDATE lessons SET short_title = 'Rambu Tempat Umum', title = 'Kosakata Izin & Rambu Larangan di Kantor serta Fasilitas Umum' WHERE id = 'b0000027-0000-0000-0000-000023000004';
UPDATE lessons SET short_title = 'Tolong Jangan Lakukan', title = 'Meminta Orang Lain Tidak Melakukan Sesuatu (-Naide Kudasai)' WHERE id = 'b0000018-0000-0000-0000-000000000011';
UPDATE lessons SET short_title = 'Praktik Aturan & Izin', title = 'Praktik Meminta Izin & Memahami Rambu Larangan Harian' WHERE id = 'b0000026-0000-0000-0000-000000002304';
UPDATE lessons SET short_title = 'Tes Unit 23', title = 'Tes Akhir Unit 23: Izin, Larangan & Bentuk-Nai' WHERE id = 'b0000027-0000-0000-0000-000023000007';

UPDATE units SET title = 'Bagian Tubuh, Berobat di Klinik & Kewajiban', description = 'Sebutkan keluhan sakit dan bagian tubuh saat berobat di klinik serta sampaikan hal yang wajib atau boleh tidak dilakukan.' WHERE id = 'a0000026-0000-0000-0000-000000000024';
UPDATE lessons SET short_title = 'Kanji Tubuh & Klinik', title = 'Mengenal Kanji Rumah Sakit & Anggota Tubuh (Mata, Tangan, Kaki)' WHERE id = 'b0000026-0000-0000-0000-000000002401';
UPDATE lessons SET short_title = 'Keluhan Sakit Harian', title = 'Kosakata Bagian Tubuh & Keluhan Sakit (Pusing, Demam)' WHERE id = 'b0000026-0000-0000-0000-000000002402';
UPDATE lessons SET short_title = 'Harus vs Tidak Perlu', title = 'Membedakan Kewajiban (-Nakereba Narimasen) & Boleh Tidak Dilakukan' WHERE id = 'b0000027-0000-0000-0000-000024000003';
UPDATE lessons SET short_title = 'Kosakata di Klinik', title = 'Kosakata Pemeriksaan Klinik, Resep Obat & Gejala Sakit' WHERE id = 'b0000027-0000-0000-0000-000024000004';
UPDATE lessons SET short_title = 'Kalimat Wajib & Izin', title = 'Menyusun Kalimat Kewajiban & Keringanan Saat Sakit' WHERE id = 'b0000026-0000-0000-0000-000000002403';
UPDATE lessons SET short_title = 'Periksa di Klinik', title = 'Praktik Menyampaikan Gejala Sakit & Bertanya Aturan di Klinik' WHERE id = 'b0000026-0000-0000-0000-000000002404';
UPDATE lessons SET short_title = 'Tes Unit 24', title = 'Tes Akhir Unit 24: Kesehatan, Klinik & Kewajiban' WHERE id = 'b0000027-0000-0000-0000-000024000007';

UPDATE units SET title = 'Menyambung Sifat, Perubahan Keadaan & Ujian Tahap 5', description = 'Gabungkan dua kata sifat dalam satu kalimat, ceritakan hal yang mulai berubah, lalu tuntaskan Ujian Tahap 5.' WHERE id = 'a0000026-0000-0000-0000-000000000025';
UPDATE lessons SET short_title = 'Sambung Kata Sifat', title = 'Menghubungkan Dua Sifat Sekaligus dengan Akhiran (-Kute / -De)' WHERE id = 'b0000026-0000-0000-0000-000000002501';
UPDATE lessons SET short_title = 'Sifat Gabungan Benda', title = 'Kosakata Deskripsi Gabungan (Murah dan Enak, Ramah dan Cantik)' WHERE id = 'b0000026-0000-0000-0000-000000002502';
UPDATE lessons SET short_title = 'Pola ''Menjadi'' (Naru)', title = 'Menyatakan Perubahan Keadaan (''Menjadi Lebih ...'') dengan Naru' WHERE id = 'b0000027-0000-0000-0000-000025000003';
UPDATE lessons SET short_title = 'Deskripsi Tempat', title = 'Kosakata Sifat Gabungan untuk Makanan & Lingkungan Sekitar' WHERE id = 'b0000027-0000-0000-0000-000025000004';
UPDATE lessons SET short_title = 'Kalimat Perubahan', title = 'Menyusun Kalimat Perubahan Musim, Usia & Kemampuan (-Ku/Ni Naru)' WHERE id = 'b0000026-0000-0000-0000-000000002503';
UPDATE lessons SET short_title = 'Persiapan Ujian T5', title = 'Latihan Gabungan Bentuk-Te, Nai, Kewajiban & Sifat untuk Ujian 5' WHERE id = 'b0000027-0000-0000-0000-000025000006';
UPDATE lessons SET short_title = 'Ujian Tahap 5', title = 'Ujian Evaluasi Tahap 5: Bentuk-Te, Izin, Klinik & Perubahan' WHERE id = 'b0000026-0000-0000-0000-000000002504';

UPDATE units SET title = 'Cerita Masa Lampau, Akhir Pekan & Pengalaman', description = 'Ceritakan kegiatan yang sudah kamu lakukan, contoh aktivitas akhir pekan, dan pengalaman berkesan selama hidup.' WHERE id = 'a0000001-0000-0000-0000-000000000008';
UPDATE lessons SET short_title = 'Bentuk Lampau (Ta)', title = 'Mengenal Perubahan Kata Kerja Bentuk Lampau Santai (Bentuk-Ta)' WHERE id = 'b0000018-0000-0000-0000-000000000009';
UPDATE lessons SET short_title = 'Cerita Akhir Pekan', title = 'Kosakata Kegiatan Akhir Pekan & Urutan Waktu Lampau' WHERE id = 'b0000018-0000-0000-0000-000000000010';
UPDATE lessons SET short_title = 'Contoh Kegiatan (-Tari)', title = 'Menyebut Beberapa Contoh Kegiatan dengan Pola (-Tari ... -Tari)' WHERE id = 'b0000027-0000-0000-0000-000026000003';
UPDATE lessons SET short_title = 'Setelah (Ta Atode)', title = 'Kosakata Rangkaian Kejadian Setelah Melakukan Sesuatu (-Ta Atode)' WHERE id = 'b0000027-0000-0000-0000-000026000004';
UPDATE lessons SET short_title = 'Pernah Lakukan', title = 'Menceritakan Pengalaman Hidup (''Pernah ...'') dengan Ta Koto Ga Aru' WHERE id = 'b0000001-0000-0000-0000-000000000030';
UPDATE lessons SET short_title = 'Cerita Pengalaman', title = 'Praktik Menceritakan Pengalaman & Kegiatan Akhir Pekanmu' WHERE id = 'b0000026-0000-0000-0000-000000002604';
UPDATE lessons SET short_title = 'Tes Unit 26', title = 'Tes Akhir Unit 26: Masa Lampau, Pengalaman & Akhir Pekan' WHERE id = 'b0000027-0000-0000-0000-000026000007';

UPDATE units SET title = 'Bentuk Kamus, Hobi, Bakat & Urutan Waktu', description = 'Gunakan bentuk dasar kata kerja untuk berbicara tentang hobi, hal yang kamu bisa lakukan, serta momen ''sebelum'' dan ''saat''.' WHERE id = 'a0000026-0000-0000-0000-000000000027';
UPDATE lessons SET short_title = 'Kenali Bentuk Kamus', title = 'Mengenal Kata Kerja Bentuk Dasar Seperti di Kamus (Jishokei)' WHERE id = 'b0000018-0000-0000-0000-000000000013';
UPDATE lessons SET short_title = 'Hobi & Kemahiran', title = 'Kosakata Hobi, Keterampilan & Hal yang Bisa Kamu Lakukan' WHERE id = 'b0000026-0000-0000-0000-000000002702';
UPDATE lessons SET short_title = 'Sebelum & Saat', title = 'Membedakan Pola Waktu Sebelum (Mae Ni) & Ketika / Saat (Toki)' WHERE id = 'b0000027-0000-0000-0000-000027000003';
UPDATE lessons SET short_title = 'Menyatakan Bisa', title = 'Menyebut Kemahiran & Hobi dengan Pola Dekiru / Koto Ga Dekimasu' WHERE id = 'b0000027-0000-0000-0000-000027000004';
UPDATE lessons SET short_title = 'Kalimat Momen Waktu', title = 'Menyusun Kalimat Kejadian Sebelum & Saat Aktivitas Berlangsung' WHERE id = 'b0000026-0000-0000-0000-000000002703';
UPDATE lessons SET short_title = 'Cerita Hobi & Bakat', title = 'Praktik Menceritakan Hobi, Bakat & Kebiasaan Harian' WHERE id = 'b0000026-0000-0000-0000-000000002704';
UPDATE lessons SET short_title = 'Tes Unit 27', title = 'Tes Akhir Unit 27: Bentuk Kamus, Hobi & Urutan Waktu' WHERE id = 'b0000027-0000-0000-0000-000027000007';

UPDATE units SET title = 'Gaya Bicara Santai, Pendapat, Kutipan & Ujian Tahap 6', description = 'Pahami gaya bicara santai dengan teman dekat, cara mengutip ucapan orang lain, dan selesaikan Ujian Tahap 6.' WHERE id = 'a0000026-0000-0000-0000-000000000028';
UPDATE lessons SET short_title = 'Gaya Bicara Santai', title = 'Mengenal Gaya Bahasa Santai ke Teman Dekat (Bentuk Kasual)' WHERE id = 'b0000026-0000-0000-0000-000000002801';
UPDATE lessons SET short_title = 'Sampaikan Pendapat', title = 'Kosakata Pendapat (''Menurutku ...'') & Kutipan Ucapan Orang' WHERE id = 'b0000026-0000-0000-0000-000000002802';
UPDATE lessons SET short_title = 'Jelaskan Benda & Orang', title = 'Menambahkan Keterangan Panjang di Depan Benda (Masakan Buatan Ibu)' WHERE id = 'b0000027-0000-0000-0000-000028000003';
UPDATE lessons SET short_title = 'Opini & Kutipan Kata', title = 'Menyatakan Pendapat (To Omou) & Mengutip Ucapan (To Iimashita)' WHERE id = 'b0000027-0000-0000-0000-000028000004';
UPDATE lessons SET short_title = 'Gabung Penjelas Benda', title = 'Menyusun Kalimat Panjang dengan Penjelas Benda atau Orang' WHERE id = 'b0000026-0000-0000-0000-000000002803';
UPDATE lessons SET short_title = 'Persiapan Ujian T6', title = 'Latihan Gabungan Lampau, Hobi, Santai & Opini untuk Ujian 6' WHERE id = 'b0000027-0000-0000-0000-000028000006';
UPDATE lessons SET short_title = 'Ujian Tahap 6', title = 'Ujian Evaluasi Tahap 6: Lampau, Kamus, Gaya Santai & Opini' WHERE id = 'b0000026-0000-0000-0000-000000002804';

UPDATE units SET title = 'Mengungkapkan Keinginan, Tujuan & Saling Membantu', description = 'Sampaikan keinginanmu serta tujuan pergi, sebutkan alasan, dan pahami budaya saling memberi dalam bahasa Jepang.' WHERE id = 'a0000026-0000-0000-0000-000000000029';
UPDATE lessons SET short_title = 'Ingin Lakukan vs Benda', title = 'Membedakan Ingin Melakukan (-Tai) vs Ingin Benda (Hoshii)' WHERE id = 'b0000001-0000-0000-0000-000000000028';
UPDATE lessons SET short_title = 'Tujuan Pergi & Alasan', title = 'Menyatakan Tujuan Pergi (-Ni Iku) & Alasan Sederhana (Kara)' WHERE id = 'b0000001-0000-0000-0000-000000000029';
UPDATE lessons SET short_title = 'Kalimat Keinginan', title = 'Menyusun Kalimat Keinginan & Target Pribadi Secara Sopan' WHERE id = 'b0000027-0000-0000-0000-000029000003';
UPDATE lessons SET short_title = 'Memberi & Menerima', title = 'Memahami Sudut Pandang Memberi & Menerima (Ageru, Morau, Kureru)' WHERE id = 'b0000027-0000-0000-0000-000029000004';
UPDATE lessons SET short_title = 'Kalimat Saling Bantu', title = 'Menyusun Kalimat Terima Kasih & Saling Membantu Sehari-hari' WHERE id = 'b0000018-0000-0000-0000-000000000012';
UPDATE lessons SET short_title = 'Praktik Saling Bantu', title = 'Praktik Mengungkapkan Rencana, Keinginan & Budaya Saling Bantu' WHERE id = 'b0000026-0000-0000-0000-000000002904';
UPDATE lessons SET short_title = 'Tes Unit 29', title = 'Tes Akhir Unit 29: Keinginan, Tujuan & Saling Membantu' WHERE id = 'b0000027-0000-0000-0000-000029000007';

UPDATE units SET title = 'Pemantapan Total & Simulasi Siap Ujian JLPT N5', description = 'Uji seluruh kemampuan Hiragana, Katakana, 50+ Kanji, kosakata jebakan, serta simulasi percakapan siap JLPT N5.' WHERE id = 'a0000026-0000-0000-0000-000000000030';
UPDATE lessons SET short_title = 'Ulasan Semua Aksara', title = 'Pemantapan Total 46 Hiragana, 46 Katakana & 50+ Kanji Dasar' WHERE id = 'b0000026-0000-0000-0000-000000003001';
UPDATE lessons SET short_title = 'Kosakata Jebakan N5', title = 'Ulasan Kata yang Sering Tertukar & Ungkapan Penting Harian' WHERE id = 'b0000001-0000-0000-0000-000000000031';
UPDATE lessons SET short_title = 'Jebakan Partikel N5', title = 'Membedakan Jebakan Partikel Wa, Ga, Ni, De, He, dan Wo' WHERE id = 'b0000027-0000-0000-0000-000030000003';
UPDATE lessons SET short_title = 'Baca Pengumuman', title = 'Membaca Pengumuman, Jadwal Jam Buka & Tiket Sehari-hari' WHERE id = 'b0000027-0000-0000-0000-000030000004';
UPDATE lessons SET short_title = 'Rangkuman Pola N5', title = 'Rangkuman Lintas 16+ Pola Kalimat & Tata Bahasa Penting JLPT N5' WHERE id = 'b0000018-0000-0000-0000-000000000014';
UPDATE lessons SET short_title = 'Simulasi Wawancara', title = 'Simulasi Tanya Jawab & Percakapan Kerja/Kehidupan di Jepang' WHERE id = 'b0000027-0000-0000-0000-000030000006';
UPDATE lessons SET short_title = 'Simulasi Akhir N5', title = 'Simulasi Terpadu Akhir JLPT N5 (Baca, Dengar, Tulis, Bicara)' WHERE id = 'b0000026-0000-0000-0000-000000003004';

UPDATE units SET title = 'Ujian Simulasi Kesiapan JLPT N5', description = 'Uji kesiapan pemahaman tata bahasa dan kosakata dasar JLPT N5 dalam simulasi berbatas waktu.' WHERE id = 'a0000001-0000-0000-0000-000000000002';
UPDATE lessons SET short_title = 'Simulasi Ujian N5', title = 'Simulasi Sectional N5: Evaluasi Tata Bahasa & Kosakata' WHERE id = 'b0000001-0000-0000-0000-000000000003';

COMMIT;
