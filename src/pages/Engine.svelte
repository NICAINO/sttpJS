<script>
    import { grid } from './stores.js'
    import Wall  from '../../components/pieces/Wall'
    import Road  from '../../components/pieces/Road'
    import Pyramid  from '../../components/pieces/Pyramid'
import { set_attributes } from 'svelte/internal';
    
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
    export let players = {
        player1: {
            name:"Gonnoegarfield",
            rating: "MEGAHOOG",
            color: "yellow"
        },
        player2: {
            name: 'Pilsiam',
            rating: "nog nooit van nica gewonnen",
            color: "green"
        },
    }
    export let currentPlayer = players.player1

    const unsubscribe = grid.subscribe(value => {
            grid_value = value;
        });

    const placePiece = (x, y, type, color) => {
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
        };

    const selectSquare = (x,y) => {
        selected.x = x
        selected.y = y

        if (selectedPiece.x !== x || selectedPiece.y !== y) {
            let array = grid_value[selectedPiece.y][selectedPiece.x]
            let items = array.splice(selectedPiece.z)
            for (let i = 0; i < items.length; i++) {
                placePiece(x, y, items[i], items[i].color)
            }
        } else {
            console.log('Same cell')
        }
    };

    const selectPiece = (location) => {
        if (selectedPiece !== location) {
            selectedPiece = location
        } else {
            selectedPiece = {
                x: null,
                y: null,
                z: null,
            }
        }
    }
    
    $: console.log("Grid geupdate: ", $grid)
    $: console.log('SelectedPiece: ', selectedPiece)
    $: console.log("currentPlayer: ", currentPlayer)
    $: console.log(Wall)

    const placeNewPiece = (selected, type) => {
        placePiece(selected.x, selected.y, type, currentPlayer.color)
        endTurn()
    }

    const endTurn = () => {
        if (currentPlayer == players.player1) 
            {currentPlayer = players.player2}
        else 
            {currentPlayer = players.player1}
    }

</script>

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
                                <div style="font-weight: bold;">
                                    {cell.length}
                                </div>
                                <div class="stack">
                                    {#each cell as stack}
                                        <div 
                                            on:click={() => {selectPiece(stack.location, x, y)}} 
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
                                    on:click={() => {selectPiece(cell[cell.length-1].location, x, y)}}
                                    class={selectedPiece === cell[cell.length-1].location ? "selected_" + cell[cell.length-1].type : cell[cell.length-1].type} 
                                    style="background-color: {cell[cell.length-1].color};"/>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>

    <button on:click={() => placeNewPiece(selected, Road)}>VO!</button>
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
    }
    
    .row {
        display: flex;
        flex-direction: row;
    }

    .cell {
        display: flex;
        width: 150px;
        aspect-ratio: 1;
        border: solid black;
        border-width: 2px;
        flex-direction: row;
    }

    .selectedCell {
        display: flex;
        width: 150px;
        aspect-ratio: 1;
        border: solid black;
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