

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
}


function printCount(){
    console.log(pokeIndex.count)
}