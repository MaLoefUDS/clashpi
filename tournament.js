const { ChallengeView, Price } = require('./challenge');

const TournamentType = {
    OPEN: 'open',
    PASSWORD_PROTECTED: 'passwordProtected',
    UNKNOWN: 'unknown'
}

const TournamentStatus = {
    IN_PREPARATION: 'inPreparation',
    IN_PROGRESS: 'inProgress',
    ENDED: 'ended',
    UNKNOWN: 'unknown'
}

class TournamentPlayer {
    constructor(tag, name, score, rank, clan) {
        this.tag = tag;
        this.name = name;
        this.score = score;
        this.rank = rank;
        this.clan = clan;
    }

    static fromJSON(jsonObject) {
        return new TournamentPlayer(
            jsonObject.tag,
            jsonObject.name,
            jsonObject.score,
            jsonObject.rank,
            jsonObject.clan);
    }

    toString() {
        return this.name;
    }
}

class Tournament {
    constructor(tag, type, status, creatorTag, name, description, levelCap, firstPlaceCardPrize, capacity, maxCapacity,
                preparationDuration, duration, createdTime, startedTime, membersList, gameMode) {
        this.tag = tag;
        this.type = type;
        this.status = status;
        this.creatorTag = creatorTag;
        this.name = name;
        this.description = description;
        this.levelCap = levelCap;
        this.firstPlaceCardPrize = firstPlaceCardPrize;
        this.capacity = capacity;
        this.maxCapacity = maxCapacity;
        this.preparationDuration = preparationDuration;
        this.duration = duration;
        this.createdTime = createdTime;
        this.startedTime = startedTime;
        this.membersList = membersList;
        this.gameMode = gameMode;
    }

    static fromJSON(jsonObject) {
        return new Tournament(
            jsonObject.tag,
            jsonObject.type,
            jsonObject.status,
            jsonObject.creatorTag,
            jsonObject.name,
            jsonObject.description || 'no description given',
            jsonObject.levelCap,
            jsonObject.firstPlaceCardPrize,
            jsonObject.capacity,
            jsonObject.maxCapacity,
            jsonObject.preparationDuration,
            jsonObject.duration,
            ChallengeView.formatDate(jsonObject.createdTime),
            jsonObject.startedTime
                ? ChallengeView.formatDate(jsonObject.startedTime)
                : undefined,
            jsonObject.membersList
                ? jsonObject.membersList.map(TournamentPlayer.fromJSON)
                : [],
            jsonObject.gameMode);
    }

    toString() {
        return `${this.name}: ${this.description}`;
    }
}

class TournamentPrice {
    constructor(winsNeeded, price) {
        this.winsNeeded = winsNeeded;
        this.price = price;
    }

    static fromJSON(jsonObject) {
        return new TournamentPrice(
            jsonObject.wins,
            Price.fromJSON(jsonObject)
        )
    }

    toString() {
        return this.price.toString();
    }
}

class GlobalTournament {
    constructor(tag, name, startTime, endTime, rewards, freeTierRewards, topRankReward, maxTopRewardRank, gameMode,
                maxLosses, levelCap, tournamentLevel) {
        this.tag = tag;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rewards = rewards;
        this.freeTierRewards = rewards;
        this.topRankReward = topRankReward;
        this.maxTopRewardRank = maxTopRewardRank;
        this.gameMode = gameMode;
        this.maxLosses = maxLosses;
        this.levelCap = levelCap;
        this.tournamentLevel = tournamentLevel;
    }

    static fromJSON(jsonObject) {
        return new GlobalTournament(
            jsonObject.tag,
            jsonObject.title,
            ChallengeView.formatDate(jsonObject.startTime),
            ChallengeView.formatDate(jsonObject.endTime),
            jsonObject.milestoneRewards
                .filter(reward => reward.type !== null)
                .map(TournamentPrice.fromJSON),
            jsonObject.freeTierRewards
                .filter(reward => reward.type !== null)
                .map(TournamentPrice.fromJSON),
            jsonObject.topRankReward
                .filter(reward => reward.type !== null)
                .map(TournamentPrice.fromJSON),
            jsonObject.maxTopRewardRank,
            jsonObject.gameMode,
            jsonObject.maxLosses,
            jsonObject.minExpLevel,
            jsonObject.tournamentLevel);
    }

    toString() {
        return this.name;
    }

}

module.exports = {Tournament, TournamentStatus, TournamentType, GlobalTournament}