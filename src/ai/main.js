//AI functie

export const main = async(oldGrid, currentPlayer) => {
    let gridArray = toArray(oldGrid)
    let possibleMoves = detPossibleMoves(gridArray)
    //let movableStacks = detMovableStacks(gridArray, currentPlayer)
    //let vo = calcEvaluation(gridArray, currentPlayer.color)
    let newArrayGrid = detMove(possibleMoves, gridArray, currentPlayer)
    let newGrid = toGrid(newArrayGrid)
    //console.log('Movable stacks', movableStacks)
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

const placePiece = (gridArray, location , currentPlayer, type) => {
    let xy = calcXY(location)
    let array = [ ...gridArray]
    array[location] = [{
        type: type,
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
        } else if (cell.length !== 2) {
            possibleMoves.push({
                place: false,
                move: true,
                location: i
            })
        }
    })
    return possibleMoves
}

    const detMovableStacks = (gridArray, currentPlayer) => {
        let movableStacks = []
        gridArray.forEach((cell, i) => {
            if (cell[0]) {
                if (cell[cell.length-1].color === currentPlayer.color) {
                    movableStacks.push({
                        location: i
                    })
                }
            }
        })
        return movableStacks
    }

const detMove = (possibleMoves, gridArray, currentPlayer) => {
    let chosenMove = {
        index: undefined,
        eval: -100000
    }
    let newGrid;
    possibleMoves.forEach((move, i) => {
        if (move.place === true) {
            let testGrid = placePiece(gridArray, move.location, currentPlayer, 'road')
            let testEval = calcEvaluation(testGrid, currentPlayer.color)
            if (testEval >= chosenMove.eval) {
                newGrid = testGrid
                chosenMove.index = i
                chosenMove.eval = testEval
            }
        }
    })
    return newGrid
}

const calcTopEvaluation = (topCells) => {
    let value = 0;
    let counted = 0;
    let loops = 0;
    topCells.forEach(topPiece => {
        let pieceValue = 0;
        counted += 1
        //up
        for (let i = topPiece.location.y-1; i >= 0; i--) {
            let succes = false;
            for (let j = 0; j < topCells.length; j++) {
                loops += 1
                if (topPiece.location.x === topCells[j].location.x && topPiece.color === topCells[j].color && topCells[j].location.y === i) {
                    pieceValue += 1
                    succes = true
                }
                if (succes === true) {
                    break
                }
            }
        }
        //down
        for (let i = topPiece.location.y+1; i < 5; i++) {
            let succes = false;
            for (let j = 0; j < topCells.length; j++) {
                loops += 1
                if (topPiece.location.x === topCells[j].location.x && topPiece.color === topCells[j].color && topCells[j].location.y === i) {
                    pieceValue += 1
                    succes = true
                }
                if (succes === true) {
                    break
                }
            }
        }
        //left
        for (let i = topPiece.location.x-1; i >= 0; i--) {
            let succes = false;
            for (let j = 0; j < topCells.length; j++) {
                loops += 1
                if (topPiece.location.y === topCells[j].location.y && topPiece.color === topCells[j].color && topCells[j].location.x === i) {
                    pieceValue += 1
                    succes = true
                }
                if (succes === true) {
                    break
                }
            }
        }
        //right
        for (let i = topPiece.location.x+1; i < 5; i++) {
            let succes = false;
            for (let j = 0; j < topCells.length; j++) {
                loops += 1
                if (topPiece.location.y === topCells[j].location.y && topPiece.color === topCells[j].color && topCells[j].location.x === i) {
                    pieceValue += 1
                    succes = true
                }
                if (succes === true) {
                    break
                }
            }
        }
        //Als het maar 1 piece is
        if (pieceValue === 0) {
            value += 1
        } else value += pieceValue
    })
    //Als er nog geen piece is neergezet
    // if (topCells.length !== 0) {
    //     console.log('counted: ', counted, ' for ', topCells[0].color, ' in ', loops, ' loops')
    // }
    return value
}

const calcStackEvaluation = (gridArray, color) => {
    const squareWorth = [10,20,30,20,10,20,30,40,30,20,30,40,50,40,30,20,30,40,30,20,10,20,30,20,10]
    let value = 0;
    let counted = 0;
    let loops = 0;
    let top;
    gridArray.forEach((cell, i) => {
        loops += 1
        if (cell[cell.length - 1] !== undefined) {
            top = cell[cell.length - 1]
        }
        cell.forEach(piece => {
            counted += 1
            loops += 1
            if (piece === top && piece.color === color) {
                //jouw piece bovenaan
                value += squareWorth[i]*10
            } else if (piece !== top && piece.color === color) {
                //jouw piece in jouw array
                value += squareWorth[i]*5
            } else if (piece !== top && piece.color !== color) {
                //niet jouw piece in jouw array
                value += squareWorth[i]
            }
        })
    })
    //console.log('Counted ', counted, ' for ', color, ' with ', loops, ' computations')
    return value
}

const calcEvaluation = (gridArray, color) => {
    let topCellsWhite = []
    let topCellsBlack = []
    gridArray.forEach(cell => {
        let top = cell[cell.length - 1]
        if (top !== undefined) {
            if (top.color === '#f8dfa1') {
                topCellsWhite.push(top)
            } else {
                topCellsBlack.push(top)
            }
        }
    })
    let stackEvalWhite = calcStackEvaluation(gridArray, '#f8dfa1')
    let stackEvalBlack = calcStackEvaluation(gridArray, '#55342b')
    let topEvalWhite = calcTopEvaluation(topCellsWhite)
    let topEvalBlack = calcTopEvaluation(topCellsBlack)
    //console.log('topEvalWhite: ', topEvalWhite, 'topEvalBlack: ', topEvalBlack)
    //console.log('stackEvalWhite: ', stackEvalWhite, 'stackEvalBlack: ', stackEvalBlack)

    let netEvalWhite = stackEvalWhite * topEvalWhite
    let netEvalBlack = stackEvalBlack * topEvalBlack

    let netEval = 0;
    if (color === '#f8dfa1') {
        netEval = netEvalWhite - netEvalBlack
    } else {
        netEval = netEvalBlack - netEvalWhite
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