const { getPokemonPictureUrlandName } = require("../downloader");

describe("retrieve a pokemon name and image URL", () => {
    //if id is 25, name sohould be pikachu and url should be 
    // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png

    let expectedImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
    let expectedJsonData = {
        name: "pikachu",
        sprites:{
            other:{
                "official-artwork": {
                    front_default: expectedImageUrl
                }
            }
        }
    }


    global.fetch = jest.fn(() => {
        console.log("Fetch has been replaced with a Jest mock");
        return new Promise((resolve, reject) => {
            // resolve(expectedJsonData);
            resolve({
                json: () => {
                    return Promise.resolve(expectedJsonData)
                }
            })
        })
    })

    test("if given an ID of 25, we expect pikachu and the correct Url", async() => {
        let result = await getPokemonPictureUrlandName(25);
        expect(result.imageUrl).toEqual(expectedImageUrl);
        expect(result.name).toEqual("pikachu");

    })
    
    afterEach(() => {
        global.fetch.mockClear();
    })


})