<script>
    import { grid } from './stores.js'
    
    let grid_value;
    let currentX;
    let currentY;

    const unsubscribe = grid.subscribe(value => {
            grid_value = value;
        });

    const fixHet = (x,y) => {
        $grid[y][x][$grid[y][x].length] = JSON.stringify($grid[y][x].length)
    }
    
    $: console.log("Grid geupdate: ", $grid)
    $: console.log('current: ', currentX, currentY)
</script>


<div class="grid">
    {#each $grid as row, y}
        <div class="row">
            {#each row as cell, x}
                <div on:click ={() => {
                    currentX = x,
                    currentY = y
                    fixHet(x,y)
                    }} 
                    class="cell"
                >
                    <div class="stackDisplay">
                        {#each cell as stack}
                            <div>
                                {stack}
                            </div>
                        {/each}
                    </div>
                    <div class="topStack">
                        <div>
                            {cell.slice(-1)}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    div {
        color: white;
    }

    .grid {
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
    }
    
    .row {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
    }

    .cell {
        display: flex;
        width: 125px;
        aspect-ratio: 1;
        border: solid black;
        border-width: 2px;
        flex-direction: row
    }

    .cell > * {
        flex: 1 100%;
    }

    .stackDisplay {
        display: flex;
        flex-direction: column-reverse;
        border: solid black;
        border-width: 1px;
    }

    .topStack {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .piece {
        flex: 1;
        color: black;
        height: 2px;
    }
</style>