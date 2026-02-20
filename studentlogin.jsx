import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudent } from '../api';

export default function StudentLogin() {
  const [enrollment, setEnrollment] = useState('');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!enrollment.trim()) { setError('Please enter your enrollment number'); return; }
    setLoading(true); setError('');
    try {
      const student = await getStudent(enrollment.trim().toUpperCase());
      localStorage.setItem('student',    JSON.stringify(student));
      localStorage.setItem('enrollment', enrollment.trim().toUpperCase());
      navigate('/join');
    } catch (e) {
      setError('❌ Student not found. Check your enrollment number.');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div style={{textAlign:'center', padding:'30px 0 20px'}}>
        <div style={{fontSize:'3rem'}}>🎓</div>
        <h1 style={{color:'#a78bfa', fontSize:'1.5rem', margin:'8px 0 4px'}}>D.Y. Patil SmartQueue</h1>
        <p style={{color:'#4b5680', fontSize:'0.85rem'}}>Campus Office Queue System</p>
      </div>

      <div className="card">
        <h2>Student Login</h2>
        <p className="card-sub">Enter your enrollment number to join the queue</p>

        <label>Enrollment Number</label>
        <input
          placeholder="e.g. DY2021001"
          value={enrollment}
          onChange={e => setEnrollment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          autoFocus
        />

        {error && <div className="msg msg-r">{error}</div>}

        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Verifying...' : '🔍 Verify & Continue'}
        </button>

        <hr className="divider" />

        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
          🔐 Admin Panel
        </button>
      </div>
    </div>
  );
}