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

    var nomeInventore = document.getElementById("nome_inventore").value;
    var cognomeInventore = document.getElementById("cognome_inventore").value;
    var indirizzoInventore = document.getElementById("indirizzo_inventore").value;
    var descrizioneInvenzione = document.getElementById("descrizione_invenzione").value;
    var tipoBrevetto = document.getElementById("tipo_brevetto").value;
    var priorita = document.getElementById("priorità").value;

    console.log("Nome Inventore:", nomeInventore);
    console.log("Cognome Inventore:", cognomeInventore);
    console.log("Indirizzo Inventore:", indirizzoInventore);
    console.log("Descrizione Invenzione:", descrizioneInvenzione);
    console.log("Tipo Brevetto:", tipoBrevetto);
    console.log("Data:", priorita);

    var datiJson = {
      "nomeInventore": nomeInventore,
      "cognomeInventore": cognomeInventore,
      "indirizzoInventore": indirizzoInventore,
      "descrizioneInvenzione": descrizioneInvenzione,
      "tipoBrevetto": tipoBrevetto,
      "priorita": priorita
    };

    console.log("Dati Json:", datiJson);

    // Invia i dati al server
    inviaDatiAlServer(datiJson);

    // Resetta il modulo se necessario
    brevettoForm.reset();
  });
  });


  function inviaDatiAlServer(datiJson) {
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


