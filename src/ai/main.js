//AI functie
import Wall  from '../../components/pieces/Wall';
import Road  from '../../components/pieces/Road';
import Pyramid  from '../../components/pieces/Pyramid';


export const main = async(oldGrid, activePlayer, inactivePlayer, maxHeight) => {
    console.time('Time')
    let gridArray = toArray(oldGrid);
    let newArrayGrid = minimax(gridArray, 4, -Infinity, Infinity, true, activePlayer, activePlayer, inactivePlayer, maxHeight);
    console.log('Vo: ', newArrayGrid)
    //     let newArrayGrid = move.newGrid;
    //     let evalWhite = move.evalWhite;
    //     let evalBlack = move.evalBlack;
    let newGrid = toGrid(newArrayGrid[1]);
    console.timeEnd('Time')
    return newGrid
};

const toArray = (grid) => {
    let ans = [];
    grid.forEach(row => {
        row.forEach(cell => {
            ans.push(cell)
        })
    });
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

const detMovesLeft = (grid, movingStack, newPosition, possibleMoves, startingPosition, maxHeight, placeMinimum) => {
    for (let i = movingStack.length; i >= placeMinimum; i--) {
        let newMovingStack = [...movingStack];
        let newGrid = [...grid];
        let j = 0;
        while (j !== i) {
            let possibleNewGrid = placePiece(newGrid, newPosition, newMovingStack[0].color, newMovingStack[0], maxHeight);
            if (possibleNewGrid !== false) {
                newGrid = possibleNewGrid
                newMovingStack.splice(0, 1)
                j++
            } else {
                j = i;
            };
        };
        if (newMovingStack.length === 0) {
            if (placeMinimum > 0) {
                possibleMoves.push(newGrid)
            };
        } else if (newPosition % 5 !== 0 && newGrid[newPosition - 1].length < maxHeight) {
            if (newGrid[newPosition - 1].length !== 0) {
                 let type = newGrid[newPosition - 1][newGrid[newPosition - 1].length - 1].type;
                 let piece = newMovingStack[0];
                 if (piece[type]) {
                    possibleMoves = detMovesLeft(newGrid, newMovingStack, newPosition - 1, possibleMoves, startingPosition, maxHeight, 1);
                 } else break
            } else {
                possibleMoves = detMovesLeft(newGrid, newMovingStack, newPosition - 1, possibleMoves, startingPosition, maxHeight, 1);
            };
        } else break
    };
    return possibleMoves
};

const detMovesUp = (grid, movingStack, newPosition, possibleMoves, startingPosition, maxHeight, placeMinimum) => {
    for (let i = movingStack.length; i >= placeMinimum; i--) {
        let newMovingStack = [...movingStack];
        let newGrid = [...grid];
        let j = 0;
        while (j !== i) {
            let possibleNewGrid = placePiece(newGrid, newPosition, newMovingStack[0].color, newMovingStack[0], maxHeight);
            if (possibleNewGrid !== false) {
                newGrid = possibleNewGrid;
                newMovingStack.splice(0, 1)
                j++
            } else {
                j = i;
            };
        };
        if (newMovingStack.length === 0) {
            if (placeMinimum > 0) {
                possibleMoves.push(newGrid)
            };
        } else if (newPosition - 5 >= 0 && newGrid[newPosition - 5].length < maxHeight) {
            if (newGrid[newPosition - 5].length !== 0) {
                 let type = newGrid[newPosition - 5][newGrid[newPosition - 5].length - 1].type;
                 let piece = newMovingStack[0];
                 if (piece[type]) {
                    possibleMoves = detMovesUp(newGrid, newMovingStack, newPosition - 5, possibleMoves, startingPosition, maxHeight, 1);
                 } else break
            } else {
                possibleMoves = detMovesUp(newGrid, newMovingStack, newPosition - 5, possibleMoves, startingPosition, maxHeight, 1);
            };
        } else break
    };
    return possibleMoves
};

const detMovesRight = (grid, movingStack, newPosition, possibleMoves, startingPosition, maxHeight, placeMinimum) => {
    for (let i = movingStack.length; i >= placeMinimum; i--) {
        let newMovingStack = [...movingStack];
        let newGrid = [...grid];
        let j = 0;
        while (j !== i) {
            let possibleNewGrid = placePiece(newGrid, newPosition, newMovingStack[0].color, newMovingStack[0], maxHeight);
            if (possibleNewGrid !== false) {
                newGrid = possibleNewGrid
                newMovingStack.splice(0, 1)
                j++
            } else {
                j = i;
            };
        };
        if (newMovingStack.length === 0) {
            if (placeMinimum > 0) {
                possibleMoves.push(newGrid)
            };
        } else if ((newPosition + 1) % 5 !== 0 && newGrid[newPosition + 1].length < maxHeight) {
            if (newGrid[newPosition + 1].length !== 0) {
                 let type = newGrid[newPosition + 1][newGrid[newPosition + 1].length - 1].type;
                 let piece = newMovingStack[0];
                 if (piece[type]) {
                    possibleMoves = detMovesRight(newGrid, newMovingStack, newPosition + 1, possibleMoves, startingPosition, maxHeight, 1);
                 } else break
            } else {
                possibleMoves = detMovesRight(newGrid, newMovingStack, newPosition + 1, possibleMoves, startingPosition, maxHeight, 1);
            };
        } else break
    };
    return possibleMoves
};

const detMovesDown = (grid, movingStack, newPosition, possibleMoves, startingPosition, maxHeight, placeMinimum) => {
    for (let i = movingStack.length; i >= placeMinimum; i--) {
        let newMovingStack = [...movingStack];
        let newGrid = [...grid];
        let j = 0;
        while (j !== i) {
            let possibleNewGrid = placePiece(newGrid, newPosition, newMovingStack[0].color, newMovingStack[0], maxHeight);
            if (possibleNewGrid !== false) {
                newGrid = possibleNewGrid
                newMovingStack.splice(0, 1)
                j++
            } else {
                j = i;
            };
        };
        if (newMovingStack.length === 0) {
            if (placeMinimum > 0) {
                possibleMoves.push(newGrid)
            };
        } else if (newPosition + 5 < 25 && newGrid[newPosition + 5].length < maxHeight) {
            if (newGrid[newPosition + 5].length !== 0) {
                 let type = newGrid[newPosition + 5][newGrid[newPosition + 5].length - 1].type;
                 let piece = newMovingStack[0];
                 if (piece[type]) {
                    possibleMoves = detMovesDown(newGrid, newMovingStack, newPosition + 5, possibleMoves, startingPosition, maxHeight, 1);
                 } else break
            } else {
                possibleMoves = detMovesDown(newGrid, newMovingStack, newPosition + 5, possibleMoves, startingPosition, maxHeight, 1);
            };
        } else break
    };
    return possibleMoves
};

const placePiece = (grid, location, color, type, maxHeight) => {
    let newGrid = [...grid];
    if (newGrid[location].length === maxHeight) {
        return false 
    } else {
        let xy = calcXY(location);
        const newPiece = {
            type: type.type,
            color: color,
            location: {
                x: xy[0],
                y: xy[1],
                z: grid[location].length
            },
            "road": type['road'],
            "wall": type['wall'],
            "pyramid": type['pyramid'],
            "win": type['win']
        };
        let newCell = [...newGrid[location], newPiece];
        newGrid[location] = newCell;
        return newGrid
    };
};

const detPossibleMoves = (grid, color, maxHeight) => {
    let possibleMoves = [];
    grid.forEach((cell, i) => {
        if (cell[0] === undefined) {
            let newArray = placePiece(grid, i, color, Road, maxHeight)
            if (newArray !== false) {
                possibleMoves.push(newArray)
            }
        } else if (cell[cell.length - 1].color === color) {
            let newGrid = [...grid];
            let movingStack = newGrid.splice(i, 1, [])

            let movesLeft = detMovesLeft(newGrid, movingStack[0], i, [], i, maxHeight, 0);
            movesLeft.forEach(move => {
                possibleMoves.push(move)
            });
            let movesUp = detMovesUp(newGrid, movingStack[0], i, [], i, maxHeight, 0);
            movesUp.forEach(move => {
                possibleMoves.push(move)
            });
            let movesRight = detMovesRight(newGrid, movingStack[0], i, [], i, maxHeight, 0);
            movesRight.forEach(move => {
                possibleMoves.push(move)
            });
            let movesDown = detMovesDown(newGrid, movingStack[0], i, [], i, maxHeight, 0);
            movesDown.forEach(move => {
                possibleMoves.push(move)
            });
        };
    });
    //console.log('possible moves: ', possibleMoves, grid)
    return possibleMoves
};

const minimax = (currentGrid, depth, alpha, beta, maximizingPLayer, activePlayerColor, activeColor, inactiveColor, maxHeight) => {
    let win = calcEvaluation(currentGrid, activePlayerColor, true);
    if (depth === 0 || win === true) {
        let evaluation = calcEvaluation(currentGrid, activePlayerColor, false) * (depth + 1);
        return [evaluation]
    };

    let possibleMoves = detPossibleMoves(currentGrid, activeColor, maxHeight);
    //console.log('pm: ', possibleMoves)
    if (possibleMoves.length === 0) {
        let evaluation = calcEvaluation(currentGrid, activePlayerColor, false) * (depth + 1);
        return [evaluation]
    } else {
        if (maximizingPLayer) {
            let maxEval = -Infinity;
            let move;
            for (let i = 0; i < possibleMoves.length; i++) {
                let evalue = minimax(possibleMoves[i], depth - 1, alpha, beta, false, activePlayerColor, inactiveColor, activeColor);
                //console.log('Move', activePlayerColor, ':', possibleMoves[i], 'will result in: ', evalue[0])
                if (evalue[0] > maxEval) {
                    maxEval = evalue[0];
                    alpha = evalue[0];
                    move = possibleMoves[i];
                };
                if (beta <= alpha) {
                    break
                };
            };
            return [maxEval, move]
        } else {
            let minEval = Infinity;
            for (let i = 0; i < possibleMoves.length; i++) {
                let evalue = minimax(possibleMoves[i], depth - 1, alpha, beta, true, activePlayerColor, inactiveColor, activeColor);
                //console.log('Countermove: ', possibleMoves[i], evalue[0])
                minEval = Math.min(minEval, evalue[0]);
                beta = Math.min(beta, evalue[0]);
                if (beta <= alpha) {
                    break
                };
            };
            return [minEval]
        };
    };
};

const calcPathEvaluation = (topCells, checkWin) => {
    //console.log('tc: ', topCells)
    let value = 0;
    let regions = 0;
    for (let j = 0; j < topCells.length; j++) {
        regions += 1;
        let checkedCells = [];
        let succes = true;
        let checkingPiece = topCells[j];
        //console.log('Begonnen bij', checkingPiece)
        while (succes === true && checkingPiece !== undefined) {
            let step = false;
            let prevCheckingPiece = checkingPiece;
            for (let i = 0; i < topCells.length; i++) {
                let piece = topCells[i];
                if (checkingPiece.location.x - 1 === piece.location.x && checkingPiece.location.y === piece.location.y && checkedCells.includes(piece) === false && piece['win'] === true) {
                    //console.log('Naar links')
                    checkedCells.push(checkingPiece);
                    checkingPiece = piece;
                    step = true;
                    break
                } else if (checkingPiece.location.y - 1 === piece.location.y && checkingPiece.location.x === piece.location.x && checkedCells.includes(piece) === false && piece['win'] === true) {
                    //console.log('Naar boven')
                    checkedCells.push(checkingPiece);
                    checkingPiece = piece;
                    step = true;
                    break
                } else if (checkingPiece.location.x + 1 === piece.location.x && checkingPiece.location.y === piece.location.y && checkedCells.includes(piece) === false && piece['win'] === true) {
                    //console.log('Naar rechts')
                    checkedCells.push(checkingPiece);
                    checkingPiece = piece;
                    step = true;
                    break
                } else if (checkingPiece.location.y + 1 === piece.location.y && checkingPiece.location.x === piece.location.x && checkedCells.includes(piece) === false && piece['win'] === true) {
                    //console.log('Naar onder')
                    checkedCells.push(checkingPiece);
                    checkingPiece = piece;
                    step = true;
                    break
                };
            };
            if (step === false) {
                for (let i = topCells.length; i >= 0; i--) {
                    if (checkedCells.includes(topCells[i]) && (Math.abs(checkingPiece.location.x - topCells[i].location.x) + Math.abs(checkingPiece.location.y - topCells[i].location.y)) === 1) {
                        //console.log('Terug naar', topCells[i])
                        if (checkedCells.includes(checkingPiece) === false) {
                            checkedCells.push(checkingPiece);
                        };
                        let j = topCells.indexOf(checkingPiece);
                        checkingPiece = topCells[i];
                        topCells.splice(j, 1);
                        break
                    };
                };
                if (prevCheckingPiece === checkingPiece) {
                    //console.log('Klaar')
                    if (checkedCells.includes(checkingPiece) === false) {
                        checkedCells.push(checkingPiece);
                    };
                    succes = false;
                };
            };
        };
        let xMin = Infinity;
        let yMin = Infinity;
        let xMax = -Infinity;
        let yMax = -Infinity;
        checkedCells.forEach(piece => {
            xMin = Math.min(xMin, piece.location.x);
            xMax = Math.max(xMax, piece.location.x);
            yMin = Math.min(yMin, piece.location.y);
            yMax = Math.max(yMax, piece.location.y);
        });
        let xDiff = xMax - xMin + 1;
        let yDiff = yMax - yMin + 1;
        //console.log('Differences: ', xDiff, yDiff, checkedCells)
        if ((xDiff === 5 || yDiff === 5) && checkWin) {
            return true
        } else if (xDiff === 5 || yDiff === 5) {
            value += 1000;
        } else {
            value += Math.floor(Math.sqrt(xDiff**2+yDiff**2)*10)/10;
        };
    };
    if (regions !== 0) {
        value = value/regions;
    };
    //console.log('Counted a mult of', value, 'over', regions, 'regions for', color,'in', loops, 'loops')
    return value
};

const calcStackEvaluation = (gridArray, color) => {
    const squareWorth = [10,20,30,20,10,20,30,40,30,20,30,40,50,40,30,20,30,40,30,20,10,20,30,20,10]
    let value = 0;
    gridArray.forEach((cell, i) => {
        if (cell[cell.length - 1] !== undefined) {
            let top = cell[cell.length - 1];
            cell.forEach(piece => {
                if (piece === top && piece.color === color) {
                    //jouw piece bovenaan
                    value += squareWorth[i]*10
                } else if (piece !== top && piece.color === color) {
                    //jouw piece in jouw array
                    value += squareWorth[i]*5
                } else if (piece !== top && piece.color !== color) {
                    //niet jouw piece in jouw array
                    value += squareWorth[i]
                };
            });
        };
    });
    //console.log('Counted ', counted, 'pieces, worth', value, 'for', color, ' with ', loops, ' comps')
    return value
};

const calcEvaluation = (gridArray, color, checkWin) => {
    let topCellsBlack = [];
    let topCellsWhite = [];
    for (let i = 0; i < gridArray.length; i++) {
        let cell = gridArray[i];
        let top = cell[cell.length - 1];
        if (top !== undefined) {
            if (top.color === '#f8dfa1') {
                topCellsWhite.push(top)
            } else {
                topCellsBlack.push(top)
            };
        };
    };
    if (checkWin) {
        let winWhite = calcPathEvaluation(topCellsWhite, true);
        let winBlack = calcPathEvaluation(topCellsBlack, true);
        if (winWhite === true || winBlack === true) {
            return true
        } else return false
    } else {
        let stackEvalWhiteValue = calcStackEvaluation(gridArray, '#f8dfa1');
        let stackEvalBlackValue = calcStackEvaluation(gridArray, '#55342b');
        let pathEvalWhiteValue = calcPathEvaluation(topCellsWhite, false);
        let pathEvalBlackValue = calcPathEvaluation(topCellsBlack, false);
        //console.log('White: ', stackEvalWhiteValue, pathEvalWhiteValue, 'Black: ', stackEvalBlackValue, pathEvalBlackValue)
        let netEvalWhite = stackEvalWhiteValue * pathEvalWhiteValue;
        let netEvalBlack = stackEvalBlackValue * pathEvalBlackValue;

        let netEval = 0;
        if (color === '#f8dfa1') {
            netEval = netEvalWhite - netEvalBlack;
        } else {
            netEval = netEvalBlack - netEvalWhite
        };
        //console.log('The netEval for', gridArray, 'is', netEval)
        return netEval
    };
};