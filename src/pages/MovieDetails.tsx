import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Info, ArrowLeft } from 'lucide-react';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="movie-details-page">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ArrowLeft size={16} />
        Back to Discover
      </Link>

      <header className="page-header">
        <div className="badge">Movie Details</div>
        <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
          Movie Title {id ? `#${id}` : ''}
        </h1>
        <p className="page-subtitle">Comprehensive overview, cast list, release info, and rating statistics.</p>
      </header>

      <div className="placeholder-card">
        <Info size={40} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
        <h3>Detailed View Placeholder</h3>
        <p>Detailed movie information for ID standard {id || 'N/A'} will be populated dynamically via API integration in upcoming phases.</p>
      </div>
    </div>
  );
};

export default MovieDetails;
