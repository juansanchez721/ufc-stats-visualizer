import "./styles/index.scss";
import "./styles/reset.scss";
require("babel-polyfill");

// import * as WebScrap from './scripts/webscraper'
const nah = require("./scripts/webscraper");

const axios = require("axios");

document.addEventListener("DOMContentLoaded", () => {
  var card = document.querySelector(".demo-card");
  card.addEventListener("click", function () {
    card.classList.toggle("is-flipped");
  });

  axios
    .get(`/rankings`)
    .then((response) => {
      const rankings = response.data.rankings;
      getRankings(rankings);
    })
    .catch(function (error) {
      console.log(error.response);
    });

});



let testobject = {};
let cards = {};
function getRankings(rankings) {
  // var mainContainer = document.getElementById("navbar");
  let dropdown = document.getElementById("weight-classes");
  // console.log(rankings)
  // dropdown.setAttribute("id", "weight-classes")
  for (var i = 0; i < rankings.length; i++) {
    let division = rankings[i].name.split("_").join(" "); //weight class name
    // console.log(division)
    let competitorArray = Object.values(rankings[i].competitor_rankings);
    testobject[division] = competitorArray;

    dropdown.appendChild(new Option(`${division}`, `${division}`));
  }
  //   console.log(testobject);

  dropdown.addEventListener("change", (e) => getFighters(e.target.value));
}

const getFighters = async (division) => {
  let dropdown = document.getElementById("weight-classes");
  dropdown.disabled = true

  cards = {};
  let names = [];
  testobject[division].forEach((fighter, i) => {
    if (i < 11) names.push(fighter.competitor.name);
  });

  let newNames = names.map((name) => {
    return name.split(", ");
  });

  // console.log(newNames)
  newNames = newNames.forEach((name, i) => {
    //  let temp = name.replace(" ", "-")
    let temp = name.reverse();
    let firstname = temp[0].split(" ")[0];
    cards[i] = {
      name: (firstname + "-" + temp[1].replace(" ", "-")).toUpperCase(),
    };
  });
  // console.log(cards)

  await getImage(Object.keys(cards));
  // console.log(fightfight)

  dropdown.disabled = false

};

async function getImage(fightfight) {
  let tempName = "";
  document.getElementById("loading").style.display = "block";
  for (let i = 0; i < fightfight.length; i++) {
    cards[i]["image"] = await nah.getImgURL(cards[i].name);
  }

  document.getElementById("loading").style.display = "none";

  let dContainer = document.getElementById("data-container-inner");
  dContainer.innerHTML = "";

  Object.values(cards).forEach((fighter, i) => {
    var fightStats = document.createElement("div"); //main div to append things to
    fightStats.setAttribute("id", `${i}`);
    fightStats.classList.add("each-fighter");

    var fighterfront = document.createElement("div");
    fighterfront.classList.add("fighter-card__face", "fighter-front");

    var fighterback = document.createElement("div");
    fighterback.classList.add("fighter-card__face", "fighter-back");

    var fighterImg = document.createElement("div"); //div to append img to
    fighterImg.setAttribute("id", `${i === 0 ? "champ-img" : "fighter-img"}`);

    var Img = document.createElement("img"); //div to append img to
    Img.src = `${fighter.image}`;

    fighterImg.appendChild(Img);

    var fighterInfo = document.createElement("div"); //div to append text/data to
    fighterInfo.setAttribute("id", "fighter-info");

    let position = i === 0 ? "C" : i; //if position is 0, then athlete is current champion if division

    let rank = document.createElement("h2");
    rank.textContent = `${position}`;

    let fighterName = document.createElement("h1");
    let lastName = fighter.name.split(/-(.+)/)[1]
    fighterName.textContent = `${lastName}`;

    if (lastName.length > 12) fighterName.classList.add("longer-name");

    fighterInfo.appendChild(rank);
    fighterInfo.appendChild(fighterName);

    fighterfront.appendChild(fighterImg);
    fighterfront.appendChild(fighterInfo);

    fightStats.appendChild(fighterfront);
    fightStats.appendChild(fighterback);
    dContainer.appendChild(fightStats);
    fightStats.addEventListener("click", (event) => {
      flipCard(fightStats);
    });
  });
}

function addFlippedInfo(element) {
  debugger 
  let cardBack = element.children[1]; //grab the flip div
  let nickname = document.createElement("h1");
  nickname.textContent = `${
    cards[element.id].nickname
      ? '"' + cards[element.id].nickname.toUpperCase() + '"'
      : cards[element.id].name.split(/-(.+)/)[1]
  }`;

  let mainDiv = document.createElement("div");
  mainDiv.classList.add("main-div-content");
  mainDiv.setAttribute("id", `main-div-${element.id}`);

  cardBack.appendChild(nickname);
  cardBack.appendChild(mainDiv);
  // // console.log(cards[i])
  // debugger
  const {
    strikesAttempted,
    strikesLanded,
    takedownsLanded,
    takedownsAttempted,
    record
  } = cards[element.id];
// debugger
  let strikingData = [
    {
      name: "Strikes Landed",
      value: parseInt(strikesLanded),
    },
    {
      name: "Strikes Missed",
      value: strikesAttempted - strikesLanded,
    },
  ];

  let wrestlingData = [
    {
      name: "Takedowns Landed",
      value: parseInt(takedownsLanded),
    },
    {
      name: "Takedowns Missed",
      value: takedownsAttempted - takedownsLanded,
    },
  ];

  createCircleCharts(strikingData, element.id, "Striking")
  createCircleCharts(wrestlingData, element.id, "Wrestling")
  createBarChart(record, element.id)
  let bottom = document.createElement("div");
  bottom.classList.add("rest-of-card");

  cardBack.appendChild(bottom)


}

