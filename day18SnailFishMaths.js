/* This snailfish homework is about addition. To add two snailfish numbers, form a pair from the left and right parameters of the addition operator. For example, [1,2] + [[3,4],5] becomes [[1,2],[[3,4],5]].
There's only one problem: snailfish numbers must always be reduced, and the process of adding two snailfish numbers can result in snailfish numbers that need to be reduced.
To reduce a snailfish number, you must repeatedly do the first action in this list that applies to the snailfish number:
If any pair is nested inside four pairs, the leftmost such pair explodes.
If any regular number is 10 or greater, the leftmost such regular number splits. */

"use strict"

const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input18.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new lines
};


const testData = "[[3,2],[3,[[40,3],4]],4],[7,[[8,4],9]]] + [1,1]"

const snailFishAdd = (expression) => "[" + (expression.split("+").map(e => e.trim()).join("],[")) + "]"


console.log(snailFishAdd(testData))

let trial = snailFishAdd(testData)

const nextNumber = (eStr) => /[0-9]+/.exec(eStr)

const previousNumber = (eStr, index) => {
    // finds the last number before the index, if any
    const nextNumber = new RegExp(/[0-9]+/, 'g') 
    let lastNumber = null, number
    //RegExp has state when with 'g' option, will search from last find with .exec()
    while ((number = nextNumber.exec(eStr)) !== null && number.index < index ) {
        lastNumber = number
    }
    return lastNumber
}
const over9 = (eStr) => {
    const nextNumber = new RegExp(/[0-9]+/, 'g') 
    let number
    //RegExp has state when with 'g' option, will search from last find with .exec()
    while ((number = nextNumber.exec(eStr)) !== null) {
        if (Number(number) > 9) return number
    }
    return null
}

const bracketCount = (eArr, stopIndex) => {
    let bCount = 0
    for (let i = 0; i < stopIndex; i++) {
        if (eArr[i] === "[") bCount +=1
        if (eArr[i] === "]") bCount -=1
    }
    return bCount
}

const pair4Deep = (eStr) => {
    const nextPair = new RegExp(/\[([0-9]+),([0-9]+)\]/, 'g')
    let pair
    //RegExp has state when with 'g' option, will search from last find with .exec()
    while ((pair = nextPair.exec(eStr)) !== null) {
        if (bracketCount(eStr.split(""), pair.index) >= 4) return pair
    }
    return null
}


const isPair4Deep = (eStr, pairIndex) => {
    if (bracketCount(eStr.split(""), pairIndex) >= 4) return true
    return false
}

const explode = (expression) => {
/*  The first pair, e.g [4,6], which is nested more than 4 deep, if any, is 
    replaced by 0, while the left and right pair values are added to the nearest 
    previous and next numbers respectively, if any.
*/
    const deepPair = pair4Deep(expression) 
    if (deepPair) {
        const pn = previousNumber(expression, deepPair.index)
        let left, right
        if (pn) {
            left = expression.slice(0, pn.index).concat
                    (Number(pn) + Number(deepPair[1])).concat
                    (expression.slice(pn.index + pn[0].length, deepPair.index))
        } else {
            left = expression.slice(0, deepPair.index)
        }
        left = left.concat('0') //the original deep pair replaced by 0

        const rightPart = expression.slice(deepPair.index + deepPair[0].length)
        const nn = nextNumber(rightPart)
        if (nn) {
            right = rightPart.slice(0, nn.index).concat
            (Number(nn) + Number(deepPair[2])).concat
            (rightPart.slice(nn.index + nn[0].length))
        } else {
            right = expression.slice(deepPair.index + deepPair[0].length)
        }
        return left + right
    }
    return expression
}

const newPair = (number) => "[" + Math.floor(number/2) + "," + Math.ceil(number/2) + "]"

const split = (expression) => {
    const bigNum = over9(expression)
    if (bigNum) return expression.slice(0, bigNum.index).concat
                (newPair(bigNum[0])).concat
                (expression.slice(bigNum.index + bigNum[0].length))
    return expression
}

const pairMag = (pair) => (3 * pair[1] + 2 * pair[2]).toString(10)

const sumIt = (str) => str.split(",").reduce((a,b) => a + b)

const magnitude = (eStr) => {
    const nextPair = new RegExp(/\[([0-9]+),([0-9]+)\]/)
    let pair = nextPair.exec(eStr)
    while ( pair !== null) {
        eStr = eStr.replace(pair[0], pairMag(pair))
        pair = nextPair.exec(eStr)
    }
    return eStr
}

