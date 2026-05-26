// URL backend Node.js kamu
const BASE_URL = '/api/peserta';

// 1. Fungsi Create (Mengirim data pendaftaran)
export const apiDaftarPeserta = (data) => {
    return $.ajax({
        url: BASE_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
};

// 2. Fungsi Read (Mengambil semua data peserta)
export const apiGetPeserta = () => {
    return $.ajax({
        url: BASE_URL,
        method: 'GET'
    });
};