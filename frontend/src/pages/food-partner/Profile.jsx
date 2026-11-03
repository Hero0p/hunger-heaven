import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import MenuGrid from '../../components/menu/MenuGrid'

const ProfileSkeleton = () => (
    <section className="rp-hero" aria-busy="true">
        <div className="rp-cover skeleton" />
        <div className="rp-hero__body">
            <div className="rp-avatar skeleton" />
            <div className="rp-hero__text">
                <div className="skeleton" style={{ height: 26, width: '55%' }} />
                <div className="skeleton" style={{ height: 16, width: '35%', marginTop: 10 }} />
                <div className="skeleton" style={{ height: 14, width: '70%', marginTop: 10 }} />
            </div>
        </div>
    </section>
)

const Profile = () => {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [menuItems, setMenuItems] = useState([])
    const [activeTab, setActiveTab] = useState('menu')
    const [error, setError] = useState(null)

    useEffect(() => {
        setProfile(null)
        setError(null)
        api.get(`/food-partner/${id}`)
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.reels || [])
                setMenuItems(response.data.foodPartner.menuItems || [])
            })
            .catch((err) => {
                setError(err.response?.status === 404 ? 'This restaurant could not be found.' : 'Could not load this restaurant. Please try again.')
            })
    }, [id])

    // Opened directly (no in-app history): go to Discover instead of leaving the site
    const goBack = () => (location.key === 'default' ? navigate('/discover') : navigate(-1))

    return (
        <main className="rp">
            <header className="rp-topbar">
                <button className="rp-back" onClick={goBack} aria-label="Go back">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <span className="rp-topbar__title">{profile?.name || 'Restaurant'}</span>
            </header>

            {error ? (
                <div className="empty-card">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <Link to="/discover" className="btn btn-solid">Browse restaurants</Link>
                </div>
            ) : !profile ? (
                <ProfileSkeleton />
            ) : (
                <>
                    <section className="rp-hero">
                        <div className="rp-cover">
                            {profile.image && <img src={profile.image} alt="" />}
                        </div>
                        <div className="rp-hero__body">
                            {profile.image
                                ? <img className="rp-avatar" src={profile.image} alt={profile.name} />
                                : <div className="rp-avatar rp-avatar--empty">{profile.name?.charAt(0)}</div>}
                            <div className="rp-hero__text">
                                <div className="rp-title-row">
                                    <h1 className="rp-name">{profile.name}</h1>
                                    {profile.rating && <span className="rp-rating" title="Rating">★ {profile.rating.toFixed(1)}</span>}
                                </div>
                                {profile.cuisine && <p className="rp-cuisine">{profile.cuisine}</p>}
                                {profile.address && (
                                    <p className="rp-address">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {profile.address}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="rp-stats" role="list" aria-label="Stats">
                            <div className="rp-stat" role="listitem">
                                <span className="rp-stat__value">{menuItems.length}</span>
                                <span className="rp-stat__label">Dishes</span>
                            </div>
                            <div className="rp-stat" role="listitem">
                                <span className="rp-stat__value">{videos.length}</span>
                                <span className="rp-stat__label">Reels</span>
                            </div>
                            <div className="rp-stat" role="listitem">
                                <span className="rp-stat__value">{profile.customersServed}</span>
                                <span className="rp-stat__label">Customers served</span>
                            </div>
                        </div>
                    </section>

                    <div className="rp-tabs" role="tablist">
                        <button role="tab" aria-selected={activeTab === 'menu'} className={`rp-tab ${activeTab === 'menu' ? 'is-active' : ''}`} onClick={() => setActiveTab('menu')}>
                            Menu <span className="rp-tab__count">{menuItems.length}</span>
                        </button>
                        <button role="tab" aria-selected={activeTab === 'reels'} className={`rp-tab ${activeTab === 'reels' ? 'is-active' : ''}`} onClick={() => setActiveTab('reels')}>
                            Reels <span className="rp-tab__count">{videos.length}</span>
                        </button>
                    </div>

                    {activeTab === 'menu' ? (
                        <MenuGrid items={menuItems} />
                    ) : videos.length === 0 ? (
                        <div className="empty-card"><p>No reels yet.</p></div>
                    ) : (
                        <section className="rp-reels" aria-label="Reels">
                            {videos.map((v) => (
                                <Link to={`/feed?reel=${v._id}`} key={v._id} className="rp-reel" aria-label={`Watch ${v.name}`}>
                                    {/* #t= makes browsers render a frame as the thumbnail */}
                                    <video className="rp-reel__video" src={`${v.video}#t=0.5`} muted playsInline preload="metadata" />
                                    <div className="rp-reel__overlay">
                                        <span className="rp-reel__name">{v.name}</span>
                                        <span className="rp-reel__likes">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
                                            {v.likeCount ?? 0}
                                        </span>
                                    </div>
                                    <span className="rp-reel__play" aria-hidden="true">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" /></svg>
                                    </span>
                                </Link>
                            ))}
                        </section>
                    )}
                </>
            )}
        </main>
    )
}

export default Profile
