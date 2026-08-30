import type { Movie, TMDBResponse, Genre, DiscoverParams } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Minimal fallback genres used strictly if TMDB genre endpoint request fails.
 */
export const FALLBACK_GENRES: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
];

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

/**
 * Fetch official list of movie genres from TMDB /genre/movie/list.
 * Returns static fallback if network or endpoint fails.
 */
export async function getGenres(signal?: AbortSignal): Promise<Genre[]> {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
      headers: getHeaders(),
      signal,
    });

    if (!response.ok) {
      return FALLBACK_GENRES;
    }

    const data: { genres: Genre[] } = await response.json();
    return data.genres && data.genres.length > 0 ? data.genres : FALLBACK_GENRES;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    return FALLBACK_GENRES;
  }
}

/**
 * Discover movies with genre, release year, and sorting parameters from TMDB /discover/movie.
 */
export async function getDiscoverMovies(
  params: DiscoverParams,
  signal?: AbortSignal
): Promise<TMDBResponse<Movie>> {
  const queryParams = new URLSearchParams({
    language: 'en-US',
    page: String(params.page || 1),
    sort_by: params.sortBy || 'popularity.desc',
  });

  if (params.genreId) {
    queryParams.append('with_genres', String(params.genreId));
  }

  if (params.year) {
    queryParams.append('primary_release_year', String(params.year));
  }

  // Filter out unrated titles when sorting by top votes
  if (params.sortBy === 'vote_average.desc') {
    queryParams.append('vote_count.gte', '100');
  }

  const response = await fetch(`${BASE_URL}/discover/movie?${queryParams.toString()}`, {
    headers: getHeaders(),
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please verify your TMDB Access Token.');
    }
    throw new Error(`Failed to discover movies. (HTTP ${response.status})`);
  }

  const data: TMDBResponse<Movie> = await response.json();
  return data;
}
