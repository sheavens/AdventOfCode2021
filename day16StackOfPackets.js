/* Solve a sequence of "packets" (using reverse Polish type arithmetic instructions).  
Solved (eventually!) using a stack of commands yet to execute.  Each waits for a number of subpackets or bits to be read.
 */

const testBin1 = 00111000000000000110111101000101001010010001001000000000
// VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB

const hexStringToBin = (hexString) => hexString.split("").map(d => hexToBin(d)).join("")

const hexToBin = (hex) => (parseInt(hex, 16).toString(2)).padStart(4, '0')


const decodeLiteral = (codedLiteral) => {
/*    
    literal is a number formed from blocks of 4 bits.. the last set of 4 is preceded by a 0, the others 1
    Example with 3 blocks of 5 bits..(version and type codes first)
      110100  101111111000101000
      vvvttt  AAAAABBBBBCCCCC
*/

    if (codedLiteral.length <  5 ) return 0 // check at least  one 5-bit block included 
    let literal = ""
    while (codedLiteral[0] === "1") { // count the codedLiteral in groups of 5
        literal = literal + codedLiteral.slice(1,5)  // include the next four digits
        codedLiteral = codedLiteral.slice(5)
    }
    literal = literal + codedLiteral.slice(1,5)  //include the four digits of the last block (preceeded by a 0)
    return literal = parseInt(literal, 2)  
}

const literalLength = (codedLiteral) => {
// the length of a literal is to the end of last 5 bit block 
// where the first (indicator) bit is a 1

    if (codedLiteral.length < 5 ) return 0 // at least one 5-bit block included
    let len = 0
    while (codedLiteral[0] === "1") {  //count the codedLiteral in groups of 5
        len = len + 5
        codedLiteral = codedLiteral.slice(5)
    }
    return len + 5  // the last 5 digit block ends with 0 - add the length of this one.
}

const getVersion = (packet) => +packet.slice(0, 3)
const getTypeID = (packet) => parseInt(+packet.slice(3, 6), 2)
const getLiteralLength = (packet) => +literalLength(packet)
const getLiteral = (packet) => +decodeLiteral(packet)
const getLengthTypeID = (packet) => + (packet.slice(6, 7))
const getNumSubPackets = (packet) => {
    console.log("subPackets", packet.slice(7, 7 + 11))
    return parseInt(+packet.slice(7, 7 + 11), 2 )
}
const getPacketBits = (packet) => parseInt(packet.slice(7, 7 + 15), 2)  // if lengthType 0, next 15 bits contain the length of the subpacket in bits
const getRestOfPackets = (packet) => packet.slice(7 + 15, 7 + 15 + getPacketBits(packet))
const getLiteralRest = (packet) => packet.slice(getLiteralLength(packet))
 // this just returns everything after teh subPackets.. I don't understand how to use the number of packet info yet
const getRestSubPackets = (packet) => packet.slice(7 + 11) 

const prodArr = (arr) => arr.reduce((a, b) => a * b, 1)
const sumArr = (arr) => arr.reduce((a, b) => +a + +b, 0)
const minArr = (arr) => arr.reduce((a, b) => b < a ? b : a)
const maxArr = (arr) => arr.reduce((a, b) => b > a ? b : a)
const greaterThan = (arr) => arr.reduce((a, b) => a > b ? 1 : 0)
const lessThan = (arr) => arr.reduce((a, b) => a < b ? 1 : 0)
const equalTo = (arr) => arr.reduce((a, b) => a === b ? 1 : 0)

const operate = (typeID, arr) => {
/* 
Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
*/ 
switch (typeID) {
    case 0:
        return sumArr(arr)
    case 1:
        return prodArr(arr)
    case 2:
        return minArr(arr)
    case 3:
        return maxArr(arr)
    case 5:
        return greaterThan(arr)
    case 6:
        return lessThan(arr)
    case 7:
        return equalTo(arr)
      default:
        // code block  - error if got to here  
        return "Error: TypeId not recognised"  
    }
}

const decodeLiterals = (packet, subPackets = null, subPacketsLength = null) => {
    const h = 6 // length of leading metadata
    if (subPackets === 0 && subPacketsLength < 6 ) {
        console.log("returning decoded literals")   
        return []
    } 
    const literal = getLiteral(packet.slice(h))
    let literalArr = [].concat(literal) 
    const len = getLiteralLength(packet.slice(h))
    if (subPackets) {
        subPackets -=1
    } else { 
        if (subPacketsLength) {
            subPacketsLength -= (h + len)
        }
    }   
    console.log("!! literal", literal)
    return literalArr.concat(decodeLiterals(packet.slice(h + len), subPackets, subPacketsLength))
    
 
}


