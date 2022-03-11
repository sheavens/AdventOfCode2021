const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input14.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new line
};

const testTemplate = "NNCB"

const testPairInsertions = [
"CH -> B",
"HH -> N",
"CB -> H",
"NH -> C",
"HB -> C",
"HC -> B",
"HN -> C",
"NN -> C",
"BH -> H",
"NC -> B",
"NB -> B",
"BN -> B",
"BB -> N",
"BC -> B",
"CC -> N",
"CN -> C"
]

const inject = (a, b, insertionMap) => insertionMap.get(a+b) 

const tally = (polymer) => polymer.reduce((total,next) => {
    total[next] = (total[next] || 0) + 1
    return total
}, {})

const polymerPairs = (polymer) => {
    let pairs = []
    for (let i = 0; i < polymer.length - 1; i++) pairs = [...pairs, polymer[i]+polymer[i+1]]
    return pairs
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

const combinedTally = (tallya, tallyb) => {
    let combined = {}
    const keySet = union(new Set(Object.keys(tallya)), new Set(Object.keys(tallyb)))
    for (let key of keySet) combined[key] = (+tallya[key] || 0) + (+tallyb[key] || 0)
    return combined
}

const max = (arr) => arr.reduce((a,b) => a < b ? b : a)
const min = (arr) => arr.reduce((a,b) => a > b ? b : a)

const tallyMax = (tally) => max(Object.values(tally))
const tallyMin = (tally) => min(Object.values(tally))

/* const solveIt  = async() => {
    // const template = testTemplate
    // const pairInsertions = testPairInsertions.map(d => d.split("->").map(e => e.trim()))
    const data = await readlines()
    const template = data[0]
    const pairInsertions = data.filter(d => d.includes("->")).map(e => e.split("->").map(f => f.trim()))
    const injectionMap = new Map(pairInsertions)
    let polymer = template
    let lastPoly
    const MAXSTEPS = 1
    for (let step = 0; step < MAXSTEPS; step++) {
        lastPoly = polymer
        polymer = new Array(lastPoly[0])
        for (let i = 0;  i < lastPoly.length - 1; i++) {
            polymer = inject(lastPoly[i], lastPoly[i+1], injectionMap) ?
                [...polymer,  inject(lastPoly[i], lastPoly[i+1], injectionMap), lastPoly[i+1]] : 
                [...polymer,  lastPoly[i+1]]
        }   
    }
    const countByLetter = tally(polymer)
    return tallyMax(countByLetter) - tallyMin(countByLetter)
} */

const buildPoly = (step, polymer, injectionMap) => {
    const MAXSTEPS = 1
    if (step > MAXSTEPS) return polymer.length //tally(polymer) 
    let length = 0// let tally = {} // I think this might not matter here as only the value at the top level will be needed
    
    lastPoly = polymer
    polymer = new Array(lastPoly[0])
    for (let i = 0;  i < lastPoly.length - 1; i++) {
        polymer = inject(lastPoly[i], lastPoly[i+1], injectionMap) ?
            [...polymer,  inject(lastPoly[i], lastPoly[i+1], injectionMap), lastPoly[i+1]] : 
            length  = length + buildPoly(step+1, [...polymer,  lastPoly[i+1]], injectionMap)
            // tally = combinedTally(tally, buildPoly(step+1, [...polymer,  lastPoly[i+1]], injectionMap))
    } 
    
    return length //tally 
}



/* const solveItPart2  = async() => {
    const template = testTemplate
    const pairInsertions = testPairInsertions.map(d => d.split("->").map(e => e.trim()))
    // const data = await readlines()
    // const template = data[0]
    // const pairInsertions = data.filter(d => d.includes("->")).map(e => e.split("->").map(f => f.trim()))
    const injectionMap = new Map(pairInsertions)

    const countByLetter = buildPoly(step = 0, polymer = template, injectionMap)


    return tallyMax(countByLetter) - tallyMin(countByLetter)
}
 */
const newObject = (pair, number, injectionMap) => {
    const addLetter = injectionMap.get(pair)
    o = {}
    if (!addLetter) {
        return null
    } else {
        o[pair[0]+addLetter] = number
        o[addLetter+pair[1]] = number
        return o
    }    
} 

const newLetterObject = (pair, number, injectionMap) => {
    const addLetter = injectionMap.get(pair)
    o = {}
    if (!addLetter) {
        return null
    } else {
        o[addLetter] = number
        return o
    }    
}

const letters = (pair, number) => {
    let l = {}
    l[pair[0]] = number
    l[pair[1]] = number
    return l
}

const letterTally = (pairCount) => {
    let tally = {}
    let count1= {} 
    let count2 = {}
    Object.entries(pairCount).forEach(([key, value]) => {
       count1[key[0]] = value
       tally = combinedTally(tally, count1)
       count2[key[1]] = value 
       tally = combinedTally(tally, count2)   
    })
    return tally
}

const solveItPart2A  = async() => {
    // const template = testTemplate
    // const pairInsertions = testPairInsertions.map(d => d.split("->").map(e => e.trim()))
    const data = await readlines()
    const template = data[0]
    const pairInsertions = data.filter(d => d.includes("->")).map(e => e.split("->").map(f => f.trim()))
    const injectionMap = new Map(pairInsertions)
    
    let polymer = template
    let newTally = {}

    
// loop through the injection Map. for each in the Tally object, add to a new tally object the new ckeys and the values of the
// from the previous tally object.   Combine this with the next ones...

// start with a count of the pairs in the initial template
let pairCount = (tally(polymerPairs(template))) // great!
let letterCount = (tally([...template])) 

MAXSTEP = 40
let counts, newPairs, letterCounts 
for (step = 0; step < MAXSTEP; step++) { 
   counts = {}, letterCounts = {}  // a new count of pairs is created at each step
   Object.entries(pairCount).forEach(entry => {
       const [pair, number] = entry
       newPairs = newObject(pair, number, injectionMap)
       counts = combinedTally(counts, newPairs) // combine these pairs into the tally
       letterCounts = combinedTally(letterCounts, newLetterObject(pair, number, injectionMap))   
   })
   pairCount = counts
   letterCount = combinedTally(letterCount, letterCounts)
}

// have got a count of letter pairs.   Need a count of letters 
// split the letter pairs and count the letters.  The first and last letter of each letter
// the template is part of a single pair.. so that letter is letterCount - 1 /2
// other letters are lettercount / 2




console.log("letter max", tallyMax(letterCount))
console.log("letter min", tallyMin(letterCount)) 


    return tallyMax(letterCount) - tallyMin(letterCount) // !!! no!! wrong count.   both counts off by one so difference ok
}
solveItPart2A().then(console.log)

    