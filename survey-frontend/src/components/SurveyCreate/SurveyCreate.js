import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './SurveyCreate.css'; // CSS dosyasını dahil et

function SurveyCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!title.trim()) {
      setError('Başlık boş olamaz.');
      return;
    }

    if (!description.trim()) {
      setError('Açıklama boş olamaz.');
      return;
    }

    if (options.some(opt => opt.trim() === '')) {
      setError('Tüm seçenekleri doldurun.');
      return;
    }

    // Prepare survey data according to API model
    const surveyData = {
      Title: title.trim(),
      Description: description.trim(),
      Options: options.map(opt => ({
        OptionText: opt.trim()
      }))
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Oturum açmanız gerekiyor.');
        return;
      }

      const response = await api.post('/surveys', surveyData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        navigate('/');
      }
    } catch (err) {
      console.error("API Hatası: ", err.response ? err.response.data : err.message);
      
      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else if (err.response?.data) {
        // API'den gelen hata mesajını işle
        if (typeof err.response.data === 'object') {
          if (err.response.data.errors) {
            // Validation errors
            const validationErrors = Object.values(err.response.data.errors)
              .flat()
              .join(', ');
            setError(validationErrors);
          } else if (err.response.data.title) {
            setError(err.response.data.title);
          } else {
            setError('Bir hata oluştu. Lütfen tüm alanları kontrol edin.');
          }
        } else {
          setError(err.response.data);
        }
      } else {
        setError('Anket oluşturulurken bir hata oluştu.');
      }
    }
  };

  return (
    <div className="create-container">
      <div className='create-form-container'>
        <h2 className="text-center mb-4">Yeni Anket Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Başlık</label>
            <input 
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Açıklama</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Seçenekler</label>
            {options.map((opt, index) => (
              <input
                key={index}
                className="form-control mb-2"
                value={opt}
                onChange={e => handleOptionChange(index, e.target.value)}
                placeholder={`Seçenek ${index + 1}`}
                required
              />
            ))}
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={addOption}>
                + Seçenek Ekle
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary" type="submit">Anket Oluştur</button>
        </form>
      </div>
    </div>
  );
}

export default SurveyCreate;
