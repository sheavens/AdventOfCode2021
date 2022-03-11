/* Calculate the product for a total of down and a total of forward mopves 

forward 5
down 5
forward 8
up 3
down 8
forward 2 

15*10 = 150*/

//read file lines
const fs = require("fs").promises


const readLines = async() => {
    // const data = await fs.readFile('test2.txt', {encoding: 'utf-8'});
    const data = await fs.readFile('input2.txt', {encoding: 'utf-8'});
    return data.split(/\n/); //split on new lines
};

const solveIt  = async() => {
    // convert lines to array of numbers
    const lines = await readLines()
    // make an array of objects
    return part2MultForwardDown(makeObject(lines))
   //  cum height * cum depth
};


const multForwardDown = (objectArray) => {
/*  returns the product of cum height and distance forward from sequence steps*/
    let f = 0
    let d = 0
    for (let index = 0; index < objectArray.length; index ++) {
        command = objectArray[index]
        if ('up' in command) {
            d = d - Number(command.up)
        } else if ('down' in command) {
            d = d + Number(command.down)
        } else if ('forward' in command) {
            f = f + Number(command.forward)
        } else {
            console.log("command not recognised")
            return
        }
    }
    return f * d
}

const part2MultForwardDown = (objectArray) => {
    /*  returns the product of cum height and distance forward from sequence steps*/
        let h = 0
        let d = 0
        let aim = 0
        for (let index = 0; index < objectArray.length; index ++) {
            command = objectArray[index]
            if ('up' in command) {
                aim = aim - Number(command.up)
            } else if ('down' in command) {
                aim = aim + Number(command.down)
            } else if ('forward' in command) {
                h = h + Number(command.forward)
                d = d + aim * Number(command.forward)
            } else {
                console.log("command not recognised")
                return
            }
        }
        return h * d
    }

const makeObject = (lines) => {
    const objArr = lines.map(line => [line.split(' ')]).map(Object.fromEntries)
    console.log(objArr)
    return objArr
}

solveIt().then(console.log)


