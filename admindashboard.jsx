import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueue, callNext, skipToken, clearQueue, getStats, getAllFeedback } from '../api';

export default function AdminDashboard() {
  const [queue,     setQueue]     = useState([]);
  const [stats,     setStats]     = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [tab,       setTab]       = useState('queue');
  const [calling,   setCalling]   = useState(false);
  const [msg,       setMsg]       = useState('');
  const [search,    setSearch]    = useState('');
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    try {
      const [q, s, f] = await Promise.all([getQueue(), getStats(), getAllFeedback()]);
      setQueue(q);
      setStats(s);
      setFeedbacks(f);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 15000);
    return () => clearInterval(t);
  }, [fetchAll]);

  const handleCallNext = async () => {
    setCalling(true);
    setMsg('');
    try {
      const r = await callNext();
      setMsg(r.message);
      fetchAll();
    } catch (e) {
      console.error(e);
      setMsg('Error calling next token');
    } finally {
      setCalling(false);
    }
  };

  const handleSkip = async (id) => {
    await skipToken(id);
    fetchAll();
  };

  const handleClear = async () => {
    if (!window.confirm('Clear entire queue? This cannot be undone.')) return;
    await clearQueue();
    fetchAll();
    setMsg('Queue cleared ✅');
  };

  const waiting  = queue.filter(q => q.status === 'waiting');
  const filtered = queue.filter(q =>
    q.student_name.toLowerCase().includes(search.toLowerCase()) ||
    q.enrollment_no.toLowerCase().includes(search.toLowerCase()) ||
    String(q.token).includes(search)
  );

  return (
    <div className="page-wide">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#a78bfa', fontSize: '1.4rem' }}>🎛️ Admin Dashboard</h1>
          <p style={{ color: '#4b5680', fontSize: '0.82rem' }}>D.Y. Patil Campus Office · Auto-refreshes every 15s</p>
        </div>
        <button className="btn btn-secondary btn-small" onClick={() => navigate('/')}>Student View</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-box"><div className="stat-num">{stats.waiting || 0}</div><div className="stat-label">Waiting</div></div>
        <div className="stat-box"><div className="stat-num">{stats.completed || 0}</div><div className="stat-label">Completed</div></div>
        <div className="stat-box"><div className="stat-num">{stats.total || 0}</div><div className="stat-label">Total Today</div></div>
        <div className="stat-box"><div className="stat-num">⭐{stats.avg_rating || '–'}</div><div className="stat-label">Avg Rating</div></div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0' }}>
        <button
          className="btn btn-primary"
          style={{ flex: 2, minWidth: '180px' }}
          onClick={handleCallNext}
          disabled={calling || waiting.length === 0}
        >
          {calling ? 'Processing...' : `📢 Call Next Token (${waiting.length} waiting)`}
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={fetchAll}>🔄 Refresh</button>
        <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleClear}>🗑️ Clear Queue</button>
      </div>

      {msg && <div className="msg msg-g">{msg}</div>}

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab ${tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('queue')}>Queue ({queue.length})</div>
        <div className={`tab ${tab === 'feedback' ? 'active' : ''}`} onClick={() => setTab('feedback')}>Feedback ({feedbacks.length})</div>
      </div>

      {tab === 'queue' && (
        <>
          <input
            placeholder="Search by name, enrollment, or token..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: '12px' }}
          />

          {filtered.length === 0 && <div className="loading">No entries found</div>}

          {filtered.map(q => (
            <div
              key={q.id}
              className="q-item"
              style={{ borderLeft: q.status === 'waiting' ? '3px solid #7c3aed' : '3px solid #1e1e3f' }}
            >
              <div className="q-item-left">
                <strong>#{q.token} — {q.student_name}</strong>
                <span>{q.enrollment_no} · {q.branch} · {q.service} · ~{q.eta_minutes}min</span>
              </div>
              <div className="q-item-right">
                <span className={`status-${q.status}`}>{q.status.toUpperCase()}</span>
                {q.status === 'waiting' && (
                  <div style={{ marginTop: '6px' }}>
                    <button className="btn btn-danger btn-small" onClick={() => handleSkip(q.id)}>
                      Skip
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'feedback' && (
        <>
          {feedbacks.length === 0 && <div className="loading">No feedback yet</div>}
          {feedbacks.map(f => (
            <div key={f.id} className="fb-item">
              <div className="fb-stars">
                {'⭐'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                <span style={{ color: '#4b5680', fontSize: '0.75rem', marginLeft: '8px' }}>Token #{f.token_id}</span>
              </div>
              {f.comment && <div className="fb-comment">{f.comment}</div>}
              {f.suggestion && <div className="fb-suggest">💡 {f.suggestion}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}