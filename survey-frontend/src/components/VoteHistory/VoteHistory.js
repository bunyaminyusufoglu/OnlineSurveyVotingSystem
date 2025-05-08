import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './VoteHistory.css';

function VoteHistory() {
  const [votes, setVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Oy geçmişinizi görmek için giriş yapmalısınız.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const response = await api.get('/Survey/votes/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVotes(response.data);
        setError('');
      } catch (err) {
        console.error('Oy geçmişi alınamadı:', err);
        if (err.response?.status === 401) {
          setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Oy geçmişi yüklenirken bir hata oluştu.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotes();
  }, [navigate]);

  return (
    <div className="vote-history-container">
      <div className="vote-history-content">
        <div className="vote-history-header">
          <h2 className="vote-history-title">Oy Geçmişim</h2>
          <button 
            className="back-to-surveys-btn"
            onClick={() => navigate('/')}
          >
            <i className="fas fa-arrow-left"></i> Anketlere Dön
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Oy geçmişi yükleniyor...</p>
          </div>
        ) : votes.length === 0 ? (
          <div className="no-votes">
            <i className="fas fa-clipboard-check"></i>
            <p>Henüz oy kullanmamışsınız.</p>
            <button 
              className="go-to-surveys-btn"
              onClick={() => navigate('/')}
            >
              Anketlere Git
            </button>
          </div>
        ) : (
          <div className="vote-grid">
            {votes.map((vote, index) => (
              <div key={index} className="vote-card">
                <div className="vote-card-header">
                  <h3 className="vote-card-title">{vote.surveyTitle}</h3>
                  <span className="vote-card-date">
                    {new Date(vote.votedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="vote-card-description">{vote.surveyDescription}</p>
                <div className="vote-card-option">
                  <i className="fas fa-check-circle"></i>
                  <span>Verdiğiniz Oy: {vote.optionText}</span>
                </div>
                <div className="vote-card-footer">
                  <span className="vote-card-time">
                    <i className="far fa-clock"></i>
                    {new Date(vote.votedAt).toLocaleTimeString('tr-TR')}
                  </span>
                  <span className="vote-card-creator">
                    <i className="far fa-user"></i>
                    {vote.createdByUsername || 'Anonim'}
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

export default VoteHistory;
