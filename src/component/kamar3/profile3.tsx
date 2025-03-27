import React from 'react';

const Profile3: React.FC = () => {
    return (
        <div
            style={{
                padding: '20px',
                color: 'white',
                backgroundColor: 'blue', // Tambahkan warna latar belakang
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Agar div memenuhi tinggi layar
                textAlign: 'center', // Untuk teks di tengah
            }}
        >
            <div>
                <h1>Profile 3</h1>
                <p>This is the Profile3 component.</p>
            </div>
        </div>
    );
};

export default Profile3;