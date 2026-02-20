import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinQueue, getServices } from '../api';

export default function JoinQueue() {
  const [service,  setService]  = useState('');
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate  = useNavigate();
  const student   = JSON.parse(localStorage.getItem('student') || '{}');
  const enrollment = localStorage.getItem('enrollment');

  useEffect(() => {
    if (!enrollment) { navigate('/'); return; }
    getServices().then(d => {
      setServices(d.services);
      setService(d.services[0]);
    }).catch(() => {
      const fallback = ['Bonafide','ID Card','TC','NOC','Character Certificate','Migration','Fee Receipt','Other'];
      setServices(fallback); setService(fallback[0]);
    });
  }, [enrollment, navigate]);

  const handleJoin = async () => {
    setLoading(true); setError('');
    const result = await joinQueue(enrollment, service);
    if (result.error) {
      setError(result.error); setLoading(false); return;
    }
    localStorage.setItem('token_data', JSON.stringify(result));
    navigate('/token');
  };

  return (
    <div className="page">
      <div className="card">
        <h2>👋 Hi, {student.name || 'Student'}!</h2>
        <p className="card-sub">
          {student.branch} · {student.year} Year · {enrollment}
        </p>

        <label>Select Office Service</label>
        <select value={service} onChange={e => setService(e.target.value)}>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {error && <div className="msg msg-r">{error}</div>}

        <div className="msg msg-b">
          📱 You will receive an SMS when your turn is near
        </div>

        <button className="btn btn-primary" onClick={handleJoin} disabled={loading || !service}>
          {loading ? 'Joining...' : '🎟️ Join Queue'}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
    </div>
  );
}