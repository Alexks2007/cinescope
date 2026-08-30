import type { Movie, TMDBResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Construct full image URL from TMDB poster/backdrop path.
 * Returns null if path is unavailable so UI components can handle fallbacks.
 */
export const getImageUrl = (
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Returns standard fetch options with Bearer authentication token.
 */
const getHeaders = (): HeadersInit => {
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  return {
    accept: 'application/json',
    Authorization: `Bearer ${token || ''}`,
  };
};

/**
 * Fetch popular movies from TMDB /movie/popular endpoint.
 */
export async function getPopularMovies(page = 1, signal?: AbortSignal): Promise<TMDBResponse<Movie>> {
  const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=${page}`, {
    headers: getHeaders(),
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please verify your TMDB Access Token.');
    }
    throw new Error(`Failed to load popular movies. (HTTP ${response.status})`);
  }

  const data: TMDBResponse<Movie> = await response.json();
  return data;
}

/**
 * Search movies from TMDB /search/movie endpoint.
 */
export async function getSearchMovies(query: string, signal?: AbortSignal): Promise<Movie[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/search/movie?language=en-US&query=${encodeURIComponent(trimmed)}&page=1`,
    {
      headers: getHeaders(),
      signal,
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please verify your TMDB Access Token.');
    }
    throw new Error(`Failed to search movies. (HTTP ${response.status})`);
  }

  const data: TMDBResponse<Movie> = await response.json();
  return data.results || [];
}
