/* add digits of binanry numbers ..
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010

Considering only the first bit of each number, there are five 0 bits and seven 1 bits. Since the most common bit is 1, the first bit of the gamma rate is 1.
The most common second bit of the numbers in the diagnostic report is 0, so the second bit of the gamma rate is 0.
The most common value of the third, fourth, and fifth bits are 1, 1, and 0, respectively, and so the final three bits of the gamma rate are 110.
So, the gamma rate is the binary number 10110, or 22 in decimal.
The epsilon rate is calculated in a similar way; rather than use the most common bit, the least common bit from each position is used. So, the epsilon rate is 01001, or 9 in decimal. Multiplying the gamma rate (22) by the epsilon rate (9) produces the power consumption, 198.
Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate, then multiply them together. What is the power consumption of the submarine? (Be sure to represent your answer in decimal, not binary.)
*/

const fs = require ('fs').promises

const readLines = async () => {
    const data = await fs.readFile("input3.txt", {encoding: 'utf8'})
    return data.split('\n')
}

const solveIt  = async() => {
    const lines = await readLines()
    let sumDigits = digitArray(cleanLine(lines[0])).fill(0) //initalise an array of zeros, of the right length
    for (line of lines) {
       const digits = digitArray(cleanLine(line))
       for (let i = digits.length -1; i >=0; i = i-1 ) {
           sumDigits[i] += Number(digits[i])  
       }
    }
    const binGamma = maxBits(sumDigits, Number(lines.length/2))
    const binEpsilon = minBits(sumDigits, Number(lines.length/2))
    const gamma = binToDec(binGamma)
    const epsilon = binToDec(binEpsilon)
    console.log("Part 1 answer", gamma * epsilon)
    return oxRating(lines) * CO2Rating(lines)   
}



const tiny = 0.0001
const minBits = (sumDigits, midPoint) => sumDigits.map(v => Number(v) >= midPoint+tiny ? 0 : 1).join('')
const maxBits = (sumDigits, midPoint) => sumDigits.map(v => Number(v) >= midPoint-tiny ? 1 : 0).join('')
//console.log("minBits", binToDec(minBits([32,5,7,98,0], 15)))
//console.log("minBits", binToDec(maxBits([32,5,7,98,0], 15)))

const rating = (ifEqualKeepOnes, lines) =>{   
    let filtered = lines
    let i = 0
    let match
    while (filtered.length > 1 && i < lines[0].length) {
        if (ifEqualKeepOnes) {
            match = countOnes(filtered, digitNum=i) >= countZeros(filtered, digitNum=i) ? 1 : 0
        } else {
            match = countOnes(filtered, digitNum=i) >= countZeros(filtered, digitNum=i) ? 0 : 1           
        }
        filtered = filtered.filter(line => digitArray(cleanLine(line))[i] === match.toString())
        i = i + 1 
    }
    console.log("filtered", filtered)
    return filtered[0]
}

const oxRating = (lines) => binToDec(rating(ifEqualKeepOnes=true, lines))
const CO2Rating = (lines) => binToDec(rating(ifEqualKeepOnes=false, lines))

const countValues = (value, arrayNumbers, digitToCount) => {
    let count = 0
    let digitArray = []
    for (number of arrayNumbers) {
        digitArray = number.toString().split('')
        if (Number(digitArray[digitToCount]) === value) count = count + 1
    }
    return count
}

const countOnes = (arrayNumbers, digitToCount) => countValues(1, arrayNumbers, digitToCount)
const countZeros = (arrayNumbers, digitToCount) => countValues(0, arrayNumbers, digitToCount)
// console.log("countZeros, expect 2", countZeros(["001102", "010345", "012347", "000000", "012347"], 1))

const digitArray = (cleanLine) => cleanLine.split('')
const cleanLine = (line) => line.toString().replace(/\s+/,'')
console.log(digitArray(cleanLine(123498)))

const binToDec = (bin) => {
    return parseInt(bin, 2)
}

solveIt().then(console.log)