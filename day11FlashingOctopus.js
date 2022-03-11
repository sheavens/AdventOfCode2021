

/* Problem models a grid of numbers 0-9, representing flashing Octopuses

You can model the energy levels and flashes of light in steps. During a single step, the following occurs:

First, the energy level of each octopus increases by 1.

Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent octopuses by 1, 
including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level greater than 9, it also flashes. 
This process continues as long as new octopuses keep having their energy level increased beyond 9. 
(An octopus can only flash at most once per step.)

Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
 */

const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input11.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new lines
};

const day11Input = ["2478668324".split(''),
"4283474125".split(''),
"1663463374".split(''),
"1738271323".split(''),
"4285744861".split(''),
"3551311515".split(''),
"8574335438".split(''),
"7843525826".split(''),
"1366237577".split(''),
"3554687226".split('')]


const testGridData = ["5483143223".split(''),
                      "2745854711".split(''),
                      "5264556173".split(''),
                      "6141336146".split(''),
                      "6357385478".split(''),
                      "4167524645".split(''),
                      "2176841721".split(''),
                      "6882881134".split(''),
                      "4846848554".split(''),
                      "5283751526".split('')]
    
const smallTest =    ["11111".split(''),
                      "19991".split(''),
                      "19191".split(''),
                      "19991".split(''),
                      "11111".split('')]

                        
const getPoints = (grid, data) => {
// store row, column and value in an object, and return an array of all of them
    pts = []
    for (let row = 0; row < grid.height; row++) {
            for (let col = 0; col < grid.width; col++) {
                pt = {col: Number(col), row: Number(row), value: Number(data[row][col])}
                pts.push(pt)
            }
    }
    return pts
}

const filterOver9 = (points) => points.filter(pt => pt.value > 9) // changed to over 9 (not 9 or Over)
const updatePoints = (points) => points.map(pt => pt = { col: pt.col, row: pt.row, value: pt.value + 1 })
const samePoints = (points) => points.map(pt => pt = { col: pt.col, row: pt.row, value: pt.value})
const flash = (points) => points.map(pt => pt = { col: pt.col, row: pt.row, value: pt.value > 9 ? 0 : pt.value })

const onNorthEdge = (point, grid) => point.row === 0 ? true : false
const onSouthEdge = (point, grid) => point.row ===  grid.width-1  ? true : false
const onEastEdge = (point, grid) => point.col ===  grid.width-1  ? true : false
const onWestEdge = (point, grid) => point.col ===  0 ? true : false

const addEnergyToNeighbours = (points, thisPoint, grid) => {
    // update neighbour to North
    if (!onNorthEdge(thisPoint, grid)) 
        points = points.map(pt => pt.row === thisPoint.row - 1 && pt.col === thisPoint.col ?
          { col: pt.col, row: pt.row, value: pt.value + 1 } : { col: pt.col, row: pt.row, value: pt.value } )                                      
    // update neighbour to South
    if (!onSouthEdge(thisPoint, grid)) 
        points = points.map(pt => pt.row === thisPoint.row + 1 && pt.col === thisPoint.col ?  
        { col: pt.col, row: pt.row, value: pt.value + 1 } : { col: pt.col, row: pt.row, value: pt.value } )   
    // update neighbour to East
    if (!onEastEdge(thisPoint, grid)) 
        points = points.map(pt => pt.row === thisPoint.row && pt.col === thisPoint.col + 1 ?  
        { col: pt.col, row: pt.row, value: pt.value + 1 } : { col: pt.col, row: pt.row, value: pt.value } )   
    // update neighbour to West
    if (!onWestEdge(thisPoint, grid)) 
        points = points.map(pt => pt.row === thisPoint.row && pt.col === thisPoint.col - 1?   
        { col: pt.col, row: pt.row, value: pt.value + 1 } : { col: pt.col, row: pt.row, value: pt.value } )   
    // update neighbour to North East
    if (!onNorthEdge(thisPoint, grid) && !onEastEdge(thisPoint, grid)) 
        points = points.map(pt => pt.row === thisPoint.row - 1 && pt.col === thisPoint.col + 1 ?   
        { col: pt.col, row: pt.row, value: pt.value + 1 } : { col: pt.col, row: pt.row, value: pt.value } )   
    // update neighbour to North West
    if (!onNorthEdge(thisPoint, grid) && !onWestEdge(thisPoint, grid)) 
        points = points.map(pt => pt.row === thisPoint.row - 1 && pt.col === thisPoint.col - 1 ?   
        { col: pt.col, row: pt.row, value: pt.value + 1 } : { col: pt.col, row: pt.row, value: pt.value } )   
    // update neighbour to South East
    if (!onSouthEdge(thisPoint, grid) && !onEastEdge(thisPoint, grid))  
        points = points.map(pt => pt.row === thisPoint.row + 1 && pt.col === thisPoint.col + 1 ?   
        { col: pt.col, row: pt.row, value: pt.value + 1 } : { col: pt.col, row: pt.row, value: pt.value } )   
    // update neighbour to South West
    if (!onSouthEdge(thisPoint, grid) && !onWestEdge(thisPoint, grid)) 
        points = points.map(pt => pt.row === thisPoint.row + 1 && pt.col === thisPoint.col - 1 ?   
        { col: pt.col, row: pt.row, value: pt.value + 1 }: { col: pt.col, row: pt.row, value: pt.value }) 
    return points
}

/* filter out the over 9s, increment their neibours and add the point to a set of already checked.
repeat until no more unchecked 9s. All points over 9 flash (reset to zero)*/

const solveItDay11 = async() => {
    const data = day11Input
    // const data = await readlines()
    // data.map(d => d.trim().split(' '))

    let grid = { width: data[0].length, height: data.length }  // just holds grid dimentions
    let points = getPoints(grid, data) // points will contain the data values 

    let flashCount = 0
    const MAXSTEPS = 1000
    for (let step = 1; step <= MAXSTEPS; step++) {

        points = updatePoints(points)

        let flashSet = new Set()
        let lastFlashSetSize
        let readyToFlash = filterOver9(points)
        let lastReadyToFlashLength = 0

        // For an Octopus with energy above 9, update the energy of each neighboring Octopus by 1
        // then repeat so that Octpuses now abve 9 also have their neighbous incremented.
        
        while (readyToFlash.length > lastReadyToFlashLength) {
            lastReadyToFlashLength = readyToFlash.length
            lastFlashSetSize = flashSet.size
            for (let point of readyToFlash) {
                lastFlashSetSize = flashSet.size
                // save points in Set as strings - not objects, which are resference objects so duplicate values would be included in the set.
                flashSet.add(point.row.toString()+point.col.toString())  
                // for any point ready to flash not already accounted for, increment the energy of its neighbours
                if (flashSet.size > lastFlashSetSize) { 
                    points = addEnergyToNeighbours(points, point, grid) 
                }
                // filter out the points over 9
                readyToFlash = filterOver9(points)
            }
        }
        if (readyToFlash.length === 100 ) {
            console.log(step)
            return step
        }
        // Once there are no more points ready to flash - flash!  All the points ready to flash reset energy to zerp
        for (let point of readyToFlash) {
            points[point.row * grid.width + point.col].value = 0  //flash
            flashCount +=1
        }
    }
    
    return flashCount
}

    
solveItDay11().then(console.log)
    
