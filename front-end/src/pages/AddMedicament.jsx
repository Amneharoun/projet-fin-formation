import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/medicaments';

const emptyForm = {
  nom: '', code: '', categorie: '',
  prix: '', stock: '', seuilAlerte: 10, datePeremption: ''
};

const MedicamentPage = () => {
  const [meds, setMeds] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const load = async () => {
    setLoading(true);
    // const res = await axios.get(API).then(response => {
    //   console.log(response.data);
    // })
    //   .catch(error => {
    //     console.error('Error fetching data:', error);
    //   });;
    const res = await axios.get(`${API}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setMeds(res.data);
    setLoading(false);
  };

  const loadAlerts = async () => {
    const res = await axios.get(`${APi}/alerts/check`);
    setAlerts(res.data.alerts || []);
  };

  useEffect(() => { load(); loadAlerts(); }, []);     // initial
  useEffect(() => { const id = setTimeout(load, 400); return () => clearTimeout(id); }, [q]); // recherche

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setEditingId(null); setForm(emptyForm); };
  const openEdit = (m) => {
    setEditingId(m._id);
    setForm({
      nom: m.nom, code: m.code, categorie: m.categorie,
      prix: m.prix, stock: m.stock, seuilAlerte: m.seuilAlerte,
      datePeremption: m.datePeremption ? m.datePeremption.substring(0, 10) : ''
    });
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, prix: Number(form.prix), stock: Number(form.stock), seuilAlerte: Number(form.seuilAlerte) };
    if (editingId) {
      await axios.put(`${API}/${editingId}`, payload);
    } else {
      await axios.post(API, payload);
    }
    await load(); await loadAlerts();
    document.getElementById('closeModalBtn').click();
  };

  const remove = async (id) => {
    if (!window.confirm('Supprimer ce médicament ?')) return;
    await axios.delete(`${API}/${id}`);
    await load(); await loadAlerts();
  };

  const isAlert = (m) => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    const perim = new Date(m.datePeremption);
    return m.stock < m.seuilAlerte || perim <= soon;
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0"> Médicaments</h3>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#medModal" onClick={openAdd}>
          + Ajouter
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="input-group mb-3">
        <span className="input-group-text">🔎</span>
        <input
          className="form-control"
          placeholder="Rechercher par nom ou code…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={load}>Rechercher</button>
      </div>

      {/* Alertes */}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Alertes stock & péremption</h5>
          {alerts.length === 0 ? (
            <p className="text-success m-0">Aucune alerte pour le moment.</p>
          ) : (
            <ul className="m-0">
              {alerts.map(a => (
                <li key={a._id}>
                  <strong>{a.nom}</strong> — stock: {a.stock} (seuil {a.seuilAlerte}), péremption: {new Date(a.datePeremption).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tableau */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Nom</th>
              <th>Code</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Seuil</th>
              <th>Péremption</th>
              <th>État</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9">Chargement…</td></tr>
            ) : meds.length === 0 ? (
              <tr><td colSpan="9">Aucun médicament.</td></tr>
            ) : meds.map(m => (
              <tr key={m._id}>
                <td>{m.nom}</td>
                <td><code>{m.code}</code></td>
                <td>{m.categorie}</td>
                <td>{Number(m.prix).toFixed(2)} €</td>
                <td>{m.stock}</td>
                <td>{m.seuilAlerte}</td>
                <td>{m.datePeremption ? new Date(m.datePeremption).toLocaleDateString() : '-'}</td>
                <td>
                  {isAlert(m)
                    ? <span className="badge text-bg-danger">Alerte</span>
                    : <span className="badge text-bg-success">OK</span>}
                </td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#medModal" onClick={() => openEdit(m)}>Modifier</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(m._id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter/Modifier */}
      <div className="modal fade" id="medModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={save}>
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? 'Modifier' : 'Ajouter'} un médicament</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer" id="closeModalBtn"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Nom</label>
                    <input className="form-control" name="nom" value={form.nom} onChange={onChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Code</label>
                    <input className="form-control" name="code" value={form.code} onChange={onChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Catégorie</label>
                    <input className="form-control" name="categorie" value={form.categorie} onChange={onChange} placeholder="Antibiotique, Vitamine…" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Prix</label>
                    <input type="number" step="0.01" min="0" className="form-control" name="prix" value={form.prix} onChange={onChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock</label>
                    <input type="number" min="0" className="form-control" name="stock" value={form.stock} onChange={onChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Seuil alerte</label>
                    <input type="number" min="0" className="form-control" name="seuilAlerte" value={form.seuilAlerte} onChange={onChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Date de péremption</label>
                    <input type="date" className="form-control" name="datePeremption" value={form.datePeremption} onChange={onChange} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">Annuler</button>
                <button className="btn btn-primary" type="submit">{editingId ? 'Mettre à jour' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MedicamentPage;
