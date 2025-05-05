import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let username = '';

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload?.username || payload?.name || '';
    } catch (err) {
      console.error('JWT parse hatası:', err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-header px-4 py-3">
      <Link to="/" className="navbar-brand logo">
        🗳️ Anket Sistemi
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link to="/" className="nav-link">Anketler</Link>
          </li>
          {token && (
            <>
              <li className="nav-item">
                <Link to="/create" className="nav-link">+ Anket Oluştur</Link>
              </li>
              <li className="nav-item">
                <Link to="/my-votes" className="nav-link">Oy Geçmişim</Link>
              </li>
              <li className="nav-item text-light mx-2">
                Hoş geldin, <strong>{username}</strong>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm ms-2">Çıkış Yap</button>
              </li>
            </>
          )}
          {!token && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Giriş Yap</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Kayıt Ol</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
