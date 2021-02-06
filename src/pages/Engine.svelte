<script>
    import { grid, log } from './stores.js'
    import Wall  from '../../components/pieces/Wall'
    import Road  from '../../components/pieces/Road'
    import Pyramid  from '../../components/pieces/Pyramid'
    
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
    let placeableCells = []

    let direction;

    $: movingStack = []

    export const maxHeigth = 10
    
    export let players = {
        player1: {
            name:"Gonnoegarfield",
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
        let didEndTurn = false
        if (clickedOn === 'piece') {
            // Select cell en zet andere info op nul
            selectCell(x, y)
            let top = grid_value[y][x][grid_value[y][x].length-1]
            // Bij eigen piece return true anders false
            if (selectPiece(piece, x, y, top)) {
                let height = grid_value[y][x].length - selectedPiece.z
                // Check of de geselcteerde stack niet hoger is dan de maximale hoogte
                if (height > 5) {
                    // Wordt uitgevoerd als stack te hoog is
                    console.log('Stack too high')
                } else {
                    // Wordt als de stack verplaatsbaar is (dus aan alle voorwaarden voldoet)
                    checkPossibleCells(x, y) 
                    checkPlaceableCells(x, y)
                } 
            } else {
                // wordt uitgevoerd als de piece niet van jou is
                console.log('Still your turn')
            }
        } else if (clickedOn === 'cell') {
            // Select cell en zet andere info op nul
            if(selectCell(x, y)) {
                // Als er een piece is geselect dan true anders false
                if (selectedPiece.x !== null && selectedPiece.y !== null && selectedPiece.z !== null ) {
                    if (isMovePossible(x, y) && isReachPossible(x, y)) {
                        let array = grid_value[selectedPiece.y][selectedPiece.x]
                        movingStack = array.splice(selectedPiece.z)
                        deselectPiece()
                        determineDirection(x, y, movingStack)
                        movement(x, y, movingStack)
                        
                    } else {
                        console.log('No movement possible')
                    }
                } else if (movingStack.length > 0) {
                    if (isMovePossible(x, y) && isReachPossible(x, y)) {
                        movement(x, y, movingStack)
                    } else {
                        console.log('Move is not possible')
                    }
                } else {
                    console.log('No piece selected')
                }
            } else if (movingStack.length > 0) {
                if(isMovePossible(x, y) && isReachPossible(x, y)) {
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
        if (didEndTurn) {
            endTurn()
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

    const movement = async(x, y, movingStack) => {
        pieceAction(x, y, movingStack[0], movingStack[0])
        movingStack.splice(0, 1)
        if (movingStack.length === 0) {
            endTurn()
        }
        await updatePossibleCells(x, y)
        updatePlaceableCells(x, y)
    }

    const updatePossibleCells = (x, y) => {
        possibleCells = []
        possibleCells.push({x: x, y: y})
        let height = movingStack.length
        if (direction === 'up') {
            for (let i = 1; i < (height+1); i++) {
                possibleCells.push({x: x, y: y - i})
            }
        } else if (direction === 'down') {
            for (let i = 1; i < (height+1); i++) {
                possibleCells.push({x: x, y: y + i})
            }
        } else if (direction === 'left') {
            for (let i = 1; i < (height+1); i++) {
                possibleCells.push({x: x - i, y: y})
            }
        } else if (direction === 'right') {
            for (let i = 1; i < (height+1); i++) {
                possibleCells.push({x: x + i, y: y})
            }
        } else {
            console.log('Something went wrong')
        }
    }

    const selectCell = (x, y) => {
        if (selectedPiece.x == x && selectedPiece.y == y) {
            deselectPiece(x, y)
            possibleCells = []
        } 
        if (selected.x == x && selected.y == y) {
            return false
        } else {
            selected.x = x
            selected.y = y
            return true
        }
    }
    
    //Met deze functie wordt nog nix gedaan. Mr ik dacht iets te maken zodat er wordt gekeken wat mogelijke cellen zijn om je shit nrtoe te plaatsen
    const checkPossibleCells = (x,y) => {
        possibleCells = []
        let array = grid_value[selectedPiece.y][selectedPiece.x]
        let height = array.length - selectedPiece.z
        for (let i = 1; i < (height+1); i++) {
            possibleCells.push(
                {x: x - i, y: y}, 
                {x: x, y: y - i}, 
                {x: x + i, y: y}, 
                {x: x, y: y + i}
            )
        }
    }

    const isReachPossible = (x, y) => {
        // console.log(possibleCells, possibleCells.length)
        for (let i = 0; i < possibleCells.length; i++) {    
            if (possibleCells[i].x == x && possibleCells[i].y == y) {
                return true
            }
        }
        return false
    }

    const updatePlaceableCells = (x, y) => {
        placeableCells = []
        for (let i = 1; i < (possibleCells.length + 1); i++) {
            let difference = Math.abs(selected.x - possibleCells[i-1].x) + Math.abs(selected.y - possibleCells[i-1].y)
            if (difference === 1) {
                placeableCells.push(
                    {x: x, y: y},
                    {x: x - i, y: y}, 
                    {x: x, y: y - i}, 
                    {x: x + i, y: y}, 
                    {x: x, y: y + i}
                )
                break
            }
        }
        console.log('PC', placeableCells)
    }

    const checkPlaceableCells = (x, y) => {
        placeableCells = []
        for (let i = 1; i < (possibleCells.length + 1); i++) {
            let difference = Math.abs(selectedPiece.x - possibleCells[i].x) + Math.abs(selectedPiece.y - possibleCells[i].y)
            if (difference === 1) {
                placeableCells.push(
                {x: x - i, y: y}, 
                {x: x, y: y - i}, 
                {x: x + i, y: y}, 
                {x: x, y: y + i}
                )
                break
            }
        }
        console.log('PC', placeableCells)
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
        if (currentPlayer.pieces > 0) {
            let topDestinyCell = grid_value[selected.y][selected.x].slice(-1)
            // Dan of de bovenste een wall is. Mss dit in een aparte functie plaats laten vinden
            if (topDestinyCell[0] && topDestinyCell[0].type === 'wall') {
                console.log("Wall")
            } else {
                //Geen wall dan voert ie deze shit uit
                let succes = pieceAction(selected.x, selected.y, type, currentPlayer)
                if (!succes) {
                    //Als ie een piece heeft kunnen plaatsen dan heeft de speler een peice minder 
                    deductPiece()
                    //En is zn beurt voorbij
                    endTurn()
                } else {
                    console.log('Still your turn')
                }
            }
        } else {
            console.log("No pieces")
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
        } else {
            console.log('Too high')
            return true
        }
    }

    //Select ie een piece
    const selectPiece = (piece,x,y,top) => {
        //Gecheckt of de active player wel de stack owned waarin hij een piece probeert te selecteren
        if (top.color === currentPlayer.color) {
            //Checken of de peice niet al is de geselecteerd
            if (selectedPiece !== piece.location) {
                // Possible cells wordt leeggehaald
                possibleCells = []
                //Piece wordt gemarkeerd als selectedPiece
                selectedPiece = piece.location
                //Als de piece al was geselecteerd dan nu niet meer
                return true
            } else {
                deselectPiece(x,y)
                return false
            }
        } else {
            console.log('Not your stack')
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
        $log.push(grid_value)
        console.log("log update ", log_value)
        possibleCells = []
    }

    const goBack = (i) => {
        $grid = log_value[log_value.length-i]
    }
    
    //$: console.log('SelectedPiece: ', selectedPiece)

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
                                    style="font-weight: bold; height: 100%;">
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
        <button on:click={() => goBack(1)}>Undo</button>
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
        height: 70px;
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