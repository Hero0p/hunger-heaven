import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CommentSection from './comments/CommentSection'

// 1234 -> "1.2K"
const formatCount = (n = 0) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

// Reusable feed for vertical reels
// Props:
// - items: Array of video items { _id, name, video, description, likeCount, savesCount, commentCount, foodPartner }
// - onLike: (item) => void | Promise<void>
// - onSave: (item) => void | Promise<void>
// - emptyMessage: string or element shown when there are no items
// - loading: show a spinner instead of the empty state
// - startId: reel to scroll to once items load
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.', loading = false, startId }) => {
  const videoRefs = useRef(new Map())
  const reelRefs = useRef(new Map())
  const [activeCommentReel, setActiveCommentReel] = useState(null)
  const [pausedIds, setPausedIds] = useState(() => new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { /* ignore autoplay errors */ })
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  // Jump to the requested reel (e.g. opened from a restaurant page)
  useEffect(() => {
    if (!startId || items.length === 0) return
    reelRefs.current.get(startId)?.scrollIntoView({ block: 'start' })
  }, [startId, items.length])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  const setReelRef = (id) => (el) => {
    if (!el) { reelRefs.current.delete(id); return }
    reelRefs.current.set(id, el)
  }

  const setPaused = (id, paused) => {
    setPausedIds((prev) => {
      if (prev.has(id) === paused) return prev
      const next = new Set(prev)
      if (paused) next.add(id); else next.delete(id)
      return next
    })
  }

  const togglePlay = (id) => {
    const video = videoRefs.current.get(id)
    if (!video) return
    if (video.paused) video.play().catch(() => { })
    else video.pause()
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {loading && (
          <div className="reels-state">
            <div className="spinner reels-spinner" aria-label="Loading reels" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="reels-state">
            <div className="reels-state__content">
              {typeof emptyMessage === 'string' ? <p>{emptyMessage}</p> : emptyMessage}
            </div>
          </div>
        )}

        {items.map((item) => {
          const partner = item.foodPartner && typeof item.foodPartner === 'object' ? item.foodPartner : null
          const liked = item.isLiked || item.liked
          const saved = item.isSaved || item.saved

          return (
            <section key={item._id} ref={setReelRef(item._id)} className="reel" role="listitem">
              <div className="reel-frame">
                <video
                  ref={setVideoRef(item._id)}
                  className="reel-video"
                  src={item.video}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  onClick={() => togglePlay(item._id)}
                  onPlay={() => setPaused(item._id, false)}
                  onPause={() => setPaused(item._id, true)}
                />

                {pausedIds.has(item._id) && (
                  <button className="reel-play" onClick={() => togglePlay(item._id)} aria-label="Play">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" /></svg>
                  </button>
                )}

                <div className="reel-overlay">
                  <div className="reel-overlay-gradient" aria-hidden="true" />
                  <div className="reel-actions">
                    <div className="reel-action-group">
                      <button
                        onClick={onLike ? () => onLike(item) : undefined}
                        className={`reel-action ${liked ? 'is-liked' : ''}`}
                        aria-label={liked ? 'Unlike' : 'Like'}
                        aria-pressed={!!liked}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill={liked ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                        </svg>
                      </button>
                      <div className="reel-action__count">{formatCount(item.likeCount ?? item.likesCount ?? item.likes ?? 0)}</div>
                    </div>

                    <div className="reel-action-group">
                      <button
                        className="reel-action"
                        aria-label="Comments"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCommentReel(activeCommentReel === item._id ? null : item._id);
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                        </svg>
                      </button>
                      <div className="reel-action__count">{formatCount(item.commentCount ?? item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0))}</div>
                    </div>

                    <div className="reel-action-group">
                      <button
                        className="reel-action"
                        onClick={onSave ? () => onSave(item) : undefined}
                        aria-label={saved ? 'Remove from saved' : 'Save'}
                        aria-pressed={!!saved}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill={saved ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                        </svg>
                      </button>
                      <div className="reel-action__count">{formatCount(item.savesCount ?? item.bookmarks ?? item.saves ?? 0)}</div>
                    </div>
                  </div>

                  <div className="reel-content">
                    {partner && (
                      <div className="reel-partner">
                        <Link to={"/food-partner/" + partner._id} className="reel-partner__link">
                          {partner.image
                            ? <img className="reel-partner__avatar" src={partner.image} alt="" />
                            : <span className="reel-partner__avatar reel-partner__avatar--empty">{partner.name?.charAt(0)}</span>}
                          <span className="reel-partner__name">{partner.name}</span>
                        </Link>
                        <Link className="reel-btn" to={"/food-partner/" + partner._id} aria-label={`View ${partner.name} menu`}>View menu</Link>
                      </div>
                    )}
                    {item.name && <h2 className="reel-title">{item.name}</h2>}
                    {item.description && <p className="reel-description" title={item.description}>{item.description}</p>}
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {
        activeCommentReel && (
          <CommentSection
            contentId={activeCommentReel}
            onClose={() => setActiveCommentReel(null)}
          />
        )
      }
    </div >
  )
}

export default ReelFeed
