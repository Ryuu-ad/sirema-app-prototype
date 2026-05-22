// Import fungsi tambahan dari file lain jika diperlukan
// Import fungsi API di baris paling atas
import { apiDaftarPeserta, apiGetPeserta } from './api.js';

$(document).ready(function() {
    
    // ... (kode routing dan loading screen yang sebelumnya tetap di sini) ...

    // ==========================================
    // 1. CREATE: Handle Submit Form Pendaftaran
    // ==========================================
    $('#form-pendaftaran').on('submit', function(e) {
        e.preventDefault(); // Mencegah browser melakukan reload halaman
        
        // Ambil data dari inputan form
        const dataPeserta = {
            nama_lengkap: $('#nama_lengkap').val(),
            peran: $('#peran').val(),
            nomor_telepon: $('#nomor_telepon').val(),
            asal_instansi: $('#asal_instansi').val(),
            alasan_magang: $('#alasan_magang').val()
        };

        // Ubah state tombol agar user tahu proses sedang berjalan
        const btnSubmit = $(this).find('button[type="submit"]');
        const originalText = btnSubmit.text();
        btnSubmit.text('Mengirim Data...').prop('disabled', true);

        // Panggil fungsi API
        apiDaftarPeserta(dataPeserta)
            .done(function(response) {
                alert('Pendaftaran berhasil! Anda akan segera dihubungi.');
                $('#form-pendaftaran').trigger('reset'); // Kosongkan input form
                
                // Refresh daftar peserta di halaman agar data baru langsung muncul
                loadDaftarPeserta(); 
                
                // Otomatis pindah ke halaman peserta (opsional)
                $('.nav-trigger[data-page="peserta"]').trigger('click');
            })
            .fail(function(xhr) {
                // Tampilkan pesan error dari backend jika ada
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'Terjadi kesalahan koneksi.';
                alert('Gagal mendaftar: ' + errorMsg);
            })
            .always(function() {
                // Kembalikan state tombol seperti semula
                btnSubmit.text(originalText).prop('disabled', false);
            });
    });

    // ==========================================
    // 2. READ: Menampilkan Data dari Database
    // ==========================================
    function loadDaftarPeserta() {
        const container = $('#container-peserta');
        
        // Tampilkan indikator loading sementara data diambil
        container.html('<p class="col-span-3 text-center text-gray-500 font-bold mt-10">Memuat data peserta...</p>');

        apiGetPeserta()
            .done(function(peserta) {
                container.empty(); // Bersihkan loading state

                if(peserta.length === 0) {
                    container.append('<p class="col-span-3 text-center text-gray-500">Belum ada peserta yang terdaftar.</p>');
                    return;
                }

                // Looping data dari backend dan buat elemen HTML-nya
                peserta.forEach(function(p) {
                    // Penentuan warna badge status
                    let statusColor = p.status === 'Aktif' ? 'bg-green-100 text-green-800' : 
                                      p.status === 'Selesai' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-yellow-100 text-yellow-800'; // Untuk pending

                    const card = `
                        <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            <div class="h-24 bg-unnes flex items-center justify-center">
                                <i class="fas fa-user text-4xl text-unnes-yellow opacity-80"></i>
                            </div>
                            <div class="p-6">
                                <h4 class="font-bold text-xl font-heading">${p.nama_lengkap}</h4>
                                <p class="text-sm text-blue-600 font-medium">${p.peran} - ${p.asal_instansi}</p>
                                <p class="mt-4 text-sm text-gray-600 italic line-clamp-3">"${p.alasan_magang}"</p>
                                <div class="mt-4 flex justify-between items-center">
                                    <span class="inline-block px-3 py-1 ${statusColor} text-xs rounded-full font-bold uppercase tracking-wide">${p.status}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    container.append(card);
                });
            })
            .fail(function(error) {
                container.html('<p class="col-span-3 text-center text-red-500">Gagal memuat data dari server.</p>');
                console.error('API Error:', error);
            });
    }

    // Panggil fungsi load data saat halaman web pertama kali dibuka
    loadDaftarPeserta();

});
// src/api.js
 
$(document).ready(function() {
    
    // 1. Loading Screen
    setTimeout(function() {
        $('#loading-screen').animate({ opacity: 0 }, 500, function() {
            $(this).hide();
        });
    }, 1500);

    // 2. Routing System (Navigasi Halaman)
    $('.nav-trigger').on('click', function() {
        const targetPage = $(this).data('page');
        
        $('.page').removeClass('active-page');
        $('#' + targetPage).addClass('active-page');
        
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    });

    // 3. Profile Overlay Toggle
    $('.profile-toggle').on('click', function(e) {
        // Mencegah overlay tertutup kalau kita klik di area box putihnya
        if ($(e.target).closest('.profile-content').length && !$(e.target).closest('button').length) {
            return; 
        }

        const overlay = $('#profile-overlay');
        if (overlay.css('display') === 'none') {
            overlay.css('display', 'flex').hide().fadeIn(200);
        } else {
            overlay.fadeOut(200);
        }
    });

    // 4. Form Izin View Toggle
    $('.izin-trigger').on('click', function() {
        const action = $(this).data('action');
        
        if (action === 'show') {
            $('#absensi-main-view').addClass('hidden');
            $('#absensi-izin-view').removeClass('hidden').hide().fadeIn(300);
        } else {
            $('#absensi-izin-view').addClass('hidden');
            $('#absensi-main-view').removeClass('hidden').hide().fadeIn(300);
        }
    });

    // 5. Submit Form Izin
    $('#form-izin').on('submit', function(e) {
        e.preventDefault();
        
        // Di sini nantinya kamu bisa panggil fungsi AJAX ke backend/API
        alert('Izin Berhasil Dikirim!');
        
        // Otomatis kembali ke menu utama absensi setelah submit
        $('.izin-trigger[data-action="hide"]').trigger('click');
        $(this).trigger('reset'); // Kosongkan form
    });

    // 6. Live Clock
    setInterval(function() {
        const now = new Date();
        $('#real-clock').text(now.toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);

});