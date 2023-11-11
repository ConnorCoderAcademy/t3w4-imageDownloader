// Synchronous library for doing filo IO
const fs = require("node:fs");

//Asynchronous function, making a directory can take time
const{ mkdir } = require("node:fs/promises");

//Streaming data, safer than traditional saving/downloading/etc
// Synchronous, so we wait and it is blocking
const { Readable } = require("node:stream");

// Wait for streaming to finish, it can take time, so it should be a promise
// It shouldn't be blocking, let's handle this with promise instead of async/await
const { finished } = require("node:stream/promises");

// Node file & directory path helper system
// /folder/subfolder/filename.png
const path = require("node:path");

const API_URL_BASE = "https://pokeapi.co/api/v2/pokemon/"

function downloadPokemonPicture (targetId = getRandomPokemonId()){
    return new Promise (async (resolve, reject) => {
        try {
            //step 1: get the image URL
            let newPokemon = await getPokemonPictureUrlandName(targetId);
            //step 2: do the download
            //option 1: hardcoded filename to ExampleImage
            //let saveFileLocation = await savePokemonPictureToDisk(newUrl, "ExampleImage.png", "storage");
            //option2: Pokemon + id, not identifiable, we want the name 
            //let saveFileLocation = await savePokemonPictureToDisk(newUrl, `Pokemon${targetId}.png`, "storage");
            
            //option 3: pokemon name.png as we wanted, a second fetch though
            // let response = await fetch(API_URL_BASE + targetId)
            // let data = await response.json();
        
            // let saveFileLocation = await savePokemonPictureToDisk(newUrl, `${data.name}.png`, "storage");
            
            //Option 4, changed the first fetch and returns an object with the name and image URL
            let saveFileLocation = await savePokemonPictureToDisk(newPokemon.imageUrl, `${newPokemon.name}.png`, "storage");

            resolve(saveFileLocation);
        } catch (error) {
            reject (error);
        }
        
    })
}

// Generate a random number between 1 and 1017 (number of Pokemons ???)
function getRandomPokemonId(){
    return Math.floor(Math.random() * 1017) +1;
}

//Retrieve Pokemon data for that number
//Retrieve the image url from that Pokemon data
async function getPokemonPictureUrlandName(targetId = getRandomPokemonId()){
    //Retrieve the API data
    let response = await fetch(API_URL_BASE + targetId).catch(error => {
        throw new Error("API failure");
    });

    if (response.status == "404") {
        throw new Error("API did not have data for the requested ID")
    };

    //Convert the response into usable JSON
    let data = await response.json().catch(error => {
        throw new Error("API did not return valid JSON");
    })

    // it contains unnecessary variables
    // let imageURL = data.sprites.other["official-artwork"].front_default;
    // return imageURL;

    // // Optimised return
    // return data.sprites.other["official-artwork"].front_default;
    return {
        name: data.name,
        imageUrl: data.sprites.other["official-artwork"].front_default
    }

}

//Download that image and save it to the computer
// Return the downloader image's file path
async function savePokemonPictureToDisk(targetUrl, targetDownloadFilename, targetDownloadDirectory = "."){
    //fetch request to the imageURL
    let imageData = await fetch(targetUrl).catch(error => {
        throw new Error("Image failed to download");
    });

    // Check if Target Directory exists
    if (!fs.existsSync(targetDownloadDirectory)){
        // Make  a directory if we need to
        await mkdir(targetDownloadDirectory);
    }

    // Create a JS-friendly file path
    let fullFileDestination = path.join(targetDownloadDirectory, targetDownloadFilename);
    
    // Stream the image from the fetch to the computer
    let fileDownloadStream = fs.createWriteStream(fullFileDestination);

    // get data as bytes from the web request,  --- pipe the bytes into the hard drive
    await finished(Readable.fromWeb(imageData.body).pipe(fileDownloadStream)).catch(error => {
        throw new Error("Failed to save content to disk")
    });
    //return the saved image location
    return fullFileDestination;
}

module.exports = {
    downloadPokemonPicture,
    getPokemonPictureUrlandName,
    savePokemonPictureToDisk,
    getRandomPokemonId
}