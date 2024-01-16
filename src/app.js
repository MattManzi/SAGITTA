
// URL del provider JSON-RPC
const rpcUrl = "https://rpc-mumbai.maticvigil.com";

// Crea un provider JSON-RPC
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");

// Controlla se MetaMask è installato
if (typeof window.ethereum !== 'undefined') {
  // Connettiti a MetaMask
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((accounts) => {
      const connectedAccount = accounts[0];
      const balance = provider.getBalance(connectedAccount);
      console.log('Saldo:', balance);
      const account = document.getElementById('myName');
      account.innerHTML = connectedAccount;
      // Ora puoi utilizzare l'indirizzo connesso come desideri
      // ad esempio, puoi utilizzarlo per creare un provider ethers per Ethereum
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      // Altri tuoi codici per Ethereum...
    })
    .catch((error) => {
      
      console.error('Errore durante la connessione a MetaMask:', error);
    });
} else {
  console.error('MetaMask non è installato nel browser.');
}

document.addEventListener("DOMContentLoaded", function () {
  var brevettoForm = document.forms.brevettoForm;

  brevettoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var nomeBrevetto = document.getElementById("nome_brevetto").value;
    var nomeInventore = document.getElementById("nome_inventore").value;
    var cognomeInventore = document.getElementById("cognome_inventore").value;
    var indirizzoInventore = document.getElementById("indirizzo_inventore").value;
    var descrizioneInvenzione = document.getElementById("descrizione_invenzione").value;
    var tipoBrevetto = document.getElementById("tipo_brevetto").value;
    var priorita = document.getElementById("priorità").value;

    console.log("Nome Brevetto:", nomeBrevetto);
    console.log("Nome Inventore:", nomeInventore);
    console.log("Cognome Inventore:", cognomeInventore);
    console.log("Indirizzo Inventore:", indirizzoInventore);
    console.log("Descrizione Invenzione:", descrizioneInvenzione);
    console.log("Tipo Brevetto:", tipoBrevetto);
    console.log("Data:", priorita);

    var datiJson = {
    "attributes" : [ {
      "trait_type" : "SagittaSBT",
      "value" : "Brevetti Certificati SAGITTA"
    }, {
      "trait_type" : "Tipo di Brevetto",
      "value" : "Brevetto d'utilità"
    }, {
        "trait_type" : "Proprietario",
        "value" : nomeInventore+" "+cognomeInventore
      }, {
        "trait_type" : "Data del Brevetto",
        "value" : priorita
      }   ],
    "description" : descrizioneInvenzione,
    "image" : "https://gateway.pinata.cloud/ipfs/Qmar8RRAZ5QoVPTzvrRk9PcFSm9YKbkanxmd951nXk2bgM", //qui si deve inserire il COD di pinata
    "name" : nomeBrevetto
    };

    console.log("Dati Json:", datiJson);

    //Creazione del .png


    //Caricamento del .png su pinata

    // Creazione del file JSON
    creazioneJSON(datiJson);

    //Caricamento del file JSON su pinata
    caricamentJSON();
    
    // Resetta il modulo se necessario
    brevettoForm.reset();
  });
  });


  function creazioneJSON(datiJson) {
    fetch('http://localhost:3002/salvaDati', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datiJson),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Risposta dal server:', data);
    })
    .catch(error => {
      console.error('Errore durante la richiesta al server:', error);
    });
  }

function caricamentJSON() {
  // Leggi il contenuto del file dal progetto (assumendo che sia un file JSON)
  fetch('./dati.json')
    .then(response => response.json())
    .then(datiJson => {
      // Invia i dati al server
      fetch('http://localhost:3002/inviaPinata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datiJson),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Risposta dal server:', data);
      })
      .catch(error => {
        console.error('Errore durante la richiesta al server:', error);
      });
    })
    .catch(error => {
      console.error('Errore durante la lettura del file:', error);
    });
}






