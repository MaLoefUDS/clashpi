const { Connector} = require('./connector');
const { Card } = require('./card');
const { ChallengeView } = require('./challenge');
const { Player } = require('./player');
const { BattleLog } = require('./battle');
const { Location, ClanRanking } = require('./location');
const { PlayerRanking } = require('./season');
const { Tournament, GlobalTournament } = require('./tournament');
const { Rarity } = require('./utils');


class Client {
    constructor(apiToken) {
        this.connector = new Connector(apiToken);
    }

    async getCards(rarity = [Rarity.COMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY, Rarity.CHAMPION],
                   name = []) {
        rarity = Connector.pack(rarity);
        name = Connector.pack(name);
        const cards = (await this.connector.request('cards')).items;
        return cards
            .map(Card.fromJSON)
            .filter(card => rarity.includes(card.rarity))
            .filter(card => name.length === 0 ? true : name.includes(card.name));
    }

    async getChallenges() {
        const challenges = (await this.connector.request('challenges'));
        return challenges
            .map(ChallengeView.fromJSON);
    }

    async getPlayer(tag) {
        // Allow getPlayer to be called on a tagged object
        tag = this.argumentToString(`getPlayer(${tag})`, tag, 'tag');
        const player = await this.connector.request(['players', tag]);
        return Player.fromJSON(player);
    }

    async getUpcomingChests(tag, index = undefined) {
        // Allow getUpcomingChests to be called on a tagged object
        tag = this.argumentToString(`getUpcomingChests(${tag}, ${index})`, tag, 'tag');
        const chests = (await this.connector.request(['players', tag, 'upcomingchests'])).items;
        if (index) {
            return chests
                .filter(chest => chest.index === index)
                .map(chest => chest.name)[0];
        } else {
            return chests;
        }
    }

    async getBattleLog(tag) {
        // Allow getBattleLog to be called on a tagged object
        tag = this.argumentToString(`getBattleLog(${tag})`, tag, 'tag');
        const battleLog = await this.connector.request(['players', tag, 'battlelog']);
        return BattleLog.fromJSON(battleLog);
    }

    async getLocations(limit = undefined) {
        const limitQuery = limit === undefined ? {} : {limit: limit};
        const locations = (await this.connector.request('locations', limitQuery)).items;
        return locations
            .map(Location.fromJSON);
    }

    async getClanRanks(locationId, clanWars = false, limit = undefined) {
        // Allow getClanRanks to be called on an identified object
        locationId = this.argumentToString(`getClanRanks(${location}, ${clanWars}, ${limit})`, locationId, 'id');
        const limitQuery = limit === undefined ? {} : {limit: limit};
        const clanRanks = (await this.connector.request(
            ['locations', locationId, 'rankings', clanWars ? 'clanwars' : 'clans'], limitQuery)).items;
        return clanRanks
            .map(ClanRanking.fromJSON);
    }

    async getPlayerRanks(seasonId, pathOfLegends = false, limit = undefined) {
        if (pathOfLegends) {
            throw new Error('[!] PathOfLegends option is currently not being supported by the API.');
        }
        // Allow getPlayerRanks to be called on an identified object
        seasonId = this.argumentToString(`getClanRanks(${seasonId}, ${pathOfLegends}, ${limit})`, seasonId, 'id');
        const limitQuery = limit === undefined ? {} : {limit: limit};
        const playerRanks = (await this.connector.request(
            ['locations', 'global', pathOfLegends ? 'pathoflegend' : 'seasons', seasonId, 'rankings', 'players'],
            limitQuery)).items;
        return playerRanks
            .map(PlayerRanking.fromJSON);
    }

    async getTournaments(name, limit = undefined) {
        // Allow getTournaments to be called on a named object
        name = this.argumentToString(`getTournaments(${name}, ${limit})`, name, 'name');
        const query = limit === undefined ? {name: name} : {name: name, limit: limit};
        const tournaments = (await this.connector.request('tournaments', query)).items;
        return tournaments
            .map(Tournament.fromJSON);
    }

    async getTournament(tag) {
        // Allow getTournaments to be called on a tagged object
        tag = this.argumentToString(`getTournament(${tag})`, tag, 'tag');
        const tournament = await this.connector.request(['tournaments', tag]);
        return Tournament.fromJSON(tournament);
    }

    async getGlobalTournament() {
        const tournaments = (await this.connector.request('globaltournaments')).items;
        return tournaments
            .map(GlobalTournament.fromJSON);
    }

    argumentToString(caller, object, key) {
        if (object === null || object === undefined) {
            throw new Error(`[!] ${caller}: Empty argument provided`);
        }
        switch (object.constructor.name) {
            case 'String': return object;
            case 'Object': {
                if (object[key]) {
                    return object[key];
                } else {
                    throw new Error(`[!] ${caller}: API failure, maybe you provided an invalid argument.`);
                }
            }
        }
    }
}

module.exports = {Client}
