/* Beacons and scanners 
For part 2 find the maximum manhattan distance between scanners. 

Scanners can see all beacons within 1000 units
Scanners can be in 24 different orientations (90 degree rotaions and upside down) */
const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input19.txt', {encoding: 'utf-8'});
    // const cleanData = data.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n") 
    const cleanData = data.replace(/\r\n|\r|\n/g, "\n") // replace \r (used by Notebook editor)
    // split at scanner headings then nest arrays inside, removing blank entries
    const cleanData2 = cleanData.split(/--- scanner \d+ ---\n/).map(e => e.replace('\n\n','').split('\n')).splice(1)
    // convert to arrays of points as numbers [] [[1,2,3],[2,4,6]],[...]]
    const cleanData3 = cleanData2.map(e=>e.map(f=>f.split(",")).map(g=>g.map(Number)))
    return cleanData3
};


const translate = (pt, [deltaX, deltaY, deltaZ]) => { 
    let [x, y, z ] = pt
    return [x + deltaX, y + deltaY, z + deltaZ]
}

const translation = (pt1, pt2) => {
    // translation to move pt2 to pt1
    const [x1, y1, z1] = pt1
    const [x2, y2, z2] = pt2
    return [x2-x1, y2-y1, z2-z1]
} 

const transformPt = (pt, transformIdx) => {
const [x, y, z] = pt
const transforms = [
// y vertical
    [x, y, z],
    [-z, y, x],
    [-x, y, -z],
    [z, y, -x],
// y upside down
    [x, -y, -z],
    [z, -y, x],
    [-x, -y, z],
    [-z, -y, -x],
// x vertical
    [-y, x, z],
    [-z, x, -y],
    [y, x, -z],
    [z, x, y],
// x upside down
    [y, -x, z],
    [-z, -x, y],
    [-y, -x, -z],
    [z, -x, -y,],
// z up
    [x, z, -y],
    [y, z, x],
    [-x, z, y],
    [-y, z, -x],
// z down
    [x, -z, y],
    [-y, -z, x],
    [-x, -z, -y],
    [y, -z, -x],
]

return transforms[transformIdx]
}

const transformScan = (pts, transformIdx) => pts.map(pt=> transformPt(pt, transformIdx))

const manhattan = (pt1, pt2) => {
    // calc. manhatten distance apart
    const [x1, y1, z1] = pt1
    const [x2, y2, z2] = pt2
    return Math.abs(x1-x2) + Math.abs(y1-y2) + Math.abs(z1-z2)
}

const stringToPt = (ptAsString) => ptAsString.split('_').map(s => Number(s))

const scanSetToArray = (scanSet) => {
    let ptArr = []
    for (let ptString of scanSet.values()) {
        ptArr.push(stringToPt(ptString))
    }
    return ptArr
}

const max = (arr) => arr.reduce((a,b) => b > a ? b : a, 0)

const maxManhattan = (scanSet) => {
    const arr = scanSetToArray(scanSet)
    let maxArr = []
    for (let pt2 of arr)  {
        let m = max(arr.map(pt => manhattan(pt, pt2)))
        maxArr.push(m)
    }
    return max(maxArr)
}

const ptToString = (pt) => {
    //returns a string made from the 3 point coordinates
    const [x, y, z]  = pt
    return x.toString() + "_" + y.toString() + "_" + z.toString()
}

const scanSet = (scanPts) => {
    let scanSet = new Set()
    for (let pt of scanPts) {
        scanSet.add(ptToString(pt))
    }
    return scanSet
}

const union = (setA, setB) => new Set([...setA, ...setB])

const solver = (untriedSolvedDataArr, unsolvedIdxSet, scannerData, solution = new Set()) => {
    
    const solved = untriedSolvedDataArr[0]
    // remove this one from untried for next recusion
    let unsolvedArr = []
    let moreSolved = true
    while (unsolvedIdxSet.size > 0 && moreSolved) { // keep solving until no more are solved with this solution
        moreSolved = false
        unsolvedArr = Array.from(unsolvedIdxSet)
        for (const next of unsolvedArr) {
            const newSolved = solveScanner(solved, scannerData[next])
            if (newSolved !== null) {
                untriedSolvedDataArr.push(newSolved.solved)  
                solution = union(solution, scanSet([newSolved.location])) // for part2 saving the scanner location
                moreSolved = true
                unsolvedIdxSet.delete(next) 
            }
        }
    }

    if (untriedSolvedDataArr.length < 2 && unsolvedIdxSet.size > 0) return null // failed to solve all scanners
    if (unsolvedIdxSet.size === 0) return solution
    solution = union(solution, solver(untriedSolvedDataArr.slice(1), unsolvedIdxSet, scannerData, solution)) 
    return solution
}

const tryTranslation = (t, solvedScan, unsolvedScan ) => {
        const translated = unsolvedScan.map(pt_u => translate(pt_u, t))
        const unSolvedSet = new Set(scanSet(translated))
        if (solvedScan.filter(e => unSolvedSet.has(ptToString(e))).length >= 12) {
            return translated  // now solved, at least 12 points matched
        } 
        return null 
}

const solveScanner = (solvedScan, unsolved) => {
    //try each of the 24 transforms
    for (let i = 0; i < 24; i++) {
        const transformedUnsolved = transformScan(unsolved, i)
        // find the translation between two points and apply that to all points unsolved set
        let t = []
        let newSolved = []
        for (let pt_s of solvedScan) {
            for (let pt_u of transformedUnsolved) {
                t = translation(pt_u, pt_s)
                newSolved = tryTranslation(t, solvedScan, transformedUnsolved) 
                if (newSolved !== null)  {
                    console.log("Found it!, translation", t)
                    return { solved: newSolved, location: t }
                }
            }
        }
    }
    return null
}

const solveIt = async() => {
    const scannerData = await readlines()
    // scanner 0 is treated as solved.. others will be solved in the co-ordinates of scanner 0
    const unsolvedSet = new Set()
// other scanners, from 1 onwards, are unsolved
    for (let i = 1; i < scannerData.length; i++) {unsolvedSet.add(i)}
    const scannersAt = solver([scannerData[0]], unsolvedSet, scannerData)
    const manhat = maxManhattan(scannersAt)
    return manhat
    // return result.size // part1
}

solveIt().then(console.log)