import "./styles/index.scss";
import "./styles/reset.scss";
require("babel-polyfill");

const scraper = require("./scripts/webscraper");
const scroll = require("./scripts/scroll");
const axios = require("axios");

document.addEventListener("DOMContentLoaded", () => {

  scroll.scrollerInit();

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
    // if(i === 5 || i === 6 || i === 7 || i === 9 || i === 10 || i === 11 || i === 12) continue

    let division = rankings[i].name.split("_").join(" "); //weight class name
    // console.log(division)
    let competitorArray = Object.values(rankings[i].competitor_rankings);
    testobject[division] = competitorArray;

    dropdown.appendChild(new Option(`${division}`, `${division}`));
  }
  dropdown.addEventListener("change", (e) => {
    e.preventDefault()
    getFighters(e.target.value)
  });
}

const getFighters = (division) => {
  let dropdown = document.getElementById("weight-classes");
  document.getElementById("choose-weight-class").disabled = true
  dropdown.disabled = true;

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

  getImage(Object.keys(cards))
    .then(() => (dropdown.disabled = false))
    .then(() => {
      document.getElementById("data-container").scrollLeft = 0;
    })
    .then(() => {
      document.getElementById("arrows").style.display = "flex"
    })

};

async function getImage(keys) {

  //Initialize array to hold list of promises
  let promiseArr = []; 
  
  //display the loading cymbol when user selects dropdown option
  document.getElementById("loading").style.display = "block";
  //add class to main body element that removes and adds to the DOM - will be toggled at the end
  document.getElementById("data-container-inner").classList.toggle("freeze");

  //loop through array argument that contains keys to overwritten 
  //global Object that holds chosen weight division athletes 
  for (let i = 0; i < keys.length; i++) {
    // cards[fighter]["image"] =
    //push promises into local array variable
    promiseArr.push(scraper.getImgURL(cards[i].name));
  }

  //Pause execution of the rest of the function until all promises are resolved/rejected concurrently
  //The Duration depends on the longest time needed to wait for one of the requests made to the webscraper
  //Significantly faster than waiting for each individual request to return, hence the array of promises
  await Promise.all(promiseArr).then((res) => {
    // debugger;
    for (let i = 0; i < res.length; i++) {
      //after all promises are resolved, an array of responses is returned.
      //Key into global variable cards and save a value for the image attribute
      cards[i]["image"] = res[i];
    }
  });

  document.getElementById("loading").style.display = "none";
  document.getElementById("data-container-inner").classList.toggle("freeze");

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
    let lastName = fighter.name.split(/-(.+)/)[1];
    fighterName.textContent = `${lastName}`;

    if (lastName.length > 12) fighterName.classList.add("longer-name");

    fighterInfo.appendChild(rank);
    fighterInfo.appendChild(fighterName);

    fighterfront.appendChild(fighterImg);
    fighterfront.appendChild(fighterInfo);

    fightStats.appendChild(fighterfront);
    fightStats.appendChild(fighterback);
    dContainer.appendChild(fightStats);
    fightStats.addEventListener("mousedown", (event) => {
      flipCard(fightStats);
    });
  });
}

function addFlippedInfo(element) {
  // console.log(element)
  let nicknameBool = cards[element.id].nickname ? true : false;

  let cardBack = element.children[1]; //grab the flip div

  let headerDiv = document.createElement("div");
  headerDiv.classList.add("header-div");

  let nickname = document.createElement("h1");
  nickname.classList.add("nickname");

  let firstName = document.createElement("h1");
  let lastName = document.createElement("h1");

  let fName = cards[element.id].name.split("-")[0];
  let lName = cards[element.id].name.split(/-(.+)/)[1];

  nickname.textContent = nicknameBool
    ? `${'"' + cards[element.id].nickname.toUpperCase() + '"'}`
    : `${fName + " " + lName}`;

  firstName.textContent = nicknameBool ? `${fName}` : "-";
  lastName.textContent = nicknameBool ? `${lName}` : "-";

  headerDiv.appendChild(firstName);
  headerDiv.appendChild(nickname);
  headerDiv.appendChild(lastName);

  // if (cards[element.id].nickname.length > 12) nickname.classList.add("longer-name");

  cardBack.appendChild(headerDiv);

  let mainDiv = document.createElement("div");
  mainDiv.classList.add("main-div-content");
  mainDiv.setAttribute("id", `main-div-${element.id}`);

  cardBack.appendChild(mainDiv);
  // // console.log(cards[i])
  // debugger
  const {
    strikesAttempted,
    strikesLanded,
    takedownsLanded,
    takedownsAttempted,
    record,
  } = cards[element.id];
  // debugger
  let strikingData = [
    {
      name: "Strikes Landed",
      value: parseInt(strikesLanded),
      total: strikesAttempted,
    },
    {
      name: "Strikes Missed",
      value: strikesAttempted - strikesLanded,
      total: strikesAttempted,
    },
  ];

  let wrestlingData = [
    {
      name: "Takedowns Landed",
      value: parseInt(takedownsLanded),
      total: takedownsAttempted,
    },
    {
      name: "Takedowns Missed",
      value: takedownsAttempted - takedownsLanded,
      total: takedownsAttempted,
    },
  ];

  createCircleCharts(strikingData, element.id, "Striking");
  createCircleCharts(wrestlingData, element.id, "Wrestling");
  createBarChart(record, element.id);


  // let bottom = document.createElement("div");
  // bottom.classList.add("rest-of-card");

  // cardBack.appendChild(bottom)
}

