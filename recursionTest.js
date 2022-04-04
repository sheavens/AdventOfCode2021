const countDown = (n) => {
  if (n === 0) return  // Base case
  let result // Will not be reached after case case hit
  result = [...result, result + countDown(n-1)]  // Recursive statements. Will bubble up
}
// console.log(countDown(6))

const recurseWithLoop  = (n) => {
    if (n === 0) return [] // Base case
    let result = [] // For bubble up.  Will not be reached after case case hit
    for (let c = 5; c > 0; c--) { //Loop counter does not advance until recursion completed
        console.log("loop counter, recursion level", c, n)
        result = [...result, recurseWithLoop(n-1)]  // Recursive statements.  After this loop continues 
    }
    return result // return the result, which will generate after loop completes
}

// console.log(recurseWithLoop(6))

const multiTrackRecursion = (n)  => {
    if (n === 0) return [] // Base case
    let result = [] // For bubble up.  Will not be reached after case case hit
    if (n % 2 === 0 ) {
        return result = [...result, multiTrackRecursion(n-1) + 2]  // Recursive statements.
    } else {
        return result = [...result, multiTrackRecursion(n-1) + 1]  // Recursive statements.
    }  
}

// console.log(multiTrackRecursion(10)) // ['1212121212']

const multiTrackRecursion2 = (n)  => {
    if (n === 0) return [] // Base case
    let result = [] // For bubble up.  Will not be reached after case case hit
    if (n % 2 === 0 ) {
        result = [...result, multiTrackRecursion2(n-1) + 2]  // Recursive statements.
    } else {
        result = [...result, multiTrackRecursion2(n-1) + 1]  // Recursive statements.
    }  
    return result
}

// console.log(multiTrackRecursion2(10)) // ['1212121212']  same

const addOne = (n) => Number(n) + 1
const multiplyThree = (n) => Number(n)*3

const multiTrackRecursion3 = (string)  => {
    if (string.length === 0) return Number(0) // Base case
    let result = [] // For bubble up.  Will not be reached after case case hit
    if (string[0] === 'a' ) {
        result = [...result, addOne(multiTrackRecursion3(string.slice(1)))]  // Recursive statements.
    } else {
        result = [...result, multiplyThree(multiTrackRecursion3(string.slice(1)))]  // Recursive statements.
    }  
    return result
}

console.log(multiTrackRecursion3('abcaaba')) // [46]  - ensure that Number is spec in operations