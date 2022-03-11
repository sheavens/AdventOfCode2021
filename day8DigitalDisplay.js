/* Decode wiring a-g lighting segments of digital numbers 1-9 on display.  Know how many wires needed for each digit, and what the 
correct wire letters are.  (Digits are displayed by lighting up segments of a digital digit . e.g an eight has all 7 
segments lit) */

const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input8.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new lines
};

const solveIt  = async() => {
    const data = await readlines()
    let wrongWires = [], encodedMessages = []
    let wrongWiring, encodedMessage
    for (let line of data) {
        [wrongWiring, encodedMessage] = line.split('|')
        wrongWires.push(wrongWiring.trim().split(' '))
        encodedMessages.push(encodedMessage.trim().split(' '))
    }  
    const countMap = countDigits(encodedMessages)
    return countMap.get(1) + countMap.get(4) + countMap.get(7) + countMap.get(8)
}

const decode = (encodedMessage, digits) => {
    let soln = ''
    for (let l of encodedMessage) {
        let lSet = new Set(l.split(''))
        for (let n = 0; n <10; n++) {
           if (isSameSet(lSet, digits.get(n))) soln = soln + n
        }
    }
    return soln
}

const solveItPart2  = async() => {
    // const data = ["acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"]
    const data = await readlines()
    let digits, decoded, sumResults = 0
    let wrongWiring, encodedMessage
    for (let line of data) {
        [wrongWiring, encodedMessage] = line.split('|')
        const wrongWires = wrongWiring.trim().split(' ')  // a array of groups of wire letters
        digits = digitSets(wrongWires)
        const encoded = encodedMessage.trim().split(' ')  // a array of groups of wire letters
        decoded = decode(encoded, digits)
        sumResults = sumResults + Number(decoded)
    }
    return sumResults
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

const digitSets = (wrongWires) => {
    let digitZero, digitOne, digitTwo, digitThree, digitFour, digitFive, digitSix, digitSeven, digitEight, digitNine
    let segmentBottomLeft, segmentBottomRight, segmentTopLeft, segmentTopRight, segmentBottom, segmentMiddle, segmentTop
    for (let wire of wrongWires) {
        // some digits can be identified from the number of segments lit (number of wire letters used)
        if (wire.length === 2) { 
           digitOne = new Set(wire.split('')) 
        } else if (wire.length === 4)  {
            digitFour = new Set(wire.split('')) 
        } else if (wire.length === 3) {
            digitSeven = new Set(wire.split('')) 
        } else if (wire.length === 7) {
            digitEight = new Set(wire.split('')) 
        }
    }
    /*  each segment of a digit is represented by a letter in the wrongWiring
    which can be identified from the letterCount in digitSets and the presence/absence
    in the segment sets of known digits */
    const segmentCount = occurence(wrongWires)
    for (const [letter, count] of segmentCount) {
        if (count === 4)  {
            segmentBottomLeft = letter  // the bottom left segment occurs in 4 of the digits 0 - 9
        } else if (count === 6) {
            segmentTopLeft = letter
        } else if (count === 7
            && (digitFour.has(letter)) 
            && (digitEight.has(letter)))  {
            segmentMiddle = letter
        } else if (count === 7 
                && !(digitFour.has(letter))
                && (digitEight.has(letter)))  {
            segmentBottom = letter
        } else if (count === 8 
                && (digitOne.has(letter)))  {
            segmentTopRight = letter
        } else if (count === 8
            && !(digitOne.has(letter)))  {
            segmentTop = letter
        } else if (count === 9)  {
            segmentBottomRight = letter
        }
    } 
    // now build a set of wires that light the segments of each other digit in the digital disply not already identified
    digitZero = new Set([segmentTop, segmentTopRight, segmentBottomRight, segmentBottom, segmentBottomLeft, segmentTopLeft])
    digitTwo = new Set([segmentTop, segmentTopRight, segmentMiddle, segmentBottomLeft, segmentBottom])
    digitThree = new Set([segmentTop, segmentTopRight, segmentMiddle, segmentBottomRight, segmentBottom])
    digitFive = new Set([segmentTop, segmentMiddle, segmentTopLeft, segmentBottomRight, segmentBottom])
    digitSix = new Set([segmentTop, segmentMiddle, segmentTopLeft, segmentBottomRight, segmentBottom, segmentBottomLeft])
    digitNine = new Set([segmentTop, segmentTopRight, segmentMiddle, segmentTopLeft, segmentBottomRight, segmentBottom])
    return new Map([[0,digitZero],[1,digitOne],[2,digitTwo],[3,digitThree],[4, digitFour],
        [5, digitFive],[6, digitSix],[7,digitSeven],[8, digitEight],[9, digitNine]])
}


const countLetter = (wireSets, letter)  => {
    return wireSets.filter(e => e.has(letter)).length
}

const occurence = (wrongWires) => {
    const wireSets = wrongWires.map(x => new Set(x.split('')))
    return new Map([
        ['a', countLetter(wireSets, 'a')],
        ['b', countLetter(wireSets, 'b')],
        ['c', countLetter(wireSets, 'c')],
        ['d', countLetter(wireSets, 'd')],
        ['e', countLetter(wireSets, 'e')],
        ['f', countLetter(wireSets, 'f')],
        ['g', countLetter(wireSets, 'g')]
    ])
}


const countDigits = (encodedMessages) => {
    let countOnes = 0
    let countFours = 0
    let countSevens = 0
    let countEights = 0
    for (let m of encodedMessages) {
        for (let d of m) {
            if (d.length === 2) {
                countOnes +=1 
            } else if (d.length === 4) {
                countFours +=1
            } else if (d.length === 3) {
                countSevens +=1 
            } else if (d.length === 7) {
                countEights +=1
            }
            
        }
    }
    return new Map ([
        [1, countOnes],
        [4, countFours],
        [7, countSevens],
        [8, countEights]
    ])
}

solveItPart2().then(console.log)

/* Examples of ways to clean the data entered : 
... replace, split, join, splice, slice, map, trim, use of regex, array deconstruction..

const cleanLine = (line) => line.toString().replace(/\s+/,'')
return data.split(/\r\n|\r|\n/) //split on newline
//  (/\r\n|\r|\n/) works on all platforms with different line endingd
cleanLine = line.replace(regex, '') // "0,9 -> 5,9"
.split('->')
let regex = new RegExp("\\s+", "g")  // regular expression \s matches all whitespace characters (includes tabs and newlines)
const makeEntry = (bagLine) => {
    let bag, contents
    [bag, contents] = bagLine.split('contain')
    const cleanBag = bag.trim().slice(0,-4).trim()
    const cleanContents = contents.replace(/bags/g,"bag").replace(/bag\./g,"bag").slice(0,-3).split("bag,").map(e => e.trim())
    const contentsKeys = cleanContents.map(e => e.split(' ').splice(1).join(' '))
    const contentsValues = cleanContents.map(e => e.split(' ')[0])
// ... 
} */