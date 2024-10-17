import React from 'react';

const ProcessAccountPatient = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.message}>Akun belum di ACC, silahkan menunggu minimal 3 hari kerja</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Mengatur tinggi kontainer agar memenuhi layar
    backgroundColor: '#f9f9f9', // Warna latar belakang
  },
  message: {
    fontSize: '24px', // Ukuran font
    color: '#333', // Warna teks
    textAlign: 'center', // Penjajaran teks ke tengah
  },
};

export default ProcessAccountPatient;