# POS Salapan Coffee & Eatery ☕🍽️

Aplikasi Kasir (Point of Sale) modern, responsif, dan siap pakai berbasis data menu dan harga dari Excel `daftar menu salapan fix.xlsx`.

## 🚀 Cara Menjalankan
Cukup **klik ganda (double click)** file:
- `start-pos.bat` atau langsung buka file `index.html` di browser Anda (Google Chrome, Microsoft Edge, Firefox, dll).

## ✨ Fitur Lengkap
1. **74 Menu dalam 13 Kategori**:
   - Signature & Special, Classic Coffee, Flavored Latte, Manual Brew, Non-Coffee, Mojito Series, Tea & Blended, Mocktails, Snacks & Finger Food, Steak & Ricebowl, Nasi & Ayam, Mie & Kwetiau, Pasta.
2. **3 Mode Harga (Multi-tier Pricing)**:
   - **Offline / Dine-in**: Sesuai Kolom B Excel (contoh Es Kopi Salapan Rp 19.000).
   - **Offline + 10% Tax**: Sesuai Kolom C Excel (contoh Rp 20.900).
   - **Online Delivery**: Sesuai Kolom E Excel untuk GrabFood / GoFood / ShopeeFood (contoh Rp 21.000).
3. **Pencarian Cepat & Filter Kategori Real-time**:
   - Pencarian instan per nama menu / kategori.
4. **Keranjang & Catatan Pesanan**:
   - Tambah/kurang kuantitas item, catatan per menu (misal: "less ice, gula pisah").
   - Pilihan tipe pesanan (Dine-in, Take Away, Online Delivery).
   - Input nama pelanggan & nomor meja.
   - Fitur diskon fleksibel (%).
5. **Checkout & Pembayaran**:
   - Tunai (Cash) dengan kalkulator uang pas / 50rb / 100rb & hitung kembalian otomatis.
   - QRIS, Transfer Bank, Kartu Debit.
6. **Cetak Struk Thermal (Thermal Receipt)**:
   - Layout thermal standar 58mm/80mm siap cetak ke printer Bluetooth/USB via dialog print browser.
7. **Riwayat Penjualan & Laporan Omset**:
   - Tersimpan otomatis di `LocalStorage` browser (tidak hilang saat refresh).
   - Cetak ulang struk (*reprint*) & pembatalan transaksi (*void*).
   - Dashboard omset harian, jumlah transaksi, AOV, dan menu terlaris (*top seller*).
   - Ekspor data laporan transaksi ke format CSV / Excel.
