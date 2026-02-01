import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/theme.css';

const PartnerDashboard = () => {
    return (
        <div style={{
            minHeight: '100vh',
            padding: '24px',
            background: 'var(--bg-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#064e3b' }}>Partner Dashboard</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px' }}>What would you like to create today?</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                width: '100%',
                maxWidth: '800px'
            }}>
                <Link to="/partner/add-menu" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                        }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#064e3b',
                            display: 'grid', placeItems: 'center'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>Create Menu</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Add delicious items to your menu with images and prices.</p>
                        <span style={{
                            marginTop: '8px', padding: '8px 24px', borderRadius: '99px', background: '#064e3b', color: '#fff', fontWeight: '600'
                        }}>Go to Menu &rarr;</span>
                    </div>
                </Link>

                <Link to="/create-food" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                        }}
                    >
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', background: '#fff1f2', color: '#e11d48',
                            display: 'grid', placeItems: 'center'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 7l-7 5 7 5V7z" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '1.25rem', color: '#1e293b' }}>Post a Reel</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Share short, engaging videos of your dishes to attract foodies.</p>
                        <span style={{
                            marginTop: '8px', padding: '8px 24px', borderRadius: '99px', background: '#e11d48', color: '#fff', fontWeight: '600'
                        }}>Create Reel &rarr;</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default PartnerDashboard;
