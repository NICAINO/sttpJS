<script>
    import { metatags } from '@roxi/routify'
    metatags.title = 'Vo man'
    metatags.description = 'Prominente website gast!'
    import Engine from './Engine.svelte'
    let players
    let activePlayer;
</script>
<body>
    <div style="display: flex; align-items: flex-start; flex-direction: column;">
        <div class="header">
            VOMB
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
    <Engine bind:currentPlayer={activePlayer} bind:players={players}/>
    <div style="display: flex; align-items: center; flex-direction: column;">
        {#if activePlayer}
            <h3>Stukken </h3>
            <p>{activePlayer.name}: {activePlayer.pieces} stukken</p>            
        {/if}
    </div>

</body>


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

</style>