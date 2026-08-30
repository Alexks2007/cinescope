import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search movies...',
}) => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" aria-hidden="true" />
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search movies"
        />
        {value.length > 0 && (
          <button
            type="button"
            className="clear-button"
            onClick={onClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
