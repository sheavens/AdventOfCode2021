const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input9.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new lines
};

const sumRisk = (arr) => arr.reduce((a,b) => Number(a) + Number(b) + 1, 0)

const solveIt  = async() => {
    const data = await readlines()
    data.map(x => x.trim().split(' '))
    let localMinArr = []
    for (let line = 0; line < data.length; line++) {
    // look at neighbours north, south east and west. neibours outside the data field set to infinity
        for (let x = 0; x < data[line].length; x++) {
            if (belowNorth(data, line, x) && 
                belowSouth(data, line, x) &&
                belowEast(data, line, x) &&
                belowWest(data, line, x)) localMinArr.push(data[line][x])
        }
    }
    return sumRisk(localMinArr)
}

// note that grid.values[y][x] correspond to row y, column x, so this is the right order for pt{x:x, y:y, grid.values[y][x]}
// to correspond to the grid values as seen in an x y box
const northPoint = (pt, grid) => pt.y === 0 ? null : {x: pt.x, y: pt.y - 1, value: grid.values[pt.y - 1][pt.x]}
const northHigher = (pt, grid) => {
    const n = northPoint(pt, grid)
    return n && n.value > pt.value && n.value < 9 
}
// north exits and is higher but less than 9

const southPoint = (pt, grid) => pt.y === grid.height-1 ? null : {x: pt.x, y: pt.y + 1, value: grid.values[pt.y + 1][pt.x]}
const southHigher = (pt, grid) => {
    const s = southPoint(pt, grid)
    return s && s.value > pt.value && s.value < 9
}

const westPoint = (pt, grid) => pt.x === 0 ? null : {x: pt.x - 1, y: pt.y, value: grid.values[pt.y][pt.x - 1]}
const westHigher = (pt, grid) => {
    const w = westPoint(pt, grid)
    return w && w.value > pt.value && w.value < 9
}

const eastPoint = (pt, grid) => pt.x ===  grid.width-1 ? null : {x: pt.x + 1, y: pt.y, value: grid.values[pt.y][pt.x + 1]}
const eastHigher = (pt, grid) => {
    const e = eastPoint(pt, grid)
    return e && e.value > pt.value && e.value < 9 
}


const basinSize = (pt, grid, basinSet = new Set()) => {
    basinSet.add(pt.x.toString()+pt.y.toString())  // objects were compared as references so convert to strings to prevent duplicates
  //  console.log(basinSet, basinSet.size)
    if (northHigher(pt, grid)) basinSet = basinSize(northPoint(pt, grid), grid, basinSet)
    if (southHigher(pt, grid)) basinSet = basinSize(southPoint(pt, grid), grid, basinSet)
    if (eastHigher(pt, grid))  basinSet = basinSize(eastPoint(pt, grid), grid, basinSet)
    if (westHigher(pt, grid))  basinSet = basinSize(westPoint(pt, grid), grid, basinSet)
    return basinSet
}


const testGridData = ["2199943210".split(''),
                      "3987894921".split(''),
                      "9856789892".split(''),
                      "8767896789".split(''),
                      "9899965678".split('')]

const testGrid = {width: 10, height: 5, values: testGridData} 
// console.log(basinSize({x:2, y:2, value:5}, testGrid) )                
            
//these have been edited so part 1 may not work anymore!
const belowNorth = (pt, grid) => !northPoint(pt, grid) || northPoint(pt, grid).value > pt.value
// north does not exist (edge of grid) or north is higher 

const belowSouth = (pt, grid) => !southPoint(pt, grid) || southPoint(pt, grid).value > pt.value
const belowEast = (pt, grid) => !eastPoint(pt, grid) || eastPoint(pt, grid).value > pt.value
const belowWest = (pt, grid) => !westPoint(pt, grid) || westPoint(pt, grid).value > pt.value


const topThree = (arr, top = 3) => arr.sort((a, b) => b - a).slice(0,3)
// console.log(topThree([14,3,6,8,1,2,9,67]))

const sum = (arr) => arr.reduce((a, b) => a + b, 0) 
const mult = (arr) => arr.reduce((a, b) => a * b, 1) 
// console.log(mult(topThree([14,3,6,8,1,2,9,67])))


const solveItPart2  = async() => {
    // const data = testGridData
    const data = await readlines()
    data.map(d => d.trim().split(' '))
    let pt = {}
    let sizes = []
    let grid = { width: data[0].length, height: data.length, values: data }
    for (let y = 0; y < grid.height; y++) {
    // look at neighbours north, south east and west. neighbours outside the data field set to infinity
        for (let x = 0; x < grid.width; x++) {
            pt = {x: x, y: y, value: grid.values[y][x]}
            // find the low points in the grid, and the size of the surrounding basins
            if (belowNorth(pt, grid) && 
                belowSouth(pt, grid) &&
                belowEast(pt, grid) &&
                belowWest(pt, grid)) sizes.push(basinSize(pt, grid).size)  //basinSize returns a set of basin coords, os size basinSize   
        }
    }
    console.log(sizes)
    return mult(topThree(sizes))
}




/* const belowSouth = (pt, grid) => {
    if (pt[y] === grid.length - 1) return true  
    return grid[pt[x]][pt[y]] < grid[pt[x]+1][pt[x][y]]  // do equal values get included as mins?
}

const belowEast = (pt, grid) => {
    if (pt[y] === grid.length - 1) return true
    return grid[pt[x]][pt[y]] < grid[pt[x]][pt[y]+1]  // do equal values get included as mins?
}

const belowWest = (pt, grid) => {
    if (pt[y] === 0) return true
    return grid[pt[x]][pt[y]] < grid[pt[x]][pt[y]-1]  // do equal values get included as mins?
}
 */
solveItPart2().then(console.log)
    
