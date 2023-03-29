const {Utils} = require('./utils')

const StartLevel = {
    COMMON: 1,
    RARE: 3,
    EPIC: 6,
    LEGENDARY: 9,
    CHAMPION: 11
}


class Card {
    constructor(name, id, rarity, level = undefined, count = undefined, pic) {
        this.name = name;
        this.id = id;
        this.rarity = rarity;
        // API sends number of level-ups and not the current level of a card
        this.level = Utils.getCorrectLevel(level, rarity);
        this.count = count;
        this.pic = pic;
    }

    toString() {
        return this.name;
    }

    static fromJSON(jsonObject) {
        return new Card(jsonObject.name, jsonObject.id, jsonObject.maxLevel, jsonObject.level, jsonObject.count, jsonObject.iconUrls.medium);
    }


}

module.exports = {Card, StartLevel};