const reduce = (expression) => {       
    let goNoFurther = false
    while (!goNoFurther) {
        while (pair4Deep(expression)) {
            expression = explode(expression)
        }
        if (!over9(expression)) {
            goNoFurther = true
        } else {
            expression = split(expression)
        }
    }
    return expression
}

// console.log(magnitude("[[1,2],[[3,4],5]]"))

/* console.log("[[[[[9,8],1],2],3],4] becomes [[[[0,9],2],3],4] (the 9 has no regular number to its left, so it is not added to any regular number).")
console.log(explode("[[[[[9,8],1],2],3],4]"))

console.log("[7,[6,[5,[4,[3,2]]]]] becomes [7,[6,[5,[7,0]]]] (the 2 has no regular number to its right, and so it is not added to any regular number).")
console.log(explode("[7,[6,[5,[4,[3,2]]]]]"))

console.log("[[6,[5,[4,[3,2]]]],1] becomes [[6,[5,[7,0]]],3].")
console.log(explode("[[6,[5,[4,[3,2]]]],1]"))

console.log("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]] becomes [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]")
console.log(explode("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]"))
console.log("(the pair [3,2] is unaffected because the pair [7,3] is further to the left; [3,2] would explode on the next action).")

console.log("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] becomes [[3,[2,[8,0]]],[9,[5,[7,0]]]].")
console.log(explode("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]")) */

// For example, the final sum of this list is [[[[1,1],[2,2]],[3,3]],[4,4]]:


// console.log(magnitude("[[1,2],[[3,4],5]]"), "becomes 143.")
// console.log(magnitude("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]"), " becomes 1384.")
// console.log(magnitude("[[[[1,1],[2,2]],[3,3]],[4,4]]"), " becomes 445.")
// console.log(magnitude("[[[[3,0],[5,3]],[4,4]],[5,5]]"), " becomes 791.")
// console.log(magnitude("[[[[5,0],[7,4]],[5,5]],[6,6]]"), " becomes 1137.")
// console.log(magnitude("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]")," becomes 3488.")

const testData1 = [[1,1],[2,2],[3,3],[4,4]]

// The final sum of this list is [[[[3,0],[5,3]],[4,4]],[5,5]]:

const testData2 =[[1,1],[2,2]
,[3,3]
,[4,4]
,[5,5]]

//The final sum of this list is [[[[5,0],[7,4]],[5,5]],[6,6]]:

const testData3 = [[1,1]
,[2,2]
,[3,3]
,[4,4]
,[5,5]
,[6,6]]

const testData4 = [
"[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]"
,"[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]"
,"[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]"
,"[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]"
,"[7,[5,[[3,8],[1,4]]]]"
,"[[2,[2,2]],[8,[8,1]]]"
,"[2,9]"
,"[1,[[[9,3],9],[[9,0],[0,7]]]]"
,"[[[5,[7,4]],7],1]"
,"[[[[4,2],2],6],[8,7]]"
]

const testData5 = [
"[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]",
"[[[5,[2,8]],4],[5,[[9,9],0]]]",
"[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]",
"[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]",
"[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]",
"[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]",
"[[[[5,4],[7,7]],8],[[8,3],8]]",
"[[9,3],[[9,9],[6,[4,9]]]]",
"[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]",
"[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]",
]

const solveIt2  = async() => {
    const data = await readlines()
    // const data = testData5
    let expression
    let size =0, largestMagnitude = 0
    for (let i = 0; i < data.length; i++) {
        for (let j = i+1; j < data.length; j++) {
            expression = "[" + data[i] + "," +  data[j] + "]"
            console.log(i,j, data.length)
            size = +magnitude(reduce(expression)) 
            if (size > largestMagnitude) largestMagnitude = size
            // now add them the other way around.. snailfish addition is not commutative
            expression = "[" + data[j] + "," +  data[i] + "]"
            console.log(j,i, data.length)
            size = +magnitude(reduce(expression)) 
            if (size > largestMagnitude) largestMagnitude = size
        }
    }
    return largestMagnitude
}

const solveIt  = async() => {
    const data = await readlines()
    //const data = testData4
    let expression = data[0]
    for (let i=1; i < data.length; i++) {
        expression = "[" + expression + "," +  data[i] + "]"
        let goNoFurther = false
        while (!goNoFurther) {
            while (pair4Deep(expression)) {
                expression = explode(expression)
            }
            if (!over9(expression)) {
                goNoFurther = true
            } else {
                expression = split(expression)
            }
        }
    }
    return magnitude(expression)
}


solveIt2().then(console.log)

