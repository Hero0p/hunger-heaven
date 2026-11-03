import React from 'react';

import '../../styles/menu-grid.css';

const MenuGrid = ({ items = [] }) => {
    if (!items || items.length === 0) {
        return <div className="empty-card"><p>No menu items yet.</p></div>;
    }

    return (
        <div className="menu-grid">
            {items.map((item, index) => (
                <article key={item._id || index} className="menu-card">
                    <div className="menu-card-content">
                        <h3 className="menu-card-title">{item.name}</h3>
                        {item.price != null && <div className="menu-card-price">₹{item.price}</div>}
                        {item.description && <p className="menu-card-desc">{item.description}</p>}
                    </div>
                    <div className="menu-card-image-container">
                        <img
                            src={item.image || 'https://placehold.co/300?text=No+Image'}
                            alt={item.name}
                            className="menu-card-image"
                            loading="lazy"
                        />
                    </div>
                </article>
            ))}
        </div>
    );
};

export default MenuGrid;
