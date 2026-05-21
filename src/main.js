// Import fungsi tambahan dari file lain jika diperlukan
// import { prosesData } from './api.js'; 

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