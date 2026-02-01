import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import classes from '../../styles/Search.module.css';

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

    const debouncedQuery = useDebounce(query, 500);

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

    return (
        <div className={classes.searchPage}>
            <div className={classes.searchHeader}>
                <input
                    type="text"
                    className={classes.searchInput}
                    placeholder="Search for food or restaurants..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
            </div>

            {query && (
                <div className={classes.tabs}>
                    <button
                        className={`${classes.tab} ${activeTab === 'all' ? classes.active : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`${classes.tab} ${activeTab === 'foods' ? classes.active : ''}`}
                        onClick={() => setActiveTab('foods')}
                    >
                        Foods
                    </button>
                    <button
                        className={`${classes.tab} ${activeTab === 'restaurants' ? classes.active : ''}`}
                        onClick={() => setActiveTab('restaurants')}
                    >
                        Restaurants
                    </button>
                </div>
            )}

            <div className={classes.resultsContainer}>
                {loading && <div className={classes.loading}>Searching...</div>}

                {!loading && !hasResults && query && (
                    <div className={classes.emptyState}>
                        <p>No results found for "{query}"</p>
                    </div>
                )}

                {!loading && hasResults && (
                    <>
                        {(activeTab === 'all' || activeTab === 'restaurants') && results.restaurants.length > 0 && (
                            <section className={classes.section}>
                                <h3 className={classes.sectionTitle}>Restaurants</h3>
                                <div className={classes.grid}>
                                    {results.restaurants.map(partner => (
                                        <Link to={`/food-partner/${partner._id}`} key={partner._id} className={classes.card}>
                                            <div className={classes.cardImage}>
                                                {partner.image ? (
                                                    <img src={partner.image} alt={partner.name} />
                                                ) : (
                                                    <div className={classes.placeholder}></div>
                                                )}
                                            </div>
                                            <div className={classes.cardContent}>
                                                <h4>{partner.name}</h4>
                                                <p>{partner.city}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(activeTab === 'all' || activeTab === 'foods') && results.foods.length > 0 && (
                            <section className={classes.section}>
                                <h3 className={classes.sectionTitle}>Food Items</h3>
                                <div className={classes.grid}>
                                    {results.foods.map(food => (
                                        <div key={food._id} className={classes.card}>
                                            {/* Food usually has video, maybe thumbnail? 
                                                 If no thumbnail, use partner image or placeholder 
                                             */}
                                            <div className={classes.cardImage}>
                                                <video src={food.video} muted className={classes.videoThumbnail} />
                                            </div>
                                            <div className={classes.cardContent}>
                                                <h4>{food.name}</h4>
                                                <p className={classes.price}>₹{food.price}</p>
                                                {food.foodPartner && (
                                                    <Link to={`/food-partner/${food.foodPartner._id}`} className={classes.partnerLink}>
                                                        by {food.foodPartner.name}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
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
