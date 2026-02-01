import React from 'react';

import '../../styles/menu-grid.css';

const MenuGrid = ({ items = [] }) => {
    if (!items || items.length === 0) {
        return <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No menu items yet.</div>;
    }

    return (
        <div className="menu-grid">
            {items.map((item, index) => (
                <div key={item._id || index} className="menu-card">
                    <div className="menu-card-image-container">
                        <img
                            src={item.image || 'https://via.placeholder.com/300?text=No+Image'}
                            alt={item.name}
                            className="menu-card-image"
                        />
                    </div>
                    <div className="menu-card-content">
                        <h4 className="menu-card-title">{item.name}</h4>
                        <p className="menu-card-desc">
                            {item.description}
                        </p>
                        <div className="menu-card-price">₹{item.price}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuGrid;
