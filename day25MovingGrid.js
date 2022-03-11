const fs = require("fs").promises;

const readlines = async () => {
    const data = await fs.readFile('input25.txt', { encoding: 'utf-8' });
    return data.split(/\r\n|\r|\n/) //split on newline
};

const testData = [ 
    "v...>>.vv>",
    ".vv>>.vv..",
    ">>.>v>...v",
    ">>v>>.>.v.",
    "v>v.vv.v..",
    ">.>>..v...",
    ".vv..>.>v.",
    "v.v..>>v.v",
    "....v..v.>"
]   

const getPoints = (grid, data) => {
    // store row, column and value in an object, and return an array of all of them
        pts = []
        for (let row = 0; row < grid.height; row++) {
                for (let col = 0; col < grid.width; col++) {
                    pt = {col: Number(col), row: Number(row), value: data[row][col]}
                    pts.push(pt)
                }
        }
        return pts
    }

const onSouthEdge = (point, grid) => point.row ===  grid.height-1  ? true : false
const onEastEdge = (point, grid) => point.col ===  grid.width-1  ? true : false

const moveSouth = (southPoints, points, grid) => {
    const tempPoints = points // tempPoints does not change; points update simultaneously 
    let southPoint
    let moves = false
    for (let pt = 0; pt < southPoints.length; pt++) {
        if (!onSouthEdge(southPoints[pt], grid)) {
            southPoint = tempPoints.filter(p => p.row === southPoints[pt].row + 1 && p.col === southPoints[pt].col)[0]
        } else { 
            southPoint = tempPoints.filter(p => p.row === 0 && p.col === southPoints[pt].col)[0]
        } 
        if (southPoint.value === '.') { 
            points = points.map(p => (p.row === southPoint.row && p.col === southPoint.col) ?
                { row: p.row, col: p.col, value: 'v'} : { row: p.row, col: p.col, value: p.value})      
            points = points.map(p => (p.row === southPoints[pt].row && p.col === southPoints[pt].col) ? 
            { row: p.row, col: p.col, value: '.'} : { row: p.row, col: p.col, value: p.value})
            moves = true
        } 
    }
    return ({points: points, moves: moves})
}

const moveEast = (eastPoints, points, grid) => {
    const tempPoints = points // tempPoints does not change; points update simultaneously 
    let eastPoint
    let moves = false
    for (let pt = 0; pt < eastPoints.length; pt++) {
        if (!onEastEdge(eastPoints[pt], grid)) {
            eastPoint = tempPoints.filter(p => p.row === eastPoints[pt].row && p.col === eastPoints[pt].col + 1)[0]
        } else { 
            eastPoint = tempPoints.filter(p => p.row === eastPoints[pt].row && p.col === 0)[0]
        } 
        if (eastPoint.value === '.') { 
            points = points.map(p => (p.row === eastPoint.row && p.col === eastPoint.col) ? 
                { row: p.row, col: p.col, value: '>'} : { row: p.row, col: p.col, value: p.value})
            points = points.map(p => (p.row === eastPoints[pt].row && p.col === eastPoints[pt].col) ?
                { row: p.row, col: p.col, value: '.'} : { row: p.row, col: p.col, value: p.value})
            moves = true
        } 
    }
    return ({points: points, moves: moves})
}

const eastSymbol = ">"
const southSymbol = "v"
const eastRow = (row, grid) => row
const eastCol = (col, grid) => col === grid.width-1  ? 0 : col + 1
const southCol = (col, grid) => col
const southRow = (row, grid) => row === grid.height-1  ? 0 : row + 1
const filterIndices = (arr, symbol) => arr.reduce((acc, curr, index) => {
                                                        if (curr === symbol) {
                                                            acc.push(index)
                                                        } 
                                                        return acc
                                                    }, [])

const move = (symbol, rowFunc, colFunc, grid, gridData) => {
    // move symbol to next cell if empty, using row and col functions
    let indices = []
    let moves = false
    const copy = JSON.parse(JSON.stringify(gridData)) // deep clone of nested array
    // copy does not change; gridData updates simultaneously 
    for (let row = 0; row < grid.height; row++) {
        // filter out array indices in data where symbol present - against starting grid
        indices = filterIndices(copy[row], symbol)  
        for (let colIndx = 0; colIndx < indices.length; colIndx++) {
            // move symbol if next space empty - against original grid
            if (copy[rowFunc(row, grid)][colFunc(indices[colIndx], grid)] === '.') {
                gridData[rowFunc(row, grid)][colFunc(indices[colIndx], grid)] = symbol
                gridData[row][indices[colIndx]] = '.'
                moves = true
            }
        }
    }
    return ({gridData: gridData, moves: moves})
}

const solveIt2 = async () => {
    const data = await readlines()
    // const data = testData
    let grid = { width: data[0].length, height: data.length }  // just holds grid dimentions
    let moves = true
    let movesEast = true 
    let movesSouth = true 
    let resultsEast = {}
    let step = 0
    let gridData = data.map(d => d.split(''))
    while (moves) {
        // east moving animals move
        resultsEast = move('>', eastRow, eastCol, grid, gridData) 
        gridData = resultsEast.gridData
        movesEast = resultsEast.moves 
        // south moving animals move
        resultsSouth = move('v', southRow, southCol, grid, gridData) 
        gridData = resultsSouth.gridData
        movesSouth = resultsSouth.moves 
        moves = (movesEast || movesSouth) ? true : false
        step +=1
    }
    return step
}
    
const solveIt = async () => {
    const data = await readlines()
    // const data = testData
    let grid = { width: data[0].length, height: data.length }  // just holds grid dimentions
    let points = getPoints(grid, data) // points will contain the data values 
    let moves = true
    let movesEast = true 
    let movesSouth = true 
    let resultsEast = {}
    let resultsSouth = {}
    let eastFacing, southFacing
    let step = 0
    while (moves) {
        eastFacing = points.filter(pt => pt.value === ">")
        southFacing = points.filter(pt => pt.value === "v")
        resultsEast = moveEast(eastFacing, points, grid)
        points = resultsEast.points
        movesEast = resultsEast.moves 
        resultsSouth = moveSouth(southFacing, points, grid) 
        points = resultsSouth.points
        movesSouth = resultsSouth.moves 
        moves = (movesEast || movesSouth) ? true : false
        step +=1
    }
    return step
}

console.log(solveIt2().then(console.log))