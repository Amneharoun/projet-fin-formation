import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'pharmacien',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestion des champs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Inscription avec appel backend
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          role: form.role.toLowerCase(), // toujours en minuscule
          email: form.email.toLowerCase(), // éviter doublons
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Compte créé avec succès ! Vérifiez vos emails pour valider le compte.');
        // setTimeout(() => navigate(`/verify?otpToken=${data.otpToken}`), 1000);

        localStorage.setItem("otpToken", data.otpToken);
        console.log("OTP Token:", localStorage.getItem("otpToken"));
        
        //  après validation OTP → login
        setTimeout(() => navigate('/verify'), 1500);
      } else {
        setMessage(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('Erreur Register:', error);
      setMessage('Erreur serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>

      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="pharmacien">Pharmacien</option>
          <option value="admin">Admin</option>
          <option value="caissier">Caissier</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer un compte'}
        </button>
      </form>

      {message && <p className="register-message">{message}</p>}
    </div>
  );
};

export default Register;
