//AI functie
export const main = async(oldGrid, activePlayer, inactivePlayer) => {
    console.time('Time')
    let gridArray = toArray(oldGrid);
    let newArrayGrid = minimax(gridArray, 2, -Infinity, Infinity, true, activePlayer, activePlayer, inactivePlayer)
    console.log('Vo: ', newArrayGrid)
    //console.log('Eval: ', calcEvaluation(gridArray, currentPlayer))
    // let possibleMoves = detPossibleMoves(gridArray);
    // let move = detMove(possibleMoves, gridArray, currentPlayer);
    //     let newArrayGrid = move.newGrid;
    //     let evalWhite = move.evalWhite;
    //     let evalBlack = move.evalBlack;
    let newGrid = toGrid(newArrayGrid[1]);
    console.timeEnd('Time')
    return newGrid
}

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

const placePiece = (gridArray, location, color, type) => {
    let xy = calcXY(location)
    let array = [ ...gridArray]
    array[location] = [{
        type: type,
        color: color,
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

const detPossibleMoves = (grid, color) => {
    let possibleMoves = [];
    grid.forEach((cell, i) => {
        if (cell[0] === undefined) {
            let newArray = placePiece(grid, i, color, 'road')
            possibleMoves.push(newArray)
        };
    });
    return possibleMoves
};

const minimax = (currentGrid, depth, alpha, beta, statement, activePlayerColor, activeColor, inactiveColor) => {
    let evaluation;

    if (depth === 0) {
        evaluation = calcEvaluation(currentGrid, activePlayerColor)
        return [evaluation]
    };

    let possibleMoves = detPossibleMoves(currentGrid, activeColor);
    //console.log('pm: ', possibleMoves)
    if (statement) {
        let maxEval = -Infinity;
        let move;
        for (let i = 0; i < possibleMoves.length; i++) {
            let evalue = minimax(possibleMoves[i], depth - 1, alpha, beta, false, activePlayerColor, inactiveColor, activeColor);
            if (evalue[0] > maxEval) {
                maxEval = evalue[0];
                alpha = evalue[0];
                move = possibleMoves[i];
            }
            if (beta <= alpha) {
                break
            };
        };
        return [maxEval, move]
    } else {
        let minEval = Infinity;
        for (let i = 0; i < possibleMoves.length; i++) {
            let evalue = minimax(possibleMoves[i], depth - 1, alpha, beta, true, activePlayerColor, inactiveColor, activeColor);
            minEval = Math.min(minEval, evalue[0]);
            beta = Math.min(beta, evalue[0]);
            if (beta <= alpha) {
                break
            };
        };
        return [minEval]
    };
};

const calcPathEvaluation = (topCells) => {
    let value = 0;
    let regions = 0;
    topCells.forEach(piece => {
        regions += 1;
        let checkedCells = [];
        let succes = true;
        let checkingPiece = piece;
        while (succes === true && checkingPiece !== undefined) {
            let step = false;
            let prevCheckingPiece = checkingPiece;
            for (let i = 0; i < topCells.length; i++) {
                if (checkingPiece.location.x - 1 === topCells[i].location.x && checkingPiece.location.y === topCells[i].location.y && checkedCells.includes(topCells[i]) === false) {
                    checkedCells.push(checkingPiece);
                    checkingPiece = topCells[i];
                    step = true;
                    break
                } else if (checkingPiece.location.y - 1 === topCells[i].location.y && checkingPiece.location.x === topCells[i].location.x && checkedCells.includes(topCells[i]) === false) {
                    checkedCells.push(checkingPiece);
                    checkingPiece = topCells[i];
                    step = true;
                    break
                } else if (checkingPiece.location.x + 1 === topCells[i].location.x && checkingPiece.location.y === topCells[i].location.y && checkedCells.includes(topCells[i]) === false) {
                    checkedCells.push(checkingPiece);
                    checkingPiece = topCells[i];
                    step = true;
                    break
                } else if (checkingPiece.location.y + 1 === topCells[i].location.y && checkingPiece.location.x === topCells[i].location.x && checkedCells.includes(topCells[i]) === false) {
                    checkedCells.push(checkingPiece);
                    checkingPiece = topCells[i];
                    step = true;
                    break
                };
            };
            if (step === false) {
                for (let i = 0; i < topCells.length; i++) {
                    if (checkedCells.includes(topCells[i]) && Math.abs(checkingPiece.location.x - topCells[i].location.x) + Math.abs(checkingPiece.location.y - topCells[i].location.y) === 1) {
                        checkedCells.push(checkingPiece);
                        topCells.splice(topCells.indexOf(checkingPiece), 1);
                        checkingPiece = topCells[i];
                        break
                    };
                };
                if (prevCheckingPiece === checkingPiece) {
                    checkedCells.push(checkingPiece);
                    succes = false;
                };
            };
        };
        let xMin = 5;
        let yMin = 5;
        let xMax = 0;
        let yMax = 0;
        checkedCells.forEach(piece => {
            if (piece.location.x > xMax) {
                xMax = piece.location.x
            };
            if (piece.location.x < xMin) {
                xMin = piece.location.x
            };
            if (piece.location.y > yMax) {
                yMax = piece.location.y
            };
            if (piece.location.y < yMin) {
                yMin = piece.location.y
            };
        });
        let xDiff = xMax - xMin + 1;
        let yDiff = yMax - yMin + 1;
        if (xDiff === 5 || yDiff === 5) {
            console.log('Win: ', checkedCells)
            value = 10000
        } else {
            value += Math.floor(Math.sqrt(xDiff**2+yDiff**2)*10)/10
        }
    });
    if (regions !== 0) {
        value = value/regions
    }
    //console.log('Counted a mult of', value, 'over', regions, 'regions for', color,'in', loops, 'loops')
    return value
};

const calcStackEvaluation = (gridArray, color) => {
    const squareWorth = [10,20,30,20,10,20,30,40,30,20,30,40,50,40,30,20,30,40,30,20,10,20,30,20,10]
    let value = 0;
    let top;
    gridArray.forEach((cell, i) => {
        if (cell[cell.length - 1] !== undefined) {
            top = cell[cell.length - 1]
        }
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
            }
        })
    })
    //console.log('Counted ', counted, 'pieces, worth', value, 'for', color, ' with ', loops, ' comps')
    return value
}

