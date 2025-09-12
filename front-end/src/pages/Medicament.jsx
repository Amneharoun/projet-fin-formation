// src/pages/Medicaments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Medicaments = () => {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    code: "",
    categorie: "",
    prix: "",
    stock: "",
    seuilAlerte: "",
    datePeremption: ""
    
  });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Charger les médicaments
  const fetchMeds = async () => {
    try {
      const res = await axios.get("http://localhost:3000/medicaments/");
      setMeds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  // 🔹 Gérer saisie du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Ajouter ou Modifier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/medicaments/${editingId}`, form);
        alert(" Médicament modifié");
      } else {
        await axios.post("http://localhost:3000/medicaments", form);
        alert("Médicament ajouté");
      }
      setForm({ nom: "", code: "", categorie: "", prix: "", stock: "", seuilAlerte: "", datePeremption: "" });
      setEditingId(null);
      fetchMeds();
    } catch (err) {
      console.error(err);
      alert(" Erreur lors de l'opération");
    }
  };

  // 🔹 Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce médicament ?")) return;
    try {
      await axios.delete(`http://localhost:3000/medicaments/${id}`);
      alert(" Médicament supprimé");
      fetchMeds();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Remplir formulaire pour modification
  const handleEdit = (med) => {
    setForm(med);
    setEditingId(med._id);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des Médicaments</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input type="text" name="nom" placeholder="Nom" className="form-control"
              value={form.nom} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="text" name="code" placeholder="Code" className="form-control"
              value={form.code} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input type="text" name="categorie" placeholder="Catégorie" className="form-control"
              value={form.categorie} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input type="number" name="prix" placeholder="Prix (fcf)" className="form-control"
              value={form.prix} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input type="number" name="stock" placeholder="Stock" className="form-control"
              value={form.stock} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input type="number" name="seuilAlerte" placeholder="Seuil alerte" className="form-control"
              value={form.seuilAlerte} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input type="date" name="datePeremption" className="form-control"
              value={form.datePeremption} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success w-100">
              {editingId ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
      </form>

      {/* Tableau */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Catégorie</th>
            <th>Prix (fcf)</th>
            <th>Stock</th>
            <th>Seuil alerte</th>
            <th>Péremption</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meds.map((med) => (
            <tr key={med._id}>
              <td>{med.nom}</td>
              <td>{med.code}</td>
              <td>{med.categorie}</td>
              <td>{med.prix}</td>
              <td>{med.stock}</td>
              <td>{med.seuilAlerte}</td>
              <td>{new Date(med.datePeremption).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(med)} className="btn btn-warning btn-sm me-2">
                  Modifier
                </button>
                <button onClick={() => handleDelete(med._id)} className="btn btn-danger btn-sm">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Medicaments;
