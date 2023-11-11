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
    //

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
    
    if (response.status === "404") {
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

}

module.exports = {
    downloadPokemonPicture,
    getRandomPokemonPictureURL,
    savePokemonPictureToDisk,
    getRandomPokemonId
}