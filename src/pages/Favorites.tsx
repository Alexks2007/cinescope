import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { MovieGrid } from '../components/MovieGrid';

export const Favorites: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page">
      <header className="page-header">
        <h1 className="page-title">Your Favorites</h1>
        <p className="page-subtitle">
          {favorites.length > 0
            ? `You have saved ${favorites.length} ${favorites.length === 1 ? 'movie' : 'movies'} to your personal list.`
            : 'Personal watchlist stored locally in your browser.'}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="placeholder-card">
          <Heart size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h3>No favorites yet</h3>
          <p>Explore Discover to search and bookmark your favorite films.</p>
          <Link
            to="/"
            className="retry-button"
            style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Compass size={16} />
            <span>Discover Movies</span>
          </Link>
        </div>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </div>
  );
};

export default Favorites;
