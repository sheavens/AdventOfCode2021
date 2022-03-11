/* Find largest (part 2 smallest) 14 digit number returning z 0 after sequence of commands.  Each didgit is input to one of 14
 sequencial instruction sets.
 Also solved manually.  
 Z explodes to high numbers unless input digit w = x in some sections, where  z/ 26 if so.
 Other sections raise z to the power 26.  Solution requires choice of inputs w to ensure z / 26 is
 met.  Can be solved manually by noticing that choices of later w to achive this rely on earlier w choices being made.
 z mod 26 must lie in correct range so that x is 1-9 and w acan be set equal to x.
 for coded solution .. worked , but slow despite cutting off high z values early. 
 Fixing w to be x when required fails, because later w only possible if earlier w choices made. */



const fs = require("fs").promises;

const readLines = async() => {
    const data = await fs.readFile('input24.txt', {encoding: 'utf-8'});
    return data.split(/\r\n|\r|\n/) //split on newline; 
}

//For example, here is an ALU program which takes an input number, negates it, and stores it in x:

test1 = [
"inp x",
"mul x -1"
]
// Here is an ALU program which takes two input numbers, then sets z to 1 if the second input number is three times larger than the first input number, or sets z to 0 otherwise:

test2 = [
"inp z",
"inp x",
"mul z 3",
"eql z x",
]

// Here is an ALU program which takes a non-negative integer as input, converts it into binary, and stores the lowest (1's) bit in z, the second-lowest (2's) bit in y, the third-lowest (4's) bit in x, and the fourth-lowest (8's) bit in w:

test3 = [
"inp w",
"add z w",
"mod z 2",
"div w 2",
"add y w",
"mod y 2",
"div w 2",
"add x w",
"mod x 2",
"div w 2",
"mod w 2",
]

const process = (input, z=0, tryDigit) => {
    let w = 0
    let x = 0
    let y = 0
    //let z = 0
    const vars = {w:w, x:x, y:y, z:z}
    let store = new Map()
    let digitString = ''
    let indx = 0
    let operation, var1=0, var2=0 
 
    for (let i = 0; i < input.length; i++) {
        [operation, var1, var2] = input[i].split(' ')
        switch (operation) {
            case 'inp':
                vars[var1] = tryDigit
                indx +=1
                digitString = digitString + vars.w.toString()
                if (indx === input.length) store.set(digitString, 
                vars.w + "-" + vars.x + "-" + vars.y + "-" + vars.z)
                break
            case 'add':
                vars[var1] = vars[var1] + (!isNaN(var2) ? +var2 : +vars[var2])
                break
            case 'mul':
                vars[var1] = vars[var1] * (!isNaN(var2) ? +var2 : +vars[var2])
                break
            case 'div':
                vars[var1] = Math.floor(+vars[var1] / (!isNaN(var2) ? +var2 : +vars[var2]))
                break
            case 'mod':
                if (!isNaN(var2) && +var2 !== 0) {
                    vars[var1] = +vars[var1] % +var2
                } else if (vars[var2] !== 0) {
                    vars[var1] = +vars[var1] % +vars[var2]
                } else {
                    vars[var1] = 0
                }
                //console.log("Compare mod: ",  var1, vars[var2], ' or ', var2, vars[var1])
                break 
            case 'eql':
                

/*                     if (vars[var1] < 10 && vars[var1] > 0 && vars[var1] !== vars[var2]) {
                        return null   // !!! rejects iteration which will miss op. to divide by 26
                    }  
                 */ // needs refinement.  Rejecting too many. Limit to whwre z/26 move included.
            
                vars[var1] = +vars[var1] === (!isNaN(var2) ? +var2 : +vars[var2]) ? 1 : 0
                break                                
            default:
        }
    }
    
    //console.log(store, vars.z)
    return {w: vars.w, x:vars.x, y:vars.y, z:vars.z }
}


// find the largest 14 digit number that produces a valid output from the
// Arithmetic Logic Unit. 
const next = (digits14) => {
    // find the next lower 14 digit number with no zeros, returning
    // as 14 digit array
    for (let i =  digits14.length - 1; i >=0 ; i-- ) {
        if (digits14[i] > 1) {
            digits14[i] = digits14[i] - 1
            return digits14
        } else {
            if (i > 0) digits14[i] = 9
        }
    }
    return digits14
}

