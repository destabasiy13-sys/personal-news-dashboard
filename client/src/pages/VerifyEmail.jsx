import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API_URL } from '../config';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  // Verifying a token isn't repeatable - a second call always fails "already
  // used". React StrictMode intentionally double-invokes effects in
  // development, so without this guard the redundant second call would
  // overwrite a genuine success with a false "already used" error.
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    fetch(`${API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        setStatus(ok ? 'success' : 'error');
        setMessage(ok ? data.message : data.error);
      });
  }, [searchParams]);

  return (
    <div className="container mt-4 text-center">
      <h1>Email Verification</h1>
      {status === 'verifying' && <p>Verifying...</p>}
      {status !== 'verifying' && (
        <div className={`alert alert-${status === 'success' ? 'success' : 'danger'}`}>
          {message}
        </div>
      )}
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}

export default VerifyEmail;
