import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, Compass, Heart } from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <Film className="brand-icon" size={24} />
          <span className="brand-name">CineScope</span>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Compass size={18} />
            <span>Discover</span>
          </NavLink>

          <NavLink 
            to="/favorites" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Heart size={18} />
            <span>Favorites</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
