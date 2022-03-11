const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input22.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on newline; 
};

smallTest = [
"on x=10..12,y=10..12,z=10..12",
"on x=11..13,y=11..13,z=11..13",
"off x=9..11,y=9..11,z=9..11",
"on x=10..10,y=10..10,z=10..10"
]

const turnOn = (on = true, rangeStrings, onSet = new Set()) => {
    const Xrange = expandArray(toArrayRange(rangeStrings[0]))
    const Yrange = expandArray(toArrayRange(rangeStrings[1]))
    const Zrange = expandArray(toArrayRange(rangeStrings[2]))
    if (Xrange.length > 0 && Yrange.length > 0 && Zrange.length > 0) {
        Xrange.forEach(x => 
            Yrange.forEach(y =>
                Zrange.forEach(z => on ? onSet.add([x,y,z].toString()) : 
                    onSet.delete([x,y,z].toString()))))
    }              
return onSet
} 

const toArrayRange = (rangeString) => {
    const regex = /([-+]?\d+)/g //matches -ve or + in front too
    let arr = []
    let result
    while ((result = regex.exec(rangeString)) !== null) {
        arr.push(+result[0])
    }
    return arr
}

const toXYZArray = (rangeString) => {
    const regex = /([-+]?\d+)/g //matches -ve or + in front too
    let arr = []
    let result
    while ((result = regex.exec(rangeString)) !== null) {
        arr.push(+result[0])
    }
    return [[arr[0], arr[1]], [arr[2], arr[3]], [arr[4], arr[5]] ]
}

const inRange = (r) => (r >= -50 && r <= 50) ? true : false

const expandArray = (arrayRange) => {
    let r = arrayRange[0]
    let rangeArr = []
    while (r <= arrayRange[1]) {
       // if (inRange(r)) rangeArr.push(r) // exclude points outside range
        rangeArr.push(r)
        r+=1
    }
    return rangeArr
}

const clean = (dataLine) => {
    const cleanContents = dataLine.replace(/x=/g,"").replace(/y=/g,"").replace(/z=/g,"")
    const contentKey = cleanContents.split(' ').slice(0,1)
    const contentsStrings = cleanContents.split(' ').splice(1).join("").split(',')
    return { [contentKey[0]] : contentsStrings}
}

const solveIt  = async() => {
    const data = await readlines()
    // data = smallTest
    const cleanData = data.map(dataLine => clean(dataLine))
    let onSet = new Set()
    cleanData.forEach(instruction => {
        if (instruction.on) onSet = turnOn(true, instruction.on, onSet )
        if (instruction.off) onSet = turnOn(false, instruction.off, onSet ) 
  })
    return onSet.size
}

const olap = (arrA = [5,10], arrB = [4, 11]) => {
    // if arrays partially overlap or one is within the other or ranges are same, return true
    if ( ((arrB[0] <= arrA[1]) && (arrB[0] >= arrA[0])) // left end of B is inside A range
        || ((arrB[1] <= arrA[1]) && (arrB[1] >= arrA[0])) // right end of B is inside A range
        || ((arrB[0] >= arrA[0]) && (arrB[1] <= arrA[1])) // B within A, wholly enclosed
        || (arrB[0] <= arrA[0]) && (arrB[1] >= arrA[1]) // A within B 
        ) return true
    return false
} 

// rewrite olap. if any value is inside both ranges return true

const overlap = (cubit = [[35,42],[40,55],[60,99]], arrRange = [[40,50],[50,60],[70,80]]) => {
    // [[35,42],[40,55],[60,99]], [[40,50],[50,60],[70,80]]
    if (olap(cubit[0], arrRange[0]) &&
    olap(cubit[1], arrRange[1]) &&
    olap(cubit[2], arrRange[2])) return true
    return false     
}

console.log(overlap())

const higher = (a, b) => a > b ? a : b
const lower = (a, b) => a < b ? a : b

const getMinMax = (cubit_i, newCubit_i) => {
    // returns the range of values bounding subCubits for 1 co-ordinate (x or y or z)
    const max = higher(cubit_i[1], newCubit_i[1]) // the largest overall
    const min = lower(cubit_i[0], newCubit_i[0]) // the smallest overall
    const minMax = lower(cubit_i[1], newCubit_i[1]) // the smaller of the maxes 
    const maxMin = higher(cubit_i[0], newCubit_i[0]) // thr larger of the minBits
    return {min: min, maxMin: maxMin, minMax: minMax, max: max}
}

