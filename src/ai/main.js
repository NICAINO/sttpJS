//AI functie

export const main = async(oldGrid) => {
    let newGrid = [[[]]]
    console.log("String", toString(oldGrid))
    //doMove(oldGrid)
    //console.log(detLegalMoves(oldGrid))
    newGrid = oldGrid
    return newGrid
}

const toString = (grid) => {
    let str = ""
    let pog = 1
    grid.forEach(row => {
        row.forEach(cell => {
            str += '/' + pog + '{'
            pog += 1

                if (cell[0]) {
                    //Cell is niet leeg
                    console.log('niet leeg')
                }
            
            str += '}/'
        })    
    });
    return str
}

// const detLegalMoves = (grid) => {
//     let ans = []
//     grid.forEach(row => {
//         row.forEach(cell => {
//             if (cell === [undefined]) {
//                 ans.push['newPlace']
//             }
//         })    
//     });


//     return ans 
// }

// const doMove = (grid) => {
//     console.log(grid)
// }