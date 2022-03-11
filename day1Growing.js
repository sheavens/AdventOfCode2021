// Calculate the number of lines where the number exceeds the previous number

//read file lines
const fs = require("fs").promises


const readLines = async() => {
    // const data = await fs.readFile('test1.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input1.txt', {encoding: 'utf-8'});
    return data.split(/\n/); //split on new lines
};

const solveIt = async() => {
    const lines = await readLines()
    const numberArray = lines.map(Number)
    const threeSums = sumThree(numberArray)
    return { part1: countIncreased(numberArray), part2 : countIncreased(threeSums)}
}

const sumThree = (array) => sumN(3, array)

const sumN = (n, array) => {
    let sumArray = [];
    for (let i = 0; i < array.length - n + 1; i++) {
        let sumOfN = 0
        for (j = 0; j < n ; j++) {
            sumOfN = sumOfN + array[i+j]
        }
        sumArray.push(sumOfN)
    }
    console.log(sumArray)
    return sumArray
}

console.log(sumThree([1,2,3,4,5,6,7,8,9,10])) //[6,9,15,18,21,24,27]

const increased = (a,b) => b > a ? true : false
// console.log(increased(76,300), increased(100,60)) //true,false


const countIncreased = (numberArray) => {
    let count = 0
    for (let i = 0; i < numberArray.length-1; i++) {
        count = increased(numberArray[i], numberArray[i+1]) ?  count + 1 : count
    //     increased(numberArray[i], numberArray[i+1]) ? console.log(numberArray[i+1], "(increased") : console.log(numberArray[i+1], "(decreased)")
    }
    return count
}

solveIt().then(console.log)

