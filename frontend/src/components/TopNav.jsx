import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './TopNav.module.css';

import { useUser } from '../context/UserContext';

const TopNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useUser();

    return (
        <nav className={classes.navbar}>
            <div className={classes.container}>
                <Link to="/" className={classes.logo}>
                    HungerHeaven
                </Link>

                <div className={`${classes.navLinks} ${isMenuOpen ? classes.active : ''}`}>
                    {user ? (
                        <div className={classes.group}>
                            <button onClick={logout} className={classes.link} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>Logout</button>
                        </div>
                    ) : (
                        <>
                            <div className={classes.group}>
                                <span className={classes.groupLabel}>For Foodies</span>
                                <Link to="/user/login" className={classes.link}>Login</Link>
                                <Link to="/user/register" className={classes.btnPrimary}>Sign Up</Link>
                            </div>

                            <div className={classes.divider}></div>

                            <div className={classes.group}>
                                <span className={classes.groupLabel}>For Partners</span>
                                <Link to="/food-partner/login" className={classes.link}>Partner Login</Link>
                                <Link to="/food-partner/register" className={classes.link}>Partner Sign Up</Link>
                            </div>
                        </>
                    )}
                </div>

                <button
                    className={classes.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className={classes.bar}></span>
                    <span className={classes.bar}></span>
                    <span className={classes.bar}></span>
                </button>
            </div>
        </nav>
    );
};

export default TopNav;
