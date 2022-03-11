/* complex but valid chunks include ([]), {()()()}, <([{}])>, [<>({}){}[([])<>]], and even (((((((((()))))))))).

Some lines are incomplete, but others are corrupted. Find and discard the corrupted lines first.

A corrupted line is one where a chunk closes with the wrong character - that is, where the characters it opens and closes with do not form one of the four legal pairs listed above.

Examples of corrupted chunks include (], {()()()>, (((()))}, and <([]){()}[{}]). Such a chunk can appear anywhere within a line, and its presence causes the whole line to be considered corrupted.

For example, consider the following navigation subsystem: */

const fs = require("fs").promises;

const readlines = async() => {
    const data = await fs.readFile('input10.txt', {encoding: 'utf-8'});
    return data.split('\n'); //split on new lines
};



class Stack {
    constructor(){
        this.data = [];
        this.top = 0;
    }

    push(element) {
    this.data[this.top] = element;
    this.top = this.top + 1;
    }

    length() {
    return this.top;
    }

    peek() {
    return this.data[this.top -1 ];
    }

    isEmpty() {
    return this.top === 0;
    }

    pop() {
        if( this.isEmpty() === false ) {
        this.top = this.top -1;
        return this.data.pop(); // removes the last element
        }
    }
}

const testChunks = ["[({(<(())[]>[[{[]{<()<>>".split(''),
"[(()[<>])]({[<{<<[]>>(".split(''),
"{([(<{}[<>[]}>{[]{[(<()>".split(''),
"(((({<>}<{<{<>}{[]{[]{}".split(''),
"[[<[([]))<([[{}[[()]]]".split(''),
"[{[{({}]{}}([{[{{{}}([]".split(''),
"{<[[]]>}<{[{[{[]{()[[[]".split(''),
"[<(<(<(<{}))><([]([]()".split(''),
"<{([([[(<>()){}]>(<<{{".split(''),
"<{([{{}}[<[[[<>{}]]]>[]]".split('')]

//  store the expected closing symbol

/* if chunk.next = opener store the matching closer in the stack.  
if chunk.next is a closer check with the expected closer - pop it off  the stack. */

const bracketSets = [['[',']'],['(',')'],['{','}'],["<",">"]]
const opener = 0
const closer = 1


const chunkCheck = (chunkBracket, closerStack) => {
    
    for (let brackets of bracketSets) {
        
        if ( chunkBracket === brackets[opener]) {
            closerStack.push(brackets[closer]) 
            return 0
        }  else if (chunkBracket === brackets[closer]) {
            const expected = closerStack.pop()
            if (expected !== chunkBracket) {
                switch(chunkBracket) {
                    case ')':
                        return 3
                    case ']':
                        return 57
                    case '}':
                        return 1197
                    case '>':
                        return 25137
                }
            } 
        }
    }
    return 0
}

const checkChunks = (chunkArray) => {
    let score = 0
    closerStack = new Stack()
    for (chunk of chunkArray) {
        for (bracket of chunk) {
            score = score + chunkCheck(bracket, closerStack)
        }
    }
    return score
}

const solveIt  = async() => {
    const data = await readlines()
    // return checkChunks(testChunks)
    return checkChunks(data.map(line => line.split('')))
}



const chunkCheck2 = (chunkBracket, closerStack) => {
    
    for (let brackets of bracketSets) {
        
        if ( chunkBracket === brackets[opener]) {
            closerStack.push(brackets[closer]) 
        }  else if (chunkBracket === brackets[closer]) {
            const expected = closerStack.pop()
            if (expected !== chunkBracket) {
                return null //empty stack for corrupt chunk
            }   
        }
    }

    return closerStack  
}

const calcScore = (closerStack) => {
    console.log(closerStack)
    let score = 0
    while (closerStack.length() > 0) {
        switch(closerStack.pop()) {
            case ')':
                score = score * 5 + 1
                break
            case ']':
                score = score * 5 + 2
                break
            case '}':
                score = score * 5 + 3
                break
            case '>':
                score = score * 5 + 4
                break
        }
    }
    return score
} 

const checkChunks2 = (chunkArray) => {
    let scores = []
    
    for (chunk of chunkArray) {
        closerStack = new Stack()
        for (bracket of chunk) {
            closerStack = chunkCheck2(bracket, closerStack)
            if (closerStack === null) break  // corrupted chunk, ignore the rest of it
        }
        if (closerStack && closerStack.length() > 0) scores.push(calcScore(closerStack))
    }
    return scores
}

const solveItPart2  = async() => {
    const data = await readlines()
    // const scores = checkChunks2(testChunks)
    const scores = checkChunks2(data.map(line => line.split('')))
    scores.sort((a,b) => a - b)
    return scores[Math.trunc(scores.length-1)/2]
    // return )
}


// solveIt().then(console.log)
solveItPart2().then(console.log)

