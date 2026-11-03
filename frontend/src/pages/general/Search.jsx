import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import classes from '../../styles/Search.module.css';

const SUGGESTIONS = ['Biryani', 'Pizza', 'Sushi', 'Burger', 'Ramen', 'Coffee', 'Cheesecake', 'Salad'];

// Debounce helper
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const Search = () => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, foods, restaurants
    const [results, setResults] = useState({ foods: [], restaurants: [] });
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 400);

    const handleSearch = useCallback(async (q) => {
        if (!q.trim()) {
            setResults({ foods: [], restaurants: [] });
            return;
        }
        setLoading(true);
        try {
            const response = await api.get(`/search?q=${encodeURIComponent(q)}`);
            setResults(response.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleSearch(debouncedQuery);
    }, [debouncedQuery, handleSearch]);

    const hasResults = results.foods.length > 0 || results.restaurants.length > 0;
    const waiting = loading || query.trim() !== debouncedQuery.trim();

    return (
        <div className={`page ${classes.searchPage}`}>
            <div className={classes.searchHeader}>
                <h1 className="page-title">Search</h1>
                <div className={classes.inputWrap}>
                    <svg className={classes.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <input
                        type="search"
                        className={classes.searchInput}
                        placeholder="Search for dishes or restaurants..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search"
                        autoFocus
                    />
                    {query && (
                        <button className={classes.clearBtn} onClick={() => setQuery('')} aria-label="Clear search">&times;</button>
                    )}
                </div>
            </div>

            {!query && (
                <section className={classes.section}>
                    <h3 className={classes.sectionTitle}>Popular searches</h3>
                    <div className={classes.chips}>
                        {SUGGESTIONS.map((s) => (
                            <button key={s} className={classes.chip} onClick={() => setQuery(s)}>{s}</button>
                        ))}
                    </div>
                </section>
            )}

            {query && (
                <div className={classes.tabs} role="tablist">
                    {[
                        ['all', 'All'],
                        ['foods', `Dishes${results.foods.length ? ` (${results.foods.length})` : ''}`],
                        ['restaurants', `Restaurants${results.restaurants.length ? ` (${results.restaurants.length})` : ''}`],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            role="tab"
                            aria-selected={activeTab === key}
                            className={`${classes.tab} ${activeTab === key ? classes.active : ''}`}
                            onClick={() => setActiveTab(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            <div className={classes.resultsContainer}>
                {query && waiting && <div className="spinner-center"><div className="spinner" /></div>}

                {!waiting && !hasResults && query && (
                    <div className="empty-card">
                        <h2>No results for "{query}"</h2>
                        <p>Try a dish like "pizza" or a restaurant name.</p>
                    </div>
                )}

                {!waiting && hasResults && (
                    <>
                        {(activeTab === 'all' || activeTab === 'restaurants') && results.restaurants.length > 0 && (
                            <section className={classes.section}>
                                <h3 className={classes.sectionTitle}>Restaurants</h3>
                                <div className={classes.grid}>
                                    {results.restaurants.map(partner => (
                                        <Link to={`/food-partner/${partner._id}`} key={partner._id} className={classes.card}>
                                            <div className={classes.cardImage}>
                                                {partner.image ? (
                                                    <img src={partner.image} alt={partner.name} loading="lazy" />
                                                ) : (
                                                    <div className={classes.placeholder}></div>
                                                )}
                                            </div>
                                            <div className={classes.cardContent}>
                                                <h4>{partner.name}</h4>
                                                <p>{partner.cuisine || partner.address}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(activeTab === 'all' || activeTab === 'foods') && results.foods.length > 0 && (
                            <section className={classes.section}>
                                <h3 className={classes.sectionTitle}>Dishes</h3>
                                <div className={classes.grid}>
                                    {results.foods.map(food => {
                                        // Reels open in the feed, menu items open their restaurant
                                        const target = food.video
                                            ? `/feed?reel=${food._id}`
                                            : food.foodPartner ? `/food-partner/${food.foodPartner._id}` : null;
                                        const Card = target ? Link : 'div';
                                        return (
                                            <Card key={food._id} to={target || undefined} className={classes.card}>
                                                <div className={classes.cardImage}>
                                                    {food.image ? (
                                                        <img src={food.image} alt={food.name} loading="lazy" />
                                                    ) : food.video ? (
                                                        <video src={`${food.video}#t=0.5`} muted playsInline preload="metadata" className={classes.videoThumbnail} />
                                                    ) : (
                                                        <div className={classes.placeholder}></div>
                                                    )}
                                                    {food.video && <span className={classes.reelBadge}>Reel</span>}
                                                </div>
                                                <div className={classes.cardContent}>
                                                    <h4>{food.name}</h4>
                                                    {food.price != null && <p className={classes.price}>₹{food.price}</p>}
                                                    {food.foodPartner && (
                                                        <span className={classes.partnerLink}>by {food.foodPartner.name}</span>
                                                    )}
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
