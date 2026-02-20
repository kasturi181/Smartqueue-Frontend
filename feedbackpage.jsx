import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { submitFeedback } from '../api';

export default function FeedbackPage() {
  const [params]     = useSearchParams();
  const tokenId      = parseInt(params.get('token') || '1');
  const [rating,     setRating]     = useState(0);
  const [hover,      setHover]      = useState(0);
  const [comment,    setComment]    = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a star rating!'); return; }
    setLoading(true);
    setError('');
    try {
      await submitFeedback({ token_id: tokenId, rating, comment, suggestion });
      setSubmitted(true);
    } catch (e) {
      setError('Failed to submit. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) return (
    <div className="page">
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', margin: '10px 0' }}>🙏</div>
        <h2>Thank You!</h2>
        <p className="card-sub">Your feedback helps improve D.Y. Patil office services.</p>
        <div className="msg msg-g">Feedback submitted successfully ✅</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="card">
        <h2>⭐ Rate Your Experience</h2>
        <p className="card-sub">D.Y. Patil Campus Office · Token #{tokenId}</p>

        {/* Star Rating */}
        <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '0.85rem', color: '#4b5680' }}>
          Tap a star to rate
        </div>
        <div className="stars">
          {[1, 2, 3, 4, 5].map(s => (
            <span
              key={s}
              className="star"
              style={{ color: s <= (hover || rating) ? '#fbbf24' : '#1e1e3f' }}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
            >★</span>
          ))}
        </div>
        {rating > 0 && (
          <div style={{ textAlign: 'center', color: '#fbbf24', fontSize: '0.85rem', marginBottom: '12px' }}>
            {['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Very Good 😊', 'Excellent 🤩'][rating]}
          </div>
        )}

        <label>Your Experience (optional)</label>
        <textarea
          rows={3}
          placeholder="How was your experience at the office?"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <label>Suggestions for Improvement (optional)</label>
        <textarea
          rows={3}
          placeholder="Any suggestions to make the office better?"
          value={suggestion}
          onChange={e => setSuggestion(e.target.value)}
        />

        {error && <div className="msg msg-r">{error}</div>}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : '✅ Submit Feedback'}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>← Skip</button>
      </div>
    </div>
  );
}