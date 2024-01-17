const urlJSON = "./SoulboundToken.json";
//creazione del provider ->Un "provider" è responsabile di fornire l'accesso ai dati della blockchain, come il saldo di un account, lo stato di un contratto e le transazioni passate.
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
const httpPinata = "https://gateway.pinata.cloud/ipfs/";
const contractAddress = "0xF48601e40a6ab82D0CF9dbE05a9fCF3729Ad03Cd";
let abi = "";
var connectedAccount = "";
var ipfsBrevetto = "";
var contract = "";
var soulboundTokenContract;
//creazione del signer -> Un "signer" è una specifica istanza di un provider che ha la capacità di firmare transazioni e inviarle alla blockchain.
const signer = web3Provider.getSigner()
console.log("Provider:", signer);

// Utilizza la funzione fetch per ottenere il contenuto del file JSON
fetch(urlJSON)
  .then(response => {
    // Controlla se la richiesta HTTP ha avuto successo
    if (!response.ok) {
      throw new Error('Errore nella richiesta HTTP ' + response.status);
    }
    // Parsa il corpo della risposta come JSON
    return response.json();
  })
  .then(data => {
    console.log(data.abi);
    abi = data;
    contract = new ethers.Contract(contractAddress, abi.abi, signer);
    console.log("contract:", contract);
  })
  .catch(error => {
    console.error('Si è verificato un errore durante il recupero del file JSON:', error);
  });

// Controlla se MetaMask è installato
if (typeof window.ethereum !== 'undefined') {
  // Connettiti a MetaMask
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(async (accounts) => {
      connectedAccount = accounts[0];
      const balance = await web3Provider.getBalance(connectedAccount);
      console.log('Saldo:', balance);
      const account = document.getElementById('myName');
      account.innerHTML = connectedAccount;
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

    const ipfsUtility = "QmX3qLwqECxBFnb1hex33my2dPE63NstL9scvF1iem3kzK";
    const ipfsDesign = "QmUu5JrsadDmE7hhj1guTPqQazPwJXJAf1Va4KTVZocVqr";

    var datiJson = {
      "attributes": [{
        "trait_type": "SagittaSBT",
        "value": "Brevetti Certificati SAGITTA"
      }, {
        "trait_type": "Tipo di Brevetto",
        "value": tipoBrevetto
      }, {
        "trait_type": "Proprietario",
        "value": nomeInventore + " " + cognomeInventore
      }, {
        "trait_type": "Data del Brevetto",
        "value": priorita
      }],
      "description": descrizioneInvenzione,
      "image": "https://gateway.pinata.cloud/ipfs/" + (tipoBrevetto === "brevetto_utilità" ? ipfsUtility : ipfsDesign), //qui si deve inserire il COD di pinata
      "name": nomeBrevetto
    };

    console.log("Dati Json:", datiJson);
    console.log("Account:", connectedAccount);

    // Creazione del file JSON e Caricamento del file JSON su pinata
    creazioneJSON(datiJson, connectedAccount);
    console.log(ipfsBrevetto);
    // Resetta il modulo se necessario
    brevettoForm.reset();
  });
});

//Funtione che comunica con lo smart contract per eseguire il safeMint()
async function mintSbt(ipfsBrevetto) {
  const transaction = await contract.safeMint(connectedAccount, httpPinata + ipfsBrevetto);
  // Attendere che la transazione sia confermata
  await transaction.wait();
  console.log("Transazione confermata:", transaction);
}

//Funtione è per la creazione del file JSON e caricamento su Pinta gestito sul server alla porta 3002
async function creazioneJSON(datiJson, connectedAccount) {
  await fetch('http://localhost:3002/salvaDati', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dati: datiJson,
      address: connectedAccount
    }),

  })
    .then(response => response.json())
    .then(data => {
      console.log('Ris dal server:', data.ipfsHashBrevetto);
      ipfsBrevetto = data.ipfsHashBrevetto;
      //si aspetta la risposta dal server del caricamento su pinata per poi eseguire la funzine mintSbt()
      mintSbt(ipfsBrevetto);

      return data;
    })
    .catch(error => {
      console.error('Errore durante la richiesta al server:', error);
    });
}