function createBarChart(record, i) {
  
  let records = record.split("-").map(ele => parseInt(ele))
  // console.log(records)

  let recordObject = [
    {
      name: "Wins",
      value: records[0]
    },
    {
      name: "Losses",
      value: records[1]
    },
     {
      name: "Draws",
      value: records[2]
    },
]
  let x = d3.scaleLinear()
  .domain([0, d3.max(recordObject, d => d.value)])
  .range([0, 285])

  let y = d3.scaleBand()
  .domain(recordObject.map(d => d.value))
  .range([0, 25 * recordObject.length])

  // let width = 100%
  // let length = 100%
  let svg = d3
  .select(`#main-div-${i}`)
  .append("svg")

  .attr("width", "100%")
  .attr("height", 135)

  .attr("text-anchor", "end")
  
  const bar = svg.selectAll("g")
  .data(recordObject)
  .join("g")
  .attr("transform", (d,i) => `translate(0,${y(d.value)})` )
  
  
  bar.append("rect")
  .attr("fill", "steelblue")
  .attr("y", 40)
  .attr("height", y.bandwidth() - 5)
  .transition()
  .duration(1500)
  .attr("width", d => x(d.value))
  
  bar.append("text")
  .attr("fill", "white")
  .attr("x", function(d) {
    return d.value <= 1 ? 40 : x(d.value) + 20
  } 
  )
  .attr("y", (y.bandwidth() / 2) + 40)
  .attr("dy", "0.2em")
  .attr("font-size", "12px")
  .text(d => d.value + " " + d.name);
  
  
    svg.append("text")
    .attr("text-anchor", "start")
    // .attr("width", 100)
    //   .attr("height", 100)
      .attr("y", 35)
      .attr("x", 0)

    .text("RECORD")

}

function createCircleCharts(firstdata, i, category) {
  const colors = d3.scaleOrdinal(["red", "white"]);
  const radius = 75;
  const path = d3.arc().outerRadius(radius).innerRadius(50);
  const dataBool = firstdata[0].value === 0 && firstdata[1].value === 0 
  console.log("databool " + dataBool)

  const values = firstdata.map(ele =>  ele.value)
  console.log(values)
  const strikespie = d3.pie().value((d) => d.value);
//   const takedownpie = d3.pie().value((d) => d.value);

  //create and append svg for chart
  let svg = d3
    .select(`#main-div-${i}`)
    .append("svg")
    .attr("width", 175)
    .append("g")
    .attr(
      "transform",
      `translate(${Math.floor(400 / 4)}, ${Math.floor(155 / 2)})`
    );

  var g = svg
    .selectAll(".arc")
    .data(strikespie(firstdata))
    .enter()
    .append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", path)
    .attr("fill", (d) => colors(d.data.value))
    .on("mouseover", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", ".85");
        console.log(d.target.__data__.data.value)
      hold
        .text(`${d.target.__data__.value}`)
        .append("tspan")
        .attr("x", 0)
        .attr("y", 20)
        .attr("font-size", "12px")
        // .attr("dy", "-2em")
        .text(`${d.target.__data__.data.name}`);

        const infinityBool = values[1]/values[0] === Infinity ? 1 : values[1]/values[0]
        console.log(19/0)
        ratio
        .text(
          `${values[0] === d.target.__data__.value ? 
          (values[0]/values[1]).toFixed(2)
          : 
          (infinityBool).toFixed(2)}`
          )
          
          desc
          .text(`Overall ${d.target.__data__.data.name} Ratio`)
          .style('font-size', '14px')


    })
    .on("mouseout", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", "1");

      hold.text(category);
    });

  let hold = svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", 10)
    .attr("x", -2)
    .style("font-size", ".8em")
    .text(dataBool ? "No Data" : category);


    ///create and append legend

    var div = d3.select(`#main-div-${i}`)
    .append('div')
    .attr("class", "legend")
    .attr("id", `legend-${category}-${i}`)
    .attr("width", 175)
    .append("svg")
    .attr("width", 175)
    .attr("height", 50 )
    // .attr("height", (firstdata.length - 1) * 20)
    .selectAll("g")
    .data(firstdata)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    })

  div
    .append("rect")
    .attr("x", 10)
    .attr("y", 4)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => colors(d.value))
    
  div
    .append("text")
    .attr("x", 24)
    .attr("y", 13)
    .attr("font-size", "13px")
    .text(function (d) {
      return d.name;
    })

  //   var ratio = d3
  //   .select(`#main-div-${i}`)
  //   .append("svg")
  //   .attr("width", 190)
  //   .attr("height", 75 )

  let ratio = d3.select(`#legend-${category}-${i}`)
    .append("text")
    .attr("x", 100)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .style('font-size', '45px')
    .text("")
    
    let desc = d3.select(`#legend-${category}-${i}`).append("text")
          .attr("x", 100)
          .attr("y", 100)  
          .text("")
          .style('font-size', '14px')

}

async function flipCard(element) {
  // console.log(cards)
  element.classList.toggle("is-flipped");
  if (!cards[element.id].flipped) {
    debugger
    const {
      strikesLanded,
      strikesAttempted,
      takedownsLanded,
      takedownsAttempted,
      nickname,
      reach,
      record
    } = await nah.getStats(cards[element.id].name);
debugger
    cards[element.id].flipped = true
    cards[element.id].degree = 0
    cards[element.id].strikesLanded = strikesLanded
    cards[element.id].strikesAttempted = strikesAttempted
    cards[element.id].takedownsLanded = takedownsLanded
    cards[element.id].takedownsAttempted = takedownsAttempted
    cards[element.id].nickname = nickname
    cards[element.id].reach = reach
    cards[element.id].record = record

    // console.log(cards[element.id]);
    addFlippedInfo(element);
  }
}
