import React, { useState, useEffect, use } from 'react'
import '../../styles/profile.css'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'
import MenuGrid from '../../components/menu/MenuGrid'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [menuItems, setMenuItems] = useState([])
    const [activeTab, setActiveTab] = useState('reels')

    useEffect(() => {
        api.get(`/food-partner/${id}`)
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.reels || [])
                setMenuItems(response.data.foodPartner.menuItems || [])
            })
    }, [id])


    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">

                    <img className="profile-avatar" src={profile?.image || "https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"} alt={profile?.name || "Profile"} />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed}</span>
                    </div>
                </div>
            </section>



            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', gap: '10px' }}>
                <button
                    onClick={() => setActiveTab('reels')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #064e3b',
                        background: activeTab === 'reels' ? '#064e3b' : '#fff',
                        color: activeTab === 'reels' ? '#fff' : '#064e3b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Reels
                </button>
                <button
                    onClick={() => setActiveTab('menu')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #064e3b',
                        background: activeTab === 'menu' ? '#064e3b' : '#fff',
                        color: activeTab === 'menu' ? '#fff' : '#064e3b',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Menu
                </button>
            </div>

            {
                activeTab === 'reels' ? (
                    <section className="profile-grid" aria-label="Videos">
                        {videos.length === 0 ? <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#999' }}>No reels yet.</div> : null}
                        {videos.map((v) => (
                            <Link to="/feed" key={v.id} className="profile-grid-item" style={{ display: 'block', textDecoration: 'none' }}>
                                <video
                                    className="profile-grid-video"
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                    src={v.video} muted ></video>
                            </Link>
                        ))}
                    </section>
                ) : (
                    <MenuGrid items={menuItems} />
                )
            }
        </main >
    )
}

export default Profile