import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/Auth/register', form);
      navigate('/login');
    } catch (err) {
      setError('Kayıt başarısız! E-posta zaten kullanılıyor olabilir.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h2 className="text-center mb-4">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="mb-3">
            <label>Kullanıcı Adı</label>
            <input 
              type="text" 
              name="username" 
              className="form-control form-input" 
              onChange={handleChange} 
              required 
              placeholder="Kullanıcı adınızı girin"
            />
          </div>
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
          <button type="submit" className="btn btn-success w-100 btn-register">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
