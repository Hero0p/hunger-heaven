import React from 'react';
import { useUser } from '../../context/UserContext';
import BottomNav from '../../components/BottomNav';

const Profile = () => {
    const { user, logout } = useUser();

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <div style={{ padding: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '24px' }}>Profile</h1>

                {user ? (
                    <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ff7f50', color: 'white', display: 'grid', placeItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>{user.name}</h2>
                                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{user.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={logout}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #fee2e2',
                                    background: '#fef2f2',
                                    color: '#ef4444',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                        <p>Please login to view your profile.</p>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
};

export default Profile;
