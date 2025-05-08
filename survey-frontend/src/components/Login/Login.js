import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Her değişiklikte hata mesajını temizle
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/Auth/login', form);
      const { token, user } = response.data;

      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', token);
      
      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }));

      // API isteklerinde kullanılacak default header'ı ayarla
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/');
    } catch (err) {
      console.error('Giriş hatası:', err);
      setError(
        err.response?.data?.message || 
        'Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="text-center mb-4">Giriş Yap</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
            />
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <button 
            type="submit" 
            className="btn btn-primary w-100 btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
