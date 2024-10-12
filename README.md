# Exaple integration certificate

## Fitur
- Menghasilkan sertifikat dummy dalam format pdf
- Menyimpan data ke dalam sqlite
- Halaman sederhana untuk menampilkan sertifikat di indeks
- Halaman untuk menghasilkan sertifikat di ``` generatecertificate```
- Tombol untuk mengirim sertifikat satu per satu
- File sendall.js untuk mengirim semua sertifikat yang belum terintegrasi

## Prasyarat
- Node.js 20.x atau lebih baru diperlukan.
- Peramban web modern (Chrome, Firefox, Safari, Edge).
- Sistem operasi yang didukung: Windows (termasuk WSL), Linux, dan macOS.

## Instalasi

1. Klon repositori ini ke mesin lokal Anda menggunakan Git.
2. Arahkan ke direktori proyek:

```bash
  cd ccontoh-integrasi-sertifikat-js
```

3. Instal dependensi proyek:

```bash
  npm install
```

## Menjalankan Aplikasi

Untuk memulai aplikasi, jalankan perintah berikut:
```bash
  npm start
```
Ini akan menjalankan server dan memantau perubahan pada file Tailwind CSS Anda secara bersamaan.

## Skrip
- `start`: Menjalankan server dan pemantau Tailwind CSS secara bersamaan.
- `start:dev`: Menjalankan server dan pemantau Tailwind CSS secara bersamaan yang akan auto reload apabila ada perubahan code.
- `install-all`: Menginstal semua dependensi.

## Dependensi
- `@aternus/csv-to-xlsx`: Mengonversi file CSV ke format XLSX.
- `@faker-js/faker`: Menghasilkan data palsu.
- `archiver`: Membuat arsip zip.
- `dotenv`: Memuat variabel lingkungan dari file .env.
- `ejs`: Templating JavaScript yang disematkan.
- `express`: Kerangka kerja web untuk Node.js.
- `express-fileupload`: Middleware untuk menangani unggahan file.
- `jimp`: Perpustakaan pemrosesan gambar.
- `pdfkit`: Perpustakaan pembuatan dokumen PDF.
- `concurrently`: Menjalankan beberapa perintah secara bersamaan.
- `tailwindcss`: Kerangka kerja CSS berbasis utilitas.
- `sequelize`:  ORM untuk memudahkan koneksi ke database.
- `sqlite3`: Database sqlite untuk simulasi database.


