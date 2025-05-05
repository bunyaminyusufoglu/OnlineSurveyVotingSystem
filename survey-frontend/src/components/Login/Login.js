import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await api.post('/Auth/login', form);
      const token = response.data.token;

      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const username = decodedToken?.email || decodedToken?.name || 'Kullanıcı';

      localStorage.setItem('username', username);

      navigate('/');
    } catch (err) {
      setError('Giriş başarısız! E-posta ya da şifre yanlış olabilir.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="text-center mb-4">Giriş Yap</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-3">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control form-input" 
              onChange={handleChange} 
              required 
              placeholder="E-posta adresinizi girin"
            />
          </div>
          <div className="mb-3">
            <label>Şifre</label>
            <input 
              type="password" 
              name="password" 
              className="form-control form-input" 
              onChange={handleChange} 
              required 
              placeholder="Şifrenizi girin"
            />
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <button type="submit" className="btn btn-primary w-100 btn-login">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
