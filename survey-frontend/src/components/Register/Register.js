import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Her değişiklikte hata mesajını temizle
  };

  const validateForm = () => {
    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    if (form.username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır.');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/Auth/register', form);
      // Başarılı kayıt sonrası kullanıcıyı login sayfasına yönlendir
      navigate('/login', { 
        state: { 
          message: 'Kayıt başarılı! Lütfen giriş yapın.' 
        } 
      });
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setError(
        err.response?.data?.message || 
        'Kayıt olurken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h2 className="text-center mb-4">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="mb-3">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input 
              id="username"
              type="text" 
              name="username" 
              className="form-control form-input" 
              value={form.username}
              onChange={handleChange} 
              required 
              placeholder="Kullanıcı adınızı girin"
              disabled={isLoading}
              minLength={3}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">E-posta</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              className="form-control form-input" 
              value={form.email}
              onChange={handleChange} 
              required 
              placeholder="E-posta adresinizi girin"
              disabled={isLoading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Şifre</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              className="form-control form-input" 
              value={form.password}
              onChange={handleChange} 
              required 
              placeholder="Şifrenizi girin"
              disabled={isLoading}
              minLength={6}
            />
            <small className="form-text text-muted">
              Şifreniz en az 6 karakter olmalıdır.
            </small>
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <button 
            type="submit" 
            className="btn btn-primary w-100 btn-register"
            disabled={isLoading}
          >
            {isLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
