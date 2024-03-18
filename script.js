//Funktionen

async function init() {
  waitMessage();
  await getAllPokemonsOverview();
  getCompletePokemonAPI();
  filterPokemon("");
}

function waitMessage() {
  document.getElementById(
    "cardRenderArea"
  ).innerHTML = `<div>Pokemon Index wird geladen. Einen Moment bitte.<br>Je nach Internetgeschwindigkeit und Auslastung der öffentlich API kann dies einige Minuten dauern. </div>`;
}

async function getCompletePokemonAPI() {
  for (let i = 0; i < pokeIndex.results.length; i++) {
    try {
      url = pokeIndex.results[i].url;
    } catch {
      console.log("url konnte nicht geladen werden an PokeIndex " + i);
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
      localStorage.setItem(`pokeID${id}`, essentialDetailsAsText);
    }
  }
}

function extractEssentialInformation(element) {
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

  if (element.types[1]) {
    if (element.types[1].type.name) {
      pokeType2 = element.types[1].type.name;
    }
  } else {
    pokeType2 = null;
  }

  if (pokeImage == null){
    pokeImage = "./img/question.png";
  }

  info = [
    pokeName,
    pokeImage,
    pokeType1,
    pokeType2,
    pokeHP,
    pokeAttack,
    pokeDefense,
    pokeSpAttack,
    pokeSpDefense,
    pokeSpeed,
    pokeWeight,
  ];
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

function pokeIDFromURL(url) {
  let segments = url.split("/");
  let pokemonId = segments[segments.length - 2];
  return pokemonId;
}

function renderOverviewCardsDetails(pokeID, index) {
  let pokeDetails = getPokeDetailsFromStorage(pokeID);
  let type = getAmountOfTypes(pokeDetails);
  let type1 = pokeDetails[2];
  let type2 = pokeDetails[3];
  renderTypeContainer(pokeID, type1, type2, type);
  addOverviewCardBackground(pokeID, type1);
}

function getAmountOfTypes(pokeDetails) {
  if (pokeDetails[2] && pokeDetails[3]) {
    return 2;
  } else {
    return 1;
  }
}

function addOverviewCardBackground(pokeID, type1) {
  element = document.getElementById(`overviewCard${pokeID}`);
  element.classList.add(type1);
}

function getPokeIDFromResultDetailsIndex(index) {
  try {
    url = pokeResultOfSearch[0].results[index].url;
  } catch {}

  if (url) {
    pokeID = pokeIDFromURL(url);
  }
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

function addModalCardBorder(pokeID, type2) {
  element = document.getElementById(`modalCard${pokeID}`);
  if (type2 == null) {
    element.classList.add("noBorder");
  }
  element.classList.add(`${type2}-border`);
}

function addModalCardBackground(pokeID, type1) {
  element = document.getElementById(`modalCard${pokeID}`);
  element.classList.add(type1);
}

function renderModalTypeContainer(pokeID, type1, type2, type) {
  let content = document.getElementById(`modalTypeRow${pokeID}`);
  content.innerHTML = "";
  if (type == 2) {
    content.innerHTML += TypeContainerHTML2(type1, type2);
  } else {
    content.innerHTML += TypeContainerHTML1(type1);
  }
}

function getStatsData(pokeDetails) {
  let data = [
    pokeDetails[4],
    pokeDetails[5],
    pokeDetails[6],
    pokeDetails[7],
    pokeDetails[8],
    pokeDetails[9],
  ];

  return data;
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

function getPokeDetailsFromStorage(pokeID) {
  let pokeDetailsAsText = localStorage.getItem(`pokeID${pokeID}`);
  let pokeDetails;
  if (pokeDetailsAsText) {
    pokeDetails = JSON.parse(pokeDetailsAsText);
    return pokeDetails;
  } else {
    console.log("Error in getPokeDetailsFromStorage");
  }
}

function hideModalButton(index) {
  if (index == 1) {
    document.getElementById("modalLeft").classList.add("noDisplay");
    document.getElementById("modalLeftImg").classList.add("noDisplay");
  } else {
    document.getElementById("modalLeft").classList.remove("noDisplay");
    document.getElementById("modalLeftImg").classList.remove("noDisplay");
  }

  if (index == pokeResultOfSearch[0].results.length-1) {
    document.getElementById("modalRight").classList.add("noDisplay");
    document.getElementById("modalRightImg").classList.add("noDisplay");
  } else {
    document.getElementById("modalRight").classList.remove("noDisplay");
    document.getElementById("modalRightImg").classList.remove("noDisplay");
  }
}

function hidePageButtons() {
  hidePageBackButtons();

  hidePageForwardButtons();
}

function hidePageBackButtons() {
  if (actualPage == 1) {
    document.getElementById("buttonPageBackImage").classList.add("noDisplay");
    document.getElementById("buttonPageBackImage2").classList.add("noDisplay");
  } else {
    document
      .getElementById("buttonPageBackImage")
      .classList.remove("noDisplay");
    document
      .getElementById("buttonPageBackImage2")
      .classList.remove("noDisplay");
  }
}

function hidePageForwardButtons() {
  if (actualPage == totalPages) {
    document
      .getElementById("buttonPageForwardImage")
      .classList.add("noDisplay");
    document
      .getElementById("buttonPageForwardImage2")
      .classList.add("noDisplay");
  } else {
    document
      .getElementById("buttonPageForwardImage")
      .classList.remove("noDisplay");
    document
      .getElementById("buttonPageForwardImage2")
      .classList.remove("noDisplay");
  }
}
