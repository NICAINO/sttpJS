<script>
    import { grid, log } from './stores.js'
    import Wall  from '../../components/pieces/Wall'
    import Road  from '../../components/pieces/Road'
    import Pyramid  from '../../components/pieces/Pyramid'
    import { main } from '../ai/main'

    //export let evals = [];
    let round = 0;
    let grid_value = [];
    let log_value = [];
    let selected = {
        x: 0,
        y: 0
    }
    let selectedPiece = {
        x: null,
        y: null,
        z: null,
    }

    let possibleCells = []
    $: placeableCells = possibleCells.filter(placeableCellsFilter);

    let direction = '';

    //export let winner = undefined;
    export let movingStack = []
    export const maxHeigth = 5;
    export let players = {
        player1: {
            name:"Gonnoe Garfield",
            rating: "MEGAHOOG",
            color: "#f8dfa1",
            pieces: 21
        },
        player2: {
            name: 'Pilsiam',
            rating: "nog nooit van nica gewonnen",
            color: "#55342b",
            pieces: 21
        },
    }

    export let currentPlayer = players.player1

    const unsubscribegrid = grid.subscribe(value => {
            grid_value = value;
    });

    const unsubscribelog = log.subscribe(value => {
        log_value = value;
    });

    //Als er een key wordt gepressed checkt ie welke key het is
    function handleKeydown(event) {
		let key = event.key;
        let keyCode = event.keyCode;
        
        if (keyCode === 32) {               //Als je op spatie drukt plaats je een road
            placePiece(selected, Road)
        }
    }

    const onClick = (clickedOn, x, y, piece) => {
        if (clickedOn === 'piece') {
            // Select cell en zet andere info op nul
            selectCell(x, y, false)
            let top = grid_value[y][x][grid_value[y][x].length-1]
            // Bij eigen piece return true anders false
            if (selectPiece(piece, top)) {
                let height = grid_value[y][x].length - selectedPiece.z
                // Check of de geselcteerde stack niet hoger is dan de maximale hoogte
                if (height > 5) {
                    // Wordt uitgevoerd als stack te hoog is
                    console.log('Stack too high')
                } else {
                    // Wordt uitgevoerd als de stack verplaatsbaar is (dus aan alle voorwaarden voldoet)
                    checkPossibleCells(height, grid_value[y][x], piece.location) 
                }
            } else if (selectedPiece.x !== null && selectedPiece.y !== null && selectedPiece.z !== null) {
                // Wordt uitgevoerd als je al je eigen piece had geselect en andermans piece selecte
                beginMovement(x, y)
            } else if (movingStack.length > 0 && isCellPlaceable(x, y)) {
                movement(x, y)
            } else {
                // wordt uitgevoerd als de piece niet van jou is en je niet aan het moven bent
                console.log('Not your stack')
            }
        } else if (clickedOn === 'cell') {
            // Select cell en zet andere info op nul
            selectCell(x, y, true)
            // Als er een piece is geselect dan true anders false
            if (selectedPiece.x !== null && selectedPiece.y !== null && selectedPiece.z !== null) {
                beginMovement(x, y)
            } else if (movingStack.length > 0 && isCellPlaceable(x, y)) {
                    movement(x, y, movingStack)
            } else {
                console.log('No piece selected')
            }
        } else {
            console.log('?')
        }
    }

    const beginMovement = (x, y) => {
        if (isCellPlaceable(x, y)) {
            let array = grid_value[selectedPiece.y][selectedPiece.x]
            movingStack = array.splice(selectedPiece.z)
            deselectPiece()
            determineDirection(x, y, movingStack)
            movement(x, y, movingStack)        
        }
    }

    const determineDirection = (x, y, movingStack) => {
        let deltaX = movingStack[0].location.x - x
        let deltaY = movingStack[0].location.y - y
        if (deltaX === 1) {
            direction = 'left'
        } else if (deltaX === -1) {
            direction = 'right'
        } else if (deltaY === 1) {
            direction = 'up'
        } else if (deltaY === -1) {
            direction = 'down'
        } else {
            console.log('Something went wrong')
        }
    }

    const flattenWall = (stack) => {
        let piece = stack.splice(stack.length - 1, 1)
        console.log('piece: ', piece)
        pieceAction(piece[0].location.x, piece[0].location.y, Road, piece[0])
    }

    const movement = (x, y, stack) => {
        if (grid_value[y][x].length > 0) {
            if(grid_value[y][x][grid_value[y][x].length - 1].type === 'wall') {
                flattenWall(grid_value[y][x])
                pieceAction(x, y, stack[0], stack[0])
            } else {pieceAction(x, y, stack[0], stack[0])}
        } else {pieceAction(x, y, stack[0], stack[0])}
        stack.splice(0, 1)
        movingStack = stack
        if (stack.length === 0) {
            endTurn()
        } else {
            checkPossibleCells(stack.length, stack, selected)
            if (possibleCells.length === 1) {
                console.log('1 possible move')
                for (let i = 0; i < stack.length; i++) {
                    pieceAction(x, y, stack[i], stack[i])
                }
                movingStack = []
                endTurn()
            }
        }
    }

    const selectCell = (x, y, clickPiece) => {
        if (selected.x == x && selected.y == y) {
            console.log('Same cell')
            if (selectedPiece.x == x && selectedPiece.y == y && clickPiece === true) {
                deselectPiece()
            }
        } else {
            selected.x = x
            selected.y = y
        }
        return true
    }

    const checkPossibleCells = (height, stack, location) => {
        possibleCells = []
        if (movingStack.length > 0) {
            possibleCells.push({x: location.x, y: location.y})
        }
        // up
        if (direction === 'up' || direction == '') {
            for (let i = 1; i < (height + 1); i++) {
                let piece = stack[i - 1 + selectedPiece.z]
                let y = location.y - i
                let x = location.x
                if (y >= 0) {
                    if (grid_value[y][x].length > 0) {
                        let type = grid_value[y][x][grid_value[y][x].length - 1].type
                        if (grid_value[y][x].length === maxHeigth || !piece[type]) {
                            break
                        } else {possibleCells.push({x: x, y: y})}
                    } else {possibleCells.push({x: x, y: y})}
                } else break
            }
        }
        // down
        if (direction === 'down' || direction === '') {
            for (let i = 1; i < (height + 1); i++) {
                let piece = stack[i - 1 + selectedPiece.z]
                let y = location.y + i
                let x = location.x
                if (y < 5) {
                    if (grid_value[y][x].length > 0) {
                        let type = grid_value[y][x][grid_value[y][x].length - 1].type
                        if (grid_value[y][x].length === maxHeigth || !piece[type]) {
                            break
                        } else {possibleCells.push({x: x, y: y})}
                    } else {possibleCells.push({x: x, y: y})}
                }
            }
        }
        // left
        if (direction === 'left' || direction === '') {
            for (let i = 1; i < (height + 1); i++) {
                let piece = stack[i - 1 + selectedPiece.z]
                let y = location.y 
                let x = location.x - i
                if (x >= 0) {
                    if (grid_value[y][x].length > 0) {
                        let type = grid_value[y][x][grid_value[y][x].length - 1].type
                        if (grid_value[y][x].length === maxHeigth || !piece[type]) {
                            break
                        } else {possibleCells.push({x: x, y: y})}
                    } else {possibleCells.push({x: x, y: y})}
                }
            }
        }
        if (direction === 'right' || direction === '') {
            for (let i = 1; i < (height + 1); i++) {
                let piece = stack[i - 1 + selectedPiece.z]
                let y = location.y 
                let x = location.x + i
                if (x < 5) {
                    if (grid_value[y][x].length > 0) {
                        let type = grid_value[y][x][grid_value[y][x].length - 1].type
                        if (grid_value[y][x].length === maxHeigth || !piece[type]) {
                            break
                        } else {possibleCells.push({x: x, y: y})}
                    } else {possibleCells.push({x: x, y: y})}
                }
            }
        }
    }

    const placeableCellsFilter = (item) => {
        for (let i = 0; i < possibleCells.length; i++) {
            if (Math.abs(item.x - selected.x) + Math.abs(item.y - selected.y) <= 1) {
                return true
            } else return false
        }
    }

    const isCellPossible = (x, y) => {
        for (let i = 0; i < possibleCells.length; i++) {    
            if (possibleCells[i].x == x && possibleCells[i].y == y) {
                return true
            }
        }
        return false
    }

    const isCellPlaceable = (x, y) => {
        for (let i = 0; i < placeableCells.length; i++) {    
            if (placeableCells[i].x == x && placeableCells[i].y == y) {
                return true
            }
        }
        console.log('No movement possible')
        return false
    }

    //Dit is zeg maar dat er een nieuwe piece wordt geplaatst
    const placePiece = (selected, type) => {
        //Eerst checken of de speler nog pieces heeft
        if (movingStack.length === 0) {
            if (currentPlayer.pieces > 0) {
                if (grid_value[selected.y][selected.x].length === 0) {
                    let succes = pieceAction(selected.x, selected.y, type, currentPlayer)
                    if (succes) {
                        //Als ie een piece heeft kunnen plaatsen dan heeft de speler een piece minder 
                        currentPlayer.pieces -= 1
                        //En is zn beurt voorbij
                        endTurn()
                    } else {
                        console.log('Still your turn')
                    }
                } else {
                    console.log('Place your piece on an empty cell')
                }
            } else {
                console.log("No pieces")
            }
        } else {
            console.log('You are moving')
        }         
    }

    //Deze functie 'plaatst' de piece echt, mr gebruik ik ook om stacks te reassignen als het ware
    const pieceAction = (x, y, type, color) => {
        //Wordt gecheckt of de toren die er staat niet al te hoog is
        if (grid_value[y][x].length < maxHeigth) {
            const piece = {
                type: type.type,
                color: color.color,
                location: {
                    x: x,
                    y: y,
                    z: grid_value[y][x].length,
                },
                "road": type['road'],
                "wall": type['wall'],
                "pyramid": type['pyramid'],
                "win": type['win']
            }
            $grid[y][x] =  [...grid_value[y][x], piece]
            return true
        } else {
            console.log('Too high')
            return false
        }
    }

    //Select ie een piece
    const selectPiece = (piece, top) => {
        //Gecheckt of de active player wel de stack owned waarin hij een piece probeert te selecteren
        if (top.color === currentPlayer.color) {
            //Checken of de peice niet al is de geselecteerd
            if (selectedPiece !== piece.location) {
                //Piece wordt gemarkeerd als selectedPiece
                selectedPiece = piece.location
                //Als de piece al was geselecteerd dan nu niet meer
                return true
            } else {
                deselectPiece()
                return false
            }
        } else {
            return false
        }
    }

    //Het deselecteren van een piece
    const deselectPiece = () => {
        selectedPiece = {
            x: null,
            y: null,
            z: null,
        }
        if (movingStack.length === 0) {
            possibleCells = []
        }
    }

    //Wisselt van currentplayer
    const endTurn = () => {
        if (currentPlayer == players.player1) 
            {currentPlayer = players.player2}
        else 
            {currentPlayer = players.player1}
        updateLog($grid)
        //let win = winChecker(grid_value)
        // if (win !== undefined) {
        //     //er heeft iemand gewonnen 
        //     console.log("Er heeft iemand gewonnen namelijk: ", win)
        //     winner = win
        // }
        round += 1;
        direction = '';
        possibleCells = [];
    }

    const undo = () => {
        console.log(round)
        console.log(JSON.parse(log_value[round-2]))
        $grid = JSON.parse(log_value[round-2])
    }

    const updateLog = (value) => {
        $log = [...log_value, JSON.stringify(value)]
    }

    // const checkwinx = (grid, y,color) => {
    //     let ans = 0;
    //     for (let x = 0; x < 5; x++) {
    //         if (grid[y][x][grid[y][x].length-1]!== undefined && grid[y][x][grid[y][x].length-1].color === color) {
    //             if (grid[y][x][grid[y][x].length-1].win) {
    //                 ans += 1 
    //             }
    //         } else break
    //     }
    //     return ans
    // }
    // const checkwiny = (grid, x,color) => {
    //     let ans = 0;
    //     for (let y = 0; y < 5; y++) {
    //         if (grid[y][x][grid[y][x].length-1]!== undefined && grid[y][x][grid[y][x].length-1].color ===  color) {
    //             if (grid[y][x][grid[y][x].length-1].win) {
    //                 ans += 1 
    //             }
    //         } else break
    //     }
    //     return ans
    // }

    // const winChecker = (grid) => {
    //     let whitewin = false;
    //     let blackwin = false;

    //     //loop x
    //     for (let i = 0; i < 5; i++) {
    //         //wit x
    //         if (checkwinx(grid, i,"#f8dfa1") === 5) {
    //             whitewin = true
    //         };
    //         //zwart x
    //         if (checkwinx(grid, i,"#55342b") === 5) {
    //             blackwin = true
    //         };
    //     };
    //     //loop y 
    //     for (let xi = 0; xi < 5; xi++) {
    //         if (checkwiny(grid, xi,"#f8dfa1") === 5) {
    //             whitewin = true
    //         };
    //         //zwart x
    //         if (checkwiny(grid, xi,"#55342b") === 5) {
    //             blackwin = true
    //         };
    //     };
    //     if (whitewin) {return "white"} 
    //     else if (blackwin) {return "black"}
    //     else return undefined
    // }

    const callAi = async(oldGrid) => {
        let notCurrentPlayerColor = '';
        if (currentPlayer.color === '#f8dfa1') {
            notCurrentPlayerColor = '#55342b'
        } else {
            notCurrentPlayerColor = '#f8dfa1'
        }
        let newGrid = await main(oldGrid, currentPlayer.color, notCurrentPlayerColor)
        //currentPlayer.pieces -= 1;
        //console.log(evals)
        $grid = newGrid;
        endTurn()
    };

    const coreTest = async() => {

    }

