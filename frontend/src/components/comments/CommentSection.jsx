import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import CommentItem from './CommentItem';
import { getComments, postComment } from '../../services/comment.api';
import { useUser } from '../../context/UserContext';

const CommentSection = ({ contentId, onClose }) => {
    const { user } = useUser();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Prevent background scrolling when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const fetchComments = async (pageNum) => {
        setLoading(true);
        try {
            const data = await getComments(contentId, pageNum);
            if (data && data.comments) {
                if (pageNum === 1) {
                    setComments(data.comments);
                } else {
                    setComments(prev => [...prev, ...data.comments]);
                }
                // Check if we reached the end (backend pages are 10 comments)
                if (data.comments.length < 10) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(1);
    }, [contentId]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchComments(nextPage);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        // Optimistic UI
        const tempId = Date.now();
        const optimisticComment = {
            id: tempId,
            text: newComment,
            user: { name: user?.name || 'You', avatar: '' },
            createdAt: new Date().toISOString()
        };

        setComments([optimisticComment, ...comments]);
        setNewComment('');

        try {
            const result = await postComment(contentId, optimisticComment.text);
            // Replace optimistic comment with real one if needed, or just let re-fetch handle consistency eventually.
            // For now, assume success and maybe update ID if we could match. 
            // Better: update the list with the real returned comment to have correct ID/User info.
            if (result && result.comment) {
                setComments(prev => [result.comment, ...prev.filter(c => c.id !== tempId)]);
            }
        } catch (error) {
            console.error("Failed to post comment", error);
            // Revert optimistic update
            setComments(prev => prev.filter(c => c.id !== tempId));
            alert('Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="comment-sheet-overlay"
            onMouseDown={onClose}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 10000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}
        >
            <div
                className="comment-sheet"
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    maxWidth: '500px',
                    height: '70vh',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideUp 0.3s ease-out'
                }}
            >
                <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

                <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ width: '40px', height: '4px', backgroundColor: '#ddd', borderRadius: '2px', position: 'absolute', top: '8px' }}></div>
                    <h3 style={{ margin: '12px 0 0', fontSize: '1rem' }}>Comments</h3>
                    <button onClick={onClose} aria-label="Close comments" style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', fontSize: '1.5rem', lineHeight: 1, cursor: 'pointer', color: 'var(--color-text-secondary)' }}>&times;</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {loading && page === 1 && <p style={{ textAlign: 'center', color: '#999' }}>Loading comments...</p>}

                    {!loading && comments.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>No comments yet. Be the first!</p>}

                    {comments.map((comment, idx) => (
                        <CommentItem key={comment._id || comment.id || idx} comment={comment} />
                    ))}

                    {hasMore && (
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}
                        >
                            {loading ? 'Loading...' : 'Load more comments'}
                        </button>
                    )}
                </div>

                {user ? (
                    <form onSubmit={handleSubmit} style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)', outline: 'none', font: 'inherit' }}
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', opacity: newComment.trim() ? 1 : 0.4, fontWeight: '600', cursor: 'pointer' }}
                        >
                            Post
                        </button>
                    </form>
                ) : (
                    <div style={{ padding: '14px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
                        <Link to="/user/login" state={{ from: `/feed?reel=${contentId}` }} style={{ fontWeight: 600 }}>Log in</Link> to join the conversation
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default CommentSection;
