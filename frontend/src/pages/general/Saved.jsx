import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import api from '../../services/api'
import ReelFeed from '../../components/ReelFeed'

const Saved = () => {
    const [videos, setVideos] = useState([])
    const [emptyMessage, setEmptyMessage] = useState("No saved videos yet.")

    useEffect(() => {
        api.get("/food/save")
            .then(response => {
                // Skip saves whose food item has since been deleted
                const savedFoods = response.data.savedFoods.filter((item) => item.food).map((item) => ({
                    _id: item.food._id,
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
            .catch((error) => {
                if (error.response?.status === 401) setEmptyMessage("Please log in as a foodie to see your saved videos.")
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            await api.post("/food/save", { foodId: item._id })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1), isSaved: false } : v))
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage={emptyMessage}
        />
    )
}

export default Saved
