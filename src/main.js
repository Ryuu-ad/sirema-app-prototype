// main.js
import './style.css'; // Memuat CSS
import $ from 'jquery'; // Memuat jQuery yang sudah kamu install

// Kita jalankan kode hanya setelah semua elemen HTML siap dibaca
$(document).ready(function () {
  
  // 1. Fungsi untuk mengambil data dari LocalStorage
  function ambilData() {
    // Coba ambil data 'sirema_data', jika kosong, kembalikan array kosong []
    let data = localStorage.getItem('sirema_data');
    return data ? JSON.parse(data) : [];
  }

  // 2. Fungsi untuk menampilkan data ke tabel
  function tampilkanData() {
    let dataMagang = ambilData();
    let tbody = $('#data-magang');
    
    tbody.empty(); // Kosongkan tabel dulu sebelum diisi ulang

    // Jika belum ada data
    if (dataMagang.length === 0) {
      tbody.append('<tr><td colspan="6">Belum ada data absensi hari ini.</td></tr>');
      return;
    }

    // Looping (ulangi) data dan masukkan satu per satu ke tabel
    dataMagang.forEach(function (item, index) {
      let baris = `
        <tr>
          <td>${index + 1}</td>
          <td>${item.tanggal}</td>
          <td>${item.nama}</td>
          <td>${item.instansi}</td>
          <td>${item.status}</td>
          <td>
            <button class="btn-hapus" data-id="${index}">Hapus</button>
          </td>
        </tr>
      `;
      tbody.append(baris);
    });
  }

  // 3. Menangani event saat form dikirim (tombol submit ditekan)
  $('#form-absensi').on('submit', function (e) {
    e.preventDefault(); // Mencegah halaman web dimuat ulang (refresh)

    // Ambil nilai dari inputan
    let nama = $('#nama').val();
    let instansi = $('#instansi').val();
    let status = $('#status').val();
    
    // Dapatkan tanggal hari ini
    let tanggalSekarang = new Date().toLocaleDateString('id-ID');

    // Buat objek data baru
    let dataBaru = {
      nama: nama,
      instansi: instansi,
      status: status,
      tanggal: tanggalSekarang
    };

    // Ambil data lama, tambahkan data baru, lalu simpan kembali
    let dataLama = ambilData();
    dataLama.push(dataBaru);
    localStorage.setItem('sirema_data', JSON.stringify(dataLama));

    // Bersihkan form input kembali kosong
    $('#nama').val('');
    $('#instansi').val('');
    $('#status').val('Hadir');

    // Perbarui tampilan tabel
    tampilkanData();
    alert('Data berhasil disimpan!');
  });

  // 4. Menangani event tombol hapus
  // Kita pakai event delegation (on 'click' pada elemen induk) karena tombol hapus dibuat dinamis
  $('#data-magang').on('click', '.btn-hapus', function () {
    let idHapus = $(this).data('id'); // Ambil index dari atribut data-id
    let konfirmasi = confirm('Yakin ingin menghapus data ini?');

    if (konfirmasi) {
      let data = ambilData();
      data.splice(idHapus, 1); // Hapus 1 item berdasarkan index
      localStorage.setItem('sirema_data', JSON.stringify(data));
      tampilkanData(); // Perbarui tabel
    }
  });

  // 5. Jalankan fungsi tampilkanData() saat halaman pertama kali dibuka
  tampilkanData();
});