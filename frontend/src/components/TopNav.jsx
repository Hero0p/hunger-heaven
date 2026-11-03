import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classes from './TopNav.module.css';

import { useUser } from '../context/UserContext';

const TopNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useUser();

    return (
        <nav className={classes.navbar}>
            <div className={classes.container}>
                <Link to="/" className={classes.logo}>
                    <span className={classes.logoMark} aria-hidden="true">H</span>
                    HungerHeaven
                </Link>

                <div className={`${classes.navLinks} ${isMenuOpen ? classes.active : ''}`}>
                    <div className={classes.group}>
                        <NavLink to="/discover" className={classes.link}>Discover</NavLink>
                        <NavLink to="/feed" className={classes.link}>Reels</NavLink>
                        <NavLink to="/search" className={classes.link}>Search</NavLink>
                    </div>

                    <div className={classes.divider}></div>

                    {user ? (
                        <div className={classes.group}>
                            <Link to="/profile" className={classes.link}>Hi, {user.name?.split(' ')[0]}</Link>
                            <button onClick={logout} className={classes.btnGhost}>Log out</button>
                        </div>
                    ) : (
                        <div className={classes.group}>
                            <Link to="/food-partner/login" className={classes.link}>For restaurants</Link>
                            <Link to="/user/login" className={classes.btnGhost}>Log in</Link>
                            <Link to="/user/register" className={classes.btnPrimary}>Sign up</Link>
                        </div>
                    )}
                </div>

                <button
                    className={classes.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation"
                    aria-expanded={isMenuOpen}
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