const split = (cubit, newCubit) => {
    // return set of smaller cubits 
    // from sections of the existing cubit that don't overlap with newCubit
    let cubabies = []
    
    // const cubXlow, cubXhigh, cubYlow, cubYhigh, cubZlow, cubZhigh
    // const newCubXlow, newCubXhigh, newCubYlow, newCubYhigh, newCubZlow, newCubZhigh

    const [cubXlow, cubXhigh] =  cubit[0] 
    const [cubYlow, cubYhigh] =  cubit[1]
    const [cubZlow, cubZhigh] =  cubit[2]

    const [newCubXlow, newCubXhigh] =  newCubit[0] 
    const [newCubYlow, newCubYhigh] =  newCubit[1]
    const [newCubZlow, newCubZhigh] =  newCubit[2]

    // x ranges outside new cubit, for cubit y range
    if (cubXhigh >= newCubXhigh + 1)
    cubabies.push([[newCubXhigh + 1, cubXhigh],[cubYlow, cubYhigh],
        [higher(cubZlow, newCubZlow), lower(cubZhigh, newCubZhigh)]])

    if (newCubXlow - 1 >= cubXlow)
    cubabies.push([[cubXlow, newCubXlow - 1],[cubYlow, cubYhigh],
        [higher(cubZlow, newCubZlow), lower(cubZhigh, newCubZhigh)]])
   
    // x values inside cubit and new cubit, for y ranges outside new cubit
    if (newCubYlow - 1 >= cubYlow)
    cubabies.push([[higher(newCubXlow, cubXlow), lower(newCubXhigh, cubXhigh)],[cubYlow, newCubYlow - 1],
    [higher(cubZlow, newCubZlow), lower(cubZhigh, newCubZhigh)]])

    if (cubYhigh >= newCubYhigh + 1)
    cubabies.push([[higher(newCubXlow, cubXlow), lower(newCubXhigh, cubXhigh)],[newCubYhigh + 1, cubYhigh],
    [higher(cubZlow, newCubZlow), lower(cubZhigh, newCubZhigh)]])
    
    // z ranges outside newcubit but inside cubit, for cubit x and y ranges
    if (newCubZlow - 1 >= cubZlow)
    cubabies.push([[cubXlow, cubXhigh],[cubYlow, cubYhigh],[cubZlow, newCubZlow - 1 ]])

    if (cubZhigh >= newCubZhigh + 1)
    cubabies.push([[cubXlow, cubXhigh],[cubYlow, cubYhigh],[newCubZhigh + 1, cubZhigh]])


    return cubabies
}

const makeCubits = (on = true, rangeStrings, cubitSet) => {
    // make a new set containing only non-overlapping parts of existing cubits,
    // plus the new one (if it is "on"; if "off" is not included)
    const newCubit = toXYZArray(rangeStrings)
    const newCubitSet = new Set()
    if (cubitSet.size === 0 && on) { // if there are no existing cubits, add this one (if switching on)
        newCubitSet.add(newCubit)
        return newCubitSet 
    }
    // Take each cubit from the extisting set..
    //.. split it and add to the new set only the parts that don't overlap with the new cubit
    cubitSet.forEach(cubit => {
        if (overlap(cubit, newCubit)) { 
            split(cubit, newCubit).map( e => newCubitSet.add(e)) // split the old cubit and add in non-overlapping parts
        } else {
            newCubitSet.add(cubit) // if there is no overlap, add in the old cubit
        }
    })
    // add the new cubit if it is set to be on.. only "on" cubits are in the set. (There will be mo overlaps with this one in the new cubit set)
    if (on) newCubitSet.add(newCubit)
    
    return newCubitSet
}

const countCells = (cubit) => (((cubit[0][1] - cubit[0][0])+1) * ((cubit[1][1] - cubit[1][0])+1) * ((cubit[2][1] - cubit[2][0])+1))

const solveIt2 = async() => {
    const data = await readlines()
    // const data = smallTest
    const cleanData = data.map(dataLine => clean(dataLine))
    let cubits = new Set()
    
    cleanData.forEach(instruction => {
        // new cubits may overlap with other cubits.. so repeat until no overlaps..
        if (instruction.on) {
            cubits = makeCubits(true, instruction.on, cubits ) 
        } else {
            if (instruction.off) cubits = makeCubits(false, instruction.off, cubits ) 
        }
  })
    let onCells = 0
    cubits.forEach(cubit => onCells = onCells + countCells(cubit))
    return onCells
}

solveIt2().then(console.log)