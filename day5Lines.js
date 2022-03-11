/* calculate points covered by more than one line */


const fs = require ('fs').promises

const readLines = async () => {
    const data = await fs.readFile("input5.txt", {encoding: 'utf8'})
    return data.split(/\r\n|\r|\n/) //split on newline
    //  (/\r\n|\r|\n/) works on all platforms with different line endingd
}

const solveIt  = async() => {
    const data = await readLines()
    // at least twp points overlap where the point in a set is not duplicated in the union of sets
    const ptSets = makePts(data)
    
    const setUnion = ptSets.reduce((a,b) => union(a,b))
    // initialise a Map from the set union, with initial values set to 0
    let pointMap = new Map([...setUnion].map(x => [x, 0])) // make a map of all the set vales
    // Iterate through the indivdual sets, incrementing the Map value for the matching key
    ptSets.forEach(set => set.forEach((pt) => pointMap.set(pt, pointMap.get(pt) + 1)))  

    const ptCountOver1 = [...pointMap].filter(([k, v]) => v > 1).length   // trick to filter a Map

    return ptCountOver1
}

/* > s = new Set(['13_14', '13_15'])
Set(2) { '13_14', '13_15' }
> a = [...s]
[ '13_14', '13_15' ]
> a.map(x => [x, 0])
[ [ '13_14', 0 ], [ '13_15', 0 ] ]
> m2 = new Map(a.map(x => [x, 0])
... )
Map(2) { '13_14' => 0, '13_15' => 0 }
> */

const makePts = (inputLines) => {
    let regex = new RegExp("\\s+", "g")  // regular expression \s matches all whitespace characters (includes tabs and newlines)
    let pts = []
    let cleanLine
    let pt1
    let pt2
    let x1
    let x2
    let y1
    let y2
    let linePtsSet
    /* 
    TODO replace testInput with inputLines (all input) 
    */
    let testInput = testLines(inputLines)
    for (let line of inputLines) {
    // format as array deconstruct point co-ordinates
        cleanLine = line.replace(regex, '') // "0,9 -> 5,9"
            .split('->') // [ '0,9 ', ' 5,9' ]
          //  .map(x => x.trim())) // [ '0,9', '5,9' ]
         //   .map(x => x.split(',')) // [ [ '0', '9' ], [ '5', '9' ] ]    
        // lines.push([(x1 + '_' + y1), (x2 + '_' + y2)])
 //       console.log(cleanLine)
        /* [start,end] = cleanLine   !!! array deconstruction failed like this.. 
        cleanLine not as expected and had something else in it..
        */
        pt1 = cleanLine[0].split(',')
        pt2 = cleanLine[1].split(',')
        x1 = Number(pt1[0])
        y1 = Number(pt1[1])
        x2 = Number(pt2[0])
        y2 = Number(pt2[1])
        

        // [start, end] = cleanLine

       // [x1, y1] = start
    // [x2, y2] = end

        linePtsSet = getPtsSet(x1,y1,x2,y2)
        if (linePtsSet.size > 0) pts.push(linePtsSet)
    }
    return pts
}

// create testLines as first few input lines to test the model
const testLines = (lines) => {
    let smallLines = []
    for (let i = 0; i < 10; i++) {
            smallLines.push(lines[i])
    }
    return smallLines
}

const getPtsSet = (x1,y1,x2,y2) =>{ // or start and end and deconstruct internally
// return set of points between the start and end line values
    let ptsArr = []
    let key = ''
    // this code assumes only horizontal or vertical lines

    // horizontal line
    if (y1 === y2) {
        const xLow = x1 < x2 ? x1 : x2 
        const xHigh = x1 > x2 ? x1 : x2 
        for (let x = xLow; x < xHigh + 1; x = x + 1) { //includes the high end point
            key = x.toString() + '_' + y1.toString() 
            ptsArr.push(key) //  this string will be used as a key for the point
        }
    } else if (x1 === x2) {
    // vertical line
        const yLow = y1 < y2 ? y1 : y2 
        const yHigh = y1 > y2 ? y1 : y2 
        for (let y = yLow; y < yHigh + 1; y = y + 1) {
            key = x1.toString() + '_' + y.toString() 
            ptsArr.push(key) // the number of these points initially set to 0
        }   
    } else { // diagonal.
        const xIncrement = x2 > x1 ? 1 : -1
        const yIncrement = y2 > y1 ? 1 : -1
        let x = x1
        for (let y = y1, x = x1 ; y != y2; y = y + yIncrement, x = x + xIncrement) {
            // ... assumes 45 degree line
            key = x.toString() + '_' + y.toString() 
            ptsArr.push(key) 
        }
        key = x2.toString() + '_' + y2.toString() 
        ptsArr.push(key)   // include the end point, reached when y = y2, after the loop ended
    }
    return new Set(ptsArr)
}

let pointCount = (ptsArr) => {
    for (linePts in ptsArr)
        console.log(Object.keys)
}

let points = {1_2:2, 2_3:3}
const multiPoints = (minNumber, points) => {
    return Object.values(points).filter(x => x >= minNumber).length
}
// console.log("multiPoints", multiPoints(2, points))

solveIt().then(console.log)

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
