<script>
    import { grid } from './stores.js'
    
    let grid_value = [];
    let currentX;
    let currentY;

    const unsubscribe = grid.subscribe(value => {
            grid_value = value;
        });

    const fixHet = (x,y) => {
        let vo = grid_value[y][x]
        let color = 'red'
        let new_vo = [...vo, {color}]
        console.log('BAAAS', JSON.stringify(new_vo))
        $grid[y][x] = new_vo
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
                            <div class="piece" style="background-color: {stack.color};"/>
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
        color: black;
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
        width: 100%;
        height: 5px;
    }
</style>