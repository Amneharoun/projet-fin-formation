import React, { useState } from "react";
import axios from "axios";

const ImportMedicament = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage(" Veuillez sélectionner un fichier Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(` ${res.data.message} — ${res.data.total} médicaments importés.`);
    } catch (err) {
      setMessage(" Erreur lors de l'importation.");
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="text-center text-primary mb-4">Importer des médicaments</h2>
        <form onSubmit={handleUpload}>
          <div className="mb-3">
            <label className="form-label">Sélectionner un fichier Excel (.xlsx)</label>
            <input
              type="file"
              className="form-control"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Importer
          </button>
        </form>
        {message && (
          <div className="alert alert-info text-center mt-3">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ImportMedicament;
