const Client = require("../models/clientModel");

// Créer un nouveau client
const creerClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir tous les clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().populate("historiqueAchats.medicament");
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un client par ID
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("historiqueAchats.medicament");
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un client
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un achat à l'historique
const ajouterAchat = async (req, res) => {
  try {
    const { clientId, medicamentId, quantite } = req.body;
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }
    
    client.historiqueAchats.push({
      medicament: medicamentId,
      quantite: quantite,
      date: new Date()
    });
    
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports= {
  creerClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
ajouterAchat,
}
