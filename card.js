
const Rarity = {
    COMMON: 14,
    RARE: 12,
    EPIC: 9,
    LEGENDARY: 6,
    CHAMPION: 4
}

class Card {
    constructor(name, id, rarity, pic) {
        this.name = name;
        this.id = id;
        this.rarity = rarity;
        this.pic = pic;
    }

    toString() {
        return this.name;
    }

    static fromJSON(jsonObject) {
        return new Card(jsonObject.name, jsonObject.id, jsonObject.maxLevel, jsonObject.iconUrls.medium);
    }
}

module.exports = {Card, Rarity};