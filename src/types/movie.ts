export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export type SortOption = 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc';

export interface DiscoverParams {
  genreId?: number;
  year?: number;
  sortBy?: SortOption;
  page?: number;
}
