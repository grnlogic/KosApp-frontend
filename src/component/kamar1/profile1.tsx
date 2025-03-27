import React from 'react';

const Profile1: React.FC = () => {
    return (
        <div
            style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#0000FF', // Warna latar belakang biru
            color: '#fff', // Warna teks putih
            }}
        >
            <div>
            <h1>Profile 1</h1>
            <p>This is the Profile1 component.</p>
            </div>
        </div>
    );
};

export default Profile1;