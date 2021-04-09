# UFC-stats-visualizer

## Background and Overview
------
The UFC stats visualizer is an app where users can see a fighter's up-to-date stats, 
including their current ranking in their respective division, reach, and record (wins, losses, draws).
Fighters limited to only the top 10 of their division, along with the division's champion. (11 max total).
A custom built webscraper is used to pull data from the official UFC website, including images and stats to ensure up to date information.
"Athlete Cards" are used to contain and illustrate athlete information. 

## Functionality and MVPs
Users of this visualizer can:

- select which weight division they wish to explore.
- use the scrollbar to view the different athletes of that division.
- hover over dispalyed charts/graphs for more indepth data
- Users can compare stats between fighters.

## Wireframes

![alt text](https://github.com/juansanchez721/UFC-stats-visualizer/blob/main/readme-img/ufcwireframe.png "UFC wireframe")


## Architecture and Technology

- HTML5
- Javascript 
- CSS
- D3 for data visualization
- Sportradar's UFC API v2
- custom built webscraper with cheerio.js

## Implementation Timeline

### Day 1 
- Set up entry file/ finish set up process
- Make simultaneous API calls to obtain relevant data to illustrate
### Day 2
- Set up dropdown for each weight class
- Set up page for chosen weight class and athletes to display
### Day 3
- Use D3 for data visualization on certain values such as wins, win method, strikes landed,strikes attempted, etc. 
- Begin styling for current available content on page
### Day 4
- Continue/finish data visualization illustrations 
- Search for fighter pics to display.
- Continue styling for existing pages.
### Day 5
- Finish styling, fix remaining bugs.

