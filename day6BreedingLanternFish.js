/* calculate number of laternfish after x days */

const fs = require ('fs').promises

const readLines = async () => {
    const data = await fs.readFile("input6.txt", {encoding: 'utf8'})

    return data.split(/\r\n|\r|\n/) //split on newline
    //  (/\r\n|\r|\n/) works on all platforms with different line endingd
}


const solveIt  = async() => {
    const data = await readLines()
    let regex = new RegExp("\\s+", "g")  // regular expression \s matches all whitespace characters (includes tabs and newlines)
    // let fishArray =[data[0].replace(regex,'')]
    let fishArray =[3,5,2,5,4,3,2,2,3,5,2,3,2,2,2,2,3,5,3,5,5,2,2,3,4,2,3,5,5,3,3,5,2,4,5,4,3,5,3,2,5,4,1,1,1,5,1,4,1,4,3,5,2,3,2,2,2,5,2,1,2,2,2,2,3,4,5,2,5,4,1,3,1,5,5,5,3,5,3,1,5,4,2,5,3,3,5,5,5,3,2,2,1,1,3,2,1,2,2,4,3,4,1,3,4,1,2,2,4,1,3,1,4,3,3,1,2,3,1,3,4,1,1,2,5,1,2,1,2,4,1,3,2,1,1,2,4,3,5,1,3,2,1,3,2,3,4,5,5,4,1,3,4,1,2,3,5,2,3,5,2,1,1,5,5,4,4,4,5,3,3,2,5,4,4,1,5,1,5,5,5,2,2,1,2,4,5,1,2,1,4,5,4,2,4,3,2,5,2,2,1,4,3,5,4,2,1,1,5,1,4,5,1,2,5,5,1,4,1,1,4,5,2,5,3,1,4,5,2,1,3,1,3,3,5,5,1,4,1,3,2,2,3,5,4,3,2,5,1,1,1,2,2,5,3,4,2,1,3,2,5,3,2,2,3,5,2,1,4,5,4,4,5,5,3,3,5,4,5,5,4,3,5,3,5,3,1,3,2,2,1,4,4,5,2,2,4,2,1,4]

  console.log(fishArray[0], fishArray[fishArray.length])
    let numFish
    let birthingFish
    let motherFish
    let newFish
    let targetDays = 256
    let fishMap = new Map([[0,fishCount(0)],[5,fishCount(5)]])
    let count = sum(Array.from(fishMap.keys))
    for (let day = 1; day < targetDays + 1; day++) {
        numFish = fishArray.length      
        fishArray = fishArray.filter(x => x != 0).map(x => x-1)
        birthingFish = numFish - fishArray.length
        newFish = new Array(birthingFish); for (let i=0; i<birthingFish; ++i) newFish[i] = 8
        motherFish = new Array(birthingFish); for (let i=0; i<birthingFish; ++i) motherFish[i] = 6
        fishArray = fishArray.concat(motherFish).concat(newFish)
        console.log(fishArray)
    }
    return fishArray.length
}


// part 2 - using Map of count by timer value, instead of arrays of ndividual fish (too slow for calc 256 days total)
const fishCount = (timerValue, fishArray) => fishArray.filter(x => x === timerValue).length 
let fishArray =[3,5,2,5,4,3,2,2,3,5,2,3,2,2,2,2,3,5,3,5,5,2,2,3,4,2,3,5,5,3,3,5,2,4,5,4,3,5,3,2,5,4,1,1,1,5,1,4,1,4,3,5,2,3,2,2,2,5,2,1,2,2,2,2,3,4,5,2,5,4,1,3,1,5,5,5,3,5,3,1,5,4,2,5,3,3,5,5,5,3,2,2,1,1,3,2,1,2,2,4,3,4,1,3,4,1,2,2,4,1,3,1,4,3,3,1,2,3,1,3,4,1,1,2,5,1,2,1,2,4,1,3,2,1,1,2,4,3,5,1,3,2,1,3,2,3,4,5,5,4,1,3,4,1,2,3,5,2,3,5,2,1,1,5,5,4,4,4,5,3,3,2,5,4,4,1,5,1,5,5,5,2,2,1,2,4,5,1,2,1,4,5,4,2,4,3,2,5,2,2,1,4,3,5,4,2,1,1,5,1,4,5,1,2,5,5,1,4,1,1,4,5,2,5,3,1,4,5,2,1,3,1,3,3,5,5,1,4,1,3,2,2,3,5,4,3,2,5,1,1,1,2,2,5,3,4,2,1,3,2,5,3,2,2,3,5,2,1,4,5,4,4,5,5,3,3,5,4,5,5,4,3,5,3,5,3,1,3,2,2,1,4,4,5,2,2,4,2,1,4]

let fishMap = new Map([[0,fishCount(0,fishArray)],[1,fishCount(1, fishArray)],
[2,fishCount(2,fishArray)],[3,fishCount(3, fishArray)],[4,fishCount(4,fishArray)],[5,fishCount(5, fishArray)],
[6,fishCount(6,fishArray)],[7,fishCount(7, fishArray)],[8,fishCount(8, fishArray)]])
const sum = (arr) => arr.reduce((a,b) => a + b, 0)


let n = 1
for (let i = 0; i < 256; i++) {
    let prevGen = Array.from(fishMap.values())
    for (let n =0; n<8; n++) fishMap.set(n,prevGen[n+1])
    fishMap.set(6, fishMap.get(6) + prevGen[0])
    fishMap.set(8, prevGen[0])
    console.log(sum(Array.from(fishMap.values())))
}
// solveIt().then(console.log)
