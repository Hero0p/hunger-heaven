import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/reels.css'
import api from '../../services/api'
import ReelFeed from '../../components/ReelFeed'
import { useUser } from '../../context/UserContext'

const Saved = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, loading: userLoading } = useUser()

    useEffect(() => {
        if (userLoading) return
        if (!user) { setLoading(false); return }

        api.get("/food/save")
            .then(response => {
                // Skip saves whose food item has since been deleted
                const savedFoods = response.data.savedFoods.filter((item) => item.food).map((item) => ({
                    _id: item.food._id,
                    name: item.food.name,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                    isSaved: true,
                }))
                setVideos(savedFoods)
            })
            .catch(() => { /* fall through to the empty state */ })
            .finally(() => setLoading(false))
    }, [user, userLoading])

    const removeSaved = async (item) => {
        try {
            await api.post("/food/save", { foodId: item._id })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1), isSaved: false } : v))
        } catch {
            // noop
        }
    }

    const emptyMessage = user ? (
        <>
            <h2>No saved reels yet</h2>
            <p>Tap the bookmark on any reel to keep it here.</p>
            <Link to="/feed" className="btn btn-solid">Browse reels</Link>
        </>
    ) : (
        <>
            <h2>Save reels you love</h2>
            <p>Log in to keep your favourite dishes in one place.</p>
            <Link to="/user/login" state={{ from: '/saved' }} className="btn btn-solid">Log in</Link>
        </>
    )

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            loading={loading || userLoading}
            emptyMessage={emptyMessage}
        />
    )
}

export default Saved
