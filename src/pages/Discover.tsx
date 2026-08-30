import React, { useEffect, useState } from 'react';
import { Film, SearchX } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getPopularMovies, getSearchMovies } from '../services/movieApi';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export const Discover: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const trimmed = value.trim();
    if (trimmed.length >= 2 || trimmed === '') {
      setIsLoading(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setIsLoading(true);
    setError(null);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  // Debounce search query changes by 450ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Fetch movies (Popular or Search) with AbortController race condition protection
  useEffect(() => {
    const controller = new AbortController();
    const trimmed = debouncedQuery.trim();

    async function loadData() {
      try {
        if (trimmed.length >= 2) {
          const results = await getSearchMovies(trimmed, controller.signal);
          if (!controller.signal.aborted) {
            setMovies(results);
            setError(null);
          }
        } else {
          const response = await getPopularMovies(1, controller.signal);
          if (!controller.signal.aborted) {
            setMovies(response.results || []);
            setError(null);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        if (!controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : 'An unexpected error occurred while loading movies.';
          setError(message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, reloadKey]);

  const isSearching = debouncedQuery.trim().length >= 2;

  return (
    <div className="discover-page">
      <header className="page-header">
        <h1 className="page-title">
          {isSearching ? `Search Results for "${debouncedQuery.trim()}"` : 'Discover Popular Movies'}
        </h1>
        <p className="page-subtitle">
          {isSearching
            ? 'Showing matching titles from TMDB.'
            : 'Explore trending and high-rated feature films around the globe.'}
        </p>
      </header>

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
        placeholder="Search movies..."
      />

      {isLoading && <LoadingSkeleton count={12} />}

      {!isLoading && error && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {!isLoading && !error && movies.length === 0 && (
        <div className="placeholder-card">
          {isSearching ? (
            <>
              <SearchX size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
              <h3>No movies found</h3>
              <p>Try a different search term.</p>
            </>
          ) : (
            <>
              <Film size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
              <h3>No Movies Available</h3>
              <p>There are currently no popular movies to display.</p>
            </>
          )}
        </div>
      )}

      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};

export default Discover;
