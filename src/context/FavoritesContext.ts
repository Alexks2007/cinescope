import { createContext } from 'react';
import type { Movie, MovieDetails } from '../types/movie';

export interface FavoritesContextType {
  favorites: Movie[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (movie: Movie | MovieDetails) => void;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
