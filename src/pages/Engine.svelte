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
            x: x,
            y: y,
            z: grid_value[y][x].length,
        }
        $grid[y][x] =  [...grid_value[y][x], piece]
        };

    const selectSquare = (x,y) => {
        selected.x = x
        selected.y = y
        };
    
    $: console.log("Grid geupdate: ", $grid)
    $: console.log('Selected: ', selected.x, selected.y)
    $: console.log("currentPlayer: ", currentPlayer)
    $: console.log(Wall)

    const turn = (selected, players, type) => {
        placePiece(selected.x, selected.y, type, currentPlayer.color)

        if (currentPlayer == players.player1) 
            {currentPlayer = players.player2}
        else 
            {currentPlayer = players.player1}
    }

</script>


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
                            <div>
                                {cell.length}
                            </div>
                            <div class="stack">
                                {#each cell as stack}
                                    <div class={stack.type} style="background-color: {stack.color};"/>
                                {/each}
                            </div>
                        </div>
                    {/if}
                    <div class="topStack">
                        {#if cell[cell.length-1]}
                            <div class={cell[cell.length-1].type} style="background-color: {cell[cell.length-1].color};"/>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>

<button on:click={() => turn(selected, players, Road)}>VO!</button>

<style>
    div {
        color: black;
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
</style>