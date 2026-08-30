import type { Movie, MovieDetails } from '../types/movie';

const FAVORITES_KEY = 'cinescope_favorites';

/**
 * Sanitize movie object to keep only essential fields needed by MovieCard/Favorites.
 */
export function sanitizeFavoriteMovie(movie: Movie | MovieDetails): Movie {
  return {
    id: movie.id,
    title: movie.title || 'Untitled',
    overview: movie.overview || '',
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    release_date: movie.release_date || '',
    vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
    vote_count: typeof movie.vote_count === 'number' ? movie.vote_count : 0,
    genre_ids: 'genre_ids' in movie && Array.isArray(movie.genre_ids)
      ? movie.genre_ids
      : 'genres' in movie && Array.isArray(movie.genres)
      ? movie.genres.map((g) => g.id)
      : [],
    popularity: 'popularity' in movie && typeof movie.popularity === 'number' ? movie.popularity : 0,
  };
}

/**
 * Safely retrieve favorites array from localStorage.
 * Returns empty array if data is missing or corrupted.
 */
export function getFavorites(): Movie[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => sanitizeFavoriteMovie(item));
  } catch (err) {
    console.error('Failed to parse favorites from localStorage:', err);
    return [];
  }
}

/**
 * Safely persist favorites array to localStorage.
 */
export function saveFavorites(favorites: Movie[]): void {
  try {
    const sanitized = favorites.map((movie) => sanitizeFavoriteMovie(movie));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('Failed to save favorites to localStorage:', err);
  }
}

/**
 * Check if a movie is currently favorited by ID.
 */
export function isFavorite(id: number, favorites: Movie[] = getFavorites()): boolean {
  return favorites.some((m) => m.id === id);
}

/**
 * Toggle favorite status for a given movie.
 * Adds if not present, removes if present. Returns updated favorites array.
 */
export function toggleFavorite(movie: Movie | MovieDetails, currentFavorites?: Movie[]): Movie[] {
  const favorites = currentFavorites ?? getFavorites();
  const exists = favorites.some((m) => m.id === movie.id);
  let updated: Movie[];

  if (exists) {
    updated = favorites.filter((m) => m.id !== movie.id);
  } else {
    const sanitized = sanitizeFavoriteMovie(movie);
    updated = [sanitized, ...favorites];
  }

  saveFavorites(updated);
  return updated;
}
