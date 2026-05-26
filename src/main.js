// src/main.js

// 1. IMPORT SEMUA FUNGSI API
import { 
    apiDaftarPeserta, 
    apiGetPeserta,
    apiGetTugas, 
    apiCreateTugas, 
    apiUpdateTugas, 
    apiDeleteTugas 
} from './api.js';

$(document).ready(function() {
    
    // ==========================================
    // A. LOADING SCREEN
    // ==========================================
    setTimeout(function() {
        $('#loading-screen').animate({ opacity: 0 }, 500, function() {
            $(this).hide();
        });
    }, 1500);

    // ==========================================
    // B. SISTEM OTORISASI (LOGIN SIMULATION) & NAVIGASI
    // ==========================================
    let isLoggedIn = localStorage.getItem('sirema_logged_in') === 'true';

    function renderAksesMenu() {
        if (isLoggedIn) {
            $('[data-role="guest"]').hide();
            $('[data-role="logged-in"]').show();
            $('[data-role="both"]').show();
            
            // Atur tampilan panel profil
            $('.info-peserta-logged-in').show();
            $('.info-peserta-guest').hide();
            $('#btn-auth-action').text('Log Out').addClass('bg-red-600 text-white hover:bg-red-700').removeClass('bg-blue-900 text-yellow-400');
        } else {
            $('[data-role="guest"]').show();
            $('[data-role="logged-in"]').hide();
            $('[data-role="both"]').show();
            
            // Atur tampilan panel profil guest
            $('.info-peserta-logged-in').hide();
            $('.info-peserta-guest').show();
            $('#btn-auth-action').text('Log In').addClass('bg-blue-900 text-yellow-400 hover:bg-blue-800').removeClass('bg-red-600 text-white');
            
            // Proteksi halaman internal
            const activePage = $('.page.active-page').attr('id');
            if (activePage === 'absensi' || activePage === 'tugas') {
                alihkanHalaman('beranda');
            }
        }
    }

    // Aksi Tombol Login/Logout di Profil
    $('#btn-auth-action').on('click', function() {
        isLoggedIn = !isLoggedIn;
        localStorage.setItem('sirema_logged_in', isLoggedIn);
        renderAksesMenu();
        $('#profile-overlay').fadeOut(200);
        alihkanHalaman('beranda');
    });

    // Fungsi Utama Pindah Halaman
    function alihkanHalaman(pageId) {
        $('.page').removeClass('active-page');
        $('#' + pageId).addClass('active-page');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }

    // Trigger Navigasi saat Menu Diklik
    $('.nav-trigger').on('click', function() {
        const page = $(this).data('page');
        alihkanHalaman(page);
    });

    // Toggle Sidebar Profile
    $('.profile-toggle').on('click', function(e) {
        if ($(e.target).closest('.profile-content').length && !$(e.target).closest('button').length) return;
        $('#profile-overlay').toggle().css('display', function(_, current) {
            return current === 'none' ? 'none' : 'flex';
        });
    });

    // Jalankan pengecekan hak akses saat web dimuat
    renderAksesMenu();


    // ==========================================
    // C. FITUR ABSENSI & JAM
    // ==========================================
    
    // Live Clock
    setInterval(function() {
        const now = new Date();
        $('#real-clock').text(now.toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);

    // Toggle Form Izin
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

    // Submit Form Izin
    $('#form-izin').on('submit', function(e) {
        e.preventDefault();
        alert('Izin Berhasil Dikirim ke Pembimbing!');
        $('.izin-trigger[data-action="hide"]').trigger('click');
        $(this).trigger('reset');
    });


    // ==========================================
    // D. CRUD PESERTA MAGANG
    // ==========================================

    $('#form-pendaftaran').on('submit', function(e) {
        e.preventDefault();
        
        const dataPeserta = {
            nama_lengkap: $('#nama_lengkap').val(),
            peran: $('#peran').val(),
            nomor_telepon: $('#nomor_telepon').val(),
            asal_instansi: $('#asal_instansi').val(),
            alasan_magang: $('#alasan_magang').val()
        };

        const btnSubmit = $(this).find('button[type="submit"]');
        const originalText = btnSubmit.text();
        btnSubmit.text('Mengirim Data...').prop('disabled', true);

        apiDaftarPeserta(dataPeserta)
            .done(function() {
                alert('Pendaftaran berhasil! Anda akan segera dihubungi.');
                $('#form-pendaftaran').trigger('reset');
                loadDaftarPeserta();
                alihkanHalaman('peserta');
            })
            .fail(function(xhr) {
                const errorMsg = xhr.responseJSON ? xhr.responseJSON.message : 'Terjadi kesalahan koneksi.';
                alert('Gagal mendaftar: ' + errorMsg);
            })
            .always(function() {
                btnSubmit.text(originalText).prop('disabled', false);
            });
    });

    function loadDaftarPeserta() {
        const container = $('#container-peserta');
        container.html('<p class="col-span-3 text-center text-gray-500 font-bold mt-10">Memuat data peserta...</p>');

        apiGetPeserta()
            .done(function(peserta) {
                container.empty();
                if(peserta.length === 0) {
                    container.append('<p class="col-span-3 text-center text-gray-500">Belum ada peserta yang terdaftar.</p>');
                    return;
                }

                peserta.forEach(function(p) {
                    let statusColor = p.status === 'Aktif' ? 'bg-green-100 text-green-800' : 
                                      p.status === 'Selesai' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-yellow-100 text-yellow-800';

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
                                </div>,
                            </div>
                        </div>
                    `;
                    container.append(card);
                });
            })
            .fail(function() {
                container.html('<p class="col-span-3 text-center text-red-500">Gagal memuat data dari server.</p>');
            });
    }


    // ==========================================
    // E. CRUD TUGAS MAGANG
    // ==========================================

    function loadDaftarTugas() {
        const container = $('#container-tugas');
        container.html('<p class="text-center text-gray-400 py-10">Menghubungkan ke basis data tugas...</p>');

        apiGetTugas().done(function(data) {
            container.empty();
            if(data.length === 0) {
                container.html('<div class="bg-white p-6 rounded-xl text-center text-gray-400 border border-dashed">Belum ada riwayat pengerjaan tugas proyek.</div>');
                return;
            }

            data.forEach(function(t) {
                const card = `
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                        <div class="space-y-2">
                            <span class="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">Proyek Kearsipan</span>
                            <h4 class="text-lg font-bold text-gray-800 font-heading JSON-judul">${t.judul}</h4>
                            <p class="text-sm text-gray-600 JSON-deskripsi">${t.deskripsi}</p>
                        </div>
                        <div class="flex space-x-2 flex-shrink-0 ml-4">
                            <button class="btn-edit-tugas p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" data-id="${t._id}"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete-tugas p-2 text-red-600 hover:bg-red-50 rounded-lg transition" data-id="${t._id}"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                `;
                container.append(card);
            });
        }).fail(function() {
            container.html('<p class="text-center text-red-500 py-10">Gagal mengunduh repositori tugas server.</p>');
        });
    }

    // Submit Form Tugas (Bisa Create atau Update)
    $('#form-tugas').on('submit', function(e) {
        e.preventDefault();
        const id = $('#tugas-id').val();
        const payload = {
            judul: $('#judul-tugas').val(),
            deskripsi: $('#deskripsi-tugas').val()
        };

        if(id) {
            // Jika ada ID tersembunyi, berarti Mode Edit (Update)
            apiUpdateTugas(id, payload).done(function() {
                alert('Tugas berhasil diperbarui!');
                resetFormTugas();
                loadDaftarTugas();
            });
        } else {
            // Jika tidak ada ID, berarti Mode Tambah Baru (Create)
            apiCreateTugas(payload).done(function() {
                alert('Progres tugas berhasil dikirim ke arsip database!');
                resetFormTugas();
                loadDaftarTugas();
            });
        }
    });

    // Masuk Mode Edit
    $(document).on('click', '.btn-edit-tugas', function() {
        const id = $(this).data('id');
        const parentCard = $(this).closest('.bg-white');
        const judul = parentCard.find('.JSON-judul').text();
        const deskripsi = parentCard.find('.JSON-deskripsi').text();

        $('#tugas-id').val(id);
        $('#judul-tugas').val(judul);
        $('#deskripsi-tugas').val(deskripsi);
        
        $('#btn-submit-tugas').text('Simpan Perubahan');
        $('#btn-batal-edit').removeClass('hidden');
        
        // Scroll layar ke form edit
        $('html, body').animate({ scrollTop: $('#tugas').offset().top }, 'fast');
    });

    // Batalkan Edit
    $('#btn-batal-edit').on('click', function() {
        resetFormTugas();
    });

    function resetFormTugas() {
        $('#form-tugas').trigger('reset');
        $('#tugas-id').val('');
        $('#btn-submit-tugas').text('Kirim Tugas');
        $('#btn-batal-edit').addClass('hidden');
    }

    // Hapus Tugas
    $(document).on('click', '.btn-delete-tugas', function() {
        if(confirm('Apakah Anda yakin ingin menghapus data tugas ini dari database?')) {
            const id = $(this).data('id');
            apiDeleteTugas(id).done(function() {
                loadDaftarTugas();
            });
        }
    });

    // ==========================================
    // F. INISIALISASI AWAL (Memanggil data pertama kali)
    // ==========================================
    loadDaftarPeserta();
    loadDaftarTugas();

});