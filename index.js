const {downloadPokemonPicture} = require("./downloader.js")

// returns a promise

downloadPokemonPicture().then(savedFileOutput => {
    console.log("New image is saved to: " + savedFileOutput)
}).catch(error => {
    console.log(error)
})

async function exampleDownload(){
    let savedFileOutput = await downloadPokemonPicture();
    console.log("New image is saved to: " + savedFileOutput);

}

