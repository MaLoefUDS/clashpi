class Location {
    constructor(id, name, isCountry) {
        this.id = id;
        this.name = name;
        this.isCountry = isCountry;
    }

    static fromJSON(jsonObject) {
        return new Location(
            jsonObject.id,
            jsonObject.name,
            jsonObject.isCountry);
    }

    toString() {
        return this.name;
    }
}

class ClanRanking {
    constructor(tag, name, rank, previousRank, location, clanScore, memberCount, badgeId) {
        this.tag = tag;
        this.name = name;
        this.rank = rank;
        this.previousRank = previousRank;
        this.location = location;
        this.clanScore = clanScore;
        this.memberCount = memberCount;
        this.badgeId = badgeId;
    }

    static fromJSON(jsonObject) {
        return new ClanRanking(
            jsonObject.tag,
            jsonObject.name,
            jsonObject.rank,
            jsonObject.previousRank,
            Location.fromJSON(jsonObject.location),
            jsonObject.clanScore,
            jsonObject.members,
            jsonObject.badgeId);
    }

    toString() {
        return this.name;
    }
}

module.exports = { Location, ClanRanking }