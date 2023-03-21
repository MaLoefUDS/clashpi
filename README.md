# Description

This package contains a simple, asynchronous, free, dependency-free node.js library for using the [Clash Royale API](https://developer.clashroyale.com/#/).

# Installation

* Install `node.js` using from [here](https://nodejs.org/en).
* Install `clashpi` with `npm install clashpi`
* You will need a Clash Royale API key to use this library. To obtain a key, create an account [here](https://developer.clashroyale.com/#/register) or if you already have one log in [here](https://developer.clashroyale.com/#/login). Afterwards click on `My Account` from where you can access your API keys. Copy the entire key. 

# Usage

Example:

First import the library and create a `Client` object.
```js
const { Client } = require('clashpi');
const client = Client(APIKEY);
```

Then call functions on the `Client` object.
````js
client.getPlayer('#JGJYQ2P2V')
    .then(player => client.getUpcomingChests(player)
        .then(chests => console.log(chests)));

// OR

client.getUpcomingChests('#JGJYQ2P2V')
        .then(chests => console.log(chest));

client.getPlayerRanks('2023-03')
    .then(rankings => console.log(rankings));
````

# Documentation

* **getCards**(rarity = [Rarity.COMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY, Rarity.CHAMPION], name = [])

> Get a list of all cards in the game, or filter by rarity or name

* **getChallenges**()

> Get a list of all challenges

* **getPlayer**(tag)

> Get all information about a specific player

* **getUpcomingChests**(player, index = undefined)

> Get all (or a specific) upcoming chests of a specific player

* **getBattleLog**(player)

> Get the battle log of a specific player

* **getLocations**(limit = undefined)

> Get a list of all locations in the game

* **getClanRanks**(location, clanWars = false, limit = undefined)

> Get a ranking of all clans in a certain location, either by clan ranking or by clan-war ranking 

* **getPlayerRanks**(season, pathOfLegends = false, limit = undefined)

> Get ranking of all players that played in a specific season, either by trophies or by path of legend rank

* **getTournaments**(name, limit = undefined)

> Get a list of all tournaments containing a specific name 

* **getTournament**(tag)

> Get all information of about a specific tournament

* **getGlobalTournament**()

> Get a list of all global tournaments
