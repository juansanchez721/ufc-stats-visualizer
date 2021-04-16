require('babel-polyfill')
const cheerio = require('cheerio') 

const axios = require('axios')
// const cheerio = require('cheerio') 
// const page_url = 'https://www.ufc.com/athlete/khabib-nurmagomedov'

 async function getImgURL(name='conor-mcgregor') {
    // debugger

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
        debugger
    const $ = cheerio.load(res.data)

    const nicknameDiv = $('div.c-hero--full__headline-prefix')
    const statsDiv =$('dd.c-overlap__stats-value')
    const firstreach = $("#block-mainpagecontent > div > div > div.l-main__content > div.l-container--no-spacing-vertical-bottom > div > div > div > div.c-bio__info > div.c-bio__info-details > div:nth-child(5) > div:nth-child(2) > div.c-bio__text")
    const secondreach = $("#block-mainpagecontent > div > div > div.l-main__content > div.l-container--no-spacing-vertical-bottom > div > div > div > div.c-bio__info > div.c-bio__info-details > div:nth-child(4) > div:nth-child(2) > div.c-bio__text")
    const recordDiv = $("div.c-hero__header")

    debugger
    let record = recordDiv[0].children[5].children[0].data.split("•")[1].split(" ")[29]
    // console.log(firstreach)
    // console.log(secondreach)
    let reach = firstreach[0] ? firstreach[0].children[0].data : secondreach[0].children[0].data
    debugger
    let nicknameText = ""
    if (nicknameDiv[0].children.length){
        debugger
        const nickname = nicknameDiv.find('div')
        // debugger
        nicknameText = nickname[0].children[0].data.split('"')[1]
        // console.log(nicknameText)
    //   debugger  
    } 

        debugger
     let strikes = {
            nickname: nicknameText ,
            reach,
            record,
                        // height: height[0].children ? height[0].children[0].data : sheight[0].children[0].data,
            strikesLanded: statsDiv[0] && statsDiv[0].children.length ? statsDiv[0].children[0].data : "0",
            strikesAttempted: statsDiv[1] && statsDiv[1].children.length ? statsDiv[1].children[0].data : "0",
            takedownsLanded: statsDiv[2] && statsDiv[2].children.length ? statsDiv[2].children[0].data :  "0",
            takedownsAttempted: statsDiv[3] && statsDiv[3].children.length ? statsDiv[3].children[0].data : "0"
        }
        debugger
        console.log(strikes)
        // console.log(strikes.takedownsLanded)
        // console.log(strikes.takedownsAttempted)
        return strikes
})
    .catch(error =>{

        return null
    }
        )


}

exports.getImgURL = getImgURL;
exports.getStats = getStats;