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

const placePiece = (gridArray, location, currentPlayer, type) => {
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
        // } else if (cell.length !== 2) {
        //     possibleMoves.push({
        //         place: false,
        //         move: true,
        //         location: i
        //     })
        }
    })
    console.log('pM: ', possibleMoves)
    return possibleMoves
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
                console.log('vo')
                newGrid = testGrid
                chosenMove.index = i
                chosenMove.eval = testEval
            }
        }
    })
    return newGrid
}

const calcPathEvaluation = (topCells, color) => {
    let value = 0;
    let loops = 0;
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
                loops += 1
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
                    loops += 1
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
        value += Math.floor(Math.sqrt(xDiff**2+yDiff**2)*10)/10
    });
    if (regions !== 0) {
        value = value/regions
    }
    console.log('Counted a mult of', value, 'over', regions, 'regions for', color,'in', loops, 'loops')
    return value
};

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
    console.log('Counted ', counted, 'pieces, worth', value, 'for', color, ' with ', loops, ' comps')
    return value
}

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
    let stackEvalWhite = calcStackEvaluation(gridArray, '#f8dfa1');
    let stackEvalBlack = calcStackEvaluation(gridArray, '#55342b');
    let pathEvalWhite = calcPathEvaluation(topCellsWhite, '#f8dfa1');
    let pathEvalBlack = calcPathEvaluation(topCellsBlack, '#55342b');

    let netEvalWhite = stackEvalWhite * pathEvalWhite;
    let netEvalBlack = stackEvalBlack * pathEvalBlack;

    let netEval = 0;
    if (color === '#f8dfa1') {
        netEval = netEvalWhite - netEvalBlack;
    } else {
        netEval = netEvalBlack - netEvalWhite;
    };
    console.log('The netEval for', color, 'is', netEval)

    return netEval
};