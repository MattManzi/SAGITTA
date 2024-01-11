const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Configurazione middleware per gestire JSON e richieste POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurazione middleware CORS per consentire le richieste da origini diverse
app.use(cors());

// Gestisci la richiesta POST a /salvaDati
app.post('/salvaDati', (req, res) => {
  const datiJson = req.body;

  try {
    // Scrivi i dati su un file
    fs.writeFileSync('dati.json', JSON.stringify(datiJson));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Errore durante il salvataggio dei dati:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
