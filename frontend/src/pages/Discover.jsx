import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../services/discover.api';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import BottomNav from '../components/BottomNav';

const Discover = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const fetchRestaurants = async (pageNum) => {
        setLoading(true);
        try {
            const data = await getRestaurants(pageNum);
            if (data && data.restaurants) {
                if (pageNum === 1) {
                    setRestaurants(data.restaurants);
                } else {
                    setRestaurants(prev => [...prev, ...data.restaurants]);
                }

                // Assuming backend returns info about total pages or if next page exists
                if (data.restaurants.length === 0 || data.totalPages === pageNum) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Failed to load restaurants", err);
            setError("Failed to load restaurants. Please try again.");
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

    return (
        <div style={{ paddingBottom: '70px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ padding: '16px 16px 8px 16px', position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 10 }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Discover</h1>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Find the best food partners around you</p>
            </header>

            <main style={{ padding: '16px' }}>
                {error && (
                    <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                        {error}
                        <br />
                        <button onClick={() => fetchRestaurants(page)} style={{ marginTop: '10px', padding: '8px 16px', background: '#e23744', color: 'white', border: 'none', borderRadius: '6px' }}>Retry</button>
                    </div>
                )}

                <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {restaurants.map(restaurant => (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))}
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div className="loading-spinner" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #e23744', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {!loading && hasMore && (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <button
                            onClick={loadMore}
                            style={{ padding: '10px 24px', background: '#064e3b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Load More
                        </button>
                    </div>
                )}

                {!loading && !hasMore && restaurants.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                        <p>That's all for now!</p>
                    </div>
                )}

                {!loading && restaurants.length === 0 && !error && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <p>No restaurants found.</p>
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
};

export default Discover;
