const fs = require("fs").promises;

const readlines = async () => {
    const data = await fs.readFile('input20.txt', { encoding: 'utf-8' });
    return data.split('\n\n') //split on blank line
};

const tinyImage = [
    "...............",
    ".....#..#......",
    ".....#.........",
    ".....##..#.....",
    ".......#.......",
    ".......###.....",
    "...............",
]

const trialImage = [
    "...............",
    "...............",
    "...............",
    "...............",
    "...............",
    ".....#..#......",
    ".....#.........",
    ".....##..#.....",
    ".......#.......",
    ".......###.....",
    "...............",
    "...............",
    "...............",
    "...............",
    "...............",
]

const trialAlgorithm =
    "..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##" +
    "#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###" +
    ".######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#." +
    ".#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#....." +
    ".#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.." +
    "...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#....." +
    "..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#"


const binToDec = (bin) => {
    return parseInt(bin, 2)
}

const ptToString = (col, row) => col.toString() + "_" + row.toString()
const valueTo01 = (value) => value === '#' ? 1 : 0

const getPoints = (grid) => {
    // store column and row in an object, and return an array of all of them
    pts = []
    for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
            pts.push({ col: col, row: row })
        }
    }
    return pts
}

const getPtMap = (grid) => {
    // store row, column as a key in a Map, with the value as the entry
    const ptMap = new Map()
    for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
            ptMap.set(ptToString(col, row), grid.values[row][col])
        }
    }
    return ptMap
}

const calcBinary = (pt, ptMap, deepSpace) => {
    // calculate binary number from 9 point grid centered on a point
    // look up the values of the 9 points in a Map (with row and col in the key)
    const topL = { col: pt.col - 1, row: pt.row - 1 }  //toDo check rows cols order and values stored
    const topM = { col: pt.col, row: pt.row - 1 }
    const topR = { col: pt.col + 1, row: pt.row - 1 }
    const midL = { col: pt.col - 1, row: pt.row }
    const midM = pt
    const midR = { col: pt.col + 1, row: pt.row }
    const botL = { col: pt.col - 1, row: pt.row + 1 }
    const botM = { col: pt.col, row: pt.row + 1 }
    const botR = { col: pt.col + 1, row: pt.row + 1 }

    const grid9 = [topL, topM, topR, midL, midM, midR, botL, botM, botR]

    const binArr = grid9.map(x => {
        const find = ptMap.get(ptToString(x.col, x.row))
        // convert hashes to ones, and zeros otherwise
        if (!find) console.log("Not found", x.col, x.row, deepSpace, valueTo01(deepSpace))
        return find ? valueTo01(find) : valueTo01(deepSpace)
    })
    //!!! returns 2 for array with two ones.. wanted a string..
    const binString = binArr.reduce((a, b) => a.toString() + b.toString())
    //const binString = binArr.join('')[0]

    return binString
}

const growGrid = (data, addLines = 2, entry = ".") => {
    // data is arrays by line
    // will add lines to all four sides
    // new line length will be + 2 * addLines

    // !!!!  Doing this created an array but when used twice it had the same reference!
    // !!!! caused problem later because both rows were being changed at the same time.
    // !!!! all rows added ended up with the same symbol and
    // !!!! too many hashes were counted
    // const newRow = new Array(data[0].length + 2 * addLines).fill(entry)
    // each existing row will grow by addLines at the start and finish
    /// !!! same error with columns
    /// const newCols = new Array(addLines).fill(entry)
    /// data = data.map((v) => [...newCols, ...v, ...newCols])
    let newRow
    let newCols

    // add new rows, each created separately (otherwise have same references)
    for (let i = 0; i < addLines; i++) {
        newRow = new Array(data[0].length).fill(entry)
        data = [newRow, ...data]
    }
    for (let i = 0; i < addLines; i++) {
        newRow = new Array(data[0].length).fill(entry)
        data = [...data, newRow]
    }

    for (let j = 0; j < data.length; j++) {
        newCols = new Array(addLines).fill(entry)
        data[j] = [...newCols, ...data[j]]
        newCols = new Array(addLines).fill(entry)
        data[j] = [...data[j], ...newCols]
    }
    return { width: data[0].length, height: data.length, values: data }
}

const countLitPixels = (grid, entry = '#') => grid.values.flat().filter(e => e === entry).length
const lookUp = (e, algorithm) => algorithm[e]
const toggle = (valueToSet, algorithm) => {
    if (valueToSet === ".") return algorithm[0]
    if (valueToSet === "#") return algorithm[511]
}

const solveIt = async () => {
    const data = await readlines()
    const algorithm = data.shift().split('') //the first item is the image enhancement algorithm

    const imageGrid = data
        .map(d => d.split('\n'))  // array split at newlines
        .map(d => d.map(e => e.split(''))).flat()   // separate characters with commas 

    let gridValues = imageGrid
    let grid
    const enhanceTimes = 50
    let deepSpace = "."
    for (let i = 0; i < enhanceTimes; i++) {
        // expand the data to a grid two lines bigger all sides
        grid = growGrid(gridValues, 2, deepSpace) 
        console.log("deepSpace", deepSpace)
        console.log(countLitPixels(grid))
        const pts = getPoints(grid)
        const ptMap = getPtMap(grid)
        // convert the grid using the image enhancement algorithm (key)
        console.log(lookUp(+binToDec(+calcBinary({ col: 0, row: 0}, ptMap, deepSpace)), algorithm))
        pts.forEach(pt => {
            if (grid.values[pt.row][pt.col] !== '#'
                && grid.values[pt.row][pt.col] !== '.') {
                console.log(pt.col, pt.row, grid.values[+pt.row][+pt.col])
            }
            grid.values[pt.row][pt.col] = lookUp(+binToDec(+calcBinary(pt, ptMap, deepSpace)), algorithm) === "#" ? "#" : "."
        })
        gridValues = grid.values
        deepSpace = toggle(deepSpace, algorithm)
        
    }
    // count the lit values (hashes)
    const countLit = countLitPixels(grid, "#")

    return countLit
}

console.log(solveIt().then(console.log))