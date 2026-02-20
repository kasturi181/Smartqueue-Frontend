import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import { adminLogin } from '../api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) { setError('Enter both fields'); return; }
    setLoading(true); setError('');
    try {
      const data = await adminLogin(username, password);
      login(data.access_token, {
        username: data.username,
        role:       data.role,
        counter_no: data.counter_no,
      });
      navigate('/admin');
    } catch (e) {
      setError(e.message || 'Login failed. Check credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div style={{textAlign:'center',padding:'30px 0 20px'}}>
        <div style={{fontSize:'2.5rem'}}>🔐</div>
        <h1 style={{color:'#a78bfa',fontFamily:'Syne,sans-serif',fontSize:'1.4rem',margin:'8px 0 4px'}}>Admin Login</h1>
        <p style={{color:'#6b7099',fontSize:'0.83rem'}}>D.Y. Patil SmartQueue · Staff Access Only</p>
      </div>

      <div className="card">
        <label>Username</label>
        <input
          placeholder="e.g. counter1 or superadmin"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        {error && <div className="msg msg-r">{error}</div>}
        <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : '🔐 Login'}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Student View</button>
      </div>
    </div>
  );
}