import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import './VoteHistory.css'; // CSS dosyası eklenecek

function VoteHistory() {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/votes/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVotes(response.data);
      } catch (err) {
        console.error('Oy geçmişi alınamadı:', err);
      }
    };

    fetchVotes();
  }, []);

  return (
    <div className="vote-history-container">
      <div className='vote-history-content'>
        <h2 className="vote-history-title">Oy Geçmişim</h2>
        {votes.length === 0 ? (
          <p className="vote-history-empty">Henüz oy kullanmamışsınız.</p>
        ) : (
          votes.map((vote, index) => (
            <div key={index} className="vote-card">
              <h5 className="vote-card-title">{vote.surveyOption.survey.title}</h5>
              <p className="vote-card-description">{vote.surveyOption.survey.description}</p>
              <p className="vote-card-option">
                <strong>Verdiğiniz Oy:</strong> {vote.surveyOption.optionText}
              </p>
              <p className="vote-card-date">
                <small>Oy Verme Tarihi: {new Date(vote.votedAt).toLocaleString()}</small>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VoteHistory;
