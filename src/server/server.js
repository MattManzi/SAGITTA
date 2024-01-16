//Librerie
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const pinataSDK = require('@pinata/sdk');

//Pinata setup
const pinata = new pinataSDK('4ad97ee4cb69986a2499', '3857316b8ceaa258886f101c6bf127b04188ed51427ca1916d53df9769b42ea9');

const app = express();
app.use(express.json());

// Configurazione middleware per gestire JSON e richieste POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurazione middleware CORS per consentire le richieste da origini diverse
app.use(cors());

// Gestisci la richiesta POST a /salvaDati
app.post('/salvaDati', async (req, res) => {
  const datiJson = req.body;
  var nomeBrevetto = datiJson.name;
  console.log(datiJson, nomeBrevetto);
  createJSONFile(nomeBrevetto, datiJson);
  await uploadPinata(nomeBrevetto);
  deleteFile("./" + nomeBrevetto + '.json');  
});


//Avvio server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});


// Funzione per creare il file temporaneo da inviare a Pinata(.JSON)
function createJSONFile(nomeBrevetto, datiJson){
  try {
    // Scrivi i dati su un file
    fs.writeFileSync(nomeBrevetto + '.json', JSON.stringify(datiJson));

    //res.status(200).json({ success: true });
  } catch (error) {
    console.error('Errore durante il salvataggio dei dati:', error.message);
    //res.status(500).json({ success: false, error: error.message });
  }
}

// Funzione per il caricamento del file temporaneo su Pinata(.JSON)
async function uploadPinata(nomeBrevetto) {
    try {
    // Testa l'autenticazione
    const authenticationResponse = await pinata.testAuthentication();
    console.log("Log1", authenticationResponse);

    //lettura stream dal file
    const readableStreamForFile = fs.createReadStream("./" + nomeBrevetto + '.json');

    console.log(readableStreamForFile.toString());

    const uploadOptions = {
      pinataMetadata: {
        name: nomeBrevetto + '.json',
      },

    };

    const pinataStatus = await pinata.pinFileToIPFS(readableStreamForFile, uploadOptions)
    console.log("Valore res: ", pinataStatus)

  } catch (error) {
    console.error('Errore durante l\'invio a Pinata:', error.message);
  }
}


// Funzione per eliminare il file temporaneo da inviare a Pinata(.JSON)
function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Errore durante l\'eliminazione del file:', err);
      return;
    }

    console.log('File eliminato con successo!');
  });
}