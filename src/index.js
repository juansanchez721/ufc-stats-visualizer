import "./styles/index.scss";
import "./styles/reset.scss"
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
    let yo = document.getElementsByClassName('each-fighter')
    for(let i = 0; i< yo.length; i++) {
        yo[i].addEventListener("click", () => createModal(yo[i].id, i))
    }
    
    // axios.get(`/rankings`)
    // .then((response) => {
    //     debugger
    //     const rankings = response.data.rankings
    //     console.log(rankings); 

    //     getRankings(rankings)
    // })
    // .catch(function (error) {
    //     debugger
    //     console.log(error.response);
    // })

    // let query = "grace hopper";
    // axios.get(`/search?string=${query}`)
    // .then((response) => {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
    
})

function getRankings(rankings) {

    // var mainContainer = document.getElementById("navbar");
    let dropdown = document.getElementById("weight-classes")
    // dropdown.setAttribute("id", "weight-classes")
    for (var i = 0; i < rankings.length; i++) {
        // console.log(response.data.rankings.length)
        let division = rankings[i].name.split("_").join(" ")
        // rankings[0].competitor_rankings[0].competitor.name
        let competitors = rankings[i].competitor_rankings.map(rank => {
            return rank.competitor 
        })
        let info = []
        competitors.forEach(fighter => {
                info.push([Object.values(fighter), "|"]) 
            }   
            )
                dropdown.appendChild(new Option(`${division}`, `${info}` ));
    }
  
            dropdown.addEventListener('change', (e) => getFighters(e.target.value))
            // mainContainer.append(dropdown)
}


function getFighters(competitors) {
    debugger 

    let fighters = competitors.split("|")
    let athletes = fighters.map((fighter) => {
        return fighter.split(",").filter(item => item !== "")
    })

    let fightfight = athletes.map((fighter, i) => { //check here to remove last undefined "athlete"
            return {
                id: fighter[0],
                name: fighter[2] + " " + fighter[1],
                abrev: fighter[3]
            }
    })

    console.log(fightfight)

    let dContainer = document.getElementById("data-container")
    dContainer.innerHTML = '';

    fightfight.forEach((fighter, i) => {

                var fightStats = document.createElement("div") //main div to append things to
                fightStats.setAttribute("id", `each-fighter-${i}` )
                fightStats.classList.add("each-fighter");
                
                var fighterImg = document.createElement("div") //div to append img to
                fighterImg.setAttribute("id", `${ i === 0 ? "champ-img" : "fighter-img"}`)

                var fighterInfo = document.createElement("div") //div to append text/data to
                fighterInfo.setAttribute("id", "fighter-info")
                
                let name = fighter.name.split(", ").reverse().join(" ") //flip name around
                let position = i === 0 ? "Champion" : i;  //if position is 0, then athlete is current champion if division
                // var text = document.createTextNode(`${name}, ${fighter.id},  rank: ${position}`)
                
                let rank = document.createElement("h1")
                rank.textContent = `${position}`

                let fighterName = document.createElement("h1")
                fighterName.textContent = `${name}`

                fighterInfo.appendChild(rank)
                fighterInfo.appendChild(fighterName)

                fightStats.appendChild(fighterImg)
                fightStats.appendChild(fighterInfo)

                dContainer.appendChild(fightStats)
                fightStats.addEventListener("click", (event) => {
                    createModal(`each-fighter-${i}`, fighter.id)
                    // axios.get(`/fighters/${fighter.id}`)
                    // .then((response) => {
                    // debugger
                    // console.log(response.data); 
                    // return response.data
                    // })
                    // .catch(function (error) {
                    // debugger
                    // console.log(error.response);
                    // });
                })
                         
    })

}

let cards = {}
function createModal(id, fighterId) {
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
    if (cards[id].degree !== 0)  {
        cards[id].degree -= 180;

    } else {
        cards[id].degree += 180;
    }

    card.style.transform = "rotatey(" + cards[id].degree + "deg)";
    card.style.transitionDuration = "0.9s"
    // console.log(cards)
}

function fighterInfo(id, fighterId) {
    // let isbn = '0201558025';
  // debugger
  console.log("api called again")
  axios.get(`/fighters/${fighterId}`)
  .then((response) => {
      debugger
      console.log(response.data.info); 
      cards[id].fighterObject = response.data
  })
  .catch(function (error) {
      debugger
      console.log(error.response);
  });

}
