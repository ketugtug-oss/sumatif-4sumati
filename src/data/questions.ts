import { Question } from '../types/exam';

export const DEFAULT_QUESTIONS: Question[] = [
  // ==========================================
  // BAGIAN 1: PILIHAN GANDA (20 SOAL)
  // ==========================================
  {
    id: 1,
    type: 'pg',
    topic: 'Pecahan',
    difficulty: 'Mudah',
    question: 'Hasil penjumlahan dari 2/5 + 1/4 adalah...',
    options: ['3/9', '8/20', '13/20', '11/20'],
    correctAnswer: '13/20',
    explanation: 'Samakan penyebut dengan KPK(5, 4) = 20. Maka 2/5 = 8/20 dan 1/4 = 5/20. Penjumlahan: 8/20 + 5/20 = 13/20.',
    points: 1
  },
  {
    id: 2,
    type: 'pg',
    topic: 'Pecahan',
    difficulty: 'Mudah',
    question: 'Hasil dari 3 1/2 - 1 1/3 adalah...',
    options: ['2 1/6', '2 1/3', '1 5/6', '2 2/5'],
    correctAnswer: '2 1/6',
    explanation: 'Ubah ke pecahan biasa: 3 1/2 = 7/2 dan 1 1/3 = 4/3. Samakan penyebut KPK(2, 3) = 6: 21/6 - 8/6 = 13/6 = 2 1/6.',
    points: 1
  },
  {
    id: 3,
    type: 'pg',
    topic: 'Perkalian Pecahan',
    difficulty: 'Sedang',
    question: 'Ibu memiliki 3/4 kg gula pasir. Untuk membuat kue bolu, Ibu menggunakan 2/3 dari gula tersebut. Berat gula yang digunakan Ibu adalah...',
    options: ['1/2 kg', '5/7 kg', '6/12 kg', '1/4 kg'],
    correctAnswer: '1/2 kg',
    explanation: 'Gula yang digunakan = 3/4 × 2/3 = (3 × 2) / (4 × 3) = 6/12 = 1/2 kg.',
    points: 1
  },
  {
    id: 4,
    type: 'pg',
    topic: 'Pembagian Pecahan',
    difficulty: 'Sedang',
    question: 'Hasil dari 4/5 : 2/3 adalah...',
    options: ['8/15', '1 1/5', '6/5', '1 1/4'],
    correctAnswer: '1 1/5',
    explanation: 'Pembagian pecahan diubah menjadi perkalian dengan kebalikan pecahan kedua: 4/5 × 3/2 = 12/10 = 6/5 = 1 1/5.',
    points: 1
  },
  {
    id: 5,
    type: 'pg',
    topic: 'Desimal & Persen',
    difficulty: 'Mudah',
    question: 'Bentuk desimal dari pecahan 3/8 adalah...',
    options: ['0,375', '0,38', '0,35', '0,425'],
    correctAnswer: '0,375',
    explanation: '3 dibagi 8: 3 : 8 = 0,375.',
    points: 1
  },
  {
    id: 6,
    type: 'pg',
    topic: 'Desimal',
    difficulty: 'Mudah',
    question: 'Hasil dari 4,25 + 3,8 - 2,15 adalah...',
    options: ['5,8', '5,9', '6,0', '5,85'],
    correctAnswer: '5,9',
    explanation: '4,25 + 3,8 = 8,05. Selanjutnya 8,05 - 2,15 = 5,90 atau 5,9.',
    points: 1
  },
  {
    id: 7,
    type: 'pg',
    topic: 'Kecepatan',
    difficulty: 'Sedang',
    question: 'Pak Wayan mengendarai sepeda motor dari Loloan Timur menuju Denpasar menempuh jarak 90 km dalam waktu 1,5 jam. Kecepatan rata-rata motor Pak Wayan adalah...',
    options: ['50 km/jam', '55 km/jam', '60 km/jam', '65 km/jam'],
    correctAnswer: '60 km/jam',
    explanation: 'Kecepatan = Jarak / Waktu = 90 km / 1,5 jam = 60 km/jam.',
    points: 1
  },
  {
    id: 8,
    type: 'pg',
    topic: 'Waktu & Kecepatan',
    difficulty: 'Sedang',
    question: 'Sebuah bus melaju dengan kecepatan 72 km/jam. Jika bus tersebut menempuh jarak 180 km, berapa lama waktu yang dibutuhkan bus?',
    options: ['2 jam', '2 jam 30 menit', '2 jam 45 menit', '3 jam'],
    correctAnswer: '2 jam 30 menit',
    explanation: 'Waktu = Jarak / Kecepatan = 180 / 72 = 2,5 jam. 0,5 jam = 30 menit, sehingga waktunya adalah 2 jam 30 menit.',
    points: 1
  },
  {
    id: 9,
    type: 'pg',
    topic: 'Debit Air',
    difficulty: 'Sedang',
    question: 'Sebuah kran air mampu mengalirkan air sebanyak 48 liter dalam waktu 4 menit. Debit aliran air kran tersebut adalah...',
    options: ['12 liter/menit', '14 liter/menit', '16 liter/menit', '20 liter/menit'],
    correctAnswer: '12 liter/menit',
    explanation: 'Debit = Volume / Waktu = 48 liter / 4 menit = 12 liter/menit.',
    points: 1
  },
  {
    id: 10,
    type: 'pg',
    topic: 'Skala & Peta',
    difficulty: 'Sedang',
    question: 'Jarak antara dua kota pada peta berskala 1 : 500.000 adalah 4 cm. Jarak sebenarnya kedua kota tersebut adalah...',
    options: ['2 km', '20 km', '200 km', '2.000 km'],
    correctAnswer: '20 km',
    explanation: 'Jarak sebenarnya = Jarak peta / Skala = 4 cm × 500.000 = 2.000.000 cm = 20 km.',
    points: 1
  },
  {
    id: 11,
    type: 'pg',
    topic: 'Skala Denah',
    difficulty: 'Sedang',
    question: 'Panjang lapangan upacara SD Negeri 3 Loloan Timur sebenarnya adalah 30 meter. Jika pada denah digambar sepanjang 6 cm, maka skala denah tersebut adalah...',
    options: ['1 : 50', '1 : 500', '1 : 5.000', '1 : 300'],
    correctAnswer: '1 : 500',
    explanation: '30 meter = 3.000 cm. Skala = Jarak pada denah : Jarak sebenarnya = 6 cm : 3.000 cm = 1 : 500.',
    points: 1
  },
  {
    id: 12,
    type: 'pg',
    topic: 'Bangun Ruang - Kubus',
    difficulty: 'Mudah',
    question: 'Sebuah bak penampungan air berbentuk kubus dengan panjang rusuk 80 cm. Volume kubus tersebut adalah...',
    options: ['51.200 cm³', '512.000 cm³', '64.000 cm³', '256.000 cm³'],
    correctAnswer: '512.000 cm³',
    explanation: 'Volume kubus = s × s × s = 80 × 80 × 80 = 512.000 cm³.',
    points: 1
  },
  {
    id: 13,
    type: 'pg',
    topic: 'Bangun Ruang - Balok',
    difficulty: 'Mudah',
    question: 'Sebuah kolam renang mini memiliki panjang 5 m, lebar 3 m, dan kedalaman 1,5 m. Volume air jika kolam terisi penuh adalah...',
    options: ['15 m³', '22,5 m³', '30 m³', '25 m³'],
    correctAnswer: '22,5 m³',
    explanation: 'Volume balok = p × l × t = 5 × 3 × 1,5 = 22,5 m³.',
    points: 1
  },
  {
    id: 14,
    type: 'pg',
    topic: 'Akar Pangkat Tiga',
    difficulty: 'Sedang',
    question: 'Nilai dari ∛4.096 + ∛1.728 adalah...',
    options: ['26', '28', '30', '32'],
    correctAnswer: '28',
    explanation: '∛4.096 = 16 (karena 16³ = 4.096) dan ∛1.728 = 12 (karena 12³ = 1.728). Maka 16 + 12 = 28.',
    points: 1
  },
  {
    id: 15,
    type: 'pg',
    topic: 'FPB & KPK',
    difficulty: 'Sedang',
    question: 'FPB dan KPK dari bilangan 24 dan 36 berturut-turut adalah...',
    options: ['12 dan 72', '6 dan 72', '12 dan 48', '8 dan 72'],
    correctAnswer: '12 dan 72',
    explanation: 'Faktorisasi prima: 24 = 2³ × 3, 36 = 2² × 3². FPB = 2² × 3 = 12. KPK = 2³ × 3² = 8 × 9 = 72.',
    points: 1
  },
  {
    id: 16,
    type: 'pg',
    topic: 'Penyajian Data',
    difficulty: 'Mudah',
    question: 'Berikut data nilai ulangan matematika 8 siswa kelas V: 75, 80, 85, 90, 75, 80, 95, 80. Modus dari data tersebut adalah...',
    options: ['75', '80', '85', '90'],
    correctAnswer: '80',
    explanation: 'Nilai 75 muncul 2 kali, nilai 80 muncul 3 kali, nilai 85 muncul 1 kali, nilai 90 muncul 1 kali, nilai 95 muncul 1 kali. Nilai terbanyak (modus) adalah 80.',
    points: 1
  },
  {
    id: 17,
    type: 'pg',
    topic: 'Rata-rata (Mean)',
    difficulty: 'Sedang',
    question: 'Hasil panen cabai Pak Made selama 5 hari (dalam kg) adalah 12, 15, 14, 16, dan 13. Rata-rata hasil panen per hari adalah...',
    options: ['13 kg', '14 kg', '15 kg', '16 kg'],
    correctAnswer: '14 kg',
    explanation: 'Rata-rata = Jumlah data / Banyak data = (12 + 15 + 14 + 16 + 13) / 5 = 70 / 5 = 14 kg.',
    points: 1
  },
  {
    id: 18,
    type: 'pg',
    topic: 'Jaring-jaring Bangun Ruang',
    difficulty: 'Mudah',
    question: 'Sebuah kubus memiliki jumlah sisi, rusuk, dan titik sudut berturut-turut adalah...',
    options: ['6 sisi, 8 rusuk, 12 titik sudut', '6 sisi, 12 rusuk, 8 titik sudut', '8 sisi, 12 rusuk, 6 titik sudut', '6 sisi, 10 rusuk, 8 titik sudut'],
    correctAnswer: '6 sisi, 12 rusuk, 8 titik sudut',
    explanation: 'Ciri-ciri bangun ruang kubus: memiliki 6 sisi berbentuk persegi yang kongruen, 12 rusuk yang sama panjang, dan 8 titik sudut.',
    points: 1
  },
  {
    id: 19,
    type: 'pg',
    topic: 'Perbandingan',
    difficulty: 'Sedang',
    question: 'Perbandingan jumlah siswa laki-laki dan perempuan di kelas V adalah 3 : 4. Jika jumlah seluruh siswa di kelas V ada 28 anak, banyak siswa perempuan adalah...',
    options: ['12 anak', '14 anak', '16 anak', '18 anak'],
    correctAnswer: '16 anak',
    explanation: 'Jumlah rasio = 3 + 4 = 7. Siswa perempuan = (4 / 7) × 28 anak = 16 anak.',
    points: 1
  },
  {
    id: 20,
    type: 'pg',
    topic: 'Operasi Campuran',
    difficulty: 'Sukar',
    question: 'Hasil dari 150 + 50 × (-4) - (-25) adalah...',
    options: ['-25', '25', '-75', '75'],
    correctAnswer: '-25',
    explanation: 'Dahulukan perkalian: 50 × (-4) = -200. Kemudian hitung dari kiri: 150 + (-200) - (-25) = 150 - 200 + 25 = -50 + 25 = -25.',
    points: 1
  },

  // ==========================================
  // BAGIAN 2: PILIHAN GANDA KOMPLEKS (5 SOAL)
  // (Kemungkinan lebih dari 1 pilihan jawaban benar)
  // ==========================================
  {
    id: 21,
    type: 'pg_kompleks',
    topic: 'Pecahan Senilai',
    difficulty: 'Sedang',
    question: 'Manakah dari pecahan-pecahan berikut yang senilai dengan 3/4? (Pilihlah semua jawaban yang benar)',
    options: ['6/8', '9/12', '12/15', '75%', '0,70'],
    correctAnswer: ['6/8', '9/12', '75%'],
    explanation: 'Pecahan 3/4 = 6/8 (kali 2), 3/4 = 9/12 (kali 3), dan 3/4 = 75/100 = 75% = 0,75. Pilihan 12/15 senilai dengan 4/5, dan 0,70 = 7/10.',
    points: 1
  },
  {
    id: 22,
    type: 'pg_kompleks',
    topic: 'Sifat Bangun Ruang Kubus & Balok',
    difficulty: 'Sedang',
    question: 'Pernyataan mana sajakah yang BENAR mengenai bangun balok? (Pilihlah semua jawaban yang benar)',
    options: [
      'Memiliki 6 sisi',
      'Memiliki 12 rusuk',
      'Semua rusuknya memiliki panjang yang sama',
      'Memiliki 8 titik sudut',
      'Memiliki 4 sisi berbentuk segitiga'
    ],
    correctAnswer: ['Memiliki 6 sisi', 'Memiliki 12 rusuk', 'Memiliki 8 titik sudut'],
    explanation: 'Balok memiliki 6 sisi (berbentuk persegi panjang), 12 rusuk (terbagi dalam 3 pasang rusuk sejajar sama panjang: p, l, t), dan 8 titik sudut. Rusuk balok tidak semuanya sama panjang.',
    points: 1
  },
  {
    id: 23,
    type: 'pg_kompleks',
    topic: 'Konversi Satuan Volume & Debit',
    difficulty: 'Sedang',
    question: 'Pilihlah semua pernyataan kesetaraan satuan volume dan debit yang BENAR di bawah ini!',
    options: [
      '1 liter = 1 dm³',
      '1 liter = 1.000 cm³',
      '1 m³ = 100 liter',
      '1 liter/detik = 60 liter/menit',
      '1 ml = 1 dm³'
    ],
    correctAnswer: ['1 liter = 1 dm³', '1 liter = 1.000 cm³', '1 liter/detik = 60 liter/menit'],
    explanation: '1 liter setara dengan 1 dm³ dan 1.000 cm³ (atau 1.000 ml). 1 menit = 60 detik, sehingga 1 liter/detik = 60 liter/menit. (1 m³ = 1.000 liter, bukan 100 liter).',
    points: 1
  },
  {
    id: 24,
    type: 'pg_kompleks',
    topic: 'Faktor dan Kelipatan',
    difficulty: 'Sedang',
    question: 'Bilangan-bilangan berikut yang merupakan faktor dari bilangan 36 adalah... (Pilihlah semua jawaban yang benar)',
    options: ['4', '6', '8', '9', '18'],
    correctAnswer: ['4', '6', '9', '18'],
    explanation: 'Faktor dari 36 adalah 1, 2, 3, 4, 6, 9, 12, 18, 36. Bilangan 8 bukan faktor dari 36 karena 36 tidak habis dibagi 8 (36 : 8 = 4 sisa 4).',
    points: 1
  },
  {
    id: 25,
    type: 'pg_kompleks',
    topic: 'Operasi Pecahan & Desimal',
    difficulty: 'Sukar',
    question: 'Manakah dari operasi hitung berikut yang hasilnya sama dengan 1? (Pilihlah semua jawaban yang benar)',
    options: [
      '3/5 + 0,4',
      '1/2 × 2',
      '4/7 : 7/4',
      '2,5 - 1 1/2',
      '0,25 × 4'
    ],
    correctAnswer: ['3/5 + 0,4', '1/2 × 2', '2,5 - 1 1/2', '0,25 × 4'],
    explanation: '1) 3/5 + 0,4 = 0,6 + 0,4 = 1. 2) 1/2 × 2 = 1. 3) 4/7 : 7/4 = 4/7 × 4/7 = 16/49 (salah). 4) 2,5 - 1 1/2 = 2,5 - 1,5 = 1. 5) 0,25 × 4 = 1.',
    points: 1
  },

  // ==========================================
  // BAGIAN 3: PILIHAN GANDA KOMPLEKS KATEGORI (5 SOAL)
  // (Pernyataan yang harus direspon Benar/Salah, Sesuai/Tidak Sesuai)
  // ==========================================
  {
    id: 26,
    type: 'kategori',
    topic: 'Operasi Pecahan dan Desimal',
    difficulty: 'Sedang',
    question: 'Tentukan kebenaran setiap pernyataan matematika berikut dengan memilih "Benar" atau "Salah"!',
    statements: [
      {
        id: 's1',
        statement: '0,5 jika diubah ke dalam bentuk pecahan biasa yang paling sederhana adalah 1/2.',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Benar'
      },
      {
        id: 's2',
        statement: '25% lebih besar nilainya daripada 1/3.',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Salah'
      },
      {
        id: 's3',
        statement: 'Hasil dari 1/2 + 1/4 sama dengan 0,75.',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Benar'
      }
    ],
    correctAnswer: {
      s1: 'Benar',
      s2: 'Salah',
      s3: 'Benar'
    },
    explanation: 'Pernyataan 1 Benar: 0,5 = 5/10 = 1/2. Pernyataan 2 Salah: 25% = 0,25 sedangkan 1/3 ≈ 0,333, jadi 25% lebih kecil. Pernyataan 3 Benar: 1/2 + 1/4 = 2/4 + 1/4 = 3/4 = 0,75.',
    points: 1
  },
  {
    id: 27,
    type: 'kategori',
    topic: 'Bangun Datar dan Luas',
    difficulty: 'Sedang',
    question: 'Perhatikan pernyataan tentang rumus luas bangun datar berikut. Tentukan "Benar" atau "Salah" untuk setiap pernyataan!',
    statements: [
      {
        id: 's1',
        statement: 'Rumus luas persegi panjang adalah panjang × lebar (p × l).',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Benar'
      },
      {
        id: 's2',
        statement: 'Rumus luas segitiga adalah alas × tinggi (a × t).',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Salah'
      },
      {
        id: 's3',
        statement: 'Luas jajar genjang dapat dihitung dengan rumus alas × tinggi (a × t).',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Benar'
      }
    ],
    correctAnswer: {
      s1: 'Benar',
      s2: 'Salah',
      s3: 'Benar'
    },
    explanation: 'Pernyataan 1 Benar: Luas persegi panjang = p × l. Pernyataan 2 Salah: Luas segitiga = 1/2 × alas × tinggi. Pernyataan 3 Benar: Luas jajar genjang = alas × tinggi.',
    points: 1
  },
  {
    id: 28,
    type: 'kategori',
    topic: 'Kecepatan dan Satuan',
    difficulty: 'Sedang',
    question: 'Tentukan kesesuaian setiap pernyataan terkait satuan jarak dan waktu dengan memilih "Sesuai" atau "Tidak Sesuai"!',
    statements: [
      {
        id: 's1',
        statement: 'Jarak 1 kilometer (km) sama dengan 1.000 meter (m).',
        options: ['Sesuai', 'Tidak Sesuai'],
        correctAnswer: 'Sesuai'
      },
      {
        id: 's2',
        statement: 'Waktu 1,5 jam sama dengan 150 menit.',
        options: ['Sesuai', 'Tidak Sesuai'],
        correctAnswer: 'Tidak Sesuai'
      },
      {
        id: 's3',
        statement: 'Kecepatan 36 km/jam sama dengan 10 meter/detik.',
        options: ['Sesuai', 'Tidak Sesuai'],
        correctAnswer: 'Sesuai'
      }
    ],
    correctAnswer: {
      s1: 'Sesuai',
      s2: 'Tidak Sesuai',
      s3: 'Sesuai'
    },
    explanation: '1 km = 1.000 m (Sesuai). 1,5 jam = 1,5 × 60 = 90 menit (bukan 150 menit, Tidak Sesuai). 36 km/jam = 36.000 m / 3.600 detik = 10 m/detik (Sesuai).',
    points: 1
  },
  {
    id: 29,
    type: 'kategori',
    topic: 'Karakteristik Bangun Ruang',
    difficulty: 'Sedang',
    question: 'Tentukan apakah pernyataan mengenai ciri-ciri kubus berikut "Benar" atau "Salah"!',
    statements: [
      {
        id: 's1',
        statement: 'Kubus memiliki 6 bidang sisi yang semuanya berbentuk persegi dan sama luas.',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Benar'
      },
      {
        id: 's2',
        statement: 'Kubus memiliki 8 buah rusuk yang sama panjang.',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Salah'
      },
      {
        id: 's3',
        statement: 'Volume kubus dengan panjang rusuk 5 cm adalah 125 cm³.',
        options: ['Benar', 'Salah'],
        correctAnswer: 'Benar'
      }
    ],
    correctAnswer: {
      s1: 'Benar',
      s2: 'Salah',
      s3: 'Benar'
    },
    explanation: 'Pernyataan 1 Benar. Pernyataan 2 Salah karena kubus memiliki 12 rusuk, bukan 8 rusuk (8 adalah jumlah titik sudutnya). Pernyataan 3 Benar: Volume = 5 × 5 × 5 = 125 cm³.',
    points: 1
  },
  {
    id: 30,
    type: 'kategori',
    topic: 'Pengolahan dan Interpretasi Data',
    difficulty: 'Sedang',
    question: 'Diberikan data nilai: 7, 8, 8, 9, 10. Tentukan kesesuaian pernyataan ukuran pemusatan data berikut dengan memilih "Sesuai" atau "Tidak Sesuai"!',
    statements: [
      {
        id: 's1',
        statement: 'Nilai yang paling sering muncul (modus) adalah 8.',
        options: ['Sesuai', 'Tidak Sesuai'],
        correctAnswer: 'Sesuai'
      },
      {
        id: 's2',
        statement: 'Nilai rata-rata (mean) dari kelima nilai tersebut adalah 8,4.',
        options: ['Sesuai', 'Tidak Sesuai'],
        correctAnswer: 'Sesuai'
      },
      {
        id: 's3',
        statement: 'Nilai tengah (median) dari data tersebut adalah 9.',
        options: ['Sesuai', 'Tidak Sesuai'],
        correctAnswer: 'Tidak Sesuai'
      }
    ],
    correctAnswer: {
      s1: 'Sesuai',
      s2: 'Sesuai',
      s3: 'Tidak Sesuai'
    },
    explanation: 'Modus = 8 karena muncul 2 kali (Sesuai). Rata-rata = (7 + 8 + 8 + 9 + 10) / 5 = 42 / 5 = 8,4 (Sesuai). Median dari data urut [7, 8, 8, 9, 10] adalah 8, bukan 9 (Tidak Sesuai).',
    points: 1
  },

  // ==========================================
  // BAGIAN 4: ISIAN SINGKAT (5 SOAL)
  // ==========================================
  {
    id: 31,
    type: 'isian',
    topic: 'Aritmetika Pecahan',
    difficulty: 'Sedang',
    question: 'Hasil dari 5/6 - 1/2 dalam bentuk pecahan paling sederhana adalah... (Tuliskan dalam format angka/angka, contoh: 1/3)',
    correctAnswer: '1/3',
    explanation: 'Samakan penyebut: 5/6 - 3/6 = 2/6. Sederhanakan dengan membagi pembilang dan penyebut dengan 2: 2/6 = 1/3.',
    points: 1
  },
  {
    id: 32,
    type: 'isian',
    topic: 'KPK',
    difficulty: 'Mudah',
    question: 'KPK dari bilangan 12 dan 18 adalah... (Tuliskan hanya angkanya saja)',
    correctAnswer: '36',
    explanation: 'Kelipatan 12: 12, 24, 36, 48, ... Kelipatan 18: 18, 36, 54, ... Kelipatan persekutuan terkecil adalah 36.',
    points: 1
  },
  {
    id: 33,
    type: 'isian',
    topic: 'Volume Kubus',
    difficulty: 'Sedang',
    question: 'Sebuah wadah berbentuk kubus memiliki volume 343 cm³. Panjang rusuk wadah tersebut adalah... cm. (Tuliskan angkanya saja)',
    correctAnswer: '7',
    explanation: 'Panjang rusuk = ∛Volume = ∛343 = 7 cm (karena 7 × 7 × 7 = 343).',
    points: 1
  },
  {
    id: 34,
    type: 'isian',
    topic: 'Kecepatan',
    difficulty: 'Sedang',
    question: 'Ketut bersepeda menempuh jarak 15 km selama 30 menit. Berapakah kecepatan rata-rata bersepeda Ketut dalam satuan km/jam? (Tuliskan angkanya saja)',
    correctAnswer: '30',
    explanation: '30 menit = 0,5 jam. Kecepatan = Jarak / Waktu = 15 km / 0,5 jam = 30 km/jam.',
    points: 1
  },
  {
    id: 35,
    type: 'isian',
    topic: 'Skala',
    difficulty: 'Sedang',
    question: 'Pada sebuah peta, jarak kota A dan B adalah 5 cm. Jika jarak sebenarnya adalah 25 km, maka nilai penyebut skala peta tersebut adalah 1 : ... (Tuliskan hanya angka penyebutnya, contoh: 500000)',
    correctAnswer: '500000',
    explanation: '25 km = 2.500.000 cm. Skala = 5 cm : 2.500.000 cm = 1 : 500.000. Angka penyebut skala adalah 500000.',
    points: 1
  }
];
