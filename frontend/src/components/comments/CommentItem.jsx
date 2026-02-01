import React from 'react';

const CommentItem = ({ comment }) => {
    // Helper to format relative time
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eee', flexShrink: 0, overflow: 'hidden' }}>
                <img
                    src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name || 'U'}&background=random`}
                    alt={comment.user?.name || 'User'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{comment.user?.name || 'User'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>{timeAgo(comment.createdAt)}</span>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: '0.9rem', lineHeight: '1.3' }}>{comment.text}</p>
            </div>
        </div>
    );
};

export default CommentItem;
