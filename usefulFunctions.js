// Examples of ways to clean the data entered : 
//... replace, split, join, splice, slice, map, trim, use of regex, array deconstruction..

const cleanLine = (line) => line.toString().replace(/\s+/,'')
data.split(/\r\n|\r|\n/) //split on newline
//  (/\r\n|\r|\n/) works on all platforms with different line endingd
cleanLine = line.replace(regex, '') // "0,9 -> 5,9"
.split('->')
let regex = new RegExp("\\s+", "g")  // regular expression \s matches all whitespace characters (includes tabs and newlines)
const makeEntry = (bagLine) => {
    let bag, contents
    [bag, contents] = bagLine.split('contain')
    const cleanBag = bag.trim().slice(0,-4).trim()
    const cleanContents = contents.replace(/bags/g,"bag").replace(/bag\./g,"bag").slice(0,-3).split("bag,").map(e => e.trim())
    const contentsKeys = cleanContents.map(e => e.split(' ').splice(1).join(' '))
    const contentsValues = cleanContents.map(e => e.split(' ')[0])
// ... 
} 
 
const ptToString = (col, row) => col.toString() + "_" + row.toString()
const valueTo01 = (value) => value === '#' ? 1 : 0
const toggle = (valueToSet, algorithm) => {
    if (valueToSet === ".") return algorithm[0]
    if (valueToSet === "#") return algorithm[511]
}


// make an object from input
const makeObject = (lines) => {
    const objArr = lines.map(line => [line.split(' ')]).map(Object.fromEntries)
    return objArr
}

// display as a table
console.table(instructions)

// conditional display to console
console.assert(number % 2 === 0, {number: number, errorMsg: errorMsg});

// Test for arrays with equal values (arrays are reference types so === fails)
function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }
// .. alternatively convert array entries to strings for comparison

//Regex funcions
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


// pick out the bits you want!
console.log(__dirname)
const file = fs.readFileSync(join(__dirname, '/input23.txt'), 'utf8')

const reg = /#############\n#...........#\n###(\w)#(\w)#(\w)#(\w)###\n  #(\w)#(\w)#(\w)#(\w)#\n  #########/
const [a1, b1, c1, d1, a2, b2, c2, d2] = file.match(reg).slice(1, 9)

//If you want to replace all carriage returns \r, newlines \n and also literal \r and '\n` then you could use:
value = value.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
//About (?:) it means a non-capturing group, because by default when you put something into a usual group () then it gets captured into a numbered variable that you can use elsewhere inside the regular expression itself, or latter in the matches array.
//(?:) prevents capturing the value

// increment a Map counting values
const addMap = (key, map, add=1) => {
    const value = +map.get(key)
    if (value) {
        map.set(key, value + add)
    } else {
        map.set(key, add)
    } 
    return map
}

// permutations - multiple recursive calls
const split = (str, memSet = new Set()) => {
    // brilliant! generates all permutations of str replacing 'X' with 0 or 1
    // 'XXXX' will generate all permutations of four 1's and 0's
    if (!str.includes('X')) {
        memSet.add(str)
        return memSet // Base case, no more 'X'
    }    
    // Replacing first 'X' by 0, and also by 1; two recursive calls
    split(str.replace('X', '0'), memSet)
    split(str.replace('X', '1'), memSet)
    return memSet
}

// stack, queue
var stack = [];
stack.push(2);       // stack is now [2]
stack.push(5);       // stack is now [2, 5]
var i = stack.pop(); // stack is now [2]
alert(i);            // displays 5

var queue = [];
queue.push(2);         // queue is now [2]
queue.push(5);         // queue is now [2, 5]
var i = queue.shift(); // queue is now [5]
alert(i);              // displays 2


// Stack class
class Stack {
  
    // Array is used to implement stack
    constructor()
    {
        this.items = [];
    }
  
    // Functions to be implemented
    // push(item)
    // pop()
    // peek()
    // isEmpty()
    // printStack()


//Push: Adds an element to the stack
// push function
push(element)
{
    // push element into the items
    this.items.push(element);
}
//This method adds an element at the top of the stack.

// Pop() : Removes an element from the stack, if the function is call on an empty stack it indicates “Underflow”
// pop function
pop()
{
    // return top most element in the stack
    // and removes it from the stack
    // Underflow if stack is empty
    if (this.items.length == 0) {
        return "Underflow";
    }
    return this.items.pop();
}
// This method returns the topmost element of stack and removes it. Return underflow when called on an empty stack.

// peek function
peek()
{
    // return the top most element from the stack
    // but does'nt delete it.
    return this.items[this.items.length - 1];
}
// Return the topmost element without removing it from the stack.

// Helper methods

// This are the three basic operation perform by an Stack lets declare some helper method which can be useful while working with stack.

// isEmpty() : return true if the stack is empty
// isEmpty function
isEmpty()
{
    // return true if stack is empty
    return this.items.length == 0;
}
// Returns true if the stack is empty.

//printStack() : This method returns a string in which all the element of an stack is concatenated.
// printStack function
printStack()
{
    var str = "";
    for (var i = 0; i < this.items.length; i++)
        str += this.items[i] + " ";
    return str;
}
}

