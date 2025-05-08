import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Kullanıcı bilgisi parse hatası:', err);
        handleLogout();
      }
    }
  }, [handleLogout]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-header px-4 py-3">
      <Link to="/" className="navbar-brand logo">
        🗳️ Anket Sistemi
      </Link>
      
      <button 
        className="navbar-toggler" 
        type="button" 
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Anketler
            </Link>
          </li>
          
          {user && (
            <>
              <li className="nav-item">
                <Link to="/create" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  + Anket Oluştur
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-votes" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Oy Geçmişim
                </Link>
              </li>
              <li className="nav-item user-info">
                <span className="welcome-text">
                  Hoş geldin, <strong>{user.username}</strong>
                </span>
              </li>
              <li className="nav-item">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-light btn-sm ms-2 logout-btn"
                >
                  Çıkış Yap
                </button>
              </li>
            </>
          )}
          
          {!user && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Giriş Yap
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Kayıt Ol
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
