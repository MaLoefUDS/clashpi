const { Connector } = require("./connector.js");
const { Card, Rarity } = require("./card.js");
const { ChallengeView } = require("./challenge.js");
const { Player } = require("./player.js");
const { BattleLog } = require("./battle.js");

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

    async getBattleLog(tag) {
        const battleLog = await this.connector.request(['players', tag, 'battlelog']);
        return BattleLog.fromJSON(battleLog);
    }

    static pack(value) {
        return value.constructor.name === 'Array' ? value : [value];
    }
}
