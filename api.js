// src/api.js
// Contoh struktur untuk memisahkan logika backend

export const submitAbsenMasuk = (userId) => {
    return $.ajax({
        url: 'https://api.sirema.unnes.ac.id/absen',
        method: 'POST',
        data: { id: userId, tipe: 'masuk' }
    });
};

export const kirimIzin = (dataIzin) => {
    // logika ajax pengiriman izin
};