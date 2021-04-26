# UFC-stats-visualizer

## Background and Overview
------
The UFC stats visualizer is an app where users can see a fighter's stats, 
including their current ranking in their respective division, strikes landed, takedowns landed, and record (wins, losses, draws).
Fighters limited to only the top 10 of their division, along with the champion. (11 max total).
A custom built webscraper is used to pull data from the official UFC website, including images and stats to ensure up to date information.
"Athlete Cards" are used to contain and illustrate athlete information. 

## Functionality and MVPs
Users of this visualizer can:

- Select which weight division they wish to explore.
- Use the scrollbar to view the different athletes of that division.
- Click on an athlete's card to view stats on back of card.
- Hover over displayed charts/graphs for more indepth data.
- Users can compare stats between fighters.

## Interaction

![alt text](https://github.com/juansanchez721/ufc-stats-visualizer/blob/main/dist/UFCStatsVisualizer.gif "UFC interaction")


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

