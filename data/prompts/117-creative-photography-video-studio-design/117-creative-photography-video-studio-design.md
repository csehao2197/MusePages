# Design.md — Lentera Cinema
### Design System & UI/UX Reference (diadaptasi dari Artlist.io)

---

## 1. Analisa Referensi: Artlist.io

Sebelum masuk ke desain Lentera Cinema, berikut hasil bedah UI/UX Artlist.io yang jadi acuan:

### 1.1 Bahasa Visual
| Aspek | Observasi di Artlist.io |
|---|---|
| **Tone** | Dark, cinematic, premium, "studio-grade". Bukan playful — kesan profesional & high-end. |
| **Background** | Dominan hitam/near-black (`#0A0A0A`–`#171717`), sesekali diselingi section putih untuk kontras & "napas". |
| **Kontras** | Tinggi — teks putih di atas hitam, aksen warna dipakai sangat hemat (hanya di CTA/badge). |
| **Imagery** | Visual/video jadi elemen utama, bukan ilustrasi flat. Thumbnail preview yang bisa hover → autoplay video singkat. |
| **Card grid** | Grid asymmetric/masonry untuk showcase karya (apps, models, katalog), tiap card punya label singkat + 1 CTA kecil. |
| **Motion** | Micro-interaction halus: hover scale, fade, autoplay preview, marquee logo klien berjalan otomatis. |
| **Navigasi** | Sticky top nav minimal, dropdown mega-menu untuk kategori produk, CTA utama selalu terlihat (pill button kontras). |
| **Tipografi** | Sans-serif modern, ukuran heading besar & tebal (bold, tight letter-spacing), body text ringan/regular untuk kontras berat visual. |
| **CTA hierarchy** | 1 CTA primer sangat jelas ("Start Free Now") diulang di banyak titik scroll — bukan basa-basi, direct action. |
| **Social proof** | Logo klien besar (Microsoft, Apple, dst) auto-scroll, dipakai untuk membangun trust instan. |
| **Struktur halaman** | Hero → highlight produk/fitur (grid card) → showcase model/karya → social proof → pricing teaser → FAQ → footer tebal. |

### 1.2 Prinsip yang Diambil untuk Lentera Cinema
1. **Dark, cinematic theme** — cocok karena bisnis Lentera Cinema itu sendiri di ranah visual/videografi (yearbook, WO, FG, VG) → tema gelap membuat foto/video preview klien "menyala" dan terlihat premium.
2. **Karya sebagai hero**, bukan teks — portofolio (foto/video) jadi konten utama di homepage, bukan paragraf panjang.
3. **Card grid dengan hover-preview** — dipakai di halaman Portofolio & Paket Layanan.
4. **CTA tunggal yang tegas & berulang** — di Lentera Cinema: **"Booking Sekarang"** / **"Konsultasi Gratis"**.
5. **Motion halus, bukan ramai** — fade-in on scroll, hover-scale card, smooth page transition.
6. **Kepercayaan lewat bukti sosial** — testimoni klien, logo sekolah/institusi yang pernah dilayani, jumlah project selesai.

---

## 2. Design System — Lentera Cinema

### 2.1 Brand Positioning
Lentera Cinema = vendor kreatif untuk momen penting: **Yearbook, Wedding Organizer (WO), Foto Graduation (FG), Video Graduation (VG)**, dan layanan dokumentasi lain. Positioning: *"Cinematic memories, professionally crafted."*

### 2.2 Palet Warna

| Token | Hex | Penggunaan |
|---|---|---|
| `--bg-base` | `#0B0B0D` | Background utama (dark mode default) |
| `--bg-surface` | `#151518` | Card, section alternate |
| `--bg-elevated` | `#1E1E22` | Modal, dropdown, nav sticky |
| `--text-primary` | `#F5F5F4` | Heading, teks utama |
| `--text-secondary` | `#A1A1AA` | Body/deskripsi |
| `--accent-primary` | `#E8B84B` (emas hangat, terinspirasi "lentera"/cahaya lampu) | CTA utama, highlight |
| `--accent-secondary` | `#7C5CFF` (ungu cinematic, opsional gradient) | Badge, aksen sekunder, link hover |
| `--success` | `#3ECF8E` | Status booking "Confirmed" |
| `--warning` | `#F5A623` | Status "Pending" |
| `--danger` | `#EF4444` | Status "Cancelled", error |
| `--border` | `#2A2A2E` | Divider, outline card |

> Catatan filosofi warna: warna emas (`accent-primary`) merepresentasikan "cahaya lentera" — jadi warna signature brand, dipakai sangat hemat (CTA, ikon, garis bawah aktif) persis seperti Artlist memakai aksen warna terbatas di atas dasar hitam.

### 2.3 Tipografi

- **Heading:** `Plus Jakarta Sans` / `Clash Display` (bold, tight tracking, ukuran besar 32–64px untuk hero)
- **Body:** `Inter` / `Plus Jakarta Sans` regular, 14–16px
- **Skala:**
  - H1: 40–56px / bold / -0.02em
  - H2: 28–36px / semibold
  - H3: 20–24px / semibold
  - Body: 16px / regular, line-height 1.6
  - Caption: 13px / medium, `text-secondary`

### 2.4 Grid & Spacing
- Container max-width: 1200px (desktop), full-bleed dengan padding 16–20px (mobile)
- Base spacing unit: 4px → scale 4/8/12/16/24/32/48/64
- Card grid: 2 kolom (mobile), 3–4 kolom (desktop), gap 16–24px
- Border-radius: 12px (card), 999px (pill button/badge)

### 2.5 Komponen Inti

