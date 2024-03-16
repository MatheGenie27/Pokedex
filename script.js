//Daten Variablen

let pokeIndex;

let pokeResultOfSearch;

let numbersOfPokemonsPerPage = 20;

let actualPage = 1;
let totalPages;

let upperBound;
let lowerBound;

let resultDetails = [];

//Funktionen

async function init() {
  await getAllPokemonsOverview();
  filterPokemon("");
  getCompletePokemonAPI();
}

function getCompletePokemonAPI() {
  console.log("Funktion: getCompletePokemonAPI");

  console.log(pokeIndex.results.length);
  for (let i = 0; i < pokeIndex.results.length; i++) {
    try {
      url = pokeIndex.results[i].url;
    } catch {
      "url konnte nicht geladen werden an PokeIndex " + i;
    }

    let segments = url.split("/");

    let pokemonId = segments[segments.length - 2];
    saveLocal(pokemonId);
  }
}

async function saveLocal(id) {
  idAsText = id.toString();
  if (isLocal(id)) {
  } else {
    let details = await getDetailsFromAPI(id);
    if (details) {
      
      let essentialDetails = extractEssentialInformation(details);

      let essentialDetailsAsText = JSON.stringify(essentialDetails);
      localStorage.setItem(`pokeID${id}`,essentialDetailsAsText);
    }
  }
}

function extractEssentialInformation(element) {
  //Extrahiere Bild, Typ1,Typ2,HP,Attack,Defense,SP-Attack,SP-Defense,Speed,Weight
  console.log("Extrahiere essenzielle Informationen");
  let pokeName = element.species.name;
  let pokeImage = element.sprites.front_default;
  let pokeType1 = element.types[0].type.name;
  let pokeType2;
  let pokeHP = element.stats[0].base_stat;
  let pokeAttack = element.stats[1].base_stat;
  let pokeDefense = element.stats[2].base_stat;
  let pokeSpAttack = element.stats[3].base_stat;
  let pokeSpDefense = element.stats[4].base_stat;
  let pokeSpeed = element.stats[5].base_stat;
  let pokeWeight = element.types.weight;

  if(element.types[1]){if(element.types[1].type.name){pokeType2 = element.types[1].type.name;}}else{pokeType2=null;}

  info =[pokeName, pokeImage, pokeType1, pokeType2, pokeHP, pokeAttack, pokeDefense, pokeSpAttack, pokeSpDefense, pokeSpeed, pokeWeight]
  return info;
}

async function getDetailsFromAPI(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let responseAsJSON;
  try {
    let response = await fetch(url);

    if (response) {
      responseAsJSON = await response.json(); 
    }
    if (responseAsJSON) {
      return responseAsJSON;
    }
  } catch {
    console.log("oopsi in getDetailsFromAPI()");
  }
}

function isLocal(id) {
  pokeDetailsAsText = localStorage.getItem(`pokeID${id}`);
  if (pokeDetailsAsText) {
    console.log("Im Speicher vorhanden")
    return true;
  } else {
    return false;
  }
}

async function getAllPokemonsOverview() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";

  try {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    pokeIndex = responseAsJson;
  } catch {
    console.log("pokeIndex konnte nicht geladen werden");
  }
}

async function filterPokemon(search) {
  if (search) {
    search = search.toLowerCase();
  }
  //console.log(search);

  await updatePokeResultOfSearch(search);
  //console.log(pokeResultOfSearch);
  calcTotalPages();
  checkPageNumber();
  renderAll();
}

function checkFilter() {
  console.log("checkFilter");
  input = getSearchInput();

  if (input.length > 2) {
    filterPokemon(input);
  } else if (input == "") {
    filterPokemon("");
  }
}

function getSearchInput() {
  let search = document.getElementById("pokeSearch").value;
  return search;
}

async function updatePokeResultOfSearch(name) {
  pokeResultOfSearch = [
    {
      results: [
        {
          name: "",
          url: "",
        },
      ],
    },
  ];

  for (let i = 0; i < pokeIndex.results.length; i++) {
    let indexName = pokeIndex.results[i].name.toLowerCase();

    if (indexName.includes(name)) {
      console.log("Daten in Result gepusht)");
      try {
        pokeResultOfSearch[0].results.push(pokeIndex.results[i]);
      } catch {
        console.log("Daten in Result pushen fehlgeschlagen");
      }
    }
  }
}

function resetSearch() {
  document.getElementById("pokeSearch").value = "";
  filterPokemon("");
}

function calcTotalPages() {
  totalPages = 0;
  totalPages = Math.ceil((pokeResultOfSearch[0].results.length - 1) / 20);
}

async function renderAll() {
  calcRenderBoundaries();
  //await getPokeDetails(); //Funktion überdenken
  renderOverviewCards();
  renderPageProgress();
}

