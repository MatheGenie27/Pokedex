//HTML Templates

function ModalCardHTML(index) {
  let pokeId = getPokeIDFromResultDetailsIndex(index);
  let pokeDetails = getPokeDetailsFromStorage(pokeId);
  if (pokeDetails[1] == null) {
    pokeDetails[1] = "./img/question.png";
  }

  return `
      <div id="modalCard${pokeId}" class="modalCard" onclick="doNotClose(event)">
  
          <div class="upperModalCard" id="upperModalCard${pokeID}">
              <div class="modalCardName">${pokeResultOfSearch[0].results[index].name}</div>
              <div class= "modalTypeRow" id="modalTypeRow${pokeID}">Typ Typ </div>
              <div class="modalImageRow"><img class="modalImage"src=${pokeDetails[1]}> </div> 
          </div>
  
          <div class="lowerModalCard" id="lowerModalCard${pokeID}">
              <div class="modalStatsHeader">Pokemon Stats</div>
              <div class="modalStatsContent" id="modalStatsContent${pokeID}">
              <canvas class="modalStatsContentChartCanvas" id="modalStatsContentChart${pokeID}"></canvas></div>
          </div>
      </div>
      
      `;
}

function modalConstructionHTML(index) {
  return `
      <div id="modalLeft" class="modalButton" onclick="doNotClose(event), clickLeft(${index})">
          <img class="modalPageImg" id="modalLeftImg" src="./img/arrow-alt-circle-left.png">
      </div>
      <div id="modalMiddle">
  
      </div>
      <div id="modalRight" class="modalButton" onclick="doNotClose(event), clickRight(${index})">
      <img class="modalPageImg" id="modalRightImg"src="./img/arrow-alt-circle-right.png">
      </div>
      `;
}

function overviewCardHTML(pokeID, index) {
  let pokeDetails = getPokeDetailsFromStorage(pokeID);

  return `
              <div class="overViewCard" id="overviewCard${pokeID}" onclick="openModal(${index})">
                                  
                  <div class="overViewCardNameRow"> ${pokeDetails[0]}</div>
                        
  
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
}

function TypeContainerHTML1(type1) {
  return `
    <div class="overviewCardType">
        ${type1}
    </div>
    `;
}

function TypeContainerHTML2(type1, type2) {
  return `
    <div class="overviewCardType"> ${type1}    </div>
    <div class="overviewCardType"> ${type2}</div>
    `;
}
