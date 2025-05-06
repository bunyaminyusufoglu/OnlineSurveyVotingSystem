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
    if (options.some(opt => opt.trim() === '')) {
      setError('Tüm seçenekleri doldurun.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/surveys', {
        title,
        description,
        options
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/'); // Anketler sayfasına dön
    } catch (err) {
      console.error(err);
      setError('Anket oluşturulamadı.');
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
          {error && <div className="text-danger mb-2">{error}</div>}
          <button className="btn btn-primary" type="submit">Anket Oluştur</button>
        </form>
      </div>
    </div>
  );
}

export default SurveyCreate;
