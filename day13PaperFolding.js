
const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input13.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new lines
};

const testInput = ["6,10",
"0,14",
"9,10",
"0,3",
"10,4",
"4,11",
"6,0",
"6,12",
"4,1",
"0,13",
"10,12",
"3,4",
"3,0",
"8,4",
"1,10",
"2,14",
"8,10",
"9,0"]

/* fold along y=7
fold along x=5 */
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



// function to translate corrdinates into a string, for unique Set values
const pointsAsStrings = (arr) =>  arr.map(r => r[0].toString() + "_" + r[1].toString())
const pointAsString = (pair) =>  pair[0].toString() + "_" + pair[1].toString()

const  points = testInput.filter(d => !isNaN(d[0])).map(d => d.split(',').map(e => parseInt(e)))
const pt = points[2]

const translate = (pt, rows = 0, cols = 0 ) => [Number(pt[0]) + cols, Number(pt[1]) + rows]
const rotate45 = (pt, clockWise = true) => clockWise ? [Number(pt[1]), -1 * Number(pt[0])] : [Number(-1 * pt[1]), Number(pt[0])]
// console.log("translate", translate(pt, 7))
// console.log("rotate", rotate45(pt))
// console.log("rotate antiC.", rotate45(pt, false))
// console.log("rotateAndBack", rotate45(rotate45(pt),false))

const reflectRow0 = (pt) => [Number(pt[0]), Number(pt[1]) *(-1)]
const reflectCol0 = (pt) => [Number(pt[0]) *(-1), Number(pt[1])]

// console.log("reflect0", reflectRow0(pt))

const reflectAboutRow = (pt, rowNum = 0) => pt[1] < rowNum ? pt : translate(reflectRow0(translate(pt, -1 * +rowNum)), +rowNum)
// console.log("reflectAboutRow", reflectAboutRow(pt, 7))

const reflectAboutCol = (pt, colNum = 0) => pt[0] < colNum ? pt : translate(reflectCol0(translate(pt, 0 , -1 * +colNum)), 0, +colNum)
// console.log("reflectAboutCol", reflectAboutCol(pt, 7))

// console.log("reflect at row 7", points.map(pt => reflectAboutRow(pt, 7)))
// console.log(" reflect at col 7", points.map(pt => reflectAboutCol(pt, 7)))

const stringToPair = (string = "4_3") => string.split("_")
const maxCol = (pairs) => pairs.map(p => +p[0]).reduce((a,b) => a < b ? b : a)
const maxRow = (pairs= [[4,3],[5,10]]) => pairs.map(p => +p[1]).reduce((a,b) => a < b ? b : a)
console.log(maxRow())

const printGrid = (stringPointSet) => {
  let printLine = []
  const gridPoints = [...stringPointSet].map(s => stringToPair(s))
  const grid = { width: maxCol(gridPoints), height: maxRow(gridPoints), values: gridPoints}
  for (let row = 0; row < grid.height + 1; row++) {
    printLine = []
    for (let col = 0; col < grid.width + 1; col++) {
      stringPointSet.has(pointAsString([+col,+row])) ?

        printLine = printLine + "#" : printLine = printLine + "."
        if (stringPointSet.has(pointAsString([+col,+row]))) {
          stringPointSet.delete(pointAsString([+col,+row]))
        } 
    }
    // console.log(stringPointSet)
    console.log(printLine)
  }
}


const solveItPart2  = async() => {
  //const data = testInput
  //const folds = [["y", 7],["x", 5]]
  const data = await readlines()
  const folds = data.filter(d => d.includes("fold")).map(i =>i.replace("fold along ","").split("="))
  let points = data.filter(d => !isNaN(d[0])).map(d => d.split(',').map(e => Number(e)))
  
  let afterReflection, afterReflectionSet
  for (let fold of folds) { 
    if (fold[0] === "y") {
      points = points.map(pt => reflectAboutRow(pt, fold[1]))
    } else {
      points = points.map(pt => reflectAboutCol(pt, fold[1]))
    }
  afterReflectionSet = new Set(pointsAsStrings(points))
  }
 
  printGrid(afterReflectionSet)

  return  afterReflectionSet.size // fold[0] is the axis, X or Y.  fold[1] is the line number to fold at 
}

solveItPart2().then(console.log)