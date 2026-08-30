import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { Genre, SortOption } from '../types/movie';
import './FilterBar.css';

interface FilterBarProps {
  genres: Genre[];
  selectedGenre: string;
  selectedYear: string;
  selectedSort: SortOption;
  onGenreChange: (genreId: string) => void;
  onYearChange: (year: string) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  isSearchActive: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  genres,
  selectedGenre,
  selectedYear,
  selectedSort,
  onGenreChange,
  onYearChange,
  onSortChange,
  onClearFilters,
  isSearchActive,
}) => {
  // Generate year range from current year down to 1970
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= 1970; year--) {
    years.push(year);
  }

  const isFilterActive =
    selectedGenre !== '' || selectedYear !== '' || selectedSort !== 'popularity.desc';

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-header">
        <div className="filter-title-group">
          <SlidersHorizontal size={18} className="filter-icon" aria-hidden="true" />
          <span className="filter-title">Filter & Sort</span>
        </div>

        {isFilterActive && !isSearchActive && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={onClearFilters}
            aria-label="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {isSearchActive && (
        <div className="search-active-notice" role="status">
          Filters are paused during active search. Clear search query to use genre, year, and sorting filters.
        </div>
      )}

      <div className={`filter-controls ${isSearchActive ? 'disabled' : ''}`}>
        {/* Genre Select */}
        <div className="select-group">
          <label htmlFor="genre-select" className="select-label">
            Genre
          </label>
          <select
            id="genre-select"
            className="filter-select"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            disabled={isSearchActive}
            aria-label="Filter by genre"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div className="select-group">
          <label htmlFor="year-select" className="select-label">
            Release Year
          </label>
          <select
            id="year-select"
            className="filter-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            disabled={isSearchActive}
            aria-label="Filter by release year"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="select-group">
          <label htmlFor="sort-select" className="select-label">
            Sort By
          </label>
          <select
            id="sort-select"
            className="filter-select"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            disabled={isSearchActive}
            aria-label="Sort movies by"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Newest Releases</option>
          </select>
        </div>
      </div>
    </div>
  );
};
