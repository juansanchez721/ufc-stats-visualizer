require('babel-polyfill')
const cheerio = require('cheerio') 

const axios = require('axios')
// const cheerio = require('cheerio') 
const page_url = 'https://www.ufc.com/athlete/khabib-nurmagomedov'

 async function getImgURL(name='conor-mcgregor') {
    debugger

    
    return await axios.get(`/fighters/image/${name}`)
    .then(res =>{
        // console.log(res.data.chicken)

    const $ = cheerio.load(res.data)
    const image = $('div.c-bio__image > img')
    
    console.log(image[0].attribs.src)
    return image[0].attribs.src

    })
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