//AI functie

export const main = async(oldGrid,currentPlayer) => {
    let gridArray = toArray(oldGrid)
    let possibleMoves = detPossibleMoves(gridArray)
    let newArrayGrid = detMove(possibleMoves, gridArray, currentPlayer)
    let newGrid = toGrid(newArrayGrid)
    //console.log(newGrid)
    return newGrid
}

const toArray = (grid) => {
    let ans = [];
    grid.forEach(row => {
        row.forEach(cell => {
            ans.push(cell)
        })
    });
    //console.log("New Array: ", ans)
    return ans
}

const toGrid = (newGrid) => {
    let ansGrid = [[],[],[],[],[]]
    newGrid.forEach((cell, i) => {
        if (i < 5) {
            ansGrid[0].push(cell)
        } else if (i < 10) {
            ansGrid[1].push(cell)
        } else if (i < 15) {
            ansGrid[2].push(cell)
        } else if (i < 20) {
            ansGrid[3].push(cell)
        } else {
            ansGrid[4].push(cell)
        }
        
    })
    return ansGrid
}

const calcXY = (i) => {
    const conversion = [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
        {x: 4, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 3, y: 1},
        {x: 4, y: 1},
        {x: 0, y: 2},
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 3, y: 2},
        {x: 4, y: 2},
        {x: 0, y: 3},
        {x: 1, y: 3},
        {x: 2, y: 3},
        {x: 3, y: 3},
        {x: 4, y: 3},
        {x: 0, y: 4},
        {x: 1, y: 4},
        {x: 2, y: 4},
        {x: 3, y: 4},
        {x: 4, y: 4}
    ]
    let x = conversion[i].x
    let y = conversion[i].y
    return [x, y]
}

const placePiece = (gridArray, location , currentPlayer) => {
    let xy = calcXY(location)
    let array = [ ...gridArray]
    array[location] = [{
        type: "road",
        color: currentPlayer.color,
        location: {
            x: xy[0],
            y: xy[1],
            z: 0
        },
        "road": true,
        "wall": false,
        "pyramid": false,
        "win": true
    }]
    return array
}

const detPossibleMoves = (grid) => {
    let possibleMoves = []
    grid.forEach((cell, i) => {
        if (cell[0] === undefined) {
            possibleMoves.push({
                place: true,
                move: true,
                location: i
            })
        } else {
            possibleMoves.push({
                place: false,
                move: true,
                location: i
            })
        }
    })

    
    return possibleMoves    
};

const detMove = (possibleMoves, gridArray, currentPlayer) => {
    let chosenMove = {
        index: undefined,
        eval: -100000
    }
    let newGrid;
    possibleMoves.forEach((move, i) => {
        if (move.place === true) {
            let testGrid = placePiece(gridArray, move.location, currentPlayer)
            let testEval = calcEvaluation(testGrid, currentPlayer.color)
            if (testEval >= chosenMove.eval) {
                newGrid = testGrid
                chosenMove.index = i
                chosenMove.eval = testEval
            }
        }
    })
    console.log(chosenMove.eval)
    return newGrid
}

const checkPossibleCells = () => {

}

const calcEvaluation = (gridArray, color) => {
    const squareWorth = [10,20,30,20,10,20,30,40,30,20,30,40,50,40,30,20,30,40,30,20,10,20,30,20,10]
    let evalWhite = 0;
    let evalBlack = 0;
    gridArray.forEach((cell, i) => {
        let top = cell[cell.length - 1]
        cell.forEach((piece) => {
            //white
            if (piece === top && piece.color === '#f8dfa1') {
                //jouw piece bovenaan
                evalWhite += squareWorth[i]*10
            } else if (piece !== top && piece.color === '#f8dfa1') {
                //jouw piece in jouw array
                evalWhite += squareWorth[i]*5
            } else if (piece !== top && piece.color !== '#f8dfa1') {
                //niet jouw piece in jouw array
                evalWhite += squareWorth[i]
            }

            //black
            if (piece === top && piece.color === '#55342b') {
                //jouw piece bovenaan
                evalBlack += squareWorth[i]*10
            } else if (piece !== top && piece.color === '#55342b') {
                //jouw piece in jouw array
                evalBlack += squareWorth[i]*5
            } else if (piece !== top && piece.color !== '#55342b') {
                //niet jouw piece in jouw array
                evalBlack += squareWorth[i]
            }
        })
    })
    //console.log("EvalWhite: ", evalWhite, "EvalBlack: ", evalBlack)
    let netEval = 0;
    if (color === '#f8dfa1') {
        netEval = evalWhite - evalBlack
    } else {
        netEval = evalBlack - evalWhite
    }
    return netEval
}

// const toString = (grid) => {
//     let str = ""
//     let pog = 1
//     grid.forEach(row => {
//         row.forEach(cell => {
//             str += '/' + pog + '{'
//             pog += 1

//                 if (cell[0]) {
//                     cell.forEach(piece => {
//                         if (piece.color === '#f8dfa1') {
//                             str += piece.type.charAt(0).toUpperCase()
//                         } else {
//                             str += piece.type.charAt(0)
//                         }
//                     })
//                 }
            
//             str += '}'
//         })    
//     });
//     return str
// }




//     return ans 
// }

// const doMove = (grid) => {
//     console.log(grid)
// }