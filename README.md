# 📝 To-Do List Web App

Aplikasi to-do list modern dengan **HTML, CSS, dan JavaScript murni** — tanpa framework, tanpa build tool, ringan dan langsung jalan di browser.

## ✨ Fitur

- ➕ **Tambah tugas** — lewat tombol atau tekan Enter
- ☑️ **Tandai selesai** — tugas dicoret otomatis
- ✏️ **Edit tugas** — klik dua kali teks tugas (Enter simpan, Esc batal)
- 🗑️ **Hapus tugas** — sekali klik
- 🏷️ **Filter dengan badge jumlah** — Semua / Aktif / Selesai
- 🔢 **Counter tugas** tersisa (real-time, `aria-live`)
- 🧹 **Hapus semua yang selesai** (nonaktif kalau tidak ada)
- 🌗 **Tema terang & gelap** — ikut preferensi sistem, pilihan tersimpan
- 💾 **Penyimpanan otomatis** — tugas tersimpan di `localStorage`, tetap ada walau browser ditutup
- ♿ **Aksesibel** — ARIA yang benar, fokus keyboard terlihat, dukungan `prefers-reduced-motion`
- 📱 **Responsif** — nyaman di HP maupun desktop

## 🚀 Cara Menjalankan

Buka `index.html` di browser (klik dua kali), atau jalankan server lokal:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Lalu kunjungi `http://localhost:8000`.

## 🛠️ Teknologi

| Teknologi | Peran |
|---|---|
| HTML5 | Struktur halaman + inline SVG favicon |
| CSS3 | Tema custom properties, glassmorphism, animasi, responsif |
| JavaScript (ES6) | Logika aplikasi, `crypto.randomUUID`, penyimpanan lokal |

## 📁 Struktur

```
├── index.html   # Struktur halaman
├── style.css    # Tema terang/gelap & tata letak
└── app.js       # Logika to-do list
```

## 📄 Lisensi

MIT — silakan dipakai untuk belajar atau dikembangkan lagi.
