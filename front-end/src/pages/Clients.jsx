import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    contact: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clients/");
      setClients(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(`http://localhost:5000/clients/${editingClient._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/clients", formData);
      }
      fetchClients();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await axios.delete(`http://localhost:5000/clients/${id}`);
        fetchClients();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nom: "", contact: "" });
    setEditingClient(null);
    setShowModal(false);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({ nom: client.nom, contact: client.contact });
    setShowModal(true);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Clients</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Nouveau Client
        </button>
      </div>

      {/* Table des clients */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Contact</th>
                  <th>Nb Achats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.nom}</td>
                    <td>{client.contact}</td>
                    <td>
                      <span className="badge bg-info">
                        {client.historiqueAchats?.length || 0}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(client)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(client._id)}
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

      {/* Modal pour ajouter/modifier */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingClient ? "Modifier Client" : "Nouveau Client"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      placeholder="Téléphone ou email"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingClient ? "Modifier" : "Ajouter"}
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
