# Dalam tahap pengembangan

# Manajemen Kost

Aplikasi **Manajemen Kost** bertujuan untuk mempermudah pengelolaan kos-kosan, termasuk manajemen penghuni, pembayaran, dan tugas terkait pengelolaan kost. Aplikasi ini menggunakan **React (TSX)** untuk frontend dan **Spring Boot** untuk backend.

# Manajemen Kost - Frontend

## 📌 Deskripsi

Frontend aplikasi **Manajemen Kost** yang dikembangkan menggunakan **React (TSX)** dan **Tailwind CSS**. Aplikasi ini memungkinkan pemilik dan penyewa kos untuk mengelola hunian mereka dengan lebih mudah.

## 🛠 Teknologi yang Digunakan

- **React (TSX)** – Framework utama untuk frontend
- **Tailwind CSS** – Styling yang fleksibel dan efisien
- **React Router** – Routing antar halaman
- **Axios** – HTTP request ke backend
- **Vite** – Pengelolaan proyek React dengan performa tinggi

## 🚀 Instalasi dan Menjalankan Aplikasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/manajemen-kost-frontend.git
cd manajemen-kost-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Konfigurasi Environment

Buat file **.env** di root proyek dan tambahkan konfigurasi berikut:

```
VITE_API_BASE_URL=http://141.11.25.167:8080/api
```

(Sesuaikan dengan URL backend jika sudah di-deploy)

### 4️⃣ Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://141.11.25.167:5173/`.

## 📁 Struktur Direktori

```plaintext
manajemen-kost-frontend/
├── src/
│   ├── components/   # Komponen UI
│   ├── pages/        # Halaman utama aplikasi
│   ├── hooks/        # Custom hooks
│   ├── utils/        # Utility/helper functions
│   ├── assets/       # File statis seperti gambar
│   └── styles/       # Styling dengan Tailwind CSS
└── public/           # File statis publik
```

## 🔧 Pengembangan

Jika ingin berkontribusi:

1. **Fork** repository ini.
2. Buat **branch baru** (`feature/nama-fitur`).
3. Lakukan **commit** dan **push** perubahan ke branch tersebut.
4. Buat **Pull Request** untuk review.

## 📜 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file `LICENSE` untuk informasi lebih lanjut.
