import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './MySurveys.css';

function MySurveys() {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySurveys = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/Survey', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Sadece kullanıcının kendi oluşturduğu anketleri filtrele
        const mySurveys = response.data.filter(survey => 
          survey.createdByUser?.id === JSON.parse(localStorage.getItem('user'))?.id
        );

        setSurveys(mySurveys);
        setError('');
      } catch (error) {
        console.error('Anketler alınamadı:', error);
        if (error.response?.status === 401) {
          setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Anketler yüklenirken bir hata oluştu.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMySurveys();
  }, [navigate]);

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Bu anketi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/Survey/${surveyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Silinen anketi listeden kaldır
      setSurveys(surveys.filter(survey => survey.id !== surveyId));
      setError('');
    } catch (error) {
      setError('Anket silinirken bir hata oluştu.');
    }
  };

  return (
    <div className="my-surveys-container">
      <div className="my-surveys-content">
        <div className="my-surveys-header">
          <h2>
            <i className="fas fa-clipboard-list"></i>
            Anketlerim
          </h2>
          <button 
            className="create-survey-btn" 
            onClick={() => navigate('/create')}
          >
            <i className="fas fa-plus"></i> Yeni Anket Oluştur
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Anketler yükleniyor...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="no-surveys">
            <i className="fas fa-clipboard-list"></i>
            <p>Henüz anket oluşturmadınız.</p>
            <button 
              className="create-first-survey-btn" 
              onClick={() => navigate('/create')}
            >
              İlk Anketi Oluştur
            </button>
          </div>
        ) : (
          <div className="survey-grid">
            {surveys.map(survey => (
              <div key={survey.id} className="survey-card">
                <div className="survey-card-header">
                  <h3>{survey.title}</h3>
                  <span className="survey-date">
                    {new Date(survey.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="survey-description">{survey.description}</p>
                <div className="survey-stats">
                  <div className="stat-item">
                    <i className="fas fa-users"></i>
                    <span>{survey.votes?.length || 0} Katılımcı</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-list"></i>
                    <span>{survey.options?.length || 0} Seçenek</span>
                  </div>
                </div>
                <div className="survey-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => navigate(`/survey/${survey.id}`)}
                  >
                    <i className="fas fa-eye"></i>
                    Görüntüle
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => navigate(`/edit-survey/${survey.id}`)}
                  >
                    <i className="fas fa-edit"></i>
                    Düzenle
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteSurvey(survey.id)}
                  >
                    <i className="fas fa-trash"></i>
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySurveys; 