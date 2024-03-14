



let pokeIndex;

async function init(){
   let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
   
    try {
        
        let response = await fetch(url);
        let responseAsJson = await response.json();
        pokeIndex = responseAsJson;
        console.log('PokeIndex:' ,pokeIndex);
        
    }catch{
        console.log("pokeIndex konnte nicht geladen werden")
    }  

    renderOverviewCards();

}


function renderOverviewCards(){
    content = document.getElementById('mainContent');
    content.innerHTML = '';

    for (let index = 0; index < pokeIndex.results.length; index++) {
        content.innerHTML += overviewCardHTML(index);
        
    }

}





function printCount(){
    console.log(pokeIndex.count)
}


function printResults(){
    console.log(pokeIndex.results)
}

function printNames(){
    for (let index = 0; index < pokeIndex.results.length; index++) {
        console.log(pokeIndex.results[index].name)
        
    }
}


//HTML Templates

function overviewCardHTML(index){
    return `
        	<div class="overViewCard">
                Name: ${pokeIndex.results[index].name}
            </div>
    `;
}
