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

    axios.get(`/rankings`)
    .then((response) => {
        debugger
        const rankings = response.data.rankings
        console.log(rankings); 

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

function getRankings(rankings) {

    // var mainContainer = document.getElementById("navbar");
    let dropdown = document.getElementById("weight-classes")
    // dropdown.setAttribute("id", "weight-classes")
    for (var i = 0; i < rankings.length; i++) {
        // console.log(response.data.rankings.length)
        let division = rankings[i].name
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

    let promises = []
    let fighterIds = []

    fightfight.forEach((fighter, i) => {

                fighterIds.push(fighter.id)

                var fightStats = document.createElement("div") //main div to append things to
                fightStats.setAttribute("id", `each-fighter` )
                
                var fighterImg = document.createElement("div") //div to append img to
                fighterImg.setAttribute("id", "fighter-img")

                var fighterInfo = document.createElement("div") //div to append text/data to
                fighterInfo.setAttribute("id", "fighter-info")
                
                let name = fighter.name.split(", ").reverse().join(" ") //flip name around
                let position = i === 0 ? "champion" : i;  //if position is 0, then athlete is current champion if division
                var text = document.createTextNode(`${name}, ${fighter.id},  rank: ${position}`)
                
                fighterInfo.appendChild(text)
                fightStats.appendChild(fighterImg)
                fightStats.appendChild(fighterInfo)

                dContainer.appendChild(fightStats)
                fightStats.addEventListener("click", (event) => {
                    new Card()
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
                // fighterInfo(fighter.id)
                // promises.push(axios.get(`/fighters/${fighter.id}`))
                         
    })
    // Promise.allSettled(promises).
    // then((results) => results.forEach((result) => console.log(result.status)));
    // console.log(fighterIds)

    // fighterIds.forEach(fighterId => {
    //     promises.push(axios.get(`/fighters/${fighterId}`))
    // })

    // Promise.all(promises)
    // .then((results) => {
    //     // for(let i=0; i< results.length; i++){
    //         console.log(results)
    //         return results
    //         // }
    //     })
    //     .catch((error) => console.log(error))
        
    //     console.log(promises)
}

// function fighterInfo(fighterId) {
//     // let isbn = '0201558025';
//   // debugger
//   axios.get(`/fighters/${fighterId}`)
//   .then((response) => {
//       debugger
//       console.log(response.data); 
//       return response.data
//   })
//   .catch(function (error) {
//       debugger
//       console.log(error.response);
//   });

// }
