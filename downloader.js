//synchronous library for doing file IO
const fs = require("node:fs");

//Asynchronous function, making a directory can take time 
const { mkdir } = require("node:fs/promises");

//streaming data, safer than traditional saving/downloading/etc
//synchronous, so we wait and it is blocking 
const { Readable } = require("node:stream");

//wait for streaming to finish, it can take time, so it should be a promise
//should not be blocking, let's handle this with promise instead of async/await
const { finished } = require("node:stream/promises");

// node file & directory path helper system 
// /folder/subfolder/filename.png etc
const path = require("node:path");

const API_URL_BASE = "https://pokeapi.co/api/v2/pokemon/"


function downloadPokemonPicture(targetId = getRandomPokemonId()){
    return new Promise (async (resolve, reject) => {
        try {
            //step 1: get image URL 
        let newUrl = await getRandomPokemonPictureURL(targetId)
        let response = await fetch(API_URL_BASE + targetId);
        let data = await response.json();

        //step 2: do the download
        let saveFileLocation = await savePokemonPictureToDisk(newUrl, `${data.name}.png`, "storage");
        resolve(saveFileLocation);

        } catch (error) {
            reject(error);
        }
    })

}

//generate random number between 1 and 1017 (number of Pokemons)

function getRandomPokemonId(){
    return Math.floor(Math.random() * 1017) +1;

}

//retrieve Pokemon Data for that number
//Retrieve the image url from that pokemon data 

async function getRandomPokemonPictureURL(targetId = getRandomPokemonId()){
    //Retrieve API data
    let response = await fetch(API_URL_BASE + targetId).catch(error => {
        throw new Error("API failure");

    });
    
    if (response.status == "404") {
        throw new Error("API did not have data for the requested ID")
    };

    //Convert response into usable JSON
    let data = await response.json().catch(error => {
        throw new Error("API did not return valid JSON");
    });

    //Could store to an "image URL" variable if wanted 
    return data.sprites.other["official-artwork"].front_default;


}

//download the image and save to the computer 
//return the downloader image's file path

async function savePokemonPictureToDisk(targetUrl, targetDownloadFileName, targetDownloadDirectory = "."){
    //fetch request to the image URL
    let imageData = await fetch(targetUrl).catch(error => {
        throw new Error("Image failed to download")
    });
    //check if target directory exists, make directory if needed
    if (!fs.existsSync(targetDownloadDirectory)) {
        await mkdir(targetDownloadDirectory)
    }

    //create a JS-friendly file path
    let fullFileDestination = path.join(targetDownloadDirectory, targetDownloadFileName);

    //stream the image from the fetch to the computer
    let fileDownloadStream = fs.createWriteStream(fullFileDestination);

    // get data as bytes from the web request, ---- pipe the bytes into the hard drive
    await finished(Readable.fromWeb(imageData.body).pipe(fileDownloadStream)).catch(error => {
        throw new Error("Failed to save content to disk")
    })

    //return the saved image location
    return fullFileDestination
}

module.exports = {
    downloadPokemonPicture,
    getRandomPokemonPictureURL,
    savePokemonPictureToDisk,
    getRandomPokemonId
}