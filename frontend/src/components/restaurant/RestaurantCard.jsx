import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/food-partner/${restaurant._id}`} className="restaurant-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="restaurant-card-image-container" style={{ position: 'relative', width: '100%', paddingTop: '66%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e0e0e0' }}>
                <img
                    src={restaurant.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={restaurant.name}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div className="restaurant-card-content" style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '600' }}>{restaurant.name}</h3>
                    <span style={{ backgroundColor: '#267E3E', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {restaurant.rating || 'NEW'}
                    </span>
                </div>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#696969', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {restaurant.cuisine || 'Fast Food, North Indian'}
                </p>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#9c9c9c' }}>
                    {restaurant.address || 'Location unavailable'}
                </p>

                <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '12px', paddingTop: '8px', display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#555' }}>
                    <span>🍽️ {restaurant.totalFoodItems || 0} Items</span>
                    <span>📹 {restaurant.totalReels || 0} Reels</span>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
