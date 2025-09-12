import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  // Fonction générique pour mettre à jour le state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", JSON.stringify(data.user.role));

        setMessage("Connexion réussie ");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMessage(`${data.message || "Erreur lors de la connexion"}`);
        navigate("/register") }
      
    } catch (error) {
      console.error("Erreur Login:", error);
      setMessage(" Erreur serveur. Veuillez réessayer.");
    }
  };

  return (
    <div className="forme mt-5">
      <div className="connexion">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%" }}
          />
          <label htmlFor="password">password:</label>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%" }}
          />
          <button className="btn" type="submit">
            Se connecter
          </button>
        </form>
        {message && <p style={{ marginTop: "1rem", color: "red" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
