import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/papers', label: 'Papers' },
    { path: '/research', label: 'Research' },
    { path: '/docs', label: 'Docs' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link className="header-logo" to="/">
          <span className="logo-text">
            <span className="logo-letter keep">H</span>
            <span className="logo-letter hide">E</span>
            <span className="logo-letter hide">L</span>
            <span className="logo-letter keep">I</span>
            <span className="logo-letter hide">O</span>
            <span className="logo-letter hide">S</span>
          </span>
        </Link>
        <nav className="header-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>Models</a>
          <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>About</a>
        </nav>
        <div className="header-actions"></div>
      </div>
    </header>
  );
};
