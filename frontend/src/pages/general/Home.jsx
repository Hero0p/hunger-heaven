import React, { useEffect, useState } from 'react'
import api from '../../services/api';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [videos, setVideos] = useState([])
    const [emptyMessage, setEmptyMessage] = useState("No videos available.")
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        api.get("/food")
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch((error) => {
                if (error.response?.status === 401) setEmptyMessage("Please log in as a foodie to watch reels.")
            })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await api.post("/food/like", { foodId: item._id })

        if (response.data.like) {
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1, isLiked: true } : v))
        } else {
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1, isLiked: false } : v))
        }

    }

    async function saveVideo(item) {
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
            emptyMessage={emptyMessage}
        />
    )
}

export default Home