const backNext = (digits14) => {
    // find the next 14 digit number with no zeros decreasing from left, returning
    // as 14 digit array
    for (let i = 0; i < digits14.length ; i++ ) {
        if (digits14[i] > 1) {
            digits14[i] = digits14[i] - 1
            return digits14
        } else {
            if (i < digits14.length) digits14[i] = 9
        }
    }
    return digits14
}

const parseTo14 = (input) => {
    let arr = []
    let splitArr = []
    let operation, var1, var2 
    for (let i = 0; i < input.length; i++) {
        [operation, var1, var2] = input[i].split(' ')
        if (operation === 'inp' && i > 0) {
            splitArr.push(arr)
            arr = []
        }
        arr.push(input[i])
    }
    splitArr.push(arr)
    return splitArr
}

const trySolve = (input) => {
    // attempt to solve backwards, fining z values into sectio taht give z zero,
    // then all z values that make that set of z values from previous section...
    
    let z, result
    let targetMap = new Map()
    targetMap.set(0, '') // the 14th (last) set of instructions must result in 0
    let lastMap = new Map()
    
    for (let i = 13; i >=0; i-- ) { //work through instruction set 
        lastMap = targetMap
        targetMap = new Map()
        let cnt = 0
        let lastPass = 1000
        for (let w = 1; w < 10; w++) {
            
            for (let j = 0; j < 10000000000; j = j + 1) {
                z = j
                result = process(input[i], z, w)
                if (lastMap.has(result)) {
                    cnt = cnt + 1
                    // finding the same result will replace in map with higher w
                    targetMap.set( z, lastMap.get(result)+w.toString())
                    if (j > lastPass) lastPass = j
                } 
                if (j > 10 * lastPass) {
                    break // cut if have not found a solution in last 1000 trials
                }
            }
        }
        if (targetMap.size < 10) console.log(targetMap)
        console.log(targetMap.size, i, cnt)
        // no result but 693649929899 last one
    }
}

const recurse = (input, stage=0, z = 0, w = 0, memoSet = new Set()) => {
    
    // success
    if (+z === 0) {
        //console.log("stage, z is zero", stage, z)
        if (stage === input.length) return '' // .. stage 13 now completed and z === 0
    }

    // fail - stage 13 completed without success - continues next w loop
    if (stage === input.length) { // stage 13 complted but z not zero
        // console.log("stage, z", stage, z)
        return null // -1?
    }

    // if this z has already been explored from here, return null
    if (memoSet.has(stage.toString() + "_" + w.toString())) {
        return null
    } 

    // apply cut-off at z power.. ..because only few chances remaining to divide by 26
     if (z > Math.pow(26, input.length-stage) ) {
        return null  
    } 

    let code = null // this line will not be reached post success

    // work through all input w options, from 9 to 1
    let result = {}
    let answer = []
    const calculated = [4,5,9,8,9,9,2,9,9,4,6,1,9,9]   //This can ne manually calculated, or as below.. slowly!
    //for (let w = 1; w <10; w++) { // for part 2
    for (let w = 9; w > 0; w--) {
        result = process(input[stage], z, w) 
        if (stage===0) console.log("stage0 w", w)
        code = recurse(input, stage+1, result.z, w, memoSet) //recurse, will try all 9s first
        memoSet.add(stage.toString() + "_" + w.toString() + z.toString()) //remember this
        if (code !== null) {
            console.log(result.w.toString())
            return code = [result.w.toString(), ...code]
        } 
    }
    return null  // fail - all recursions and loops completed without success
}

const testResult = (input, result) => {
    let z = 0
    let code = []
    let vars = {}
    for (i=0; i < input.length; i++) {
        vars = process(input[i], z, result[i])
        z = vars.z
        code.push(vars.w)
        console.log(z, code)
    }
    return code
}

solveIt = async() => {
    let input = await readLines()
    // let input = test1 
    // split input into 14 sets starting with "inp"
    input = parseTo14(input) // now looking at just instruction set as array of 14 sections
    return recurse(input)

    // return trySolve(input)
    const testR1 = [4,5,9,8,9,9,2,9,9,4,6,1,9,9]
    console.log(testResult(input, testR1))

}
// ['4', '5', '9', '8', '9', '9', '2', '9', '9', '4', '6', '1', '9', '9']
solveIt().then(console.log)