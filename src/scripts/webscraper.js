require('babel-polyfill')

const axios = require('axios')
const cheerio = require('cheerio') 
const page_url = 'https://www.ufc.com/athlete/khabib-nurmagomedov'

async function getImgURL() {
    debugger
    const { data } = await axios.get('/fighters/image')
    debugger
    const $ = cheerio.load(data)
    const image = $('div.c-bio__image > img')
    
    // const yo = image.find.img
    console.log(image[0].attribs.src)
    return image[0].attribs.src
}



exports.getImgURL = getImgURL;