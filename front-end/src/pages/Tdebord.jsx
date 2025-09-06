import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMedicaments: 0,
    ruptures: 0,
    ventes: 0,
  });

  // Vérifier si connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirige si pas connecté
    } else {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const [medRes, ventesRes, alertRes] = await Promise.all([
        axios.get("http://localhost:5000/medicaments"),
        axios.get("http://localhost:5000/auth/getVentes"),
        axios.get("http://localhost:5000/medicaments/alerts"),
      ]);

      setStats({
        totalMedicaments: medRes.data.length,
        ruptures: alertRes.data.length,
        ventes: ventesRes.data.length,
      });
    } catch (err) {
      console.error("Erreur récupération stats:", err);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-4">
      <h2>👋 Bienvenue {user?.name || "Utilisateur"} !</h2>
      <p>Email : {user?.email}</p>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white p-3">
            <h4>Total Médicaments</h4>
            <p>{stats.totalMedicaments}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white p-3">
            <h4>Ruptures/Péremptions</h4>
            <p>{stats.ruptures}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white p-3">
            <h4>Ventes effectuées</h4>
            <p>{stats.ventes}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button onClick={() => navigate("/medicaments")} className="btn btn-outline-primary me-2">
          📦 Gestion des Médicaments
        </button>
        <button onClick={() => navigate("/ventes")} className="btn btn-outline-success">
          💰 Gestion des Ventes
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
