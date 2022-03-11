// Optimise to land in target box

const max = (arr) => arr.reduce((a,b) => b > a ? b : a)

const getXStepsInRange = (initialVelocity, target) => {
    // returns all numbers of steps hitting target, or infinity if stops in target area
    let stepSize = initialVelocity
    let d = 0
    let stepsInRange = []
    let steps = 0
    let stopsInRange = false

    while (d <= target.xMax && stepSize > 0) {
        if (d >= target.xMin) stepsInRange = [...stepsInRange, steps]
        d = d + stepSize
        steps = steps + 1
        stepSize = stepSize === 0 ? 0 : stepSize - 1 
    }

    if (stepSize === 0) stopsInRange = true
    return { steps: stepsInRange, stops : stopsInRange }
}

const getYStepsInRange = (initialVelocity, target) => {
    // returns all numbers of steps hitting target, and height
    
    let y = 0
    let stepsInRange = []
    let steps = 0
    let height = 0
    let stepSize = initialVelocity
    let rising = initialVelocity > 0 ? true : false

    while (y > target.yMax || rising) {
        if (stepSize === 0) {
            height = y
            rising = false
        }
        steps = steps + 1
        y = y + stepSize
        stepSize = stepSize - 1
    }
    while (y >= target.yMin) {
        stepsInRange = [...stepsInRange, steps]
        steps = steps + 1
        y = y + stepSize
        stepSize = stepSize - 1
    }
    return { height: height, steps: stepsInRange }
}

const uX = (target) => {
    let ux
    let maxSteps = null
    for (ux = 0; ux <= target.xMax; ux++) {
        steps = xMaxSteps(ux, target.xMax)
        if (steps > maxSteps) maxSteps = steps
        if (maxSteps === infinity) continue
    }
    return { ux:ux, maxSteps: maxSteps}
}



console.log("are we there yet?")
const stepRange = (xMin, xMax)  => {
    // this only works if it comes to a stop in the target area.. might hit the target area
    // but still be moving.
    let stepSize = 1
    let distance = 0
    let steps = 0
    let stepsInRange = [] 
    while (distance <= xMax) {
        distance = distance + stepSize
        stepSize = stepSize + 1
        steps = steps + 1
        if (distance >= xMin) stepsInRange = [...stepsInRange, steps]
    }
    return stepsInRange
}

const testTarget = {xMin: 20, xMax: 30, yMin: -10,  yMax: -5} 

const target = {xMin: 79, xMax: 137, yMin: -176,  yMax: -117}  

const solvitOld = (target) => {
    let height = 0
    let maxHeight = 0
    for (let steps of stepRange(target.xMin, target.xMax)) {
        height = getMaxHeight(steps, target.yMin, target.yMax)
        if (height > maxHeight) maxHeight = height
    }
    return maxHeight
}

const getHeight = (initVelocity) => {
    let v = initVelocity
    h = 0
    while (v > 0) {
        h = h + v
        v = v - 1
    }
    return h
}

const sameStep = (xSteps, xStops, yStep) => {
    // return true if there the same yStep in the target box is in the range of x st
    // or if the projectile stopped in the box - then all ySteps thereafter are also valid
    if ( (xSteps.filter(e => e === yStep).length > 0) || 
       (max(xSteps) < yStep) && xStops) return true
    return false
}

const solvit = (target) => {
    let height = 0
    let maxHeight = 0
    const stepMax = max([Math.abs(target.yMin), Math.abs(target.yMax)]) // largest initial y velocity (step size) that could hit target
    for (let ux = 0; ux <= target.xMax; ux++) { // start at low x velocities.. looking for large no. of steps
        const xStepsInRange = getXStepsInRange(ux, target)
        if (xStepsInRange.steps.length > 0) { // ..if there are steps in x range that hit target
            for (let uy = stepMax; uy > 0; uy--) { // start with high y velocities.. looking for max height
            const yStepsInRange = getYStepsInRange(uy, target)  // there are steps in y that hit the target
               // find them at the same step ...Sets?
                yStepsInRange.steps.forEach(yStep => {
                   if (sameStep(xStepsInRange.steps, xStepsInRange.stops, yStep))
                   console.log(ux, uy) 
                   height = yStepsInRange.height
                   maxHeight =  height > maxHeight ?  height : maxHeight
                })                       
            }
        }   
    }
    return maxHeight
}

