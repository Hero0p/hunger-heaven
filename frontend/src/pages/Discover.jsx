import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../services/discover.api';
import RestaurantCard, { RestaurantCardSkeleton } from '../components/restaurant/RestaurantCard';
import '../styles/discover.css';

const Discover = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const fetchRestaurants = async (pageNum) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRestaurants(pageNum);
            if (data && data.restaurants) {
                if (pageNum === 1) {
                    setRestaurants(data.restaurants);
                } else {
                    setRestaurants(prev => [...prev, ...data.restaurants]);
                }

                // A short page (backend default limit is 10) means there is nothing more to load
                if (data.restaurants.length < 10) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Failed to load restaurants", err);
            setError("We couldn't load restaurants. The server may be waking up, please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants(1);
    }, []);

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchRestaurants(nextPage);
        }
    };

    const firstLoad = loading && restaurants.length === 0;

    return (
        <div className="page">
            <header className="page-header discover-header">
                <div>
                    <h1 className="page-title">Discover</h1>
                    <p className="page-subtitle">Find the best food partners around you</p>
                </div>
                <Link to="/search" className="discover-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    Search dishes or restaurants
                </Link>
            </header>

            {error && (
                <div className="empty-card">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button className="btn btn-solid" onClick={() => fetchRestaurants(page)}>Retry</button>
                </div>
            )}

            <div className="restaurant-grid">
                {restaurants.map(restaurant => (
                    <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
                {firstLoad && Array.from({ length: 6 }, (_, i) => <RestaurantCardSkeleton key={i} />)}
            </div>

            {loading && !firstLoad && (
                <div className="spinner-center"><div className="spinner" /></div>
            )}

            {!loading && hasMore && restaurants.length > 0 && (
                <div className="discover-more">
                    <button onClick={loadMore} className="btn btn-outline">Load more</button>
                </div>
            )}

            {!loading && !hasMore && restaurants.length > 0 && (
                <p className="discover-end">You've seen all {restaurants.length} restaurants</p>
            )}

            {!loading && restaurants.length === 0 && !error && (
                <div className="empty-card"><p>No restaurants found.</p></div>
            )}
        </div>
    );
};

export default Discover;