**Button**
- Primary: solid `accent-primary`, teks hitam, rounded-full, hover: sedikit scale + brightness naik
- Secondary/Ghost: outline `border`, teks putih, hover: bg `bg-elevated`
- Icon button: transparan, hover bg `bg-surface`

**Card Portofolio**
- Thumbnail 4:5 atau 16:9, overlay gradient bawah untuk judul
- Hover (desktop): scale 1.03 + autoplay preview video (jika ada) / crossfade ke foto ke-2
- Tap (mobile): buka lightbox/detail

**Nav (Site 1 - User, mobile-first)**
- Sticky top bar tipis, logo kiri, hamburger kanan
- Bottom nav mobile opsional untuk akses cepat: Home / Portofolio / Layanan / Booking / Kontak (mirip app-like experience, relevan karena mobile-first)

**Form Booking**
- Multi-step (stepper), dark surface card, input dengan border halus, validasi realtime
- Progress indicator emas di atas

**Admin Table/Dashboard**
- Base tetap dark theme tapi lebih "kerja" — kontras dinaikkan sedikit, density lebih tinggi, badge status warna-warni sesuai token di atas
- Sidebar kiri fixed, topbar search + notifikasi + profil

### 2.6 Motion Guidelines
- Fade-in + translateY(8px) saat elemen masuk viewport (durasi 400–500ms, ease-out)
- Hover card: scale 1.02–1.04, shadow naik, durasi 200ms
- Page/route transition: fade sederhana 150–250ms (hindari animasi berat di mobile)
- Skeleton loading (bukan spinner polos) untuk list portofolio & booking table

---

## 3. Site 1 — User Web (Mobile-First)

> Prioritas: mobile-first, karena target audiens (calon klien yearbook/WO/graduation) mayoritas akses dari HP via link Instagram/WA.

### 3.1 Homepage
1. **Hero** — headline besar ("Abadikan Momenmu, Sinematik") + video/foto showcase looping + CTA "Booking Sekarang" & "Lihat Portofolio"
2. **Logo/Instansi strip** — sekolah/kampus/klien yang pernah dilayani (auto-scroll marquee, seperti logo klien Artlist)
3. **Kategori Layanan (card grid)** — Yearbook, WO, FG, VG, dll — tiap card: ikon/foto, deskripsi singkat, link "Lihat Detail"
4. **Showcase Portofolio unggulan** — grid hover-preview (foto/video)
5. **Kenapa Lentera Cinema** — 3–4 value prop (pengalaman, tim profesional, revisi, tepat waktu)
6. **Testimoni klien** — carousel/card
7. **Paket & Harga (teaser)** — ringkas, CTA ke halaman detail
8. **FAQ**
9. **Footer** — kontak, sosial media, WA langsung

### 3.2 Halaman Portofolio
- Filter kategori (Yearbook/WO/FG/VG) — tab horizontal scrollable di mobile
- Grid masonry hover-preview, tap → lightbox/detail project (album foto + embed video)

### 3.3 Halaman Layanan & Paket
- List paket per kategori, tiap paket: nama, highlight fitur, harga mulai dari, tombol "Pilih Paket" → lanjut ke form booking (prefill paket)

### 3.4 Alur Booking (Site 1)
1. Pilih kategori & paket
2. Isi data (nama, kontak, tanggal acara, lokasi, catatan)
3. Ringkasan & konfirmasi (opsional upload DP/bukti transfer)
4. Submit → notifikasi ke Admin (masuk ke Site 2) + auto-reply WA/email ke user
5. Status booking bisa dicek user via halaman "Cek Status" (input no. HP/kode booking) — read-only, ambil data dari tabel yang sama dikelola admin

### 3.5 Halaman Lainnya
- Tentang Kami, Kontak (WA floating button persist di semua halaman), Blog/Artikel (opsional untuk SEO)

---

## 4. Site 2 — Admin Web

### 4.1 Struktur Navigasi (Sidebar)
- Dashboard
- Booking (list, calendar view, detail, ubah status)
- Klien
- Layanan & Paket (CRUD)
- Portofolio (CRUD, upload media)
- Testimoni (CRUD)
- Laporan/Analitik
- Pengaturan (user admin, role, integrasi WA)

### 4.2 Dashboard
- Ringkasan: total booking bulan ini, pending/confirmed/completed, revenue estimasi, jadwal acara terdekat (widget kalender mini)

### 4.3 Manajemen Booking
- Table + filter (status, kategori, tanggal)
- Kanban/pipeline view opsional: Pending → Confirmed → In Progress → Delivered → Completed
- Detail booking: data klien, paket, catatan, riwayat komunikasi, upload file terkait
- Kalender full-view untuk cek bentrok jadwal tim/kru

### 4.4 Manajemen Layanan, Portofolio, Testimoni
- CRUD sederhana dengan uploader media (Supabase Storage)

### 4.5 Role & Auth
- Role: Super Admin, Admin/Staff (permission granular opsional di fase awal cukup 2 role)

---

## 5. Prinsip Responsif
- Site 1: **mobile-first strict** — desain dari 375px lebar dulu, breakpoint naik ke tablet (768px) & desktop (1200px)
- Site 2 (Admin): **desktop-first**, tetap responsif ke tablet untuk kebutuhan cek cepat dari HP (table → card view di mobile)

---

## 6. Catatan Teknis Implementasi
- **Next.js (App Router)** + Tailwind CSS untuk styling sesuai token di atas (masukkan ke `tailwind.config` sebagai custom colors)
- **Supabase**: Auth (admin login), Postgres (booking, klien, paket, portofolio), Storage (media foto/video)
- Gunakan komponen shadcn/ui sebagai base lalu re-theme sesuai dark palette di atas, agar konsisten & cepat development
- Animasi: `framer-motion` untuk fade-in/scroll-reveal & hover-scale card
