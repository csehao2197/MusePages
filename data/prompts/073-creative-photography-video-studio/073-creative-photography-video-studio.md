# PRD.md — Lentera Cinema
### Product Requirements Document

---

## 1. Ringkasan Eksekutif

Lentera Cinema adalah vendor kreatif yang melayani dokumentasi momen penting: **Yearbook, Wedding Organizer (WO), Foto Graduation (FG), Video Graduation (VG)**, dan layanan sejenis. 
Sistem ini dibuat sebagai **Web Profile & Portofolio** (mobile-first) untuk menampilkan karya, katalog layanan/paket, dan mengarahkan calon klien ke WhatsApp untuk booking.

**Tech stack:** Next.js (App Router), desain mengadaptasi bahasa visual Artlist.io (dark, cinematic, card-grid, motion halus) — detail di `design.md`.

---

## 2. Latar Belakang Bisnis
- Kategori layanan utama: Yearbook, WO, FG, VG.
- Kanal akuisisi klien saat ini: Instagram, WhatsApp, referral.
- Masalah yang diselesaikan: Tidak ada etalase portofolio terpusat & profesional. Klien kebingungan mencari paket & harga serta contoh karya yang relevan.

---

## 3. Tujuan Produk (Goals)
1. Meningkatkan kredibilitas brand lewat website portofolio yang premium & cinematic, 100% mirip dengan UI/UX Artlist.io.
2. Mempermudah calon klien melihat paket & portofolio secara rapi dan terstruktur.
3. Mengarahkan konversi dari visitor langsung ke WhatsApp untuk proses booking (frictionless).

---

## 4. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| **Calon Klien (Siswa/Panitia Sekolah, Calon Pengantin, Mahasiswa)** | Lihat portofolio nyata, tahu paket & harga, bisa hubungi WhatsApp untuk booking dengan mudah dari HP. |

---

## 5. Ruang Lingkup Fitur

### 5.1 Site — Web Profile & Portofolio (Mobile-First)

#### 5.1.1 Homepage
- Hero showcase (foto/video latar sinematik).
- Kategori layanan (Yearbook/WO/FG/VG).
- Showcase portofolio unggulan.
- Preview paket & harga.
- Testimoni klien.
- FAQ.
- CTA persist: tombol WhatsApp untuk booking/tanya-tanya.

#### 5.1.2 Portofolio
- Filter per kategori.
- Grid galeri (foto & embed video).
- Detail project (lightbox).

#### 5.1.3 Layanan & Paket
- List paket per kategori: nama, deskripsi, fitur/inclusion, harga.
- CTA "Pilih Paket" / "Booking" → Arahkan langsung ke chat WhatsApp.

#### 5.1.4 Halaman Pendukung
- Tentang Kami
- Kontak (Info kontak + tombol arah ke WhatsApp)

---

## 6. Tech Stack

| Layer | Pilihan |
|---|---|
| Framework | Next.js (App Router, React Server Components) |
| Styling | Tailwind CSS (v4) + custom design token dari `design.md` |
| Database/Data | Data statis / lokal (Fase Profil) |
| Hosting | Vercel |

---

## 7. Referensi Desain
Lihat `design.md` untuk detail sistem desain (warna, tipografi, komponen, layout per halaman) hasil adaptasi dari analisa UI/UX Artlist.io. (Dark mode, font sans geometric seperti DM Sans, accent gold, clean aesthetic, layout mobile-first).
