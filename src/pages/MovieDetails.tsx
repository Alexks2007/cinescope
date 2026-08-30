import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Heart, Film, AlertTriangle } from 'lucide-react';
import type { MovieDetails as MovieDetailsType } from '../types/movie';
import { getMovieDetails, getImageUrl } from '../services/movieApi';
import { useFavorites } from '../hooks/useFavorites';
import { ErrorMessage } from '../components/ErrorMessage';
import './MovieDetails.css';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = movie ? isFavorite(movie.id) : false;

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      if (!id) {
        return;
      }
      try {
        const data = await getMovieDetails(id, controller.signal);
        if (!controller.signal.aborted) {
          setMovie(data);
          setError(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : 'An unexpected error occurred while loading movie details.';
          setError(message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      controller.abort();
    };
  }, [id, reloadKey]);

  if (!id) {
    return (
      <div className="movie-details-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Discover</span>
        </Link>
        <div className="placeholder-card">
          <AlertTriangle size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h3>Invalid Movie ID</h3>
          <p>Please select a valid movie from the discovery catalog.</p>
          <Link to="/" className="retry-button" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            <span>Return to Discover</span>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="movie-details-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Discover</span>
        </Link>
        <div className="details-skeleton">
          <div className="details-skeleton-backdrop shimmer" />
          <div className="details-skeleton-content">
            <div className="details-skeleton-poster shimmer" />
            <div className="details-skeleton-lines">
              <div className="skeleton-line shimmer" style={{ width: '60%' }} />
              <div className="skeleton-line shimmer" style={{ width: '30%' }} />
              <div className="skeleton-line shimmer" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error === 'Movie not found.') {
      return (
        <div className="movie-details-page">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Discover</span>
          </Link>
          <div className="placeholder-card">
            <AlertTriangle size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
            <h3>Movie Not Found</h3>
            <p>The requested movie could not be found or may have been removed.</p>
            <Link to="/" className="retry-button" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              <span>Return to Discover</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="movie-details-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Discover</span>
        </Link>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const ratingFormatted = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtimeFormatted = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div className="movie-details-page">
      <Link to="/" className="back-link" aria-label="Back to Discover page">
        <ArrowLeft size={16} />
        <span>Back to Discover</span>
      </Link>

      <div
        className="backdrop-header"
        style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined }}
      >
        <div className="backdrop-overlay" />
      </div>

      <div className="details-content">
        <div className="details-poster-wrapper">
          {posterUrl && !imageError ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="details-poster"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="poster-fallback">
              <Film size={48} className="fallback-icon" />
              <span className="fallback-text">{movie.title}</span>
            </div>
          )}
        </div>

        <div className="details-info">
          <h1 className="details-title">{movie.title}</h1>

          {movie.tagline && <p className="details-tagline">"{movie.tagline}"</p>}

          <div className="details-meta-row">
            <div className="meta-item">
              <Star size={16} className="meta-icon" />
              <span>{ratingFormatted}</span>
              {movie.vote_count > 0 && <span className="vote-count">({movie.vote_count.toLocaleString()} votes)</span>}
            </div>

            {releaseYear !== 'N/A' && (
              <div className="meta-item">
                <Calendar size={16} className="meta-icon" />
                <span>{releaseYear}</span>
              </div>
            )}

            {runtimeFormatted && (
              <div className="meta-item">
                <Clock size={16} className="meta-icon" />
                <span>{runtimeFormatted}</span>
              </div>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="genres-row">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-pill">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {movie.overview && (
            <div className="overview-section">
              <h2 className="overview-title">Overview</h2>
              <p className="overview-text">{movie.overview}</p>
            </div>
          )}

          <button
            type="button"
            className={`favorite-details-button ${favorite ? 'active' : ''}`}
            onClick={() => toggleFavorite(movie)}
            aria-label={favorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          >
            <Heart size={18} className={`details-heart-icon ${favorite ? 'filled' : ''}`} />
            <span>{favorite ? 'In Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