const solvitPart2 = (target) => {
    let height = 0
    let maxHeight = 0
    let targetCombs = new Set()
    const stepMax = max([Math.abs(target.yMin), Math.abs(target.yMax)]) // largest initial y velocity (step size) that could hit target
    for (let uy = stepMax; uy >= -1*stepMax; uy--) { // start with high y velocities.. looking for max height
        const yStepsInRange = getYStepsInRange(uy, target)  // there are steps in y that hit the target
        // find them at the same step ...Sets?
    
        for (let ux = 0; ux <= target.xMax; ux++) { // start at low x velocities.. looking for large no. of steps
            const xStepsInRange = getXStepsInRange(ux, target)
            if (xStepsInRange.steps.length > 0) { // ..if there are steps in x range that hit target

                yStepsInRange.steps.forEach(yStep => {
                   if (sameStep(xStepsInRange.steps, xStepsInRange.stops, yStep)) {
                        targetCombs.add([ux, uy].toString())
                        height = yStepsInRange.height
                        maxHeight =  height > maxHeight ?  height : maxHeight
                   }
                })                       
            }
        }   
    }
    return targetCombs.size
}

console.log(solvitPart2(target))

const testResult = [
[23,-10],  [25,-9],   [27,-5],  [29,-6],  [22,-6],   [21,-7],  [9,0],  [27,-7],  [24,-5],
[25,-7],  [26,-6],   [25,-5],  [6,8],  [11,-2],   [20,-5],  [29,-10],  [6,3],  [28,-7],
[8,0],  [30,-6],   [29,-8],  [20,-10],  [6,7],   [6,4],  [6,1],  [14,-4],  [21,-6],
[26,-10],  [7,-1],   [7,7],  [8,-1],  [21,-9],   [6,2],  [20,-7],  [30,-10],  [14,-3],
[20,-8],  [13,-2],   [7,3],  [28,-8],  [29,-9],   [15,-3],  [22,-5],  [26,-8],  [25,-8],
[25,-6],  [15,-4],   [9,-2],  [15,-2],  [12,-2],   [28,-9],  [12,-3],  [24,-6],  [23,-7],
[25,-10],  [7,8],   [11,-3],  [26,-7],  [7,1],   [23,-9],  [6,0],  [22,-10],  [27,-6],
[8,1],  [22,-8],   [13,-4],  [7,6],  [28,-6],   [11,-4],  [12,-4],  [26,-9],  [7,4],
[24,-10],  [23,-8],   [30,-8],  [7,0],  [9,-1],   [10,-1],  [26,-5],  [22,-9],  [6,5],
[7,5],  [23,-6],   [28,-10],  [10,-2],  [11,-1],   [20,-9],  [14,-2],  [29,-7],  [13,-3],
[23,-5],  [24,-8],   [27,-9],  [30,-7],  [28,-5],   [21,-10],  [7,9],  [6,6],  [21,-5],
[27,-10],  [7,2],   [30,-9],  [21,-8],  [22,-7],   [24,-9],  [20,-6],  [6,9],  [29,-5],
[8,-2],  [27,-8],   [30,-5],  [24,-7],
]

const cleanTest = testResult.map(e => [Number(e[0]),Number(e[1])])
// multi-level sort !!!! One for the library!
const sorted = cleanTest.sort((a, b) => b[0] - a[0]).sort((a, b) => b[0] === a[0] ? b[1] - a[1] : b[0])
// console.log(testResult.map(e => [Number(e[0]),Number(e[1])]).sort((a,b) => b[0] > a[0]))