const decodeOperations = (packet) =>  {
    const h = 6 // length of leading metadata
    if (packet.length < 6 ) {
        console.log("returning packet length below 6")   
        return []// full encoded length has been consumed.  The end
    } 
    // otherwise type IDs are "operators" ?? might need to exclude 000
    const lengthTypeID = getLengthTypeID(packet)  
    let subPacketsLength = 0
    let subPackets = 0
    if (lengthTypeID === 1) {
        subPackets = getNumSubPackets(packet)  // if LengthType 1, next 12 bits ..
        h = 7 + 11  // length of leading metadata
    } else {
        subPacketsLength = getPacketBits(packet)
        h = 7 + 15  // length of leading metadata
    } 

    return result.concat(operate(typeID, decodePack(packet.slice(h), subPackets, subPacketsLength))) // decode the subpackets
}


const decodePack = (packet) => {
    const typeID = getTypeID(packet) // Next three bits are the type ID
    console.log("typeID", typeID)
    result = []
    if (typeID  !== 4) {
        
        result = result.concat(decodeLiterals(packet, subPackets, subPacketsLength )) 
          // otherwise type IDs are "operators" ?? might need to exclude 000
          const lengthTypeID = getLengthTypeID(packet)  
          let subPacketsLength = 0
          let subPackets = 0
          if (lengthTypeID === 1) {
              subPackets = getNumSubPackets(packet)  // if LengthType 1, next 12 bits ..
              h = 7 + 11  // length of leading metadata
          } else {
              subPacketsLength = getPacketBits(packet)
              h = 7 + 15  // length of leading metadata
          } 
          // console.log("!!Hi", decodePacket(packet.slice(h), subPackets, subPacketsLength))
          result = operate(typeID, decodePack(packet.slice(h))) // decode the subpackets
    
          if (typeID  === 4) result = result.concat(decodeLiterals(packet, subPackets, subPacketsLength )) 
      
      }
    
    decodeOperations(packet)
}


const decodePacket = (packet, subPackets = 1) => {
    console.log("packet, length", packet, packet.length)
    // To end - packet fully consumed 
    // (.. or less than the length of leading metadata ?)
    if (subPackets === 0 && packet.length < 6 ) {
        console.log("returning decoded packets")   
        return []
    } 
    
    if (subPackets) subPackets = subPackets -1

    let result = [] // will contain result, bubbled up at the end
    
    const typeID = getTypeID(packet) // Next three bits are the type ID
    console.log("typeID", typeID)

    if (typeID  !== 4) { 

      // type IDs are "operators"
        const lengthTypeID = getLengthTypeID(packet) 


        if (lengthTypeID === 1) {
            //subPacketsLength = 0
            //subPackets = getNumSubPackets(packet)  // if LengthType 1, next 12 bits ..
            h = 7 + 11  // length of operator packet
            // recurse until the number of subpackets consumed
            // loop over this number of subPackets
            let ns = getNumSubPackets(packet)
            let s = 0
            while (s < ns) {
                result = [...result, decodePacket(packet.slice(h))]
                s += 1
            }
            return operate(typeID, result)
            result = [...result, operate(typeID, decodePacket(packet.slice(h), subPackets=getNumSubPackets(packet)))] // decode the subpackets
            
        } else {
            //subPackets = 0
            //subPacketsLength = getPacketBits(packet)
            h = 7 + 15  // length of operator packet
            let pb = getPacketBits(packet)
            let b = 0
            while (b < pb) {
                result = [...result, decodePacket(packet.slice(h), pb, )]
                pb += h
            }
            return operate(typeID, result)


            result = [...result, operate(typeID, decodePacket(packet.slice(h, getPacketBits(packet)), subPackets=0))]
            // decode the rest, after this packet length
            decodePacket(packet.slice(h + getPacketBits(packet)), subPackets=0, subPacketsLength=getPacketBits(packet))// decode the subpackets
        } 
 
    } else { // if not an operator, one or more literals follow

        h = 6  // length of leading metadata
        // type ID 4 is a "literal" number and can be read directly
    
        const len = getLiteralLength(packet.slice(h))
        result =  [...result, getLiteral(packet.slice(h, h + len))]
        decodePacket(packet.slice(h + len), subPackets=0, subPacketsLength=getPacketBits(packet))


    
    }


    

    // return {version: version, typeID: typeID, literal: literal, sumVersions = sumVersions}
} 

