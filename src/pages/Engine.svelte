<script>
    import { grid, log } from './stores.js'
    import Wall  from '../../components/pieces/Wall'
    import Road  from '../../components/pieces/Road'
    import Pyramid  from '../../components/pieces/Pyramid'
import { element } from 'svelte/internal';
    
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

    let reachableCells = []
    let possibleCells = []
    let placeableCells = []

    let direction;

    let movingStack = []

    export const maxHeigth = 10
    
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
            selectCell(x, y)
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
                    checkReachableCells(x, y) 
                    //checkPlaceableCells(x, y)
                }
            } else if (selectedPiece.x !== null && selectedPiece.y !== null && selectedPiece.z !== null) {
                // Wordt uitgevoerd als je al je eigen piece had geselect en andermans piece selecte
                beginMovement(x, y)
            } else if (movingStack.length !== 0 && isMovePossible(x, y)) {
                movement(x, y)
            } else {
                // wordt uitgevoerd als de piece niet van jou is en je niet aan het moven bent
                console.log('Not your stack')
            }
        } else if (clickedOn === 'cell') {
            // Select cell en zet andere info op nul
            if(selectCell(x, y, piece)) {
                // Als er een piece is geselect dan true anders false
                if (selectedPiece.x !== null && selectedPiece.y !== null && selectedPiece.z !== null) {
                    beginMovement(x, y)
                } else if (movingStack.length > 0) {
                    if (isMovePossible(x, y)) {
                        movement(x, y, movingStack)
                    } else {
                        console.log('Move is not possible')
                    } 
                } else {
                    console.log('No piece selected')
                }
            } else if (movingStack.length > 0) {
                if(isMovePossible(x, y)) {
                    movement(x, y, movingStack)
                } else {
                    console.log('Move is not possible')
                }
            } else {
                console.log('Same cell')
            }
        } else {
            console.log('?')
        }
    }

    const beginMovement = (x, y) => {
        if (isMovePossible(x, y) && isReachPossible(x, y)) {
            let array = grid_value[selectedPiece.y][selectedPiece.x]
            movingStack = array.splice(selectedPiece.z)
            deselectPiece()
            determineDirection(x, y, movingStack)
            movement(x, y, movingStack)        
        } else {
            console.log('No movement possible')
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
        console.log('Direction: ', direction)
    }

    const movement = (x, y, movingStack) => {
        pieceAction(x, y, movingStack[0], movingStack[0])
        movingStack.splice(0, 1)
        //updatePossibleCells(x, y)
        //updatePlaceableCells(x, y)
        if (placeableCells.length === 1) {
            console.log('1 possible move')
            for (let i = 0; i < movingStack.length; i++) {
                pieceAction(x, y, movingStack[i], movingStack[i])
            }
            movingStack = []
        }
        if (movingStack.length === 0) {
            endTurn()
        }
    }

    const selectCell = (x, y) => {
        if (selected.x == x && selected.y == y) {
            return false
        } else {
            if (selectedPiece.x == x && selectedPiece.y == y) {
                deselectPiece()
            } 
            selected.x = x
            selected.y = y
            return true
        }
    }
    
    //Met deze functie wordt nog nix gedaan. Mr ik dacht iets te maken zodat er wordt gekeken wat mogelijke cellen zijn om je shit nrtoe te plaatsen
    const checkReachableCells = (x,y) => {
        reachableCells = []
        let array = grid_value[selectedPiece.y][selectedPiece.x]
        let height = array.length - selectedPiece.z
        for (let i = 1; i < (height+1); i++) {
            reachableCells.push(
                {x: x - i, y: y}, 
                {x: x, y: y - i}, 
                {x: x + i, y: y}, 
                {x: x, y: y + i}
            )
        }
    }

    $: console.log('rc: ', reachableCells)

    // const updatePossibleCells = (x, y) => {
    //     possibleCells = []
    //     possibleCells.push({x: x, y: y})
    //     let height = movingStack.length
    //     if (direction === 'up') {
    //         for (let i = 1; i < (height+1); i++) {
    //             possibleCells.push({x: x, y: y - i})
    //         }
    //     } else if (direction === 'down') {
    //         for (let i = 1; i < (height+1); i++) {
    //             possibleCells.push({x: x, y: y + i})
    //         }
    //     } else if (direction === 'left') {
    //         for (let i = 1; i < (height+1); i++) {
    //             possibleCells.push({x: x - i, y: y})
    //         }
    //     } else if (direction === 'right') {
    //         for (let i = 1; i < (height+1); i++) {
    //             possibleCells.push({x: x + i, y: y})
    //         }
    //     } else {
    //         console.log('Something went wrong')
    //     }
    // }

    const isReachPossible = (x, y) => {
        for (let i = 0; i < possibleCells.length; i++) {    
            if (possibleCells[i].x == x && possibleCells[i].y == y) {
                return true
            }
        }
        return false
    }

    $: possibleCells = reachableCells.filter(possibleCellsFilter);

    const possibleCellsFilter = (item) => {
        for (let i = 0; i < reachableCells.length; i++) {
            if (item.x < 0 || item.x > 4 || item.y < 0 || item.y > 4) {
                return false
            } else {
                let array = grid_value[item.y][item.x]
                if (array.length === 0) {
                    return true 
                } else if (array.length !== 10 && array[array.length - 1].type !== 'wall' && array[array.length - 1].type !== 'pyramid') {
                    return true
                } else return false
            }
        }
    }

    $: console.log('PC: ', possibleCells)

    $: placeableCells = possibleCells.filter(placeableCellsFilter);

    $: console.log('PlaceC: ', placeableCells)

    const placeableCellsFilter = (item) => {
        for (let i = 0; i < possibleCells.length; i++) {
            if (Math.abs(item.x - selected.x) + Math.abs(item.y - selected.y) === 1) {
                console.log('In reach: ', item)
                return true
            } else if (Math.abs(item.x - selected.x) + Math.abs(item.y - selected.y) === 0 && movingStack.length !== 0) {
                console.log('In reach: ', item)
                return true
            } else return false
        }
    }

    const isMovePossible = (x, y) => {
        for (let i = 0; i < placeableCells.length; i++) {    
            if (placeableCells[i].x == x && placeableCells[i].y == y) {
                return true
            }
        }
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
                        //Als ie een piece heeft kunnen plaatsen dan heeft de speler een peice minder 
                        deductPiece()
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
                }
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
            reachableCells = []
            possibleCells = []
            placeableCells = []
        }
    }

    //Is gwn dat er een piece wordt afgetrokken van het aantal pieces dat een speler heeft
    const deductPiece = () => {
        currentPlayer.pieces = currentPlayer.pieces-1
    }

    //Wisselt van currentplayer
    const endTurn = () => {
        if (currentPlayer == players.player1) 
            {currentPlayer = players.player2}
        else 
            {currentPlayer = players.player1}
        updateLog($grid)
        round += 1
        reachableCells = []
        possibleCells = []
        placeableCells = []
    }

    const undo = () => {
        console.log(round)
        console.log(JSON.parse(log_value[round-2]))
        $grid = JSON.parse(log_value[round-2])
    }

    const updateLog = (value) => {
        $log = [...log_value, JSON.stringify(value)]
    }