function createBarChart(record, i) {
  let records = record.split("-").map((ele) => parseInt(ele));
  // console.log(records)

  let recordObject = [
    {
      name: records[0] === 1 ? "Win" : "Wins",
      value: records[0],
    },
    {
      name: records[1] === 1 ? "Loss" : "Losses",
      value: records[1],
    },
    {
      name: records[2] === 1 ? "Draw" : "Draws",
      value: records[2],
    },
  ];
  let x = d3
    .scaleLinear()
    .domain([0, d3.max(recordObject, (d) => d.value)])
    .range([0, 285]);

  let y = d3
    .scaleBand()
    .domain(recordObject.map((d) => d.value))
    .range([0, 25 * recordObject.length]);

  // let width = 100%
  // let length = 100%
  let svg = d3
    .select(`#main-div-${i}`)
    .append("svg")

    .attr("width", "100%")
    .attr("height", 135)

    .attr("text-anchor", "end");

  const bar = svg
    .selectAll("g")
    .data(recordObject)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${y(d.value)})`);

  bar
    .append("rect")
    .attr("fill", "steelblue")
    .attr("y", 40)
    .attr("height", y.bandwidth() - 5)
    .transition()
    .duration(1500)
    .attr("width", (d) => x(d.value));

  bar
    .append("text")
    .attr("fill", "white")
    .attr("x", function (d) {
      return d.value <= 1 ? 40 : x(d.value) + 20;
    })
    .attr("y", y.bandwidth() / 2 + 40)
    .attr("dy", "0.2em")
    .attr("font-size", "12px")
    .text((d) => d.value + " " + d.name);

  svg
    .append("text")
    .attr("text-anchor", "start")
    // .attr("width", 100)
    //   .attr("height", 100)
    .attr("y", 35)
    .attr("x", 0)

    .text("RECORD");
}

function createCircleCharts(firstdata, i, category) {
  const colors = d3.scaleOrdinal(["#d20a0a", "white"]);
  const radius = 75;
  const path = d3.arc().outerRadius(radius).innerRadius(50);
  const dataBool = firstdata[0].value === 0 && firstdata[1].value === 0;
  // console.log("databool " + dataBool)

  const values = firstdata.map((ele) => ele.value);
  // console.log(values)
  const strikespie = d3.pie().value((d) => d.value);
  //   const takedownpie = d3.pie().value((d) => d.value);

  //create and append svg for
  let ratio = null;
  let fraction = null;
  let desc = null;
  let svg = null;
  let hold = null;
  switch (category) {
    case "Striking":
      svg = d3
        .select(`#main-div-${i}`)
        .append("svg")
        .attr("width", 175)
        .attr("height", 155)
        .append("g")
        .attr(
          "transform",
          `translate(${Math.floor(175 / 2)}, ${Math.floor(155 / 2)})`
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
          let hundredBool =
            d.target.__data__.value / d.target.__data__.data.total === 1;
          d3.select(this).transition().duration("50").attr("opacity", ".60");
          // console.log(d.target.__data__.data.value)
          hold
            .text(`${d.target.__data__.value}`)
            .append("tspan")
            .attr("x", 0)
            .attr("y", 20)
            .attr("font-size", "12px")
            // .attr("dy", "-2em")
            .text(`${d.target.__data__.data.name}`);

          //Percentage text element on Legend
          ratio.text(
            hundredBool
              ? "100%"
              : (
                  (d.target.__data__.value / d.target.__data__.data.total) *
                  100
                ).toFixed(1) + `%`
          );

          desc
            .text(`${d.target.__data__.data.name} Percentage`)
            .style("font-size", "14px");

          fraction.text(
            `${
              d.target.__data__.value.toString() +
              " out of " +
              d.target.__data__.data.total.toString()
            }`
          );
        })
        .on("mouseout", function (d, i) {
          d3.select(this).transition().duration("50").attr("opacity", "1");

          hold.text(category);
        });

      hold = svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 10)
        .attr("x", -2)
        .style("font-size", ".8em")
        .text(dataBool ? "No Data" : category);

      ///create and append legend

      var div = d3
        .select(`#main-div-${i}`)
        .append("div")
        .attr("class", "legend")
        .attr("id", `legend-${category}-${i}`)
        .attr("width", 175)
        .append("svg")
        .attr("width", 175)
        .attr("height", 40)
        // .attr("height", (firstdata.length - 1) * 20)
        .selectAll("g")
        .data(firstdata)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      div
        .append("rect")
        .attr("x", 10)
        .attr("y", 4)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d) => colors(d.value));

      div
        .append("text")
        .attr("x", 24)
        .attr("y", 13)
        .attr("font-size", "13px")
        .text(function (d) {
          return d.name;
        });

      //   var ratio = d3
      //   .select(`#main-div-${i}`)
      //   .append("svg")
      //   .attr("width", 190)
      //   .attr("height", 75 )

      ratio = d3
        .select(`#legend-${category}-${i}`)
        .append("text")
        .attr("x", 100)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "45px")
        .text("");

      desc = d3
        .select(`#legend-${category}-${i}`)
        .append("text")
        .attr("x", 100)
        .attr("y", 100)
        .text("")
        .style("font-size", "14px");

      fraction = d3
        .select(`#legend-${category}-${i}`)
        .append("text")
        .attr("x", 100)
        .attr("y", 120)
        .style("width", "100%")
        .style("font-size", "14px")
        .text("");

      break;

    case "Wrestling":
      ///create and append legend

      var div = d3
        .select(`#main-div-${i}`)
        .append("div")
        .attr("class", "legend")
        .attr("id", `legend-${category}-${i}`)
        .attr("width", 175)
        .append("svg")
        .attr("width", 175)
        .attr("height", 40)
        // .attr("height", (firstdata.length - 1) * 20)
        .selectAll("g")
        .data(firstdata)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      div
        .append("rect")
        .attr("x", 60)
        .attr("y", 4)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d) => colors(d.value));

      div
        .append("text")
        .attr("x", 75)
        .attr("y", 13)
        .attr("font-size", "13px")
        .text(function (d) {
          return d.name;
        });

      //   var ratio = d3
      //   .select(`#main-div-${i}`)
      //   .append("svg")
      //   .attr("width", 190)
      //   .attr("height", 75 )

      ratio = d3
        .select(`#legend-${category}-${i}`)
        .append("text")
        .attr("x", 100)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "45px")
        .style("width", "fit-content")
        .text("");

      desc = d3
        .select(`#legend-${category}-${i}`)
        .append("text")
        .attr("x", 100)
        .attr("y", 100)
        .style("width", "fit-content")
        .text("")
        .style("font-size", "14px");

      fraction = d3
        .select(`#legend-${category}-${i}`)
        .append("text")
        .attr("x", 100)
        .attr("y", 120)
        .style("width", "fit-content")
        .style("font-size", "14px")
        .text("");

      svg = d3
        .select(`#main-div-${i}`)
        .append("svg")
        .attr("width", 175)
        .attr("height", 155)
        .append("g")
        .attr(
          "transform",
          `translate(${Math.floor(175 / 2)}, ${Math.floor(155 / 2)})`
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
          let hundredBool =
            d.target.__data__.value / d.target.__data__.data.total === 1;
          // debugger
          d3.select(this).transition().duration("50").attr("opacity", ".60");
          // console.log(d.target.__data__.data.value)
          hold
            .text(`${d.target.__data__.value}`)
            .append("tspan")
            .attr("x", 0)
            .attr("y", 20)
            .attr("font-size", "12px")
            // .attr("dy", "-2em")
            .text(`${d.target.__data__.data.name}`);

          //Percentage text element on Legend
          ratio.text(
            hundredBool
              ? "100%"
              : (
                  (d.target.__data__.value / d.target.__data__.data.total) *
                  100
                ).toFixed(1) + `%`
          );

          desc
            .text(`${d.target.__data__.data.name} Percentage`)
            .style("font-size", "14px");

          fraction.text(
            `${
              d.target.__data__.value.toString() +
              " out of " +
              d.target.__data__.data.total.toString()
            }`
          );
        })
        .on("mouseout", function (d, i) {
          d3.select(this).transition().duration("50").attr("opacity", "1");

          hold.text(category);
        });

      hold = svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 10)
        .attr("x", -2)
        .style("font-size", ".8em")
        .text(dataBool ? "No Data" : category);

      break;
  }
}

async function flipCard(element) {
  // console.log(cards)
  // document.getElementById().disabled = true
  
  element.classList.toggle("is-flipped");
  if (!cards[element.id].flipped) {
    document.getElementById(`${element.id}`).style.pointerEvents = "none";
    // debugger
    const {
      strikesLanded,
      strikesAttempted,
      takedownsLanded,
      takedownsAttempted,
      nickname,
      reach,
      record,
    } = await scraper.getStats(cards[element.id].name);
    // debugger
    cards[element.id].flipped = true;
    cards[element.id].degree = 0;
    cards[element.id].strikesLanded = strikesLanded;
    cards[element.id].strikesAttempted = strikesAttempted;
    cards[element.id].takedownsLanded = takedownsLanded;
    cards[element.id].takedownsAttempted = takedownsAttempted;
    cards[element.id].nickname = nickname;
    cards[element.id].reach = reach;
    cards[element.id].record = record;

    // console.log(cards[element.id]);
    addFlippedInfo(element);
    document.getElementById(`${element.id}`).style.pointerEvents = "all";

  }

}
