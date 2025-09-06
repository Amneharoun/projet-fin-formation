// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function Factures() {
//   const [ventes, setVentes] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [medicaments, setMedicaments] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     client: "",
//     medicaments: [{ medicament: "", quantite: 1, prix: 0 }],
//     reduction: 0
//   });

//   useEffect(() => {
//     fetchVentes();
//     fetchClients();
//     fetchMedicaments();
//   }, []);

//   const fetchVentes = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/vente");
//       setVentes(response.data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des ventes:", error);
//     }
//   };

//   const fetchClients = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/clients");
//       setClients(response.data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des clients:", error);
//     }
//   };

//   const fetchMedicaments = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/medicaments");
//       setMedicaments(response.data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des médicaments:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Calculer le total
//       const sousTotal = formData.medicaments.reduce((sum, item) => {
//         return sum + (item.quantite * item.prix);
//       }, 0);
//       const total = sousTotal - (formData.reduction || 0);

//       const ventData = {
//         ...formData,
//         total: total,
//         dateVente: new Date()
//       };

//       await axios.post("http://localhost:5000/vente", ventData);
      
//       // Ajouter l'achat à l'historique du client
//       for (const item of formData.medicaments) {
//         await axios.post("http://localhost:5000/clients/achat", {
//           clientId: formData.client,
//           medicamentId: item.medicament,
//           quantite: item.quantite
//         });
//       }

//       fetchVentes();
//       resetForm();
//     } catch (error) {
//       console.error("Erreur lors de la création de la facture:", error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       client: "",
//       medicaments: [{ medicament: "", quantite: 1, prix: 0 }],
//       reduction: 0
//     });
//     setShowModal(false);
//   };

//   const addMedicament = () => {
//     setFormData({
//       ...formData,
//       medicaments: [...formData.medicaments, { medicament: "", quantite: 1, prix: 0 }]
//     });
//   };

//   const removeMedicament = (index) => {
//     const newMedicaments = formData.medicaments.filter((_, i) => i !== index);
//     setFormData({ ...formData, medicaments: newMedicaments });
//   };

//   const updateMedicament = (index, field, value) => {
//     const newMedicaments = [...formData.medicaments];
//     newMedicaments[index][field] = value;
    
//     // Auto-remplir le prix si un médicament est sélectionné
//     if (field === "medicament") {
//       const selectedMed = medicaments.find(m => m._id === value);
//       if (selectedMed) {
//         newMedicaments[index].prix = selectedMed.prix;
//       }
//     }
    
//     setFormData({ ...formData, medicaments: newMedicaments });
//   };

//   const calculateTotal = () => {
//     const sousTotal = formData.medicaments.reduce((sum, item) => {
//       return sum + (item.quantite * item.prix);
//     }, 0);
//     return sousTotal - (formData.reduction || 0);
//   };

//   return (
//     <div className="container-fluid p-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Gestion des Factures</h2>
//         <button 
//           className="btn btn-primary"
//           onClick={() => setShowModal(true)}
//         >
//           + Nouvelle Facture
//         </button>
//       </div>

//       {/* Table des ventes/factures */}
//       <div className="card shadow-sm">
//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-light">
//                 <tr>
//                   <th>Date</th>
//                   <th>Client</th>
//                   <th>Médicaments</th>
//                   <th>Total</th>
//                   <th>Réduction</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {ventes.map((vente) => (
//                   <tr key={vente._id}>
//                     <td>{new Date(vente.dateVente).toLocaleDateString()}</td>
//                     <td>{vente.client?.nom || "Client anonyme"}</td>
//                     <td>
//                       <small>
//                         {vente.medicaments?.map((item, i) => (
//                           <div key={i}>
//                             {item.medicament?.nom || "N/A"} (x{item.quantite})
//                           </div>
//                         ))}
//                       </small>
//                     </td>
//                     <td>
//                       <strong>{vente.total?.toFixed(2)} CFA</strong>
//                     </td>
//                     <td>
//                       {vente.reduction ? `${vente.reduction} CFA` : "-"}
//                     </td>
//                     <td>
//                       <button className="btn btn-sm btn-outline-primary">
//                         Imprimer
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal pour nouvelle facture */}
//       {showModal && (
//         <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Nouvelle Facture</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={resetForm}
//                 ></button>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Client</label>
//                     <select
//                       className="form-select"
//                       value={formData.client}
//                       onChange={(e) => setFormData({...formData, client: e.target.value})}
//                     >
//                       <option value="">Client anonyme</option>
//                       {clients.map((client) => (
//                         <option key={client._id} value={client._id}>
//                           {client.nom}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Médicaments</label>
//                     {formData.medicaments.map((item, index) => (
//                       <div key={index} className="row mb-2 align-items-end">
//                         <div className="col-md-4">
//                           <select
//                             className="form-select"
//                             value={item.medicament}
//                             onChange={(e) => updateMedicament(index, "medicament", e.target.value)}
//                             required
//                           >
//                             <option value="">Sélectionner un médicament</option>
//                             {medicaments.map((med) => (
//                               <option key={med._id} value={med._id}>
//                                 {med.nom} (Stock: {med.stock})
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div className="col-md-2">
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Qté"
//                             value={item.quantite}
//                             onChange={(e) => updateMedicament(index, "quantite", parseInt(e.target.value))}
//                             min="1"
//                             required
//                           />
//                         </div>
//                         <div className="col-md-3">
//                           <input
//                             type="number"
//                             className="form-control"
//                             placeholder="Prix unitaire"
//                             value={item.prix}
//                             onChange={(e) => updateMedicament(index, "prix", parseFloat(e.target.value))}
//                             step="0.01"
//                             min="0"
//                             required
//                           />
//                         </div>
//                         <div className="col-md-2">
//                           <strong>{(item.quantite * item.prix).toFixed(2)} CFA</strong>
//                         </div>
//                         <div className="col-md-1">
//                           {formData.medicaments.length > 1 && (
//                             <button
//                               type="button"
//                               className="btn btn-outline-danger btn-sm"
//                               onClick={() => removeMedicament(index)}
//                             >
                              
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                     <button
//                       type="button"
//                       className="btn btn-outline-primary btn-sm"
//                       onClick={addMedicament}
//                     >
//                       + Ajouter un médicament
//                     </button>
//                   </div>

