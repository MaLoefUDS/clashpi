class Season {
    constructor(id) {
        this.id = id;
    }

    static fromJSON(jsonObject) {
        return new Season(jsonObject.id);
    }

    static current(date = new Date()) {
        const month = date.getMonth() + 1;
        return new Season(`${date.getFullYear()}-${month.length === 2 ? month : `0${month}`}`);
    }

    toString() {
        return this.id;
    }
}

class PlayerRanking {
    constructor(tag, name, rank, previousRank, expLevel, score, isTrophies, isElo) {
        this.tag = tag;
        this.name = name;
        this.rank = rank;
        this.previousRank = previousRank;
        this.expLevel = expLevel;
        this.score = score;
        this.isTrophies = isTrophies;
        this.isElo = isElo;
    }

    static fromJSON(jsonObject) {
        return new PlayerRanking(
            jsonObject.tag,
            jsonObject.name,
            jsonObject.rank,
            jsonObject.previousRank || jsonObject.rank,
            jsonObject.expLevel,
            jsonObject.eloRating || jsonObject.trophies,
            !!jsonObject.trophies,
            !!jsonObject.eloRating);
    }

    toString() {
        return this.name;
    }

}

module.exports = { Season, PlayerRanking }