const max = (a,b) => a > b ? a : b

const stackSolve = (packet) => {
    let typeID, lengthTypeID
    const litHeader = 6  // length of metaData
    const op1Header = 6 + 1 + 11  // length of metaData
    const op0Header = 6 + 1 + 15  // length of metaData
    // accum decoded length
    let dl = 0
    let dc = 0
    let pks = 0

    let opStack = new Stack()
    opStack.push({operator: null, length: packet.length, decoded: 0, subpks: 0, literals: []})
    let top, next, literalResult, len

    while (opStack.peek().length > 0 || opStack.peek().subpks > 0) {

        //read typeId
        typeID = getTypeID(packet.slice(dl))
        pks = pks + 1
        // concatenate literals
        if (typeID !== 4) { // an operator
            lengthTypeID = getLengthTypeID(packet.slice(dl)) 
            if (lengthTypeID === 1) { // length Type Id is 1, number of immediate subpackets encoded next 
                // add the operator to the top of the stack
                opStack.push({operator: typeID, length: 0, decoded: 0, subpks: getNumSubPackets(packet.slice(dl)), literals: []})
                dl = dl + op1Header
                pks = 0
            } else { // length Type Id is 0, length of subpackets encoded next
                // add the operator to the top of the stack
                decoded = dl + op0Header // store the length decoded at this point
                opStack.push({operator: typeID , length: getPacketBits(packet.slice(dl)), decoded: decoded, subpks: 0, literals: []})
                dl = dl + op0Header
                dc = dl
            }
        } else { // (typeID === 4) a literal
            // add the literal to the top stack element
            top = opStack.pop()
            opStack.push({operator: top.operator, length: top.length, decoded: top.decoded, subpks: max(top.subpks-1,0), literals: [...top.literals, getLiteral(packet.slice(dl+litHeader))]})
            dl = dl + litHeader + getLiteralLength(packet.slice(dl+litHeader))
        }
        console.log(opStack.peek())
        while ((opStack.peek().subpks === 0 && opStack.peek().length === 0) || 
                    dl - opStack.peek().decoded === opStack.peek().length) { 
            // pop the top stack element and apply the operator
            top = opStack.pop()
            literalResult = operate(top.operator, top.literals)
            if (opStack.peek().operator === null) {
                return literalResult
            } else {
                next = opStack.pop()
                opStack.push({operator: next.operator, length: next.length, decoded: next.decoded, subpks: max(next.subpks-1,0), literals: [...next.literals, literalResult ]})
                console.log(opStack.peek())
            }
        }
       
    }
}



const decodeStack = (packet, opStack) => { // add operator to operator stack. and subpackets to subpackets stack
    
    while (packet.length > 6) {  // min length for another sub packet
   
    const typeID = getTypeID(packet) // Next three bits are the type ID
    console.log("typeID", typeID)
    // add typeId to stack

    if (typeID  !== 4) { // not a literal
        // type IDs are "operators"
        const lengthTypeID = getLengthTypeID(packet) 
        if (lengthTypeID === 1) {
            h = 7 + 11  // length of operator packet
            // mark this as consumed against top entry of the stack ??
            /// 1 packet of lenght h has been consumed and

            // initilly, we have the length of the full input packet to consume..
            // but what if the operator? none.  nothing on the operator stack
            // first entry has operator and to consume as packet.slice(h)
            
            subPackets=getNumSubPackets(packet)
            // add this to the stack
            entry = {operator: typeID, toConsume: {subpackets: subpackets, length: length}, 
                    consumed: {length: 0, subpackets: 0}}
            opStack.push(entry)
            // add number of subpackets to stack
            packet.slice(h)
            lengthConsumed += h
            subPacketsConsumed += 1
        } else {   
            h = 7 + 15  // length of operator packet
            subPacketsLength=getPacketBits(packet)
            // add this to the stack
            entry = {operator: typeID, toConsume: {subpackets: subpackets, length: length}, 
            consumed: {length: 0, subpackets: 0}}
            opStack.push(entry)

            packet.slice(h)
            lengthConsumed += h
            subPacketsConsumed += 1
        } 
    } else { // a literal number
        h = 6  // length of leading metadata
        len = getLiteralLength(packet.slice(h))
        literal = getLiteral(packet.slice(h, h + len))
        lengthConsumed += h
        subPacketsConsumed += 1
        // when expected length or number of subpackets has been consumed, apply operator
        // and return the result to the stack
        if (lengthConsumed >= peek(opStack).consumed.length)  !!! TBC
        // when the length consumed equals the total expected, apply the operator
        if (packetsOrLengthStack === length  && length === lengthconsumed) return null //!!

    }

    const operatorStack = []
    // add operator to operator stack
    }

}


