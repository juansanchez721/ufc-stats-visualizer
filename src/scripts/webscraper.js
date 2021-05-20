require('babel-polyfill')
const cheerio = require('cheerio') 

const axios = require('axios')
// const cheerio = require('cheerio') 
// const page_url = 'https://www.ufc.com/athlete/khabib-nurmagomedov'

 async function getImgURL(name) {

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

    const $ = cheerio.load(res.data)
    const tempImage = $('#block-mainpagecontent > div > div > div.l-main__content > div.l-container--no-spacing-vertical-bottom > div > div > div > div.c-bio__image > img')
    const image = $('div.c-bio__image > img')
    debugger
    return image[0].attribs.src

    })
    .catch(error => null)
}


async function getStats(name='conor-mcgregor') {
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
    const $ = cheerio.load(res.data)

    const nicknameDiv = $('div.c-hero--full__headline-prefix')
    const statsDiv =$('dd.c-overlap__stats-value')
    const firstreach = $("#block-mainpagecontent > div > div > div.l-main__content > div.l-container--no-spacing-vertical-bottom > div > div > div > div.c-bio__info > div.c-bio__info-details > div:nth-child(5) > div:nth-child(2) > div.c-bio__text")
    const secondreach = $("#block-mainpagecontent > div > div > div.l-main__content > div.l-container--no-spacing-vertical-bottom > div > div > div > div.c-bio__info > div.c-bio__info-details > div:nth-child(4) > div:nth-child(2) > div.c-bio__text")
    const recordDiv = $("div.c-hero__header")
        // debugger
    let temp = recordDiv[0].children[5].children[0].data.split("•")[1]
    let record = temp ? temp.split(" ")[29] : recordDiv[0].children[5].children[0].data.split("•")[0]
    // debugger
    let reach = firstreach[0] ? firstreach[0].children[0].data : secondreach[0].children[0].data
    // debugger
    let nicknameText = ""
    // debugger
    if (nicknameDiv[0].children.length){
        // debugger
        const nickname = nicknameDiv.find('div')
        nicknameText = nickname[0].children[0].data.split('"')[1]
    } 
    // debugger

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
        // console.log(strikes)
        // debugger
        return strikes
})
    .catch(error =>{

        return null
    }
        )


}

exports.getImgURL = getImgURL;
exports.getStats = getStats;