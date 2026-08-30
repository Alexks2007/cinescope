import React, { useEffect, useState } from 'react';
import { Film, SearchX } from 'lucide-react';
import type { Movie, Genre, SortOption, DiscoverParams } from '../types/movie';
import {
  getDiscoverMovies,
  getSearchMovies,
  getGenres,
  FALLBACK_GENRES,
} from '../services/movieApi';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { MovieGrid } from '../components/MovieGrid';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export const Discover: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>(FALLBACK_GENRES);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('popularity.desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Fetch official TMDB genre list on mount (falls back gracefully if request fails)
  useEffect(() => {
    let isCancelled = false;

    async function loadGenres() {
      try {
        const fetchedGenres = await getGenres();
        if (!isCancelled && fetchedGenres.length > 0) {
          setGenres(fetchedGenres);
        }
      } catch {
        if (!isCancelled) {
          setGenres(FALLBACK_GENRES);
        }
      }
    }

    loadGenres();

    return () => {
      isCancelled = true;
    };
  }, []);

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

  const handleGenreChange = (genreId: string) => {
    setSelectedGenre(genreId);
    setIsLoading(true);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setIsLoading(true);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setIsLoading(true);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedSort('popularity.desc');
    setIsLoading(true);
    setError(null);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  // Debounce search query input by 450ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Main movies fetch effect (Search or Discover) with AbortController cancellation
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
          const discoverParams: DiscoverParams = {
            genreId: selectedGenre ? Number(selectedGenre) : undefined,
            year: selectedYear ? Number(selectedYear) : undefined,
            sortBy: selectedSort,
          };
          const response = await getDiscoverMovies(discoverParams, controller.signal);
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
  }, [debouncedQuery, selectedGenre, selectedYear, selectedSort, reloadKey]);

  const isSearching = debouncedQuery.trim().length >= 2;

  return (
    <div className="discover-page">
      <header className="page-header">
        <h1 className="page-title">
          {isSearching ? `Search Results for "${debouncedQuery.trim()}"` : 'Discover Movies'}
        </h1>
        <p className="page-subtitle">
          {isSearching
            ? 'Showing matching titles from TMDB.'
            : 'Explore trending, top-rated, and categorized feature films.'}
        </p>
      </header>

      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
        placeholder="Search movies..."
      />

      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        selectedYear={selectedYear}
        selectedSort={selectedSort}
        onGenreChange={handleGenreChange}
        onYearChange={handleYearChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        isSearchActive={isSearching}
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
              <h3>No movies found</h3>
              <p>No titles match the selected genre, year, and sort criteria. Try adjusting or clearing your filters.</p>
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
