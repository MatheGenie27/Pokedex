let pokeIndex;

let pokeResultOfSearch;

let numbersOfPokemonsPerPage = 20;

let actualPage = 1;
let totalPages;

let upperBound;
let lowerBound;

async function init() {
  await getAllPokemons();
  filterPokemon('');
  renderAll();
}

async function getAllPokemons() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";

  try {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    pokeIndex = responseAsJson;
    console.log("PokeIndex:", pokeIndex, "geladen");
  } catch {
    console.log("pokeIndex konnte nicht geladen werden");
  }
}


async function filterPokemon(search) {
  
  if (search) {
    search = search.toLowerCase();
  }
  console.log(search);

  await updatePokeResultOfSearch(search);
  console.log(pokeResultOfSearch);
  calcTotalPages();
  checkPageNumber();
  renderAll();
}

function checkFilter() {
  console.log("checkFilter");
  input = getSearchInput();

  if (input.length > 2) {
    filterPokemon(input);
  } else if(input==""){filterPokemon('')} 
}

function getSearchInput(){
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
        console.log("pushen fehlgeschlagen");
      }
    }
  }
}

function calcTotalPages() {
  totalPages = 0;
  totalPages = Math.ceil((pokeResultOfSearch[0].results.length - 1) / 20);
}

function renderAll() {
  renderOverviewCards();
  renderPageProgress();
}

function renderOverviewCards() {
  calcRenderBoundaries();

  let content = document.getElementById("cardRenderArea");
  content.innerHTML = "";

  for (let index = lowerBound; index < upperBound; index++) {
    content.innerHTML += overviewCardHTML(index);
  }
}

function calcRenderBoundaries() {
  lowerBound = getLowerBound();

  upperBound = getUpperBound();
}

function getLowerBound() {
  if ((actualPage - 1) * numbersOfPokemonsPerPage > 0) {
    return (actualPage - 1) * numbersOfPokemonsPerPage;
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

function printCount() {
  console.log(pokeIndex.count);
}

function printResults() {
  console.log(pokeIndex.results);
}

function printNames() {
  for (let index = 0; index < pokeIndex.results.length; index++) {
    console.log(pokeIndex.results[index].name);
  }
}

//HTML Templates

function overviewCardHTML(index) {
  if (pokeResultOfSearch[0].results) {
    return `
        	<div class="overViewCard">
                Name: ${pokeResultOfSearch[0].results[index].name}
            </div>
    `;
  } else {
    return `<div>kein Pokemon gefunden<div>`;

    //return `
    //<div class="overViewCard">
    //Name: ${pokeIndex.results[index].name}
    //</div>`
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
