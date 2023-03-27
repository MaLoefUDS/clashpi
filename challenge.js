const PriceType = {
    CHEST: 'chest',
    RESOURCE: 'resource',
    CONSUMABLE: 'consumable',
    TRADE: 'tradeToken'
}

class Price {
    constructor(type, amount, { chest = undefined,
                                consumable = undefined,
                                resource = undefined,
                                tradeToken = undefined } = {}) {
        this.type = type;
        this.amount = amount;
        this.chest = chest;
        this.consumable = consumable;
        this.resource = resource;
        this.tradeToken = tradeToken;
    }

    static fromJSON(jsonObject) {
        switch (jsonObject.type) {
            case PriceType.CHEST:
                return new Price(PriceType.CHEST, 1,
                    {chest: jsonObject.chest});
            case PriceType.CONSUMABLE:
                return new Price(PriceType.CONSUMABLE, jsonObject.amount,
                    {consumable: jsonObject.consumableName});
            case PriceType.RESOURCE:
                return new Price(PriceType.RESOURCE, jsonObject.amount,
                    {resource: jsonObject.resource});
            case PriceType.TRADE:
                return new Price(PriceType.TRADE, jsonObject.amount,
                    {tradeToken: jsonObject.rarity});
            default:
                console.log(jsonObject);
        }
    }

    toString() {
        let amount = `${this.amount}x`;
        switch (this.type) {
            case PriceType.CHEST: return `${amount} Chest: ${this.chest}`;
            case PriceType.CONSUMABLE: return `${amount} ${this.consumable}`;
            case PriceType.RESOURCE: return `${amount} ${this.resource}`;
            case PriceType.TRADE: return `${amount} TradeToken: ${this.tradeToken}`
        }
    }
}

class Challenge {
    constructor(id, name, description, winMode, casual, wins, losses, gameMode, pic, prices) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.winMode = winMode;
        this.casual = casual;
        this.wins = wins;
        this.losses = losses;
        this.gameMode = gameMode;
        this.pic = pic;
        this.prices = prices;
    }

    static fromJSON(jsonObject) {
        let prices = jsonObject.prizes;
        prices = prices
            .filter(price => price.type && price.type !== "none")
            .map(Price.fromJSON);
        return new Challenge(
            jsonObject.id,
            jsonObject.name,
            jsonObject.description,
            jsonObject.winMode,
            jsonObject.casual,
            jsonObject.maxWins,
            jsonObject.maxLosses,
            jsonObject.gameMode,
            jsonObject.iconUrl,
            prices);
    }

    toString() {
        return this.name;
    }
}

class ChallengeView {
    constructor(startTime, endTime, challenges) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.challenges = challenges;
    }

    static fromJSON(jsonObject) {
        let challenges = jsonObject.challenges
            .map(Challenge.fromJSON);
        return new ChallengeView(
            ChallengeView.formatDate(jsonObject.startTime),
            ChallengeView.formatDate(jsonObject.endTime),
            challenges)
    }

    static formatDate(string) {
        return new Date(
            string.slice(0, 4) + "-"
            + string.slice(4, 6) + "-"
            + string.slice(6, 11) + ":"
            + string.slice(11, 13) + ":0"
            + string.slice(14, string.length));
    }

    isRunning(timestamp = new Date().getTime()) {
        // endTime is in second format while getTime and startTime
        // are in milliseconds
        return timestamp >= this.startTime.getTime()
            && timestamp <= (this.endTime.getTime() * 1000);
    }

    toString() {
        return this.challenges[0].toString();
    }

    totalPrices() {
        let prices = [];
        this.challenges
            .map(challenge => prices = prices.concat(challenge.prices));
        return prices;
    }
}

module.exports = {Challenge, ChallengeView, Price}