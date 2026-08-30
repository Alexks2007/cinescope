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
export async function getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const response = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=${page}`, {
    headers: getHeaders(),
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
