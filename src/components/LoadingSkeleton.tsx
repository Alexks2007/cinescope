import React from 'react';
import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 10 }) => {
  return (
    <div className="skeleton-grid" aria-label="Loading movies">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-poster shimmer" />
          <div className="skeleton-info">
            <div className="skeleton-title shimmer" />
            <div className="skeleton-meta shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};
