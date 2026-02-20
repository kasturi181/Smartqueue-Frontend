import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin   from './pages/StudentLogin';
import JoinQueue      from './pages/JoinQueue';
import TokenPage      from './pages/TokenPage';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackPage   from './pages/FeedbackPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/"         element={<StudentLogin />} />
          <Route path="/join"     element={<JoinQueue />} />
          <Route path="/token"    element={<TokenPage />} />
          <Route path="/admin"    element={<AdminDashboard />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;