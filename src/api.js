// src/api.js

// ==========================================
// PENGATURAN URL (PILIH SALAH SATU)
// ==========================================

// OPSI 1: Jika file Frontend dan Backend DIGABUNG dalam satu folder/satu Replit
const PESERTA_URL = '/api/peserta';
const TUGAS_URL = '/api/tugas';

// OPSI 2: Jika Backend jalan di terminal lokal (port 5000) dan Frontend dibuka via Live Server HTML
// const PESERTA_URL = 'http://localhost:5000/api/peserta';
// const TUGAS_URL = 'http://localhost:5000/api/tugas';

// OPSI 3: Jika Frontend dan Backend dipisah di 2 project Replit yang berbeda
// const PESERTA_URL = 'https://nama-backend-replitmu.replit.app/api/peserta';
// const TUGAS_URL = 'https://nama-backend-replitmu.replit.app/api/tugas';


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