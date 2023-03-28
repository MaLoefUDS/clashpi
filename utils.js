const UpgradeCost = {
    // example:  LEVEL_TEN = cost for an upgrade from level 9 to level 10
    LEVEL_ONE: 0,
    LEVEL_TWO: 5,
    LEVEL_THREE: 20,
    LEVEL_FOUR: 50,
    LEVEL_FIVE: 150,
    LEVEL_SIX: 400,
    LEVEL_SEVEN: 1000,
    LEVEL_EIGHT: 2000,
    LEVEL_NINE: 4000,
    LEVEL_TEN: 8000,
    LEVEL_ELEVEN: 15000,
    LEVEL_TWELVE: 35000,
    LEVEL_THIRTEEN: 75000,
    LEVEL_FOURTEEN: 100000,
}

const Rarity = {
    // number describes how many level upgrades are possible from the basic card
    COMMON: 14,
    RARE: 12,
    EPIC: 9,
    LEGENDARY: 6,
    CHAMPION: 4
}

class Utils {


    static totalCardValue(currentLevel, rarity) {
        let cost = 0;
        let startLevel = 15 - rarity;

        for (let i = startLevel; i < currentLevel; i++) {
            cost += Object.values(UpgradeCost)[i].valueOf();
        }

        if (rarity === Rarity.EPIC && currentLevel >= 7) {
            cost -= 600;
        } else if (rarity === Rarity.LEGENDARY && currentLevel >= 10) {
            cost -= 3000;
        }

        return cost;

    }


    static getCorrectLevel(level, rarity) {
        // start level of a card = 15 - rarity
        // correct level = start level + sent Level - 1
        return 15 - rarity + level - 1;
    }

}

module.exports = {Utils}
