import { useState } from 'react';
import { API_URL } from '../config';

function VerifyBanner({ user }) {
  const [message, setMessage] = useState('');

  if (!user || user.is_verified) {
    return null;
  }

  async function handleResend() {
    setMessage('Sending...');
    const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    setMessage(res.ok ? data.message : data.error);
  }

  return (
    <div className="alert alert-warning mb-0 text-center rounded-0 d-flex justify-content-center align-items-center gap-3 flex-wrap">
      <span>Please verify your email address.</span>
      <button className="btn btn-sm btn-outline-dark" onClick={handleResend}>
        Resend verification email
      </button>
      {message && <span>{message}</span>}
    </div>
  );
}

export default VerifyBanner;
