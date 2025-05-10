import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SurveyList from './components/SurveyList/SurveyList';
import SurveyCreate from './components/SurveyCreate/SurveyCreate';
import VoteHistory from './components/VoteHistory/VoteHistory';
import Header from './components/Header/Header';
import MySurveys from './components/MySurveys/MySurveys';
import EditSurvey from './components/EditSurvey/EditSurvey';




function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<SurveyList />} />
        <Route path="/create" element={<SurveyCreate />} />
        <Route path="/my-votes" element={<VoteHistory />} />
        <Route path="/my-surveys" element={<MySurveys />} />
        <Route path="/edit-survey/:id" element={<EditSurvey />} />
      </Routes>
    </Router>
  );
}

export default App;
