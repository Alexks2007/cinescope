import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Film, Heart } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieApi';
import { useFavorites } from '../hooks/useFavorites';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const ratingFormatted = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="card-link" aria-label={`View details for ${movie.title}`}>
        <div className="poster-container">
          {posterUrl && !imageError ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="movie-poster"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="poster-fallback">
              <Film size={36} className="fallback-icon" />
              <span className="fallback-text">{movie.title}</span>
            </div>
          )}

          <div className="rating-badge">
            <Star size={12} className="star-icon" />
            <span>{ratingFormatted}</span>
          </div>

          <button
            type="button"
            className={`favorite-card-button ${favorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={favorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          >
            <Heart size={16} className={`heart-icon ${favorite ? 'filled' : ''}`} />
          </button>
        </div>

        <div className="card-info">
          <h3 className="movie-title" title={movie.title}>
            {movie.title}
          </h3>
          <p className="movie-meta">
            <span className="release-year">{releaseYear}</span>
          </p>
        </div>
      </Link>
    </article>
  );
};
