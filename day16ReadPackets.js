const testBin1 = 00111000000000000110111101000101001010010001001000000000
// VVVTTTILLLLLLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBBBBBB

const testBin2 = 11101110000000001101010000001100100000100011000001100000
// VVVTTTILLLLLLLLLLLAAAAAAAAAAABBBBBBBBBBBCCCCCCCCCCC

const testHex1 = "8A004A801A8002F478"
const testHex2 = "620080001611562C8802118E34"
const testHex3 = "C0015000016115A2E0802F182340"
const testHex4 = "A0016C880162017C3686B18A3D4780"

const testHexOperator = "38006F45291200"

const hexStringToBin = (hexString) => hexString.split("").map(d => hexToBin(d)).join("")

const hexToBin = (hex) => (parseInt(hex, 16).toString(2)).padStart(4, '0')



// console.log(hexToBin(testHex1))
// console.log(hexToBin(testHex2))
// console.log(hexToBin(testHex3))
// console.log(hexToBin(testHex4))

const decodeLiteral = (codedLiteral) => {
/*    
    literal is a number formed from blocks of 4 bits.. the last set of 4 is preceded by a 0, the others 1
    Example with 3 blocks of 5 bits..(version and type codes first)
      110100  101111111000101000
      vvvttt  AAAAABBBBBCCCCC
*/
console.log("sub decodeLiteral, codedLiteral", codedLiteral)
    if (codedLiteral.length <  5 ) return 0 // check at least  one 5-bit block included 
    let literal = ""
    while (codedLiteral[0] === "1") { // count the codedLiteral in groups of 5
        literal = literal + codedLiteral.slice(1,5)  // include the next four digits
        codedLiteral = codedLiteral.slice(5)
    }
    return literal = literal + codedLiteral.slice(1,5)  //include the four digits of the last block (preceeded by a 0)
}

const literalLength = (codedLiteral) => {
// the length of a literal is to the end of last 5 bit block 
// where the first (indicator) bit is a 1
console.log("sub literalLength, codedLiteral", codedLiteral)
    if (codedLiteral.length < 5 ) return 0 // at least one 5-bit block included
    let len = 0
    while (codedLiteral[0] === "1") {  //count the codedLiteral in groups of 5
        len = len + 5
        codedLiteral = codedLiteral.slice(5)
    }
    return len + 5  // the last 5 digit block ends with 0 - add the length of this one.
}

const getVersion = (packet) => +packet.slice(0, 3)
const getTypeID = (packet) => +packet.slice(3, 6)
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


const decodePacket = (packet) => {
    console.log("packet, length", packet, packet.length)
    if (packet.length === 0 || +packet === 0) return 0 // full encoded length has been consumed.  The end
    // if (packet.length < 6 + 5)  return { err: "ERROR, packet too short, packet", packet: packet }
    
    let sumVersions = 0
    const version = getVersion(packet) // First 3 bits are the version number
    sumVersions = sumVersions + parseInt(version, 2) // track the sum of all version numbers
    console.log("version, versions", version, sumVersions)
    
    let literal
    const typeID = getTypeID(packet) // Next three bits are the type ID
    console.log("typeID", typeID)
    let h

    if (typeID  === 100) {// type ID 4 (100 in binary) is a "literal" number and can be read directly
        h = 6 // length of leading metadata
        literal = getLiteral(packet.slice(h)) 

        console.log("!! literal", literal, parseInt(literal, 2))
        sumVersions = sumVersions + decodePacket(packet.slice(h + getLiteralLength(packet.slice(h)))) // decode the rest

    } else {  // otherwise type IDs are "operators" ?? might need to exclude 000
        const lengthTypeID = getLengthTypeID(packet)  //
        if (lengthTypeID === 1) {
            const subPackets = getNumSubPackets(packet)  // if LengthType 1, next 12 bits ..
            // decode each subpacket  --- not using no. subPackets??

/*             for (let n = 0; n < subPackets; n++) { // decode the number of subpackets
                sumVersions = sumVersions + decodePacket(getRestSubPackets(packet))
            } */
            h = 7 + 11  // length of leading metadata
            sumVersions = sumVersions + decodePacket(packet.slice(h)) // decode the rest
           
        } else {
            if (lengthTypeID === 0) {
                const lengthSubPackets = getPacketBits(packet)
                h = 7 + 15  // length of leading metadata
                sumVersions = sumVersions + decodePacket(packet.slice(h, h + lengthSubPackets)) // decode the number of packet bits
                sumVersions = sumVersions + decodePacket(packet.slice(h + lengthSubPackets)) // decode the rest
            }
        } 

    }
    return sumVersions    
    // return {version: version, typeID: typeID, literal: literal, sumVersions = sumVersions}
} 



let y = hexStringToBin("C0015000016115A2E0802F182340").split("").join("|")

//console.log("38006F45291200", decodePacket(hexStringToBin("38006F45291200")))
//console.log("EE00D40C823060", decodePacket(hexStringToBin("EE00D40C823060")))
//console.log("8A004A801A8002F478", decodePacket(hexStringToBin("8A004A801A8002F478")))
//console.log("620080001611562C8802118E34", decodePacket(hexStringToBin("620080001611562C8802118E34")))
//console.log("C0015000016115A2E0802F182340", decodePacket(hexStringToBin("C0015000016115A2E0802F182340")))
//console.log("A0016C880162017C3686B18A3D4780", decodePacket(hexStringToBin("A0016C880162017C3686B18A3D4780")))
console.log(solveStack(hexStringToBin("E20D41802B2984BD00540010F82D09E35880350D61A41D3004E5611E585F40159ED7AD7C90CF6BD6BE49C802DEB00525272CC1927752698693DA7C70029C0081002140096028C5400F6023C9C00D601ED88070070030005C2201448400E400F40400C400A50801E20004C1000809D14700B67676EE661137ADC64FF2BBAD745B3F2D69026335E92A0053533D78932A9DFE23AC7858C028920A973785338832CFA200F47C81D2BBBC7F9A9E1802FE00ACBA44F4D1E775DDC19C8054D93B7E72DBE7006AA200C41A8510980010D8731720CB80132918319804738AB3A8D3E773C4A4015A498E680292B1852E753E2B29D97F0DE6008CB3D4D031802D2853400D24DEAE0137AB8210051D24EB600844B95C56781B3004F002B99D8F635379EDE273AF26972D4A5610BA51004C12D1E25D802F32313239377B37100105343327E8031802B801AA00021D07231C2F10076184668693AC6600BCD83E8025231D752E5ADE311008A4EA092754596C6789727F069F99A4645008247D2579388DCF53558AE4B76B257200AAB80107947E94789FE76E36402868803F0D62743F00043A1646288800084C3F8971308032996A2BD8023292DF8BE467BB3790047F2572EF004A699E6164C013A007C62848DE91CC6DB459B6B40087E530AB31EE633BD23180393CBF36333038E011CBCE73C6FB098F4956112C98864EA1C2801D2D0F319802D60088002190620E479100622E4358952D84510074C0188CF0923410021F1CE1146E3006E3FC578EE600A4B6C4B002449C97E92449C97E92459796EB4FF874400A9A16100A26CEA6D0E5E5EC8841C9B8FE37109C99818023A00A4FD8BA531586BB8B1DC9AE080293B6972B7FA444285CC00AE492BC910C1697B5BDD8425409700562F471201186C0120004322B42489A200D4138A71AA796D00374978FE07B2314E99BFB6E909678A0")))

