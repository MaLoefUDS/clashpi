const { Connector } = require('./connector');
const { Card, Rarity } = require('./card');
const { ChallengeView } = require('./challenge');
const { Player } = require('./player');
const { BattleLog } = require('./battle');
const { Location, ClanRanking } = require('./location');
const { PlayerRanking } = require('./season');
const { Tournament } = require('./tournament');

class Client {
    constructor(apiToken) {
        this.connector = new Connector(apiToken);
    }

    async getCards(rarity = [Rarity.COMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY, Rarity.CHAMPION],
                   name = []) {
        rarity = Client.pack(rarity);
        name = Client.pack(name);
        const cards = (await this.connector.request(['cards'])).items;
        return cards
            .map(card => Card.fromJSON(card))
            .filter(card => rarity.includes(card.rarity))
            .filter(card => name.length === 0 ? true : name.includes(card.name));
    }

    async getChallenges() {
        const challenges = (await this.connector.request(['challenges']));
        return challenges
            .map(challenge => ChallengeView.fromJSON(challenge));
    }

    async getPlayer(tag) {
        const player = (await this.connector.request(['players', tag]));
        return Player.fromJSON(player);
    }

    async getUpcomingChests(tag, index = undefined) {
        const chests = (await this.connector.request(['players', tag, 'upcomingchests'])).items;
        if (index) {
            return chests
                .filter(chest => chest.index === index)
                .map(chest => chest.name)[0];
        } else {
            return chests;
        }
    }

    async getBattleLog(player) {
        let tag = player;
        if (player.constructor.name === 'Object') {
            tag = player.tag; // Assumption: player is an object of Player type
        }
        const battleLog = await this.connector.request(['players', tag, 'battlelog']);
        return BattleLog.fromJSON(battleLog);
    }

    async getLocations(limit = undefined) {
        const limitQuery = limit === undefined ? {} : {limit: limit};
        const locations = (await this.connector.request(['locations'], limitQuery)).items;
        return locations
            .map(location => Location.fromJSON(location));
    }

    async getClanRanks(location, clanWars = false, limit = undefined) {
        let id = location;
        const limitQuery = limit === undefined ? {} : {limit: limit};
        if (location.constructor.name === 'Object') {
            id = location.id; // Assumption: location is an object of Location type
        }
        const clanRanks = (await this.connector.request(
            ['locations', id, 'rankings', clanWars ? 'clanwars' : 'clans'],
            limitQuery)).items;
        return clanRanks
            .map(clanRank => ClanRanking.fromJSON(clanRank));
    }

    async getPlayerRanks(season, pathOfLegends = false, limit = undefined) {
        if (pathOfLegends) {
            throw new Error('PathOfLegends option is currently not being supported by the API.');
        }

        let id = season;
        const limitQuery = limit === undefined ? {} : {limit: limit};
        if (season.constructor.name === 'Object') {
            id = season.id; // Assumption: season is an object of Season type
        }
        const playerRanks = (await this.connector.request(
            ['locations', 'global', pathOfLegends ? 'pathoflegend' : 'seasons', id, 'rankings', 'players'],
            limitQuery)).items;
        return playerRanks
            .map(playerRank => PlayerRanking.fromJSON(playerRank));
    }

    async getTournaments(name, limit = undefined) {
        const query = limit === undefined ? {name: name} : {name: name, limit: limit};
        const tournaments = (await this.connector.request(['tournaments'], query)).items;
        return tournaments
            .map(tournament => Tournament.fromJSON(tournament));
    }

    async getTournament(tag) {
        const tournament = await this.connector.request(['tournaments', tag]);
        return Tournament.fromJSON(tournament);
    }

    static pack(value) {
        return value.constructor.name === 'Array' ? value : [value];
    }
}
