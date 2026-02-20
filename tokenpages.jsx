import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getTokenStatus } from '../api';

export default function TokenPage() {
  const [tokenData, setTokenData] = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);
  const navigate = useNavigate();
  const enrollment = localStorage.getItem('enrollment');

  useEffect(() => {
    const data = localStorage.getItem('token_data');
    if (!data) { navigate('/'); return; }
    const parsed = JSON.parse(data);
    setTokenData(parsed);

    // Poll status every 30 seconds
    const poll = setInterval(async () => {
      try {
        const s = await getTokenStatus(parsed.token);
        setLiveStatus(s);
      } catch {}
    }, 30000);

    // First immediate check
    getTokenStatus(parsed.token).then(setLiveStatus).catch(() => {});

    return () => clearInterval(poll);
  }, [navigate]);

  if (!tokenData) return <div className="loading">Loading...</div>;

  const isCompleted = liveStatus?.status === 'completed';
  const waitingAhead = liveStatus?.waiting_ahead ?? tokenData.position - 1;
  const eta = liveStatus?.eta_minutes ?? tokenData.eta_minutes;

  return (
    <div className="page">
      <div className="card">
        <h2>🎟️ Your Token</h2>
        <p className="card-sub">{enrollment} · {tokenData.service}</p>

        <div className="token-badge">
          <div style={{fontSize:'0.8rem',color:'#4b5680',marginBottom:'4px'}}>TOKEN NUMBER</div>
          <div className="token-num">{tokenData.token}</div>
          <div className="token-service">{tokenData.service}</div>

          {isCompleted ? (
            <div className="eta-pill">✅ Your turn is NOW — Please go to the counter</div>
          ) : (
            <>
              <span className="eta-pill">⏱ ~{eta} min wait</span>
              <span className="pos-pill">#{waitingAhead + 1} in queue</span>
            </>
          )}
        </div>

        <div style={{textAlign:'center', margin:'20px 0'}}>
          <QRCodeSVG
            value={`DYPatil-SmartQueue|Token:${tokenData.token}|Enrollment:${enrollment}|Service:${tokenData.service}`}
            size={140}
            bgColor="#08080f"
            fgColor="#a78bfa"
            level="H"
          />
          <div style={{color:'#4b5680',fontSize:'0.75rem',marginTop:'6px'}}>
            Show this QR at the counter
          </div>
        </div>

        {!isCompleted && <div className="msg msg-b">
          📱 You'll get an SMS when you're next. Keep this page open.
        </div>}

        {isCompleted && <div className="msg msg-g">
          🎉 Service complete! Rate your experience below.
        </div>}

        {isCompleted && <button className="btn btn-green"
          onClick={() => navigate(`/feedback?token=${tokenData.queue_id}`)}>
          ⭐ Rate Experience
        </button>}

        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Home</button>
      </div>
    </div>
  );
}