import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import config from '../../config';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Gérer le scroll pour modifier l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Nettoyer l'event listener lors du démontage
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fermer le menu lors du changement de route
  useEffect(() => {
    if (menuOpen) {
      // Ajouter une classe pour éviter le scroll du body
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <img src="/images/logo.png" alt={config.company.name} />
            </Link>
          </div>
          
          <nav>
            <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
              <li>
                <NavLink 
                  to="/" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/services" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  À propos
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/contact" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/booking"
                  onClick={() => setMenuOpen(false)} 
                  className={`btn btn-primary reservation-btn ${({ isActive }) => isActive ? 'active' : ''}`}
                >
                  Réserver
                </NavLink>
              </li>
            </ul>
            
            <div className="mobile-menu-btn" onClick={toggleMenu}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;