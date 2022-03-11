const rollDeterministicDie = (lastRoll) => [+lastRoll%100 + 1, +(lastRoll+1)%100 + 1, +(lastRoll+2)%100 + 1]
const score = (lastSpace, dieRoll) => ((lastSpace-1)+dieRoll[0]+dieRoll[1]+dieRoll[2])%10 + 1
const score3Rolls = (lastSpace, totalDieRolls) => ((lastSpace-1)+totalDieRolls)%10 + 1
const min = (a , b) => a < b ? a : b
const scoreString = (s1, s2) => s1.toString()+"_"+s2.toString()

const addMap = (key, map, add=1) => {
    const value = +map.get(key)
    if (value) {
        map.set(key, value + add)
    } else {
        map.set(key, add)
    } 
    return map
}

const roll3totals = () => {
    const roll = [1,2,3]
    const rollMap = new Map()
    roll.forEach(e => roll.forEach(
        f => roll.forEach(
            g => addMap(e+f+g, rollMap))))
    return rollMap
}

const comboProb = (roll3Map) => {
    // return a map of the probability of each score combination
    const scoreMap = new Map ()
    const scores = [3,4,5,6,7,8,9]
    scores.forEach(s1 => scores.forEach(
        s2 => addMap(scoreString(s1,s2), scoreMap, roll3Map.get(s1)*roll3Map.get(s2))))
    console.log("scoreMap ", scoreMap)
    return scoreMap
}

const scoreCombs = () => {
      // return an array of each score combination
      const scoreComb = []
      const scores = [3,4,5,6,7,8,9]
      scores.forEach(s1 => scores.forEach(
          s2 => scoreComb.push([+s1, +s2])))
      console.log("scoreComb", scoreComb)
      return scoreComb  
}

console.log(comboProb(roll3totals()))


const play = () => {
    let player1Score = 0
    let player1Position = 4
    let player2Score = 0
    let player2Position = 8
    let dieRolls = 0
    while (player1Score < 1000  && player2Score < 1000) {
        player1Position = score(player1Position, rollDeterministicDie(dieRolls))
        player1Score = player1Score + player1Position
        dieRolls += 3
        if (player1Score < 1000) {
            player2Position = score(player2Position, rollDeterministicDie(dieRolls))
            player2Score = player2Score + player2Position
            dieRolls += 3
        }
    }
    console.log(rollDeterministicDie(dieRolls-3))  // the last time the die was rolled
    console.log(player1Score, player2Score) 
    console.log(dieRolls)
    return min(player1Score, player2Score) * dieRolls

}

const update = (gameState, scores, scoresProbs) => {
// a gameState is : [[player1.position, player1.score],[player2.position, player2.score], ways]
    const player1Position = diracScore(gameState[0][0], scores[0])
    const player2Position = diracScore(gameState[1][0], scores[1])
    const player1Score = gameState[0][1] + player1Position // added score is board position   
    const player2Score = gameState[1][1] + player2Position 
    const ways = +gameState[2] * scoresProbs.get(scoreString(scores[0], scores[1]))

    return [[player1Position, player1Score],[player2Position, player2Score], ways]

}


const playPart2 = () => {
    // each time a player rolls dice 3 times of play opens 27 universes..3*3*3 ?
    // round can be won by player 1 without player 2 rolling : 27 universes, or
    // by player two with ?? 27*2 universes? 
    // update player1 and player 2 separately, adding 27 univers to the pot for each roll.  
    let player1 = {position: 4, score: 0}
    let player2 = {position: 8, score: 0}
    let wins = {player1: 0, player2:0}
    
    
    const winScore = 21

    return wins = recursePlay(player1, player2, wins)


}



const updatePlayer = (player, roll3) => {
    const position = score3Rolls(player.position, roll3)
    const score = player.score + position 
return {roll3: roll3, position:position, score:score}  // important to return new object
}


const recursePlay = (player1, player2, ways, wins, scoreFreq, scoreCombs, winScore) => {
    // check for winner.  
    // A total score from 3 rolls can be reached in one or more ways, held in scoreFreq Map
    // Wins are in all universes where the score was reached; all the ways to here

    /*  !! This code produces a score for player1 7 x too big.. because each player1  3 die total value features 
     7x in the score combinations.  (Attempt to change it in recursePlay2 not yet working.. but can at least get 
      the right answer from this one - divide player1 score by 7!!) */

        if (player1.roll3) ways = ways * scoreFreq.get(player1.roll3) // no roll3 on first call
        if (player1.score >= winScore) return wins = {player1: wins.player1 + ways, player2: wins.player2}
        
        // player 2 goes second.  Can only win if player1 has not already won.
        if (player2.roll3) ways = ways * scoreFreq.get(player2.roll3)  // player 2 wins on all the universes the score combination occurs
        if (player2.score >= winScore) return wins = {player1: wins.player1, player2: wins.player2 + ways}
    
    scoreCombs.forEach((roll3Comb)  => { // roll3Comb holds the totals from 3 rolls for player 1 and player 2    
        // depth first recursion until this combination of dice rolls has a winner
        wins = recursePlay(updatePlayer(player1, roll3Comb[0]), updatePlayer(player2, roll3Comb[1]), 
        ways, wins, scoreFreq, scoreCombs, winScore)
    })
    // no more rolls - no more universes from here - all games over when loop at top of scack runs out
    //console.log(wins)
    return wins
    
    }

const recursePlay2 = (player1, player2, ways, wins, scoreFreq, scoreCombs, winScore) => {
// check for winner.  
// A total score from 3 rolls can be reached in one or more ways, held in scoreFreq Map
// Wins are in all universes where the score was reached; all the ways to here
    
    if (player1.roll3) {
        ways = ways * scoreFreq.get(player1.roll3) // no roll3 on first call
        if (player1.score >= winScore) return wins = {player1: wins.player1 + ways, player2: wins.player2}
    } 
    // player 2 goes second.  Can only win if player1 has not already won.
    if (player2.roll3) {
        ways = ways * scoreFreq.get(player2.roll3)  // player 2 wins on all the universes the score combination from player 1 and player2 occurs
        if (player2.score >= winScore) return wins = {player1: wins.player1, player2: wins.player2 + ways}
    } 
    
    // !!! This code does not revert to previous player2 score on return from player1 win.  Why?

    // Double loop with each player1 score tried with each player 2 score.. until somebody wins
    for (let [p1roll3, value] of scoreFreq) { // p1roll3 holds the total from 3 rolls    
        for (let [p2roll3, value] of scoreFreq) {
            // depth first recursion until this combination of dice rolls has a winner
            wins = recursePlay2(updatePlayer(player1, p1roll3), player2 = updatePlayer(player2, p2roll3), ways, wins, scoreFreq, scoreCombs, winScore)
        }
}
// no more rolls - no more universes from here - all games over when loop at top of scack runs out
//console.log(wins)
return wins
// 647920021341197 the right answer for player 1 in my input case

}


const playPart2Recursive = () => {
    let player1 = {position: 8, score: 0, roll3: null}
    let player2 = {position: 4, score: 0, roll3: null}
    let wins = {player1: 0, player2:0}
    
    const winScore = 21
    const combs = scoreCombs()  // an array of score combinations
    const scoreFreq = roll3totals()  // a Map of 3 roll totals with the number of occurences
    let ways = 1 // the number of ways this gamestate was reached (via the same 3 roll total made in dfferent ways)

    return recursePlay(player1, player2, ways, wins, scoreFreq, combs, winScore)

}

console.log(playPart2Recursive())