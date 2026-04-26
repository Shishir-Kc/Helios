import React, { useState, useEffect } from 'react';
import './Header.css';

export const Header = ({ onOpenPopup }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to handle initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e) => {
    e.preventDefault();
    if (onOpenPopup) onOpenPopup();
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <a className="header-logo" href="#">
            <span className="logo-text">
              <span className="logo-letter keep">H</span>
              <span className="logo-letter hide">E</span>
              <span className="logo-letter hide">L</span>
              <span className="logo-letter keep">I</span>
              <span className="logo-letter hide">O</span>
              <span className="logo-letter hide">S</span>
            </span>
          </a>
          <nav className="header-nav">
            <a href="#" className="nav-link" onClick={handleNavClick}>Models</a>
            <a href="#" className="nav-link" onClick={handleNavClick}>Research</a>
            <a href="#" className="nav-link" onClick={handleNavClick}>Docs</a>
            <a href="#" className="nav-link" onClick={handleNavClick}>About</a>
          </nav>
          <div className="header-actions">
            {/* <Button variant="primary">Request Access</Button> */}
          </div>
        </div>
      </header>
  );
};
