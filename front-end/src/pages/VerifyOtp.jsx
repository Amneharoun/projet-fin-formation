import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  //   const [otpToken, setOtpToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const otpToken = localStorage.getItem("otpToken");
      const response = await fetch('http://localhost:5000/auth/email-verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp,
          otpToken,
          purpose: 'verify-email',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Vérification réussie ! Vous pouvez maintenant vous connecter.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(`${data.message || "Erreur de vérification"}`);
      }
    } catch (error) {
      console.error('Erreur Verify:', error);
      setMessage('Erreur serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-3">Vérification du compte</h3>
          <p className="text-center text-muted">Entrez le code OTP reçu par email</p>

          {message && (
            <div className={`alert ${message.includes('réussie') ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Code OTP</label>
              <input
                type="text"
                id="otp"
                className="form-control"
                placeholder="Entrez votre code OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            {/* <div className="mb-3">
              <label htmlFor="otpToken" className="form-label">Token reçu (otpToken)</label>
              <input
                type="text"
                id="otpToken"
                className="form-control"
                placeholder="Entrez le token reçu"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                required
              />
            </div> */}

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
