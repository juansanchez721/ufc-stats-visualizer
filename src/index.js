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
      debugger;
      const rankings = response.data.rankings;
      getRankings(rankings);
    })
    .catch(function (error) {
      debugger;
      console.log(error.response);
    });

});

function createCharts(firstdata, i, category) {
  const colors = d3.scaleOrdinal(["red", "white"]);
  const radius = 75;
  const path = d3.arc().outerRadius(radius).innerRadius(50);

  const strikespie = d3.pie().value((d) => d.value);
//   const takedownpie = d3.pie().value((d) => d.value);

  //create and append svg for chart
  let svg = d3
    .select(`#main-div-${i}`)
    .append("svg")
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
      //   console.log(d.target.__data__.data.name)
      hold
        .text(`${d.target.__data__.value}`)
        .append("tspan")
        .attr("x", 0)
        .attr("y", 20)
        .attr("font-size", "12px")
        // .attr("dy", "-2em")
        .text(`${d.target.__data__.data.name}`);
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
    .attr("font-size", ".8em")
    .text(category);


    ///create and append legend
  var legend = d3
    .select(`#main-div-${i}`)
    .append("svg")
    .attr("class", "legend")
    .attr("width", 120)
    // .attr("height", (firstdata.length - 1) * 20)
    .selectAll("g")
    .data(firstdata)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", 10)
    .attr("y", 4)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => colors(d.value));

  legend
    .append("text")
    .attr("x", 24)
    .attr("y", 13)
    .attr("font-size", "13px")
    .text(function (d) {
      return d.name;
    });

    legend.append("textspan")
    .attr('x', 20)
    .attr('y', 50)
    .attr('font-size', '24px')
    .text("Test")
}

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
  cards = {};
  debugger;
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

  getImage(Object.keys(cards));
  // console.log(fightfight)
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
    fighterName.textContent = `${fighter.name.split(/-(.+)/)[1]}`;

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
  debugger;
  // console.log(i)
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
  const {
    strikesAttempted,
    strikesLanded,
    takedownsLanded,
    takedownsAttempted,
  } = cards[element.id];

  let strikingData = [
    {
      name: "Strikes Landed",
      value: strikesLanded,
    },
    {
      name: "Strikes Missed",
      value: strikesAttempted - strikesLanded,
    },
  ];

  let wrestlingData = [
    {
      name: "Takedowns Landed",
      value: takedownsLanded,
    },
    {
      name: "Takedowns Missed",
      value: takedownsAttempted - takedownsLanded,
    },
  ];

  createCharts(strikingData, element.id, "Striking")
  createCharts(wrestlingData, element.id, "Wrestling")

  let bottom = document.createElement("div");
  bottom.classList.add("rest-of-card");

  cardBack.appendChild(bottom)


}

// let cards = {}
async function flipCard(element) {
  // console.log(cards)
  element.classList.toggle("is-flipped");

  if (!cards[element.id].flipped) {
    const {
      strikesLanded,
      strikesAttempted,
      takedownsLanded,
      takedownsAttempted,
      nickname,
      reach,
      height,
    } = await nah.getStats(cards[element.id].name);

    cards[element.id].flipped = true;
    (cards[element.id].degree = 0),
      (cards[element.id].strikesLanded = strikesLanded);
    cards[element.id].strikesAttempted = strikesAttempted;
    cards[element.id].takedownsLanded = takedownsLanded;
    cards[element.id].takedownsAttempted = takedownsAttempted;
    cards[element.id].nickname = nickname;
    cards[element.id].reach = reach;
    cards[element.id].height = height;

    // console.log(cards[element.id]);
    addFlippedInfo(element);
  }
}
