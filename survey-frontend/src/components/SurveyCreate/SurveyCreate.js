import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './SurveyCreate.css';

function SurveyCreate() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    options: ['', '']
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;
    setForm(prev => ({
      ...prev,
      options: updatedOptions
    }));
    setError('');
  };

  const addOption = () => {
    if (form.options.length >= 10) {
      setError('En fazla 10 seçenek ekleyebilirsiniz.');
      return;
    }
    setForm(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (form.options.length <= 2) {
      setError('En az 2 seçenek olmalıdır.');
      return;
    }
    const updatedOptions = form.options.filter((_, i) => i !== index);
    setForm(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setError('Başlık boş olamaz.');
      return false;
    }

    if (!form.description.trim()) {
      setError('Açıklama boş olamaz.');
      return false;
    }

    if (form.options.some(opt => opt.trim() === '')) {
      setError('Tüm seçenekleri doldurun.');
      return false;
    }

    if (form.options.length < 2) {
      setError('En az 2 seçenek olmalıdır.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    const surveyData = {
      title: form.title.trim(),
      description: form.description.trim(),
      options: form.options.map(opt => ({
        text: opt.trim()
      }))
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Oturum açmanız gerekiyor.');
        navigate('/login');
        return;
      }

      const response = await api.post('/Survey', surveyData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        navigate('/', { 
          state: { 
            message: 'Anket başarıyla oluşturuldu!' 
          } 
        });
      }
    } catch (err) {
      console.error("API Hatası: ", err);
      
      if (err.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          if (err.response.data.errors) {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-container">
      <div className='create-form-container'>
        <h2 className="text-center mb-4">Yeni Anket Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title">Başlık</label>
            <input 
              id="title"
              className="form-control" 
              value={form.title} 
              onChange={e => handleInputChange('title', e.target.value)} 
              placeholder="Anket başlığını girin"
              required 
              disabled={isLoading}
              maxLength={200}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description">Açıklama</label>
            <textarea 
              id="description"
              className="form-control" 
              value={form.description} 
              onChange={e => handleInputChange('description', e.target.value)} 
              placeholder="Anket açıklamasını girin"
              required 
              disabled={isLoading}
              maxLength={1000}
              rows={4}
            />
          </div>
          <div className="mb-3">
            <label>Seçenekler</label>
            {form.options.map((opt, index) => (
              <div key={index} className="option-container">
                <input
                  className="form-control"
                  value={opt}
                  onChange={e => handleOptionChange(index, e.target.value)}
                  placeholder={`Seçenek ${index + 1}`}
                  required
                  disabled={isLoading}
                  maxLength={200}
                />
                {form.options.length > 2 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm remove-option"
                    onClick={() => removeOption(index)}
                    disabled={isLoading}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="btn btn-secondary btn-sm add-option" 
              onClick={addOption}
              disabled={isLoading || form.options.length >= 10}
            >
              + Seçenek Ekle
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button 
            className="btn btn-primary submit-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Oluşturuluyor...' : 'Anket Oluştur'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SurveyCreate;
