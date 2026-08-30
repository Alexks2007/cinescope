import React, { useState, useEffect, useCallback } from 'react';
import type { Movie, MovieDetails } from '../types/movie';
import { getFavorites, toggleFavorite as toggleFavoriteUtil, isFavorite as isFavoriteUtil } from '../services/favorites';
import { FavoritesContext } from './FavoritesContext';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>(() => getFavorites());

  // Listen for storage changes across tabs or windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cinescope_favorites') {
        setFavorites(getFavorites());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isFavorite = useCallback(
    (id: number) => isFavoriteUtil(id, favorites),
    [favorites]
  );

  const toggleFavorite = useCallback((movie: Movie | MovieDetails) => {
    setFavorites((prev) => toggleFavoriteUtil(movie, prev));
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
