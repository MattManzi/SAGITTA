const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());

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


const axios = require('axios');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/inviaPinata', async (req, resInviaPinata) => {
  try {
    const pinataSDK = require('@pinata/sdk');
    const pinata = new pinataSDK('4ad97ee4cb69986a2499', '3857316b8ceaa258886f101c6bf127b04188ed51427ca1916d53df9769b42ea9');
    
    // Testa l'autenticazione
    const authenticationResponse = await pinata.testAuthentication();
    console.log("Log1",authenticationResponse);

    // Sostituisci '/home/cry/SAGITTA/src/dati.json' con il percorso effettivo del tuo file JSON
    const readableStreamForFile = fs.createReadStream('./dati.json');

     console.log(readableStreamForFile.toString());

    // Sostituisci 'YourFileName.json' con il nome desiderato
    const uploadOptions = {
      pinataMetadata: {
        name: 'dati.json',
      },

    };
    
    const pinataStatus = await pinata.pinFileToIPFS(readableStreamForFile, uploadOptions)
    console.log("Valore res: ",pinataStatus)


    resInviaPinata.status(200).json({ success: true, pinataResponse: uploadOptions });
  } catch (error) {
    console.error('Errore durante l\'invio a Pinata:', error.message);
    resInviaPinata.status(500).json({ success: false, error: error.message });
  }
});


const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

