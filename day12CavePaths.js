/* find all paths from start to end passing through smaller caves (lower case letters) only once */


const test =["start-A", "start-b",
"A-c",
"A-b",
"b-d",
"A-end",
"b-end"]

const test2 =[
"fs-end",
"he-DX",
"fs-he",
"start-DX",
"pj-DX",
"end-zg",
"zg-sl",
"zg-pj",
"pj-he",
"RW-he",
"fs-DX",
"pj-RW",
"zg-RW",
"start-pj",
"he-WI",
"zg-he",
"pj-fs",
"start-RW"
]

const data = 
[
"BC-gt",
"gt-zf",
"end-KH",
"end-BC",
"so-NL",
"so-ly",
"start-BC",
"NL-zf",
"end-LK",
"LK-so",
"ly-KH",
"NL-bt",
"gt-NL",
"start-zf",
"so-zf",
"ly-BC",
"BC-zf",
"zf-ly",
"ly-NL",
"ly-LK",
"IA-bt",
"bt-so",
"ui-KH",
"gt-start",
"KH-so"
]

const getLinks = (data, cave) =>
    (data.filter(e => e[0] === cave || e[1] === cave).map(p => p.filter(e => e !== cave))).flat()

//make a Map of neighbours
const getLinkMap = (data) => {
    let caveSet = new Set()
    let from, to
    // make set of all caves
    for (let link of data)  {
        [from, to] = link
        caveSet.add(from)
        caveSet.add(to)
    }
    // make neighbour list for each cave
    let linkMap = new Map()
    for (let cave of Array.from(caveSet)) {
        linkMap.set(cave, getLinks(data, cave)) 
    }
    return linkMap
}

class LIFOQueue {
    constructor() {
        // an array to hold the items
        this.items = []
    }
    // methods
    isEmpty = () => this.items.length === 0

    dequeue = () => {
        if (this.isEmpty()) return "Underflow"
        return this.items.pop()  //! LIFO (otherwise shift)
    }

    peek = () => {
        if (this.isEmpty()) return "No elements in the queue"
        return this.items[0]
    }

    enqueue = (item) => {
        this.items.push(item)
    }
}

const numPaths = (cave, caveMap) => {
    // !! this is giving a BFS and incorrectly stopping paths when
    // a small cave has been visited on a different path..
    let q = new LIFOQueue
    let smallCavesVisited = new Set()
    let linkedCaves = []
    let paths = 0

    q.enqueue("start") // start from this cave
    smallCavesVisited.add("start")  // don't revist start from other caves

    while (!q.isEmpty()) {
        cave = q.dequeue()
        if (cave === "end") { // don't enqueue neighbours of end 
            paths = paths + 1 // end of path reached
        } else {
            linkedCaves = caveMap.get(cave)
            for (let nextCave of linkedCaves) { //enqueue the visitable neighbours
                if (!smallCavesVisited.has(nextCave)) q.enqueue(nextCave)
                if (cave.toLowerCase() === cave) smallCavesVisited.add(cave)  //small caves are lower case
            }
        }
    }
    return paths
}

const getPaths = (cave, caveMap, smallCavesVisited = new Set(), noSmallCaveVisitedTwice = true) => {

    //check whether the goal has been reached
    if (cave === "end") return 1

    let path = 0

    // take unvisited small caves only - or, in Part 2 allow one small cave only to bevisited twice
    if (!smallCavesVisited.has(cave ) || 
    (noSmallCaveVisitedTwice) && cave !== "start") {
        if (smallCavesVisited.has(cave)) noSmallCaveVisitedTwice = false

    //1. mark the current node as visited (small caves cannot be revisited)
    // at the start, will add start to visited.  Saqme position for the two branches
    /// coming from start
 
     if (cave.toLowerCase() === cave) smallCavesVisited.add(cave) //small caves are lower case
        // check that the child node had not been visited - skip it if so
        
        //console.log("unvisited cave", cave)

        const linkedCaves = caveMap.get(cave)

        // 3. Iterate over the unvisited child nodes (linked caves)
        for (let nextCave of linkedCaves) {
            
            //!!!!! visited set passed by reference and stopping new paths visiting small caves .. make new Set
               path = path + getPaths(nextCave, caveMap, new Set(Array.from(smallCavesVisited)), noSmallCaveVisitedTwice)
         
        }
        

    }

    return path
}

const solveIt = (rawData) => getPaths(cave = "start", caveMap = getLinkMap(rawData.map(d => d.split('-'))))

console.log(solveIt(data))





