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
  waitMessage();
  await getAllPokemonsOverview();
  await getCompletePokemonAPI();
  filterPokemon("");
  ;
}

function waitMessage(){
  document.getElementById('cardRenderArea').innerHTML = `<div>Pokemon Index wird geladen. Einen Moment bitte.</div>`
}

async function getCompletePokemonAPI() {
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
    await saveLocal(pokemonId);
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
  

  await updatePokeResultOfSearch(search);
  
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
  
  renderOverviewCards();
  renderPageProgress();
}



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
    renderOverviewCardsDetails(pokeID, index);



  }


}



function renderOverviewCardsDetails(pokeID, index){
  let pokeDetails = getPokeDetailsFromStorage(pokeID);
   
    let type = getAmountOfTypes(pokeDetails);
    let type1= pokeDetails[2];
    let type2 = pokeDetails[3];
    renderTypeContainer(pokeID,type1, type2, type);
    addOverviewCardBackground(pokeID, type1);

    
  
}

function getAmountOfTypes(pokeDetails){
    if (pokeDetails[2]&&pokeDetails[3]){
      return 2;
    } else{ return 1;}

}


function renderTypeContainer(pokeID,type1, type2, type){
    let content = document.getElementById(`overviewCardTypeContainer${pokeID}`);
    content.innerHTML = '';
    if (type==2){
      content.innerHTML += TypeContainerHTML2(type1, type2);
    } else {
      content.innerHTML += TypeContainerHTML1(type1);
    }
}


function TypeContainerHTML1(type1){
  return `
  <div class="overviewCardType">
      ${type1}
  </div>
  `;
}


function TypeContainerHTML2(type1, type2){
  return `
  <div class="overviewCardType"> ${type1}    </div>
  <div class="overviewCardType"> ${type2}</div>
  `;
}


function addOverviewCardBackground(pokeID, type1){
  element= document.getElementById(`overviewCard${pokeID}`);
  element.classList.add(type1);
}




function getPokeIDFromResultDetailsIndex(index){
        try{url = pokeResultOfSearch[0].results[index].url;}
        catch{}

        if(url){pokeID = pokeIDFromURL(url);}
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
  scrollToTop();
  document.body.style.overflow = "hidden";
}

function scrollToTop() {
  window.scrollTo({
      top: 0,
       
  });
}


function closeModal() {
  modal = document.getElementById("modal");
  modal.classList.add("noDisplay");
  document.body.style.overflow = "auto";
}

function renderModal(index) {
  if (pokeResultOfSearch[0].results[index]) {
    modal = document.getElementById("modalWrapper");
    modal.innerHTML = "";
    modal.innerHTML += modalConstructionHTML(index);
    renderModalCard(index);
    renderModalCardDetails(index);
  }
}

function renderModalCardDetails(index){
  let pokeId = getPokeIDFromResultDetailsIndex(index);
  let pokeDetails = getPokeDetailsFromStorage(pokeId);      
  let type = getAmountOfTypes(pokeDetails);
  let type1= pokeDetails[2];
  let type2 = pokeDetails[3];
  
          renderModalTypeContainer(pokeId,type1, type2, type);
          addModalCardBackground(pokeID, type1);
          addModalCardBorder(pokeID,type2);
       
}

function addModalCardBorder(pokeID, type2){
    element=document.getElementById(`modalCard${pokeID}`);
    if(type2==null){element.classList.add('noBorder')};
    element.classList.add(`${type2}-border`);
  
}


 function addModalCardBackground(pokeID, type1){
            element= document.getElementById(`modalCard${pokeID}`);
            element.classList.add(type1);
          }


function renderModalTypeContainer(pokeID,type1, type2, type){
  let content = document.getElementById(`modalTypeRow${pokeID}`);
  content.innerHTML = '';
  if (type==2){
    content.innerHTML += TypeContainerHTML2(type1, type2);
  } else {
    content.innerHTML += TypeContainerHTML1(type1);
  }
}



function renderModalCard(index) {
  let pokemonId = getPokeIDFromResultDetailsIndex(index); 
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
  let pokeId = getPokeIDFromResultDetailsIndex(index);
  let pokeDetails = getPokeDetailsFromStorage(pokeId);
  return `
    <div id="modalCard${pokeId}" class="modalCard" onclick="doNotClose(event)">

        <div class="upperModalCard" id="upperModalCard${pokeID}">
            <div class="modalCardName">${pokeResultOfSearch[0].results[index].name}</div>
            <div class= "modalTypeRow" id="modalTypeRow${pokeID}">Typ Typ </div>
            <div class="modalImageRow"><img class="modalImage"src=${pokeDetails[1]}> </div> 
        </div>

        <div class="lowerModalCard" id="lowerModalCard${pokeID}">
            <div class="modalStatsHeader">Pokemon Stats</div>
            <div class="modalStatsContent">StatsContnet </div>
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
        	<div class="overViewCard" id="overviewCard${pokeID}" onclick="openModal(${index})">
                                
                <div> ${pokeResultOfSearch[0].results[index].name}</div>
                      

                  <div class="overviewCardImgRow"> 
                    <div class="overviewCardTypeContainer"  id="overviewCardTypeContainer${pokeID}">
                        <div class="overViewCardType">Typ1</div>
                        <div class="overViewCardType">Typ2</div>
                    </div>
                    <img class="overviewImage" src="${pokeDetails[1]}">
                  </div>

                <div> ID: ${pokeID}</div>

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