const pcalcEvaluation = (gridArray, color) => {
    let topCells = [];
    gridArray.forEach(cell => {
        let top = cell[cell.length - 1];
        if (top !== undefined) {
            if (top.color === color) {
                topCells.push(top)
            };
        };
    });
    let stackEvalValue = calcStackEvaluation(gridArray, color);
    let pathEvalValue = calcPathEvaluation(topCells, color);

    let netEval = stackEvalValue * pathEvalValue;
    return netEval
};

const calcEvaluation = (gridArray, color) => {
    let topCellsWhite = [];
    let topCellsBlack = [];
    gridArray.forEach(cell => {
        let top = cell[cell.length - 1];
        if (top !== undefined) {
            if (top.color === '#f8dfa1') {
                topCellsWhite.push(top)
            } else {
                topCellsBlack.push(top)
            };
        };
    });
    let stackEvalWhiteValue = calcStackEvaluation(gridArray, '#f8dfa1');
    let stackEvalBlackValue = calcStackEvaluation(gridArray, '#55342b');
    let pathEvalWhiteValue = calcPathEvaluation(topCellsWhite, '#f8dfa1');
    let pathEvalBlackValue = calcPathEvaluation(topCellsBlack, '#55342b');

    let netEvalWhite = stackEvalWhiteValue * pathEvalWhiteValue;
    let netEvalBlack = stackEvalBlackValue * pathEvalBlackValue;

    let netEval = 0;
    if (color === '#f8dfa1') {
        netEval = netEvalWhite - netEvalBlack;
    } else {
        netEval = netEvalBlack - netEvalWhite;
    };
    //console.log('The netEval for', color, 'is', netEval)

    return netEval
};