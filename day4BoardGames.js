/* bingo.  first borad to win */



const fs = require ('fs').promises

const readLines = async () => {
    const data = await fs.readFile("input4.txt", {encoding: 'utf8'})
    return data.split('\n\n') //split on blank line, then newline, then spaces
    // (/\r\n|\r|\n/)  works on all platforms with different line endingd
}

// SET FUNCTIONS
const union = (setA, setB) => new Set([...setA, ...setB])
// return set that are in either input set
// console.log("union", union(new Set([1,2,3,4,5]), new Set([1,3,5,7,9])))

const intersection = (setA, setB) => {
// rerurn set that are in both input sets
    return new Set([...setA].filter(x => setB.has(x)))
}
// console.log("intersection", intersection(new Set([1,2,3,4,5]), new Set([1,3,5,7,9])))

const difference = (setA, setB) => {
// return set that are in SetA but not in Set B
    return new Set([...setA].filter(x => !setB.has(x)))
}
// console.log("difference", difference(new Set([1,2,3,4,5]), new Set([1,3,5,7,9])))

const sumSet = (set) => [...set].reduce((accum,next) => accum + Number(next), 0)
// console.log("sumSet", sumSet(new Set([1,2,3,4,5])))

const isSameSet = (s1, s2) => {
    if (s1.size !== s2.size) {
      return false;
    }
    return [...s1].every(i => s2.has(i))
  }
/* 
  console.log("isSameSet", isSameSet(intersection(new Set([13,85,18,29,28]), new Set([85, 537, 10, 28, 29, 98, 13, 58, 18])),
  new Set([13,85,18,29,28]))) */

const solveIt  = async() => {
    const data = await readLines()
    const calls = data.shift().split(',') //the first item is the sequence of bingo calls
    const boards = data
    // turn the data into an array of boards, each board an array of row numbers
        .map(d => d.split('\n'))  // array split at newlines
        .map(d => d.map(e => boardRow(e)))  // ..and split them by whitespace characters
    console.log(boards)
    const gameOver = play(boards, calls) 
    console.log("gameOver", gameOver)
    if (gameOver.win != null) {
    // part 1 asks for the procuct of the last call made and the sum of numbers yet to call on the winning board
        return gameOver.lastCall * sumSet(yetToCall(gameOver.allCalls, gameOver.winningBoard))
    } else {
        return null
    }
}

const boardSets = (board) => {
    //make an array of sets of all rows and columns for a board 
    bs = []
    for (let row of board) {
        bs.push(new Set(row))
    }
    for (let col=0; col < board[0].length; col= col+1) {
        let colSet = new Set()
        for (let row of board) {
            colSet.add(row[col])
        }
        bs.push(colSet)
    }
    return bs
}
// console.log("boardsets", boardSets(testBoard))

const play = (boards, calls) => {
// returns an object with all required details of status after a win, or win === null
    let callSet = new Set()
    let winningBoards = new Set()
    let lastCall
    for (let call of calls) {
        callSet.add(call)
        for (let board of boards) {
           let winSets = boardSets(board)
           for (let win of winSets) { // when the callSet contains all the numbers in a board row or column (boardSets), the board is the winning one
            // if (isSameSet(intersection(win, callSet), win)) return { lastCall: call, allCalls: callSet, winningBoard : board, win: win}
            if (isSameSet(intersection(win, callSet), win)) winningBoards.add(board)
            if (winningBoards.size === boards.length) return { lastCall: call, allCalls: callSet, winningBoard : board, win: win} //part 2 return last board to win
            }
        }
        lastCall = call
    }
    return { lastCall: lastCall, allCalls: callSet, winningBoard : null, win: null}
}
const testBoard = [[22,59,7,10,6],[33,36,96,55,23],[13,85,18,29,28],[75,46,83,73,58],[34,40,87,56,98]]
const testBoards = [[[22,59,7,10,6],[33,36,96,55,23],[13,85,18,29,28],[75,46,83,73,58],[34,40,87,56,98]],
[[20,51,7,10,6],[33,36,96,55,23],[13,85,18,29,28],[75,46,83,73,58],[33,40,87,57,98]]]
// console.log("play", play(testBoards, [85, 537, 10, 28, 29, 98, 13, 58, 18]))



const yetToCall = (calls, board) => {
// make a set of all numbers on the board not in the sequence of calls made
const callSet = new Set(calls)
    let yetToCallSet = new Set()
    for (let row of board) {
       yetToCallSet =union(yetToCallSet, difference(new Set(row), callSet))
    }
    return yetToCallSet
} 
// console.log("yetToCall", yetToCall([85, 537, 10, 28, 29, 98, 13, 58, 18], testBoard))

// clean up the board row to remove extra whitespace characters
regex = new RegExp("\\s+", "g")  // regular expression \s matches all whitespace characters (includes tabs and newlines)
const boardRow = (string)  => string.replace(regex, ' ').split(' ')
//console.log(boardRow('3     6 7 89 123'))



solveIt().then(console.log)