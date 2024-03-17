//Daten Variablen

let pokeIndex;

let pokeResultOfSearch;

let numbersOfPokemonsPerPage = 20;

let actualPage = 1;
let totalPages;

let upperBound;
let lowerBound;

let resultDetails = [];

//ChartVariablen

const TYPE = "bar";
const LABEL = "";
const LABELS = [
  "HITPOINTS",
  "ATTACK",
  "DEFENSE",
  "SP-ATTACK",
  "SP-DEFENSE",
  "SPEED",
];
const BACKGROUNDCOLOR = [
  "rgba(168, 167, 122, 0.2)", // Normal
  "rgba(238, 129, 48, 0.2)", // Fire
  "rgba(99, 144, 240, 0.2)", // Water
  "rgba(122, 199, 76, 0.2)", // Grass
  "rgba(247, 208, 44, 0.2)", // Electric
  "rgba(192, 48, 40, 0.2)", // Fighting
];
const BORDERCOLOR = [
  "rgba(168, 167, 122, 1)", // Normal
  "rgba(238, 129, 48, 1)", // Fire
  "rgba(99, 144, 240, 1)", // Water
  "rgba(122, 199, 76, 1)", // Grass
  "rgba(247, 208, 44, 1)", // Electric
  "rgba(192, 48, 40, 1)", // Fighting
];

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
