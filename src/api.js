// src/api.js

// URL Relatif (Bisa diubah jadi URL lengkap jika backend & frontend dipisah di Replit)
const PESERTA_URL = '/api/peserta';
const TUGAS_URL = '/api/tugas';

// ==========================================
// API PESERTA MAGANG
// ==========================================
export const apiDaftarPeserta = (data) => {
    return $.ajax({
        url: PESERTA_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
};

export const apiGetPeserta = () => {
    return $.ajax({
        url: PESERTA_URL,
        method: 'GET'
    });
};

// ==========================================
// API TUGAS MAGANG
// ==========================================
export const apiGetTugas = () => {
    return $.ajax({
        url: TUGAS_URL,
        method: 'GET'
    });
};

export const apiCreateTugas = (data) => {
    return $.ajax({
        url: TUGAS_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
};

export const apiUpdateTugas = (id, data) => {
    return $.ajax({
        url: `${TUGAS_URL}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
};

export const apiDeleteTugas = (id) => {
    return $.ajax({
        url: `${TUGAS_URL}/${id}`,
        method: 'DELETE'
    });
};