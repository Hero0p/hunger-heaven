import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="page" style={{ maxWidth: 560 }}>
        <div className="empty-card" style={{ marginTop: 'var(--space-10)' }}>
            <h2>Page not found</h2>
            <p>The page you're looking for doesn't exist or has moved.</p>
            <Link to="/discover" className="btn btn-solid">Browse restaurants</Link>
        </div>
    </div>
);

export default NotFound;
