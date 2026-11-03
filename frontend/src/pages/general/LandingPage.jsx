import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import RestaurantCard, { RestaurantCardSkeleton } from '../../components/restaurant/RestaurantCard';
import { getRestaurants } from '../../services/discover.api';
import '../../styles/landing.css';

const FEATURES = [
    { title: 'Discover local favourites', text: 'Browse restaurants near you with real menus, prices and ratings.', icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /> },
    { title: 'Watch food reels', text: 'See dishes come to life in short videos straight from the kitchen.', icon: <path d="M23 7l-7 5 7 5V7z M3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /> },
    { title: 'Save what you crave', text: 'Bookmark reels and come back to your favourite dishes anytime.', icon: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" /> },
];

const LandingPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRestaurants(1, 10)
            // Feature restaurants with complete profiles
            .then((data) => setRestaurants((data.restaurants || []).filter((r) => r.image && r.cuisine)))
            .catch(() => setRestaurants([]))
            .finally(() => setLoading(false));
    }, []);

    const collage = restaurants.slice(0, 4);

    return (
        <div className="landing">
            <TopNav />

            <header className="landing-hero">
                <div className="landing-hero__text">
                    <span className="hero-badge">Fresh &amp; Fast</span>
                    <h1 className="landing-title">Delicious food,<br />delivered to you</h1>
                    <p className="landing-description">
                        Explore the best local restaurants, watch their dishes in short reels and find your next favourite meal.
                    </p>
                    <div className="landing-cta">
                        <Link to="/feed" className="btn btn-solid landing-btn">Start exploring</Link>
                        <Link to="/discover" className="btn btn-outline landing-btn">Browse restaurants</Link>
                    </div>
                </div>

                <div className="landing-collage" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`landing-collage__tile tile-${i}`}>
                            {collage[i] ? <img src={collage[i].image} alt="" /> : <div className="skeleton" />}
                        </div>
                    ))}
                </div>
            </header>

            <section className="landing-section">
                <div className="landing-section__head">
                    <div>
                        <h2>Popular restaurants</h2>
                        <p>Hand-picked spots our foodies love</p>
                    </div>
                    <Link to="/discover" className="landing-see-all">See all →</Link>
                </div>
                <div className="restaurant-grid">
                    {loading
                        ? Array.from({ length: 3 }, (_, i) => <RestaurantCardSkeleton key={i} />)
                        : restaurants.slice(0, 6).map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
                </div>
            </section>

            <section className="landing-section">
                <div className="landing-features">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="landing-feature">
                            <span className="landing-feature__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                            </span>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="landing-section">
                <div className="landing-partner">
                    <div>
                        <h2>Own a restaurant?</h2>
                        <p>Upload your menu, post reels and reach hungry customers nearby.</p>
                    </div>
                    <Link to="/food-partner/register" className="btn landing-partner__btn">Become a partner</Link>
                </div>
            </section>

            <footer className="landing-footer">
                © {new Date().getFullYear()} HungerHeaven · Built with ❤️ by Hero0p
            </footer>
        </div>
    );
};

export default LandingPage;
