import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../services/api';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import { useUser } from '../../context/UserContext'
import { useFlashMessage } from '../../context/FlashMessageContext'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [searchParams] = useSearchParams()
    const startId = searchParams.get('reel')
    const navigate = useNavigate()
    const { user } = useUser()
    const { showMessage } = useFlashMessage()
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        api.get("/food")
            .then(response => {
                setVideos(response.data.foodItems)
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    // Likes and saves need an account; come back to the same reel after logging in
    const requireLogin = (item, action) => {
        if (user) return false
        showMessage(`Log in to ${action} reels`, 'info')
        navigate('/user/login', { state: { from: `/feed?reel=${item._id}` } })
        return true
    }

    async function likeVideo(item) {
        if (requireLogin(item, 'like')) return

        const response = await api.post("/food/like", { foodId: item._id })

        if (response.data.like) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1, isLiked: true } : v))
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1, isLiked: false } : v))
        }

    }

    async function saveVideo(item) {
        if (requireLogin(item, 'save')) return

        const response = await api.post("/food/save", { foodId: item._id })

        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1, isSaved: true } : v))
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1, isSaved: false } : v))
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            loading={loading}
            startId={startId}
            emptyMessage={error ? (
                <>
                    <h2>Couldn't load reels</h2>
                    <p>The server may be waking up. Please try again in a moment.</p>
                    <button className="btn btn-solid" onClick={() => window.location.reload()}>Retry</button>
                </>
            ) : "No reels yet."}
        />
    )
}

export default Home
