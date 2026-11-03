import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/discover.css';

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const RestaurantCardSkeleton = () => (
    <div className="restaurant-card" aria-hidden="true">
        <div className="restaurant-card__media skeleton" />
        <div className="restaurant-card__body">
            <div className="skeleton" style={{ height: 18, width: '60%' }} />
            <div className="skeleton" style={{ height: 14, width: '80%', marginTop: 10 }} />
            <div className="skeleton" style={{ height: 14, width: '45%', marginTop: 8 }} />
        </div>
    </div>
);

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/food-partner/${restaurant._id}`} className="restaurant-card">
            <div className="restaurant-card__media">
                {restaurant.image
                    ? <img src={restaurant.image} alt={restaurant.name} loading="lazy" />
                    : <div className="restaurant-card__placeholder">{restaurant.name?.charAt(0)}</div>}
                <span className={`restaurant-card__rating ${restaurant.rating ? '' : 'is-new'}`}>
                    {restaurant.rating ? `★ ${restaurant.rating.toFixed(1)}` : 'New'}
                </span>
            </div>
            <div className="restaurant-card__body">
                <h3 className="restaurant-card__name">{restaurant.name}</h3>
                {restaurant.cuisine && <p className="restaurant-card__cuisine">{restaurant.cuisine}</p>}
                <p className="restaurant-card__address">{restaurant.address || 'Location unavailable'}</p>
                <div className="restaurant-card__meta">
                    <span>{plural(restaurant.totalFoodItems || 0, 'dish', 'dishes')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{plural(restaurant.totalReels || 0, 'reel', 'reels')}</span>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
