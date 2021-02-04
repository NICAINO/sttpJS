<script>
    import { grid } from './stores.js'
    import Wall  from '../../components/pieces/Wall'
    import Road  from '../../components/pieces/Road'
    import Pyramid  from '../../components/pieces/Pyramid'
    
    let grid_value = [];
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

    const unsubscribe = grid.subscribe(value => {
            grid_value = value;
        });

    function handleKeydown(event) {
		let key = event.key;
        let keyCode = event.keyCode;
        
        if (keyCode === 32) {
            placePiece(selected, Road)
        }
    }
    
    const checkPossibleCells = (x,y) => {
        let array = grid_value[selectedPiece.y][selectedPiece.x]
        let height = array.length - selectedPiece.z
        if (height > 5) {
            deselectPiece(selectedPiece.x, selectedPiece.y)
        } else {
            for (let i = 1; i < (height+1); i++) {
                let possibleLeft = x - i
                let possibleRight = x + i
                let possibleDown = y + i
                let possibleUp = y - i
                possibleCells.push({possibleLeft, y}, {possibleUp, x}, {possibleRight, y}, {possibleDown, x})
            }
        }
    }

    const placePiece = (selected, type) => {
        if (currentPlayer.pieces > 0) {
            let topDestinyCell = grid_value[selected.y][selected.x].slice(-1)
            if (topDestinyCell[0] && topDestinyCell[0].type === 'wall') {
                console.log("Wall")
            } else {
                let succes = pieceAction(selected.x, selected.y, type, currentPlayer.color)
                if (!succes) {
                    deductPiece()
                    endTurn()
                } else {
                    console.log('Still your turn')
                }
            }
        } else {
            console.log("No pieces")
        }      
    }

    const movePiece = (x,y) => {
        let array = grid_value[selectedPiece.y][selectedPiece.x]
        let topDestinyCell = grid_value[y][x].slice(-1)
        if ((array.length - selectedPiece.z) > 5) {
            console.log('Stack to high')
        } else if (topDestinyCell && topDestinyCell[0].type === 'wall') {
            console.log("Wall")
        } else {
            let items = array.splice(selectedPiece.z)
            for (let i = 0; i < items.length; i++) {
                pieceAction(x, y, items[i], items[i].color)
            }
            
        }
        deselectPiece(selectedPiece.x, selectedPiece.y)
    }

    const pieceAction = (x, y, type, color) => {
        if (grid_value[y][x].length < maxHeigth) {
            const piece = {
                type: type.type,
                color: color,
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

    const selectSquare = (x,y) => {
        selected.x = x
        selected.y = y

        if (selectedPiece.x !== null || selectedPiece.y !== null || selectedPiece.z !== null) {
            if (selectedPiece.x !== x || selectedPiece.y !== y) {
                movePiece(x,y)
            } else {
                console.log('Same cell')
            }
        } else {
            console.log('No selected piece')
        }
    }

    const selectPiece = (location,x,y,top) => {
        if (top === currentPlayer.color) {
            if (selectedPiece !== location) {
                selectedPiece = location
                checkPossibleCells(location.x, location.y)
            } else {
                deselectPiece(x,y)
            }
        } else {
            console.log('Not your stack')
        }
    }

    const deselectPiece = (x,y) => {
        if (selectedPiece.x !== x || selectedPiece.y !== y) {
            selectSquare(x,y)
        } else {
            selectedPiece = {
                x: null,
                y: null,
                z: null,
            }
            possibleCells = []
        }
    }

    const deductPiece = () => {
        currentPlayer.pieces = currentPlayer.pieces-1
    }

    const endTurn = () => {
        if (currentPlayer == players.player1) 
            {currentPlayer = players.player2}
        else 
            {currentPlayer = players.player1}
    }
    
    $: console.log("Grid geupdate: ", $grid)
    $: console.log('SelectedPiece: ', selectedPiece)

</script>

<svelte:window on:keydown={handleKeydown}/>

<body>
    <div class="grid">
        {#each $grid as row, y}
            <div class="row">
                {#each row as cell, x}
                    <div on:click ={() => {
                        selectSquare(x,y)
                        }} 
                        class="{selected.x === x && selected.y === y ? "selectedCell" : "cell"}"
                    >
                        {#if cell.length > 1}
                            <div class="stackDisplay">
                                <div on:click={() => {deselectPiece(x,y)}} style="font-weight: bold; height: 100%;">
                                    {cell.length}
                                </div>
                                <div class="stack">
                                    {#each cell as stack}
                                        <div 
                                            on:click={() => {selectPiece(stack.location, x, y, cell[cell.length-1].color)}} 
                                            class={selectedPiece === stack.location ? "selected_" + stack.type : stack.type} 
                                            style="background-color: {stack.color};"
                                        />
                                    {/each}
                                </div>
                            </div>
                        {/if}
                        <div class="topStack">
                            {#if cell[cell.length-1]}
                                <div 
                                    on:click={() => {selectPiece(cell[cell.length-1].location, x, y, cell[cell.length-1].color)}}
                                    class={selectedPiece === cell[cell.length-1].location ? "selected_" + cell[cell.length-1].type : cell[cell.length-1].type} 
                                    style="background-color: {cell[cell.length-1].color};"/>
                            {/if}
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
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
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