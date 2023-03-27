const { Card } = require('./card');
const { ChallengeView } = require('./challenge');

const BattleType = {
    RIVERRACE: 'riverRacePvP',
    CASUAL: 'casual2v2',
    PVP: 'PVP',
    RANKED: 'pathOfLegend',
    BOATBATTLE: 'boatBattle'
}

class BattlePlayer {
    constructor(tag, name, startingTrophies, crowns, kingTowerHitPoints, princesTowerHitPoints, cards, elixirLeaked) {
        this.tag = tag;
        this.name = name;
        this.startingTrophies = startingTrophies;
        this.crowns = crowns;
        this.kingTowerHitPoints = kingTowerHitPoints;
        this.princesTowerHitPoints = princesTowerHitPoints;
        this.cards = cards;
        this.elixirLeaked = elixirLeaked;
    }

    static fromJSON(jsonObject) {
        return new BattlePlayer(
            jsonObject.tag,
            jsonObject.name,
            jsonObject.startingTrophies,
            jsonObject.crowns,
            jsonObject.kingTowerHitPoints,
            jsonObject.princesTowerHitPoints,
            jsonObject.cards
                .filter(card => card.name)
                .map(Card.fromJSON),
            jsonObject.elixirLeaked);
    }
}

class Battle {
    constructor(type, time, challengeInfo, boatInfo, isLadderTournament, arena,
                gameMode, deckSelection, isHosted, teamOne, teamTwo) {
        this.type = type;
        this.time = time;
        this.challengeInfo = challengeInfo;
        this.boatInfo = boatInfo;
        this.isLadderTournament = isLadderTournament;
        this.arena = arena;
        this.gameMode = gameMode;
        this.deckSelection = deckSelection;
        this.teamOne = teamOne;
        this.teamTwo = teamTwo;
        this.isHosted = isHosted;
    }

    static fromJSON(jsonObject) {
        return new Battle(
            jsonObject.type,
            ChallengeView.formatDate(jsonObject.battleTime),
            {id: jsonObject.challengeId,
                title: jsonObject.challengeTitle,
                winsBefore: jsonObject.challengeWinCountBefore},
            {side: jsonObject.boatBattleSide,
                towersBefore: 3 - jsonObject.prevTowersDestroyed,
                towersAfter: jsonObject.remainingTowers},
            jsonObject.isLadderTournament,
            jsonObject.arena.name,
            jsonObject.gameMode,
            jsonObject.deckSelection,
            jsonObject.isHostedMatch,
            jsonObject.team.map(BattlePlayer.fromJSON),
            jsonObject.opponent.map(BattlePlayer.fromJSON));
    }

    toString() {
        return `${this.type}: ` +
            `${this.teamOne.map(player => player.name).join(' with ')} vs. ` +
            `${this.teamTwo.map(player => player.name).join(' with ')}`;
    }
}

class BattleLog {
    constructor(battles) {
        this.battles = battles;
    }

    static fromJSON(jsonObject) {
        const battles = [];
        for (const battle of jsonObject) {
            battles.push(Battle.fromJSON(battle));
        }
        return new BattleLog(battles);
    }

    toString() {
        return this.battles
            .map(battle => battle.toString())
            .join('\n');
    }
}

module.exports = { BattleLog };