</script>

<svelte:window on:keydown={handleKeydown}/>

<body>
    <div class="grid">
        {#each $grid as row, y}
            <div class="row">
                {#each row as cell, x}
                    <div class="{selected.x === x && selected.y === y ? "selectedCell"  : (possibleCells && isReachPossible(x,y)) ? "possibleCell" : "cell"}">
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
        <button on:click={() => {endTurn()}}>Einde beurt</button>
        <button on:click={() => undo()}>Undo</button>
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
        width: 150px;
        aspect-ratio: 1;
        border: solid #573a2e;
        border-width: 2px;
        flex-direction: row;
        background-color: #fccc74;
    }

    .possibleCell {
        display: flex;
        width: 150px;
        aspect-ratio: 1;
        border: solid #573a2e;
        border-width: 2px;
        flex-direction: row;
        background-color: #e100ff7e; 
    }

    .selectedCell {
        display: flex;
        width: 150px;
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
    }

    .road {
        width: 90%;
        height: 10px;
    }

    .pyramid {
        width: 75%;
        height: 25px;
        border-top-right-radius: 25px;
        border-top-left-radius: 25px;
    }

    .selected_wall {
        width: 50%;
        aspect-ratio: 1.25;
    }

    .selected_road {
        width: 90%;
        height: 10px;
        border: solid black;
        border-width: 2px;
    }

    .selected_pyramid {
        width: 75%;
        height: 25px;
        border-top-right-radius: 25px;
        border-top-left-radius: 25px;
    }
</style>