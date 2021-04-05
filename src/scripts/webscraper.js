require('babel-polyfill')
const cheerio = require('cheerio') 

const axios = require('axios')
// const cheerio = require('cheerio') 
const page_url = 'https://www.ufc.com/athlete/khabib-nurmagomedov'

 async function getImgURL(name='conor-mcgregor') {
    debugger

    let nameURL = name
    switch (name) {
        case "DANIEL-HOOKER":
            nameURL = "Dan-Hooker"
            break;
        case "GEOFFERY-NEAL":
            nameURL = "Geoff-Neal"
            break;
        case "ALEX-VOLKANOVSKI":
            nameURL = "Alexander-Volkanovski"
            break;
        case "CHAN-JUNG":
            nameURL = "Chan-sung-Jung"
            break;
       
    }

    
    return await axios.get(`/fighters/image/${nameURL}`)
    .then(res =>{
        // console.log(res.data.chicken)

    const $ = cheerio.load(res.data)
    const image = $('div.c-bio__image > img')
    
    // console.log(image)
    return image[0].attribs.src

    })
    .catch(error => null)
}


async function getStats(name='conor-mcgregor') {

    return await axios.get(`/fighters/image/${name}`)
    .then(res =>{
        // console.log(res.data)

    const $ = cheerio.load(res.data)

    // const nicknameDiv = $('div.c-hero--full__headline-prefix')
    // const nickname = nicknameDiv.find('div')
    // console.log(nickname[0].children[0])
    // return nickname[0].children[0]
    
    const statsDiv =$('dd.c-overlap__stats-value')
    // console.log(statsDiv.find('dd'))
        // console.log(statsDiv[0].children)
        console.log(statsDiv[0].children[0].data)
        console.log(statsDiv[1].children[0].data)
        console.log(statsDiv[2].children.length ? statsDiv[2].children[0].data :  null)
        console.log(statsDiv[3].children[0].data)


})
    .catch(error =>{

        return null
    }
        )


}

exports.getImgURL = getImgURL;
exports.getStats = getStats;