//                   <div className="row">
//                     <div className="col-md-6">
//                       <label className="form-label">Réduction (CFA)</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={formData.reduction}
//                         onChange={(e) => setFormData({...formData, reduction: parseFloat(e.target.value) || 0})}
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label">Total</label>
//                       <div className="form-control-plaintext">
//                         <strong>{calculateTotal().toFixed(2)} CFA</strong>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={resetForm}>
//                     Annuler
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     Créer la facture
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState } from "react";

const Factures = () => {
  // Exemple de factures (tu pourras les récupérer depuis ton backend plus tard)
  const [factures, setFactures] = useState([
    { id: 1, client: "Jean Dupont", montant: 120.5, date: "2025-08-01", statut: "Payée" },
    { id: 2, client: "Marie Curie", montant: 89.99, date: "2025-08-05", statut: "En attente" },
    { id: 3, client: "afra", montant: 45.0, date: "2025-08-10", statut: "Annulée" },
  ]);

  const [search, setSearch] = useState("");
  const [newFacture, setNewFacture] = useState({
    client: "",
    montant: "",
    date: "",
    statut: "En attente",
  });

  // Filtrage
  const filteredFactures = factures.filter(
    (f) =>
      f.client.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toString().includes(search)
  );

  // Suppression
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette facture ?")) {
      setFactures(factures.filter((f) => f.id !== id));
    }
  };

  // Ajout
  const handleAddFacture = (e) => {
    e.preventDefault();

    if (!newFacture.client || !newFacture.montant || !newFacture.date) {
      alert(" Veuillez remplir tous les champs !");
      return;
    }

    const newId = factures.length > 0 ? factures[factures.length - 1].id + 1 : 1;
    const factureToAdd = { id: newId, ...newFacture, montant: parseFloat(newFacture.montant) };

    setFactures([...factures, factureToAdd]);
    setNewFacture({ client: "", montant: "", date: "", statut: "En attente" });

    alert("Facture ajoutée avec succès !");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="fas fa-receipt me-2"></i> Gestion des Factures
      </h2>

      {/* Formulaire ajout facture */}
      <div className="card mb-4 shadow-sm">
        {/* <div className="card-header bg-primary text-white">
          <i className="fas fa-plus-circle me-2"></i> Nouvelle facture
        </div> */}
        <div className="card-body">
          <form onSubmit={handleAddFacture} className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Client</label>
              <input
                type="text"
                className="form-control"
                value={newFacture.client}
                onChange={(e) => setNewFacture({ ...newFacture, client: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Montant </label>
              <input
                type="number"
                className="form-control"
                value={newFacture.montant}
                onChange={(e) => setNewFacture({ ...newFacture, montant: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={newFacture.date}
                onChange={(e) => setNewFacture({ ...newFacture, date: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                value={newFacture.statut}
                onChange={(e) => setNewFacture({ ...newFacture, statut: e.target.value })}
              >
                <option value="En attente">En attente</option>
                <option value="Payée">Payée</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                <i className="fas fa-save me-2"></i> Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher par client ou numéro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Tableau */}
      <table className="table table-hover table-bordered shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Montant </th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFactures.length > 0 ? (
            filteredFactures.map((facture) => (
              <tr key={facture.id}>
                <td>{facture.id}</td>
                <td>{facture.client}</td>
                <td>{facture.montant.toFixed(2)}</td>
                <td>{facture.date}</td>
                <td>
                  <span
                    className={`badge ${
                      facture.statut === "Payée"
                        ? "bg-success"
                        : facture.statut === "En attente"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {facture.statut}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-info me-2">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(facture.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Aucune facture trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Factures;
