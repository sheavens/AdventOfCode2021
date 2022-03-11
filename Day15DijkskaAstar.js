"use strict"

const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input15.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new line
};

const testData =
    ["1163751742",
        "1381373672",
        "2136511328",
        "3694931569",
        "7463417111",
        "1319128137",
        "1359912421",
        "3125421639",
        "1293138521",
        "2311944581"]

const smallTestData =
    ["123",
        "456",
        "789"]



const getNeighbours = (cell, g) => {
    // gives the array indices of neighbours for one grid cell
    // neighbours numbered 0 to grid.rows * grid.cols - 1 
    const col = getCol(cell, g)
    const row = getRow(cell, g)
    let neighbours = []
    if (col < g.width - 1) neighbours.push(cell + 1)
    if (col > 0) neighbours.push(cell - 1)
    if (row > 0) neighbours.push(cell - g.width)
    if (row < g.height - 1) neighbours.push(cell + g.width)
    return neighbours
}

const neighbours = (g = grid) => {
    // gives the array indices of neighbours for all grid cells
    let neighbours = []
    for (let c = 0; c < g.width; c++) {
        for (let r = 0; r < g.height; r++) {
            neighbours.push(getNeighbours(c, r, g))
        }
    }
    return neighbours  // the neighbours of each cell, in an array
}

const initCost = (g = grid) => new Array(g.width * g.height).fill(Infinity)

const gridCell = (col, row, g = grid) => col + row * g.width
// returns the index of a grid cell in a (flat) array

const getRow = (cell, g) => Math.floor(cell / g.width)
const getCol = (cell, g) => cell % g.width




class Qelement {
    constructor(element, priority, grid) {
        this.element = element
        this.priority = priority
        this.neighbours = getNeighbours(element, grid)
    }
}

class PriorityQueue {
    constructor() {
        // an array to hold the items
        this.items = []
    }
    // methods
    isEmpty = () => this.items.length === 0

    dequeue = () => {
        if (this.isEmpty()) return "Underflow"
        return this.items.shift()
    }

    peek = () => {
        if (this.isEmpty()) return "No elements in the queue"
        return this.items[0]
    }

    enqueue = (element, priority, grid) => {
        // creating new object for the queue
        const qElement = new Qelement(element, priority, grid)
        let contain = false
        // iterating through the array to add item at the correct location
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement)
                contain = true
                break
            }
        }
        // if the element hasn't already been added it has the highest priority
        // and is added to the front of the PriorityQueue
        if (!contain) this.items.push(qElement)
    }

    changePriority = (element, newPriority) => {
        // remove the old item from the PriorityQueue
        for (let i = 0; i < items.length - 1; i++) {
            if (this.items[i].col === element.col
                && this.items[i].row === element.row) {
                this.items.splice(i, 1)
                break
            }
        }
        // enqueue the new one.
        this.enqueue(element, newPriority)
    }
}

const data = testData.map(e => e.split(""))

const makeFlatGrid = (data) => {
    return { width: data[0].length, height: data.length, values: data.flat() }
}

const bigFlatGrid = (data = testData) => {
    const smallBlock = data.map(e => e.split("").map(d => +d))
    let bigBlockValues = []
    // add 4 more blocks of columns to each row of initial block
    // to reach 5 * initial colums total.
    // Each added block are 1 greater than the last, 
    // but wrapping back from 9 to 1  (9 + 1 = 1)

    for (let c = 0; c < smallBlock[0].length; c++) { // there are smallBlock[0].length rows to add to
        // add 1 col for each row entry of small block, repeat x 4  
        for (let b = 0; b < 5; b++) {
            bigBlockValues.push(smallBlock[c].map(e => (e + b - 1) % 9 + 1)) // numbers increase by 1 for each cell block of columns added
        }        
    }
    // this gives a number of arrays 5 * the number of lines in sb..
    // ..now add thee another 4 times, adding another one (wrapped at 9) to each loop
    for (let b = 1; b < 5; b++) { // add 1, 
        for (let arr = 0; arr < 5 * smallBlock.length; arr++) { // there are smallBock.height rows to add to
            bigBlockValues.push(bigBlockValues[arr].map(e => (e + b - 1) % 9 + 1)) // numbers increase by 1 for each block of rows added
        }
    } 

    return { width: smallBlock[0].length * 5, height: smallBlock.length * 5, values: bigBlockValues.flat() }

}
// console.log(bigFlatGrid())

const solveIt  = async() => {

    const data = await readlines()
    const grid = bigFlatGrid(data)
    // const grid = makeFlatGrid(data.map(e => e.split("")))
      
    const cost = grid.values  // will use values as independent array here
    // create the PriorityQueue
    let q = new PriorityQueue
    // create a set to mark visited nodes
    let visited = new Set()
    // initialise priority of cells to Infinity
    let priority = new Array(grid.width * grid.height).fill(Infinity)
    // reset start cell to priority 0
    priority[0] = 0
    // add start to queue
    const start = gridCell(0, 0, grid)
    q.enqueue(start, 0, grid)
    // the target cell is at bottom corner
    const end = gridCell(grid.width - 1, grid.height - 1, grid)

    // ** Cycle of path search
    let next
    while (!q.isEmpty()) {
        // Dequeue next priority element and add it to visited set
        next = q.dequeue()
        if (!visited.has(next.element)) { // * a visited cell in the queue will already have been treated
            visited.add(next.element)
            // update cost of unvisited neighbours and add them to the Priority Queue to visit
            for (let n of next.neighbours) {
                if (visited.has(n)) continue
                // priority reset as lowest cost to get there discovered so far
                // cells numbers same as array indices in cost array, so use indices to find them
                // cumulative ?? input cell cost + (for A*) heuristic gives priority for the queue (A*)
                // could use Manhattan => proportional to distance to end (without diagonal travel)
                // if use heuristic.. may need to track parent too.. 
                if (priority[n] > next.priority + +cost[n])  // will always be lower than initial Infinity
                    priority[n] = next.priority + +cost[n]
                // priority will always be higher if changed here.
                // * don't need to change the priority of this neighbour in the queue, just enqueue it again
                // at higher priority; it will not be used if in visited set when dequeued
                q.enqueue(n, priority[n], grid) // the cumulative cost is the priority
            }
            if (next.element === end) break  // target node reached 
        }
    }
    return priority[end]

}

// console.log(solveIt(grid))

solveIt().then(console.log)
