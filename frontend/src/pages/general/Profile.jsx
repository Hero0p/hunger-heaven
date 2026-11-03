import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import BottomNav from '../../components/BottomNav';
import '../../styles/account.css';

const Chevron = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
);

const Profile = () => {
    const { user, loading, logout } = useUser();

    return (
        <div className="page account-page">
            <header className="page-header">
                <h1 className="page-title">Profile</h1>
            </header>

            {loading ? (
                <div className="spinner-center"><div className="spinner" /></div>
            ) : user ? (
                <>
                    <section className="account-card">
                        <div className="account-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                        <div className="account-info">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    </section>

                    <nav className="account-links" aria-label="Account">
                        <Link to="/saved" className="account-link">Saved reels <Chevron /></Link>
                        <Link to="/discover" className="account-link">Browse restaurants <Chevron /></Link>
                        <Link to="/feed" className="account-link">Watch reels <Chevron /></Link>
                    </nav>

                    <button onClick={logout} className="btn btn-danger-soft account-logout">Log out</button>
                </>
            ) : (
                <>
                    <section className="empty-card account-guest">
                        <div className="account-avatar account-avatar--guest" aria-hidden="true">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h2>You're browsing as a guest</h2>
                        <p>Log in to like, save and comment on reels.</p>
                        <div className="account-guest__actions">
                            <Link to="/user/login" state={{ from: '/profile' }} className="btn btn-solid">Log in</Link>
                            <Link to="/user/register" state={{ from: '/profile' }} className="btn btn-outline">Create account</Link>
                        </div>
                    </section>

                    <Link to="/food-partner/login" className="account-partner">
                        <div>
                            <strong>Own a restaurant?</strong>
                            <span>Log in to the partner dashboard to manage your menu and reels.</span>
                        </div>
                        <Chevron />
                    </Link>
                </>
            )}
            <BottomNav />
        </div>
    );
};

export default Profile;
