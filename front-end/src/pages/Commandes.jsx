import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fournisseur: "",
    produits: [{ nom: "", quantite: 1 }],
    statut: "En attente"
  });

  useEffect(() => {
    fetchCommandes();
    fetchFournisseurs();
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/commandes");
      setCommandes(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/listeFournisseurs");
      setFournisseurs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fournisseurs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/commandes", formData);
      fetchCommandes();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
    }
  };

  const updateStatut = async (id, newStatut) => {
    try {
      await axios.put(`http://localhost:3000/commandes/${id}/statut`, { statut: newStatut });
      fetchCommandes();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await axios.delete(`http://localhost:3000/commandes/${id}`);
        fetchCommandes();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fournisseur: "",
      produits: [{ nom: "", quantite: 1 }],
      statut: "En attente"
    });
    setShowModal(false);
  };

  const addProduit = () => {
    setFormData({
      ...formData,
      produits: [...formData.produits, { nom: "", quantite: 1 }]
    });
  };

  const removeProduit = (index) => {
    const newProduits = formData.produits.filter((_, i) => i !== index);
    setFormData({ ...formData, produits: newProduits });
  };

  const updateProduit = (index, field, value) => {
    const newProduits = [...formData.produits];
    newProduits[index][field] = value;
    setFormData({ ...formData, produits: newProduits });
  };

  const getStatutBadge = (statut) => {
    const badges = {
      "En attente": "bg-warning",
      "Livrée": "bg-success",
      "Annulée": "bg-danger"
    };
    return badges[statut] || "bg-secondary";
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Commandes</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nouvelle Commande
        </button>
      </div>

      {/* Table des commandes */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Fournisseur</th>
                  <th>Produits</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((commande) => (
                  <tr key={commande._id}>
                    <td>{new Date(commande.date).toLocaleDateString()}</td>
                    <td>{commande.fournisseur?.nom || "N/A"}</td>
                    <td>
                      <small>
                        {commande.produits.map((p, i) => (
                          <div key={i}>{p.nom} (x{p.quantite})</div>
                        ))}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${getStatutBadge(commande.statut)}`}>
                        {commande.statut}
                      </span>
                    </td>
                    <td>
                      {commande.statut === "En attente" && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => updateStatut(commande._id, "Livrée")}
                          >
                            Livrer
                          </button>
                          <button
                            className="btn btn-sm btn-warning me-1"
                            onClick={() => updateStatut(commande._id, "Annulée")}
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(commande._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal pour nouvelle commande */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nouvelle Commande</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Fournisseur *</label>
                    <select
                      className="form-select"
                      value={formData.fournisseur}
                      onChange={(e) => setFormData({...formData, fournisseur: e.target.value})}
                      required
                    >
                      <option value="">Sélectionner un fournisseur</option>
                      {fournisseurs.map((f) => (
                        <option key={f._id} value={f._id}>{f.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Produits</label>
                    {formData.produits.map((produit, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nom du produit"
                            value={produit.nom}
                            onChange={(e) => updateProduit(index, "nom", e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Quantité"
                            value={produit.quantite}
                            onChange={(e) => updateProduit(index, "quantite", parseInt(e.target.value))}
                            min="1"
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          {formData.produits.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeProduit(index)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addProduit}
                    >
                      + Ajouter un produit
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Créer la commande
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
