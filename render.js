async function renderAll() {
  calcRenderBoundaries();

  renderOverviewCards();
  renderPageProgress();
  hidePageButtons();
}

async function renderOverviewCards() {
  let content = document.getElementById("cardRenderArea");
  content.innerHTML = "";

  for (let index = lowerBound; index <= upperBound; index++) {
    let pokeID = getPokeIDFromResultDetailsIndex(index);
    
    if (index < pokeResultOfSearch[0].results.length) {
      console.log("if Bedingung");

      if (isLocal(pokeID)) {
        content.innerHTML += overviewCardHTML(pokeID, index);
        renderOverviewCardsDetails(pokeID, index);
      } else {
        //PokeDetails liegen noch nicht lokal vor

        await saveLocal(pokeID);
        content.innerHTML += overviewCardHTML(pokeID, index);
        renderOverviewCardsDetails(pokeID, index);
      }
    }
  }
}

function renderTypeContainer(pokeID, type1, type2, type) {
  let content = document.getElementById(`overviewCardTypeContainer${pokeID}`);
  content.innerHTML = "";
  if (type == 2) {
    content.innerHTML += TypeContainerHTML2(type1, type2);
  } else {
    content.innerHTML += TypeContainerHTML1(type1);
  }
}

function renderPageProgress() {
  let content = document.getElementById("pageProgress");

  content.innerHTML = "";
  content.innerHTML += `${actualPage} / ${totalPages}`;
}

async function renderModal(index) {
  if (pokeResultOfSearch[0].results[index]) {
    modal = document.getElementById("modalWrapper");
    modal.innerHTML = "";
    modal.innerHTML += modalConstructionHTML(index);
    let pokeID = getPokeIDFromResultDetailsIndex(index);
    hideModalButton(index);
    if (isLocal(pokeID)) {
      renderModalCard(index);
      renderModalCardDetails(index);
    } else {
      //PokeDetails liegen noch nicht lokal vor

      await saveLocal(pokeID);
      renderModalCard(index);
      renderModalCardDetails(index);
    }
  }
}

function renderModalCardDetails(index) {
  let pokeId = getPokeIDFromResultDetailsIndex(index);
  let pokeDetails = getPokeDetailsFromStorage(pokeId);
  let type = getAmountOfTypes(pokeDetails);
  let type1 = pokeDetails[2];
  let type2 = pokeDetails[3];

  renderModalTypeContainer(pokeId, type1, type2, type);
  addModalCardBackground(pokeID, type1);
  addModalCardBorder(pokeID, type2);
  renderModalCardStats(pokeDetails, pokeID);
}

function renderModalCardStats(pokeDetails, pokeID) {
  let data = getStatsData(pokeDetails);

  const ctx = document.getElementById(`modalStatsContentChart${pokeID}`);
  Chart.defaults.font.size = 10;
  new Chart(ctx, {
    type: TYPE,
    data: {
      labels: LABELS,
      datasets: [
        {
          label: LABEL,
          data: data,
          borderWidth: 1,
          backgroundColor: BACKGROUNDCOLOR,
          borderColor: BORDERCOLOR,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          max: 150,
        },
      },
    },
  });
}

function renderModalCard(index) {
  let pokemonId = getPokeIDFromResultDetailsIndex(index);
  modalCard = document.getElementById("modalMiddle");
  modalCard.innerHTML = "";
  modalCard.innerHTML += ModalCardHTML(index);
}
