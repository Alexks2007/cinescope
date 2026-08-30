import React, { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getPopularMovies } from '../services/movieApi';
import { MovieGrid } from '../components/MovieGrid';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export const Discover: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadPopularMovies() {
      try {
        const data = await getPopularMovies();
        if (!isCancelled) {
          setMovies(data.results || []);
        }
      } catch (err) {
        if (!isCancelled) {
          const message =
            err instanceof Error ? err.message : 'An unexpected error occurred while fetching movies.';
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPopularMovies();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="discover-page">
      <header className="page-header">
        <h1 className="page-title">Discover Popular Movies</h1>
        <p className="page-subtitle">Explore trending and high-rated feature films around the globe.</p>
      </header>

      {isLoading && <LoadingSkeleton count={12} />}

      {!isLoading && error && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {!isLoading && !error && movies.length === 0 && (
        <div className="placeholder-card">
          <Film size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h3>No Movies Available</h3>
          <p>There are currently no popular movies to display.</p>
        </div>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};

export default Discover;
