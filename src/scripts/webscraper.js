require('babel-polyfill')
const cheerio = require('cheerio') 

const axios = require('axios')
// const cheerio = require('cheerio') 
const page_url = 'https://www.ufc.com/athlete/khabib-nurmagomedov'

 async function getImgURL(name='conor-mcgregor') {
    debugger

    let nameURL = name
    switch (name) {
        case "Daniel-Hooker":
            nameURL = "Dan-Hooker"
        case "Geoffery-Neol":
            nameURL = "Geoff-Neal"
        case "Alex-Volkanovski":
            nameURL = "Alexander-Volkanovski"
        case "Chan-Jung":
            nameURL = "Chan-sung-Jung"
            // break;
       
    }

    
    return await axios.get(`/fighters/image/${nameURL}`)
    .then(res =>{
        // console.log(res.data.chicken)

    const $ = cheerio.load(res.data)
    const image = $('div.c-bio__image > img')
    
    // console.log(image[0].attribs.src)
    return image[0].attribs.src

    })
    .catch(error => null)
    debugger
    // console.log(data)
    // const $ = cheerio.load(data)
    // const image = $('div.c-bio__image > img')
    
    // const yo = image.find.img
    // console.log(image[0].attribs.src)
    // return image[0].attribs.src

    // const { data } = await axios.get(page_url)
    debugger
    // const $ = cheerio.load(data)
    // const image = $('div.c-bio__image > img')
    
    // const yo = image.find.img
    // console.log(image[0].attribs.src)
    // return image[0].attribs.src
}



exports.getImgURL = getImgURL;