<script>
    import { grid } from './stores.js'

    let grid_value;
    const unsubscribe = grid.subscribe(value => {
            grid_value = value;
        });

    const fixHet = () => {
        $grid[0][0][2] = "super relaxed neef"
    }
    
    $: console.log($grid)
</script>


<div class="grid">
    {#each $grid as row}
        <div class="row">
            {#each row as cell}
                <div class="cell">
                    {#each cell as block}
                        <div class="blockDisplay">
                            {block}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/each}
</div>

<button on:click={() => fixHet()}>POG</button>

<style>
    .grid {
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
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
        flex-direction: column-reverse
    }

    .blockDisplay {
        border: solid red;
        border-width: 1px;
    }
</style>