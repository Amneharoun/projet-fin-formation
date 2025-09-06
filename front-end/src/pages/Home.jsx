import React from "react";
import './home.css'; // ton fichier CSS personnalisé

const Home = () => {
  return (

<>
    {/* <main className="home"> */}
      <div className="container home" id="container-home">
        <div className="row align-items-center">
          <div className="col-md-6" id="title">
            <h1 className="display-4"> Bienvenue sur Medi</h1>
            <p>
             la solution digitale pour trouver vos médicaments en un seul clic.
              Gagnez du temps, vérifiez la disponibilité, et localisez votre pharmacie la plus proche.
            </p>
          </div>
        </div>
      </div>
    {/* </main> */}
        <section className="container my-5" id="services">
  <h2 className="text-center mb-4">Nos Services</h2>
  <div className="row">
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Recherche de médicaments</h5>
          <p className="card-text">Recherchez rapidement un médicament dans toutes les pharmacies disponibles d'abeche.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Alertes de stock</h5>
          <p className="card-text">Soyez informé en cas de rupture ou expiration proche d’un médicament.</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Gestion des ventes</h5>
          <p className="card-text">Suivi des ventes, factures, et historique de chaque client/patient.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="container my-5" id="contact">
  <h2 className="text-center mb-4">Contactez-nous</h2>
  <form>
    <div className="mb-3">
      <label htmlFor="name" className="form-label">Nom</label>
      <input type="text" className="form-control" id="name" />
    </div>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email</label>
      <input type="email" className="form-control" id="email" />
    </div>
    <div className="mb-3">
      <label htmlFor="message" className="form-label">Message</label>
      <textarea className="form-control" id="message" rows="4"></textarea>
    </div>
    <button type="submit" className="btn btn-success">Envoyer</button>
  </form>
</section>
</>
  );
};

export default Home;
