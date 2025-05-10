import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import './SurveyList.css'; // Özel stil dosyası

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Kullanıcı bilgilerini al
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/Auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(response.data);
        }
      } catch (error) {
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  // Anketleri al ve filtrele
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await api.get('/Survey', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const filteredSurveys = response.data.filter(survey => 
          survey.createdByUser?.id !== currentUser?.id
        );

        setSurveys(filteredSurveys);
        setError('');
      } catch (error) {
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

    fetchSurveys();
  }, [navigate, currentUser]);

  const handleVote = async (surveyId, optionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Oy vermek için giriş yapmalısınız.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      await api.post(`/Survey/${surveyId}/vote`, { optionId }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const surveysResponse = await api.get('/Survey', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const filteredSurveys = surveysResponse.data.filter(survey => 
        survey.createdByUser?.id !== currentUser?.id
      );

      setSurveys(filteredSurveys);
      setError('');
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 400 && error.response?.data === 'Bu ankete daha önce oy verdiniz.') {
        setError('Bu ankete daha önce oy vermişsiniz. Her anket için sadece bir kez oy kullanabilirsiniz.');
      } else {
        setError(error.response?.data || 'Oy kullanılırken bir hata oluştu.');
      }
    }
  };

  return (
    <div className="survey-list-container">
      <div className="survey-list-content">
        {location.state?.message && (
          <div className="alert alert-success">
            {location.state.message}
          </div>
        )}
        
        <div className="survey-header">
          <h2>Aktif Anketler</h2>
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
            <p>Henüz anket bulunmuyor.</p>
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
                <div className="survey-options">
                  {survey.options.map(option => {
                    const voteCount = option.votes?.length || 0;
                    const totalVotes = survey.votes?.length || 0;
                    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                    const hasVoted = option.votes?.some(vote => vote.userId === currentUser?.id);

                    return (
                      <div 
                        key={option.id} 
                        className={`survey-option ${hasVoted ? 'voted' : ''}`}
                      >
                        <div className="option-content">
                          <div className="option-text">{option.text}</div>
                          <div className="option-stats">
                            <span className="vote-count">{voteCount} oy</span>
                            <span className="vote-percentage">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="option-progress">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <button
                          className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                          onClick={() => handleVote(survey.id, option.id)}
                          disabled={hasVoted}
                        >
                          {hasVoted ? (
                            <>
                              <i className="fas fa-check"></i>
                              Oy Verildi
                            </>
                          ) : (
                            'Oy Ver'
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="survey-footer">
                  <span className="total-votes">
                    <i className="fas fa-chart-bar"></i>
                    Toplam {survey.votes?.length || 0} oy
                  </span>
                  <span className="created-by">
                    <i className="fas fa-user"></i>
                    {survey.createdByUser?.username || 'Anonim'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SurveyList;
