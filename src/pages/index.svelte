<script>
    import { metatags } from '@roxi/routify'
    metatags.title = 'Vo man'
    metatags.description = 'Prominente website gast!'
    import Engine from './Engine.svelte'
    let players
    let activePlayer;
    let movingStack = [];
    let winner;
</script>
{#if winner}
<p>winner: {winner}</p>
{:else}
<body>
    <div style="display: flex; align-items: flex-start; flex-direction: column;">
        <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; align-items: center;">
            <div class="header">
                VOMB
            </div>
            <div style="width: 10vh; display: flex; flex-direction: column-reverse;">
                {#each movingStack as piece}
                    <div 
                        class={piece.type} 
                        style="background-color: {piece.color};"
                    />
                {/each}
            </div>
        </div>
        <div style="width: 100%;">
        {#if activePlayer}
            <h2>
                Beurt:
            </h2>
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; width: 100%;">
                <h3>
                    {activePlayer.name}
                </h3>
                <div style="height: 25px; width: 25px; background-color: {activePlayer.color}; border-width: 1px; border: solid black;"/>
            </div>
            <h2>Spelers:</h2>
            <p>- {players.player1.name}</p>
            <p>- {players.player2.name}</p>     
        {/if}
        </div>
    </div>
    <Engine bind:currentPlayer={activePlayer} bind:players={players} bind:movingStack={movingStack} bind:winner={winner}/>
    <div style="display: flex; align-items: center; flex-direction: column;">
        {#if activePlayer}
            <h3>Stukken </h3>
            <p>{activePlayer.name}: {activePlayer.pieces} stukken</p>            
        {/if}
    </div>

</body>
{/if}


<style>

    body {
        background-color: #fff;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    body > * {
        flex: 1 100%;
    }
    
    p {
        margin-top: 2px;
        margin-bottom: 2px;
    }

    h2 {
        margin-top: 0px;
        margin-bottom: 0px;
        display: flex;
        flex-wrap: wrap;
    }

    .header {
        font-size: 3em;
        font-weight: bold;
        padding: 20px;
        text-transform: uppercase;
        text-align: center;
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

</style>