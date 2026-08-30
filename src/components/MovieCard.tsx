import React, { useState } from 'react';
import { Star, Film } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getImageUrl } from '../services/movieApi';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const ratingFormatted = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <article className="movie-card">
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
      </div>

      <div className="card-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <p className="movie-meta">
          <span className="release-year">{releaseYear}</span>
        </p>
      </div>
    </article>
  );
};
