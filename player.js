const { Card } = require("./card");

class Badge {
    constructor(name, level, maxLevel, progress, target, pic) {
        this.name = name;
        this.level = level;
        this.maxLevel = maxLevel;
        this.progress = progress;
        this.target = target;
        this.pic = pic;
    }
    static fromJSON(jsonObject) {
        return new Badge(
            jsonObject.name,
            jsonObject.level,
            jsonObject.maxLevel,
            jsonObject.progress,
            jsonObject.target,
            jsonObject.iconUrls.large);
    }

    toString() {
        return this.name;
    }
}

class Achievement {
    constructor(name, stars, value, target, info) {
        this.name = name;
        this.stars = stars;
        this.value = value;
        this.target = target;
        this.info = info;
    }

    static fromJSON(jsonObject) {
        return new Achievement(
            jsonObject.name,
            jsonObject.stars,
            jsonObject.value,
            jsonObject.target,
            jsonObject.info);
    }

    toString() {
        return this.name;
    }
}

class LeagueStat {
    constructor(trophies, trophyRecord, month) {
        this.trophies = trophies;
        this.trophyRecord = trophyRecord;
        this.month = month;
    }

    getTimestamp() {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth()}`;
    }

    static fromJSON(jsonObject) {
        const date = new Date();
        const month = date.getMonth() + 1;
        const timestamp = jsonObject.id || `${date.getFullYear()}-${month.length === 2 ? month : `0${month}`}`;
        const trophyRecord = jsonObject.bestTrophies ?
            Math.max(jsonObject.bestTrophies, jsonObject.trophies) :
            jsonObject.trophies;
        return new LeagueStat(
            jsonObject.trophies,
            trophyRecord,
            timestamp);
    }

    toString() {
        return `(${this.month}) ${this.trophies} Trophies, ${this.trophyRecord} Trophy Record`;
    }
}

class LeagueStats {
    constructor(currentSeason, previousSeason, bestSeason) {
        this.currentSeason = currentSeason;
        this.previousSeason = previousSeason;
        this.bestSeason = bestSeason;
    }

    static fromJSON(jsonObject) {
        const current = LeagueStat.fromJSON(jsonObject.currentSeason);
        const previous = LeagueStat.fromJSON(jsonObject.previousSeason);
        let best = LeagueStat.fromJSON(jsonObject.bestSeason);
        // Sometimes API information is wrong for some reason
        if (current.trophyRecord > best.trophyRecord) {
            best = current;
        }
        if (previous.trophyRecord > best.trophyRecord) {
            best = previous;
        }
        return new LeagueStats(current, previous, best);
    }

    toString() {
        let string = '';
        string += `Current Season ${this.currentSeason.toString()}\n`;
        string += `Previous Season ${this.previousSeason.toString()}\n`;
        string += `Best Season ${this.bestSeason.toString()}`;
        return string;
    }
}

class Player {
    constructor(tag, name, expLevel, expPoints, totalExpPoints, starPoints, trophies, trophyRecord,
                battleCount, wins, threeCrowns, losses, challengeCardsWon, challengeBattleCount,
                tournamentCardsWon, tournamentBattleCount, role, donations, donationsReceived,
                totalDonations, warDayWins, clanCardsCollected, clan, arena, leagueStats,
                badges, achievements, cards, favouriteCard) {
        this.tag = tag;
        this.name = name;
        this.expLevel = expLevel;
        this.expPoints = expPoints;
        this.totalExpPoints = totalExpPoints;
        this.starPoints = starPoints;
        this.trophies = trophies;
        this.trophyRecord = trophyRecord;
        this.battleCount = battleCount;
        this.wins = wins;
        this.threeCrowns = threeCrowns;
        this.losses = losses;
        this.challengeCardsWon = challengeCardsWon;
        this.challengeBattleCount = challengeBattleCount;
        this.tournamentCardsWon = tournamentCardsWon;
        this.tournamentBattleCount = tournamentBattleCount;
        this.role = role;
        this.donations = donations;
        this.donationsReceived = donationsReceived;
        this.totalDonations = totalDonations;
        this.warDayWins = warDayWins;
        this.clanCardsCollected = clanCardsCollected;
        this.clan = clan;
        this.arena = arena;
        this.leagueStats = leagueStats;
        this.badges = badges;
        this.achievements = achievements;
        this.cards = cards;
        this.favouriteCard = favouriteCard;
    }

    static fromJSON(jsonObject) {
        return new Player(
            jsonObject.tag,
            jsonObject.name,
            jsonObject.expLevel,
            jsonObject.expPoints,
            jsonObject.totalExpPoints,
            jsonObject.starPoints,
            jsonObject.trophies,
            jsonObject.trophyRecord,
            jsonObject.battleCount,
            jsonObject.wins,
            jsonObject.threeCrowns,
            jsonObject.losses,
            jsonObject.challengeCardsWon,
            jsonObject.challengeBattleCount,
            jsonObject.tournamentCardsWon,
            jsonObject.tournamentBattleCount,
            jsonObject.role,
            jsonObject.donations,
            jsonObject.donationsReceived,
            jsonObject.totalDonations,
            jsonObject.warDayWins,
            jsonObject.clanCardsCollected,
            jsonObject.clan.name,
            jsonObject.arena.name,
            LeagueStats.fromJSON(jsonObject.leagueStatistics),
            jsonObject.badges.map(badge => Badge.fromJSON(badge)),
            jsonObject.achievements.map(achievement => Achievement.fromJSON(achievement)),
            jsonObject.cards.map(card => Card.fromJSON(card)),
            Card.fromJSON(jsonObject.currentFavouriteCard));
    }

    toString() {
        return this.name;
    }
}

module.exports = { Player };