// Stack class
class Stack {
  
    // Array is used to implement stack
    constructor()
    {
        this.items = [];
    }

    //Push: Adds an element to the stack
    // push function
    push(element)
    {
        // push element into the items
        this.items.push(element);
    }

    // Pop() : Removes an element from the stack, if the function is call on an empty stack it indicates “Underflow”
    // pop function
    pop()
    {
        if (this.items.length == 0)
            return "Underflow";
        return this.items.pop();
    }
    
    // peek function
    peek()
    {
        // returns the top most element from the stack
        // but does'nt delete it.
        return this.items[this.items.length - 1];
    }


    // Helper methods
    isEmpty()
    {
        // return true if stack is empty
        return this.items.length == 0;
    }


    //printStack() : This method returns a string in which all the elements of a stack are concatenated.
    // printStack function
    printStack()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}


//console.log("C200B40A82 finds the sum of 1 and 2, resulting in the value 3.", stackSolve(hexStringToBin("C200B40A82")))
//console.log("880086C3E88112 finds the minimum of 7, 8, and 9, resulting in the value 7.", stackSolve(hexStringToBin("880086C3E88112")))
//console.log("04005AC33890 finds the product of 6 and 9, resulting in the value 54.", stackSolve(hexStringToBin("04005AC33890")))
//console.log("CE00C43D881120 finds the maximum of 7, 8, and 9, resulting in the value 9.", stackSolve(hexStringToBin("CE00C43D881120")))
//console.log("D8005AC2A8F0 produces 1, because 5 is less than 15.", stackSolve(hexStringToBin("D8005AC2A8F0")))
//console.log("F600BC2D8F produces 0, because 5 is not greater than 15.", stackSolve(hexStringToBin("F600BC2D8F")))
//console.log("9C005AC2F8F0 produces 0, because 5 is not equal to 15.", stackSolve(hexStringToBin("9C005AC2F8F0")))
//console.log("9C0141080250320F1802104A08 produces 1", stackSolve(hexStringToBin("9C0141080250320F1802104A08")))
console.log(stackSolve(hexStringToBin("E20D41802B2984BD00540010F82D09E35880350D61A41D3004E5611E585F40159ED7AD7C90CF6BD6BE49C802DEB00525272CC1927752698693DA7C70029C0081002140096028C5400F6023C9C00D601ED88070070030005C2201448400E400F40400C400A50801E20004C1000809D14700B67676EE661137ADC64FF2BBAD745B3F2D69026335E92A0053533D78932A9DFE23AC7858C028920A973785338832CFA200F47C81D2BBBC7F9A9E1802FE00ACBA44F4D1E775DDC19C8054D93B7E72DBE7006AA200C41A8510980010D8731720CB80132918319804738AB3A8D3E773C4A4015A498E680292B1852E753E2B29D97F0DE6008CB3D4D031802D2853400D24DEAE0137AB8210051D24EB600844B95C56781B3004F002B99D8F635379EDE273AF26972D4A5610BA51004C12D1E25D802F32313239377B37100105343327E8031802B801AA00021D07231C2F10076184668693AC6600BCD83E8025231D752E5ADE311008A4EA092754596C6789727F069F99A4645008247D2579388DCF53558AE4B76B257200AAB80107947E94789FE76E36402868803F0D62743F00043A1646288800084C3F8971308032996A2BD8023292DF8BE467BB3790047F2572EF004A699E6164C013A007C62848DE91CC6DB459B6B40087E530AB31EE633BD23180393CBF36333038E011CBCE73C6FB098F4956112C98864EA1C2801D2D0F319802D60088002190620E479100622E4358952D84510074C0188CF0923410021F1CE1146E3006E3FC578EE600A4B6C4B002449C97E92449C97E92459796EB4FF874400A9A16100A26CEA6D0E5E5EC8841C9B8FE37109C99818023A00A4FD8BA531586BB8B1DC9AE080293B6972B7FA444285CC00AE492BC910C1697B5BDD8425409700562F471201186C0120004322B42489A200D4138A71AA796D00374978FE07B2314E99BFB6E909678A0")))