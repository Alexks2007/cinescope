import React from 'react';
import type { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import './MovieGrid.css';

interface MovieGridProps {
  movies: Movie[];
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};
