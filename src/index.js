import "./styles/index.scss";
import "./styles/reset.scss"
require('babel-polyfill')

// import * as WebScrap from './scripts/webscraper'
const nah = require('./scripts/webscraper')

import Card from './scripts/card'
// const Card = require('./scripts/card');

// function testfunction() {
//     console.log("test message")
// }

// testfunction()

// function getData() {
//     fetch('http://api.sportradar.us/ufc/trial/v2/en/rankings.json?api_key=wjvfbsmrqxd6gfjgqu9mdkv3')
//     .then(response => {
//         return response.json()
//     })
//     .then(fighters => {
//         fighters.rankings.forEach(element => {
//             console.log(element.name);
            
//         });
//     })
// }

// getData();
const axios = require('axios');

document.addEventListener('DOMContentLoaded', () => {
    // let yo = document.getElementsByClassName('each-fighter')
    // for(let i = 0; i< yo.length; i++) {
    //     yo[i].addEventListener("click", () => flipCard(yo[i].id, i))
    // }
    // nah.getImgURL();

    axios.get(`/rankings`)
    .then((response) => {
        debugger
        const rankings = response.data.rankings
        getRankings(rankings)
    })
    .catch(function (error) {
        debugger
        console.log(error.response);
    })

    // let query = "grace hopper";
    // axios.get(`/search?string=${query}`)
    // .then((response) => {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
    
})

let testobject = {}
let cards = {}
function getRankings(rankings) {

    // var mainContainer = document.getElementById("navbar");
    let dropdown = document.getElementById("weight-classes")
    // console.log(rankings)
    // dropdown.setAttribute("id", "weight-classes")
    for (var i = 0; i < rankings.length; i++) {

        let division = rankings[i].name.split("_").join(" ") //weight class name
        // console.log(division)
        let competitorArray = Object.values(rankings[i].competitor_rankings)
        testobject[division]= competitorArray
        // console.log(competitorArray)
        // let competitors = rankings[i].competitor_rankings.map(rank => { //get fighters for this ranking
        //     return rank.competitor 
        // })
        // console.log(competitors)

        // let info = []
        // competitors.forEach(fighter => {
        //     // console.log(fighter.name)
        //         info.push(fighter.name) //names only
        //     }   
        //     )
            // console.log(info)    
                dropdown.appendChild(new Option(`${division}`, `${division}` ));
    }
    console.log(testobject)
  
            dropdown.addEventListener('change', (e) => getFighters(e.target.value))
            // mainContainer.append(dropdown)
}


const getFighters = async (division) => {
    cards = {}
    debugger 
    let names = []
    testobject[division].forEach((fighter, i) => {
        if (i < 11) names.push(fighter.competitor.name)
    })
    
    let newNames = names.map(name => {
        return name.split(", ")
    })

    console.log(newNames)
    newNames = newNames.forEach((name, i) =>{
        //  let temp = name.replace(" ", "-")
        let temp = name.reverse()
        let firstname = temp[0].split(" ")[0]
         cards[i]= {
             'name': firstname + "-" + temp[1].replace(" ","-")
         }
    })
    console.log(cards)

         getImage(Object.keys(cards))
        // console.log(fightfight)
    

}

async function getImage(fightfight) {
    let tempName=""
    for(let i = 0; i < fightfight.length; i++ ){
        
        cards[i]['image']= await nah.getImgURL(cards[i].name)
    }
    // console.log(cards)
    // return fightfight

    let dContainer = document.getElementById("data-container")
    dContainer.innerHTML = '';

    Object.values(cards).forEach((fighter, i) => {

                var fightStats = document.createElement("div") //main div to append things to
                fightStats.setAttribute("id", `each-fighter-${i}` )
                fightStats.classList.add("each-fighter");
                
                var fighterImg = document.createElement("div") //div to append img to
                fighterImg.setAttribute("id", `${ i === 0 ? "champ-img" : "fighter-img"}`)
                fighterImg.style.backgroundImage = `url(${fighter.image})`;

                var fighterInfo = document.createElement("div") //div to append text/data to
                fighterInfo.setAttribute("id", "fighter-info")

                
                // let name = fighter.name.split(", ").reverse().join(" ") //flip name around
                let position = i === 0 ? "C" : i;  //if position is 0, then athlete is current champion if division
                // var text = document.createTextNode(`${name}, ${fighter.id},  rank: ${position}`)
                
                let rank = document.createElement("h2")
                rank.textContent = `${position}`

                let fighterName = document.createElement("h1")
                fighterName.textContent = `${fighter.name}` 

                fighterInfo.appendChild(rank)
                fighterInfo.appendChild(fighterName)

                fightStats.appendChild(fighterImg)
                fightStats.appendChild(fighterInfo)

                let flipped = document.createElement("div") //div to append text/data to
                fightStats.appendChild(flipped)


                dContainer.appendChild(fightStats)
                fightStats.addEventListener("click", (event) => {
                    flipCard(`each-fighter-${i}`, fighter.id)
                })
                         
    })
}


function addFlippedInfo(id) {
    debugger
    console.log(id)
    let flip = document.getElementById(id).children[2] //grab the flip div
    flip.innerHTML = `${cards[id].fighterObject.info.nickname}`
}

// let cards = {}
function flipCard(id, fighterId) {
    console.log(cards)
    if(!cards[id]) {
        cards[id] = {
          degree:0,
          fighterObject:fighterInfo(id, fighterId)  
        } 
        debugger
    }
    // console.log(k)

    var card = document.getElementById(id);
    let flip = document.getElementById(id).children[2] //grab the flip div
    debugger
    console.log(flip)
    if (cards[id].degree !== 0)  {
        cards[id].degree -= 180;
        // flip.style.display = "none"
        // card.style.transitionDuration = "0.9s"
        flip.classList.remove("flip-div")
        flip.classList.add("hide-div")
        // flip.innerHTML = ""
    } else {
        cards[id].degree += 180;
        flip.classList.remove("hide-div")
        flip.classList.add("flip-div")
        debugger
        // document.getElementById("flip-div").style.display = "block"
    }

    card.style.transform = "rotatey(" + cards[id].degree + "deg)";
    card.style.transitionDuration = "0.9s"
    // console.log(cards)
    debugger
}

function fighterInfo(id, fighterId) {
    // let isbn = '0201558025';
  // debugger
  console.log("api called again")
//   axios.get(`/fighters/${fighterId}`)
//   .then((response) => {
//       debugger
//       console.log(response.data); 
//       cards[id].fighterObject = response.data
//       addFlippedInfo(id)
//   })
//   .catch(function (error) {
//       debugger
//       console.log(error.response);
//   });

}
