import React from 'react';
import { Heart } from 'lucide-react';

export const Favorites: React.FC = () => {
  return (
    <div className="favorites-page">
      <header className="page-header">
        <h1 className="page-title">Your Favorites</h1>
        <p className="page-subtitle">Personal watchlist stored locally in your browser.</p>
      </header>

      <div className="placeholder-card">
        <Heart size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
        <h3>Saved Movies Placeholder</h3>
        <p>Your saved favorite movies will appear here once saved from the discovery list or details page.</p>
      </div>
    </div>
  );
};

export default Favorites;