</script>

<svelte:window on:keydown={handleKeydown}/>

<body>
    <div class="grid">
        {#each $grid as row, y}
            <div class="row">
                {#each row as cell, x}
                    <div class="{selected.x === x && selected.y === y ? "selectedCell"  : (possibleCells && isCellPossible(x,y)) ? "possibleCell" : "cell"}">
                        {#if cell.length > 1}
                            <div class="stackDisplay">
                                <div on:click={() => {onClick('cell', x, y)}} 
                                    style="font-weight: bold; height: 100%; width: 100%; text-align: center;">
                                    {cell.length}
                                </div>
                                <div class="stack">
                                    {#each cell as stack}
                                        <div 
                                            on:click={() => {onClick('piece', x, y, stack)}} 
                                            class={selectedPiece === stack.location ? "selected_" + stack.type : stack.type} 
                                            style="background-color: {stack.color};"
                                        />
                                    {/each}
                                </div>
                            </div>
                        {/if}
                        <div class="topStack">
                            <div 
                                class="topStackFill"
                                on:click={() => {onClick('cell', x, y, cell[cell.length-1])}}
                            />
                            {#if cell[cell.length-1]}
                                <div 
                                    on:click={() => {onClick('piece', x, y, cell[cell.length-1])}}
                                    class={selectedPiece === cell[cell.length-1].location ? "selected_" + cell[cell.length-1].type : cell[cell.length-1].type} 
                                    style="background-color: {cell[cell.length-1].color};"
                                />
                            {/if}
                            <div 
                                class="topStackFill"
                                on:click={() => {onClick('cell', x, y, cell[cell.length-1])}}
                            />
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
    <div style="display: flex; flex-direction: row;">
        <button on:click={() => placePiece(selected, Road)}>Weg</button>
        <button on:click={() => placePiece(selected, Wall)}>Muur</button>
        <button on:click={() => placePiece(selected, Pyramid)}>Piramide</button>
        <button on:click={() => endTurn()}>Einde beurt</button>
        <button on:click={() => undo()}>Undo</button>
        <button on:click={() => callAi(grid_value)}>Lekker testen</button>
        <button on:click={() => coreTest()}></button>
    </div>
</body>

<style>
    div {
        color: black;
    }

    body {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-width: 2px;
        border: solid #573a2e;
    }
    
    .row {
        display: flex;
        flex-direction: row;
    }

    .cell {
        display: flex;
        height: calc(18vh - 15px);
        aspect-ratio: 1;
        border: solid #573a2e;
        border-width: 2px;
        flex-direction: row;
        background-color: #fccc74;
    }

    .possibleCell {
        display: flex;
        height: calc(18vh - 15px);
        aspect-ratio: 1;
        border: solid #573a2e;
        border-width: 2px;
        flex-direction: row;
        background-color: #e100ff7e; 
    }

    .selectedCell {
        display: flex;
        height: calc(18vh - 15px);
        aspect-ratio: 1;
        border: solid #573a2e;
        border-width: 2px;
        flex-direction: row;
        background-color: #00ff0025; 
    }

    .stackDisplay {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-right: solid blue;
        border-width: 2px;
        align-items: center;
    }

    .stack {
        display: flex; 
        flex-direction: column-reverse; 
        width: 100%; 
        align-items: center;
    }

    .topStack {
        flex: 5;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .topStackFill {
        width: 100%;
        flex: 1;
        box-sizing: border-box;
    }

    .wall {
        width: 50%;
        aspect-ratio: 1.25;
        border: solid black;
        border-width: 0.5px;
    }

    .road {
        width: 90%;
        height: calc((20vh - 15px)/13);
        border: solid black;
        border-width: 0.5px;
    }

    .pyramid {
        width: 75%;
        height: calc((20vh - 15px)/6);
        border-top-right-radius: 25px;
        border-top-left-radius: 25px;
        border: solid black;
        border-width: 0.5px;
    }

    .selected_wall {
        width: 50%;
        aspect-ratio: 1.25;
        border: solid black;
        border-width: 2px;
    }

    .selected_road {
        width: 90%;
        height: calc((20vh - 15px)/13);
        border: solid black;
        border-width: 2px;
    }

    .selected_pyramid {
        width: 75%;
        height: calc((20vh - 15px)/6);
        border-top-right-radius: 25px;
        border-top-left-radius: 25px;
        border: solid black;
        border-width: 2px;
    }
</style>