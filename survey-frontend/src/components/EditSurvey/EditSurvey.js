import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import './EditSurvey.css';

function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [survey, setSurvey] = useState({
    title: '',
    description: '',
    options: []
  });
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/Survey/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Kullanıcının kendi anketi mi kontrol et
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (response.data.createdByUser?.id !== currentUser?.id) {
          setError('Bu anketi düzenleme yetkiniz yok.');
          setTimeout(() => navigate('/my-surveys'), 2000);
          return;
        }

        setSurvey({
          title: response.data.title,
          description: response.data.description,
          options: response.data.options.map(option => ({
            id: option.id,
            text: option.text
          }))
        });
        setError('');
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Anket bilgileri alınamadı.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurvey();
  }, [id, navigate]);

  const handleTitleChange = (e) => {
    setSurvey(prev => ({ ...prev, title: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setSurvey(prev => ({ ...prev, description: e.target.value }));
  };

  const handleNewOptionChange = (e) => {
    setNewOption(e.target.value);
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;

    setSurvey(prev => ({
      ...prev,
      options: [...prev.options, { id: Date.now(), text: newOption.trim() }]
    }));
    setNewOption('');
  };

  const handleRemoveOption = (optionId) => {
    setSurvey(prev => ({
      ...prev,
      options: prev.options.filter(option => option.id !== optionId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!survey.title.trim()) {
      setError('Anket başlığı boş olamaz.');
      return;
    }

    if (survey.options.length < 2) {
      setError('En az 2 seçenek eklemelisiniz.');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // API'ye gönderilecek veriyi hazırla
      const surveyData = {
        id: parseInt(id),
        title: survey.title.trim(),
        description: survey.description.trim(),
        options: survey.options.map(option => ({
          id: option.id,
          text: option.text.trim()
        }))
      };

      const response = await api.put(`/Survey/${id}`, surveyData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        navigate('/my-surveys', { 
          state: { message: 'Anket başarıyla güncellendi.' }
        });
      } else {
        setError('Anket güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Anket güncelleme hatası:', error);
      if (error.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Anket güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-survey-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Anket bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-survey-container">
      <div className="edit-survey-content">
        <div className="edit-survey-header">
          <h2>
            <i className="fas fa-edit"></i>
            Anketi Düzenle
          </h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-survey-form">
          <div className="form-group">
            <label htmlFor="title">Anket Başlığı</label>
            <input
              type="text"
              id="title"
              value={survey.title}
              onChange={handleTitleChange}
              className="form-control"
              placeholder="Anket başlığını girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Anket Açıklaması</label>
            <textarea
              id="description"
              value={survey.description}
              onChange={handleDescriptionChange}
              className="form-control"
              placeholder="Anket açıklamasını girin"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Seçenekler</label>
            <div className="options-list">
              {survey.options.map(option => (
                <div key={option.id} className="option-item">
                  <span>{option.text}</span>
                  <button
                    type="button"
                    className="remove-option-btn"
                    onClick={() => handleRemoveOption(option.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="add-option">
              <input
                type="text"
                value={newOption}
                onChange={handleNewOptionChange}
                className="form-control"
                placeholder="Yeni seçenek ekle"
              />
              <button
                type="button"
                className="add-option-btn"
                onClick={handleAddOption}
              >
                <i className="fas fa-plus"></i>
                Ekle
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/my-surveys')}
            >
              İptal
            </button>
            <button type="submit" className="save-btn">
              <i className="fas fa-save"></i>
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSurvey; 