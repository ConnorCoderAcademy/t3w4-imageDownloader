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


function downloadPokemonPicture(targetId = getRandomPokemonId()){

}

//generate random number between 1 and 1017 (number of Pokemons)
function getRandomPokemonId(){

}

//retrieve Pokemon Data for that number
//Retrieve the image url from that pokemon data 
async function getRandomPokemonPictureURL(targetId = getRandomPokemonId()){

}

//download the image and save to the computer 
//return the downloader image's file path
async function savePokemonPictureToDisk(targetUrl, targetDownloadFileName, targetDownloadDirectory = "."){

}

module.exports = {
    downloadPokemonPicture,
    getRandomPokemonPictureURL,
    savePokemonPictureToDisk,
    getRandomPokemonId
}