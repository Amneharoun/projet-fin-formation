


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard/overview", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setData(res.data);
        setRole(res.data.role)        
      })
      .catch((err) => console.error("Erreur Dashboard:", err));
    }, []);
    
  if (!data) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-primary text-white p-3" style={{ width: "220px", minHeight: "100vh" }}>
        <h4 className="mb-4">Pharmacie</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a href="/dashboard" className="nav-link text-white">📊 Tableau de bord</a>
          </li>

          {/* Accessible à TOUS */}
          <li className="nav-item mb-2">
            <a href="/medicament" className="nav-link text-white">💊 Médicaments</a>
          </li>

          <li className="nav-item mb-2">
            <a href="/clients" className="nav-link text-white">👥 Clients</a>
          </li>

          <li className="nav-item mb-2">
            <a href="/factures" className="nav-link text-white">🧾 Factures</a>
          </li>

          {/* Visible uniquement par Admin & Pharmacien */}
          {(role === "admin" || role === "pharmacien") && (
            <li className="nav-item mb-2">
              <a href="/commandes" className="nav-link text-white">📦 Commandes</a>
            </li>
          )}

          {/* Visible uniquement par Admin */}
          {role === "admin" && (
            <li className="nav-item mb-2">
              <a href="/utilisateurs" className="nav-link text-white">⚙️ Utilisateurs</a>
            </li>
          )}
        </ul>
      </div>

      {/* Contenu principal */}
      <div className="flex-grow-1 p-4">
        <h3 className="mb-4">Tableau de bord ({role})</h3>

        {/* Alertes */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h6 className="text-warning"> Médicaments en rupture</h6>
              <p>{data.lowStockCount} médicaments en rupture</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h6 className="text-success"> Péremption</h6>
              <p>{data.expiringCount} arrivent à péremption</p>
            </div>
          </div>
        </div>

        {/* Graphique ventes (réservé aux Admin & Pharmacien) */}
        {(role === "admin" || role === "pharmacien") && (
          <div className="card shadow-sm p-3 mb-4">
            <h5>Ventes</h5>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.sales}>
                  <Line type="monotone" dataKey="valeur" stroke="#007bff" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Médicaments en rupture (Visible pour TOUS) */}
        <div className="card shadow-sm p-3">
          <h5>Médicaments en rupture</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Médicament</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.medicamentsRupture.map((med, i) => (
                <tr key={i}>
                  <td>{med.nom}</td>
                  <td>{med.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
