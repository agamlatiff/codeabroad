import type { GrammarPoint } from '@/features/curriculum/types/curriculum'
import type { DidYouKnowTone } from '@/shared/components/ui/DidYouKnowCallout'
import type { KodiEmotion } from '@/shared/components/ui/KodiCharacter'

export interface GrammarDidYouKnowInfo {
  title: string
  description: string
  example: string
  tone: DidYouKnowTone
  emotion: KodiEmotion
}

/**
 * Maps a grammar point (its category, title, or formula) into a beginner-friendly
 * "Tahukah Kamu?" explanation card in everyday Indonesian.
 */
export function resolveGrammarDidYouKnow(point: GrammarPoint): GrammarDidYouKnowInfo {
  const haystack = `${point.title} ${point.formula} ${point.explanation}`.toLowerCase()

  if (haystack.includes('partikel') || point.category === 'particle') {
    if (haystack.includes('objek') || haystack.includes('transitif') || haystack.includes('を')) {
      return {
        title: 'Apa itu Partikel Objek (を) & Verba Transitif?',
        description:
          'Partikel adalah "penanda peran" kecil di belakang kata benda. Khusus partikel を (dibaca "o"), tugasnya menunjuk benda yang dikenai aksi. Sedangkan Verba Transitif adalah kata kerja yang butuh objek (misalnya makan, minum, membaca).',
        example: 'Analogi: コーヒーを のみます = "[Kopi] (objeknya) ← minum" → Minum kopi.',
        tone: 'amber',
        emotion: 'curious',
      }
    }

    return {
      title: 'Apa itu Partikel dalam Bahasa Jepang?',
      description:
        'Partikel adalah 1–2 huruf Hiragana kecil yang menempel di belakang kata (seperti は, の, に, で, を) untuk menunjukkan fungsi kata itu — mirip kata depan "di, ke, dengan, milik" di bahasa Indonesia, tapi letaknya sesudah kata benda.',
      example: 'Analogi: わたしの ほん = "Saya + の (milik) + buku" → Buku milik saya.',
      tone: 'amber',
      emotion: 'curious',
    }
  }

  if (haystack.includes('predikat') || point.category === 'sentence_pattern') {
    return {
      title: 'Apa itu Topik (は) & Predikat di Akhir Kalimat?',
      description:
        'Berbeda dari bahasa Indonesia, predikat (kata kerja atau inti keterangan seperti "adalah / melakukan apa") dalam bahasa Jepang selalu ditaruh di PALING BELAKANG kalimat! Partikel は (dibaca "wa") berfungsi memberi tahu apa topik pembicaraannya.',
      example: 'Rumus santai: "[Yang dibahas] は + [Penjelasannya di akhir] です".',
      tone: 'blue',
      emotion: 'explaining',
    }
  }

  if (point.category === 'conjugation') {
    return {
      title: 'Apa maksudnya "Konjugasi" Kata Kerja?',
      description:
        'Konjugasi adalah perubahan bentuk ekor kata kerja untuk mengganti nuansa waktu, sopan/santai, atau penyangkalan — mirip dalam bahasa Indonesia menambah awalan/kata bantu, tapi di Jepang bagian belakang katanya yang berubah (-masu, -masen, -mashita).',
      example: 'Contoh: たべます (makan) → たべません (tidak makan) → たべました (sudah makan).',
      tone: 'emerald',
      emotion: 'idea',
    }
  }

  if (point.category === 'tense') {
    return {
      title: 'Cara Kerja "Tense" (Bentuk Waktu) di Bahasa Jepang',
      description:
        'Bahasa Jepang jauh lebih simpel daripada bahasa Inggris! Hanya ada 2 kelompok waktu utama: Bentuk Sekarang / Masa Depan (belum atau rutin terjadi) dan Bentuk Lampau (sudah lewat, biasanya berakhiran ～ました / ～でした).',
      example: 'Cukup ubah ujung kalimat — bentuk di depan dan tengah kalimat tidak ikut berubah.',
      tone: 'blue',
      emotion: 'clock',
    }
  }

  if (point.category === 'honorific' || haystack.includes('keigo') || haystack.includes('teineigo')) {
    return {
      title: 'Apa itu Bahasa Sopan (Teineigo) & Keigo?',
      description:
        'Di Jepang, pilihan akhir kalimat menentukan tingkat kesopanan. Teineigo (-masu / desu) adalah bahasa sopan standar sehari-hari ke orang baru atau rekan kantor, sedangkan Keigo dipakai ke atasan, klien, atau situasi bisnis resmi.',
      example: 'Tip aman pemula: pakai akhiran ～ます atau ～です agar selalu terdengar ramah dan sopan!',
      tone: 'violet',
      emotion: 'polite',
    }
  }

  return {
    title: 'Tip Membaca Rumus Pola Kalimat',
    description:
      'Setiap kotak bertanda kurung siku [...] di rumus bisa diganti dengan kata kosakata apa saja sesuai situasi, sedangkan huruf Hiragana di luar kurung siku adalah partikel atau akhiran tetapnya.',
    example: 'Dengarkan audio normal dan pelan 0.6x di bawah ini sambil mengikuti intonasi penutur!',
    tone: 'amber',
    emotion: 'curious',
  }
}
