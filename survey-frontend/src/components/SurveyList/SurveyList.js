import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './SurveyList.css'; // Özel stil dosyası

function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await api.get('/surveys');
        setSurveys(response.data);
      } catch (error) {
        console.error('Anketler alınamadı:', error);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="survey-list-container">
      <div className="survey-list-content">
        <button className="btn btn-success mb-3" onClick={() => navigate('/create')}>
          Yeni Anket Ekle
        </button>
        <h2 className="text-center mb-4">Aktif Anketler</h2>
        {surveys.length === 0 ? (
          <p>Henüz anket yok.</p>
        ) : (
          surveys.map(survey => (
            <div key={survey.id} className="card mb-3 survey-card">
              <div className="card-body">
                <h5>{survey.title}</h5>
                <p>{survey.description}</p>
                <ul className="list-group">
                  {survey.options.map(option => (
                    <li key={option.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {option.optionText}
                      <VoteButton optionId={option.id} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VoteButton({ optionId }) {
  const [voted, setVoted] = useState(false);

  const handleVote = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/votes`, { surveyOptionId: optionId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVoted(true);
    } catch (error) {
      console.error('Oy kullanılamadı:', error);
    }
  };

  return (
    <button className="btn btn-sm btn-outline-primary" disabled={voted} onClick={handleVote}>
      {voted ? 'Oy Verildi' : 'Oy Ver'}
    </button>
  );
}

export default SurveyList;