// GRID functions 

// Grid stored as flat array ..
const getNeighbours = (cell, g) => {
    // gives the array indices of neighbours for one grid cell
    // neighbours numbered 0 to grid.rows * grid.cols - 1 
    const col = getCol(cell, g)
    const row = getRow(cell, g)
    let neighbours = []
    if (col < g.width - 1) neighbours.push(cell + 1)
    if (col > 0) neighbours.push(cell - 1)
    if (row > 0) neighbours.push(cell - g.width)
    if (row < g.height - 1) neighbours.push(cell + g.width)
    return neighbours
}

const neighbours = (g = grid) => {
    // gives the array indices of neighbours for all grid cells
    let neighbours = []
    for (let c = 0; c < g.width; c++) {
        for (let r = 0; r < g.height; r++) {
            neighbours.push(getNeighbours(c, r, g))
        }
    }
    return neighbours  // the neighbours of each cell, in an array
}



const gridCell = (col, row, g = grid) => col + row * g.width
// returns the index of a grid cell in a (flat) array

const getRow = (cell, g) => Math.floor(cell / g.width)
const getCol = (cell, g) => cell % g.width

// Other, non-flat grid funcs

const getPoints = (grid) => {
    // store column and row in an object, and return an array of all of them
    pts = []
    for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
            pts.push({ col: col, row: row })
        }
    }
    return pts
}

const getPtMap = (grid) => {
    // store row, column as a key in a Map, with the value as the entry
    const ptMap = new Map()
    for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
            ptMap.set(ptToString(col, row), grid.values[row][col])
        }
    }
    return ptMap
}

const growGrid = (data, addLines = 2, entry = ".") => {
    // data is arrays by line
    // will add lines to all four sides
    // new line length will be + 2 * addLines

    // !!!!  Doing the following created an array but when used twice it had the same reference!
    // !!!! caused problem later because both rows were being changed at the same time.
    // const newRow = new Array(data[0].length + 2 * addLines).fill(entry)
    // each existing row will grow by addLines at the start and finish
    /// !!! same error with columns
    /// const newCols = new Array(addLines).fill(entry)
    /// data = data.map((v) => [...newCols, ...v, ...newCols])
    // REWRITTEN BELOW: 
    
    let newRow
    let newCols

    // add new rows, each created separately (otherwise have same references)
    for (let i = 0; i < addLines; i++) {
        newRow = new Array(data[0].length).fill(entry)
        data = [newRow, ...data]
    }
    for (let i = 0; i < addLines; i++) {
        newRow = new Array(data[0].length).fill(entry)
        data = [...data, newRow]
    }

    for (let j = 0; j < data.length; j++) {
        newCols = new Array(addLines).fill(entry)
        data[j] = [...newCols, ...data[j]]
        newCols = new Array(addLines).fill(entry)
        data[j] = [...data[j], ...newCols]
    }
    return { width: data[0].length, height: data.length, values: data }
}


// SET FUNCTIONS
const union = (setA, setB) => new Set([...setA, ...setB])
// return set that are in either input set
// console.log("union", union(new Set([1,2,3,4,5]), new Set([1,3,5,7,9])))

const intersection = (setA, setB) => {
    // rerurn set that are in both input sets
    return new Set([...setA].filter(x => setB.has(x)))
}
// console.log("intersection", intersection(new Set([1,2,3,4,5]), new Set([1,3,5,7,9])))

const difference = (setA, setB) => {
    // return set that are in SetA but not in Set B
    return new Set([...setA].filter(x => !setB.has(x)))
}
// console.log("difference", difference(new Set([1,2,3,4,5]), new Set([1,3,5,7,9])))

const sumSet = (set) => [...set].reduce((accum, next) => accum + Number(next), 0)
// console.log("sumSet", sumSet(new Set([1,2,3,4,5])))

const isSameSet = (s1, s2) => {
    if (s1.size !== s2.size) {
        return false;
    }
    return [...s1].every(i => s2.has(i))
}