//ÜBERARBEITUNG!!!!!!!!!!!!!!!!!!!!!!!!!!!
async function getPokeDetails() {
  //Start getPoke Details!!!!
  resultDetails.length = 0;
  console.log("Länge nach Setzen auf Null: " + resultDetails.length);
  resultDetails.push([0, null]);

  for (let index = lowerBound; index <= upperBound; index++) {
    try {
      url = pokeResultOfSearch[0].results[index].url;
    } catch {
      "url konnte nicht geladen werden an index " + index;
    }

    // Teile die URL anhand des Schrägstrichs ("/") auf
    let segments = url.split("/");

    // Die ID des Pokémon befindet sich im vorletzten Segment
    let pokemonId = segments[segments.length - 2];

    // let pokemonId = url.split('/').pop();
    console.log("PokemonID von URL: " + pokemonId);
    pokeImage = await fetch(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`
    );
    pokeType1 = null;
    pokeType2 = null;
    pokeHP = null;
    pokeAttack = null;
    pokeDefense = null;
    pokeSpAttack = null;
    pokeSpDefense = null;
    pokeSpeed = null;
    pokeWeight = null;

    detail = [
      pokeImage,
      pokeType1,
      pokeType2,
      pokeHP,
      pokeAttack,
      pokeDefense,
      pokeSpeed,
      pokeWeight,
    ];
    //let detail = await fetch(url);

    resultDetails.push([index, detail]);
    console.log(index);
  }

  console.log(resultDetails);
  console.log("Länge: ", resultDetails.length);
} // Ende get PokeDetails

function pokeIDFromURL(url){
  // Teile die URL anhand des Schrägstrichs ("/") auf
  let segments = url.split("/");

  // Die ID des Pokémon befindet sich im vorletzten Segment
  let pokemonId = segments[segments.length - 2];
  return pokemonId;
}

function renderOverviewCards() {
  let content = document.getElementById("cardRenderArea");
  content.innerHTML = "";

  for (let index = lowerBound; index <= upperBound; index++) {
    let pokeID = getPokeIDFromResultDetailsIndex(index)
    content.innerHTML += overviewCardHTML(pokeID, index);
  }
}

function getPokeIDFromResultDetailsIndex(index){
        url = pokeResultOfSearch[0].results[index].url;
        pokeID = pokeIDFromURL(url);
        return pokeID;
        
}

function calcRenderBoundaries() {
  lowerBound = getLowerBound();

  upperBound = getUpperBound();
}

function getLowerBound() {
  if ((actualPage - 1) * numbersOfPokemonsPerPage > 0) {
    return (actualPage - 1) * numbersOfPokemonsPerPage + 1;
  } else {
    return 1;
  }
}

function getUpperBound() {
  let bound = actualPage * numbersOfPokemonsPerPage;
  if (bound > pokeResultOfSearch[0].results.length) {
    return pokeResultOfSearch[0].results.length;
  } else {
    return bound;
  }
}

function renderPageProgress() {
  let content = document.getElementById("pageProgress");

  content.innerHTML = "";
  content.innerHTML += `${actualPage}/${totalPages}`;
}

function checkPageNumber() {
  if (totalPages == 0) {
    actualPage = 0;
  } else {
    actualPage = 1;
  }
}

function pageForward() {
  if (actualPage < totalPages) {
    actualPage++;
    renderAll();
  }
}

function pageBack() {
  if (actualPage > 1) {
    actualPage--;
    renderAll();
  }
}

function openModal(index) {
  modal = document.getElementById("modal");
  modal.classList.remove("noDisplay");
  renderModal(index);
}

function closeModal() {
  modal = document.getElementById("modal");
  modal.classList.add("noDisplay");
}

function renderModal(index) {
  if (pokeResultOfSearch[0].results[index]) {
    modal = document.getElementById("modalWrapper");
    modal.innerHTML = "";
    modal.innerHTML += modalConstructionHTML(index);
    renderModalCard(index);
  }
}

function renderModalCard(index) {
  modalCard = document.getElementById("modalMiddle");
  modalCard.innerHTML = "";
  modalCard.innerHTML += ModalCardHTML(index);
}

function doNotClose(event) {
  event.stopPropagation();
}

function clickLeft(index) {
  if (index > 1) {
    if (index <= lowerBound) pageBack();
    renderModal(index - 1);
  }
}

function clickRight(index) {
  if (index < pokeResultOfSearch[0].results.length) {
    if (index >= upperBound) pageForward();
    renderModal(index + 1);
  }
}

function getPokeDetailsFromStorage(pokeID){
  let pokeDetailsAsText = localStorage.getItem(`pokeID${pokeID}`);
  let pokeDetails;
  if (pokeDetailsAsText){
    pokeDetails = JSON.parse(pokeDetailsAsText);
    return pokeDetails;
  } else {console.log("Error in getPokeDetailsFromStorage")}
}

//HTML Templates

function ModalCardHTML(index) {
  return `
    <div id="modalCard${index}" class="modalCard" onclick="doNotClose(event)">
        <div class="upperModalCard">
            <div class="modalCardName">${pokeResultOfSearch[0].results[index].name}</div>
            <div>${index}</div>
            <div>lowerBound:${lowerBound} , upperBound:${upperBound}</div>
        </div>
        <div class="lowerModalCard">
        </div>
    </div>
    
    `;
}

function modalConstructionHTML(index) {
  return `
    <div id="modalLeft" class="modalButton" onclick="doNotClose(event), clickLeft(${index})">

    </div>
    <div id="modalMiddle">

    </div>
    <div id="modalRight" class="modalButton" onclick="doNotClose(event), clickRight(${index})">

    </div>
    `;
}

function overviewCardHTML(pokeID, index) {
  let pokeDetails = getPokeDetailsFromStorage(pokeID);
  

  if (pokeResultOfSearch[0].results[index]) {
    return `
        	<div class="overViewCard" id="${index}" onclick="openModal(${index})">
                    <div> Name:</div>
                    <div> ${pokeResultOfSearch[0].results[index].name}</div>
                    <div class="overviewCardImgRow"> <img class="overviewImage" src="${pokeDetails[1]}"></div>
                    <div> Index: ${index}</div>
            </div>
    `;
  } else {
    return "";
  }
}

//Daten

pokeResultOfSearch = [
  {
    results: [
      {
        name: "",
        url: "",
      },
    ],
  },
];
