
import React from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import '../../styles/landing.css';
import { useUser } from '../../context/UserContext';

const LandingPage = () => {

    return (
        <div className="landing-container">
            <TopNav />

            <header className="landing-hero">
                <span className="hero-badge">Fresh & Fast</span>
                <h1 className="landing-title">Delicious Food,<br />Delivered to You</h1>
                <p className="landing-description">
                    Explore the best local restaurants and share your own culinary moments with short videos.
                </p>
                <div className="landing-cta">
                    <Link to="/feed" className="btn-primary">Start Exploring</Link>
                    <Link to="/discover" className="btn-secondary">Browse Restaurants</Link>
                </div>
            </header>

            <div className="landing-visual">
                {/* Could add a hero image or 3D element here */}
                <div className="visual-circle"></div>
                <div className="visual-circle small"></div>
            </div>
        </div>
    );
};

export default LandingPage;
