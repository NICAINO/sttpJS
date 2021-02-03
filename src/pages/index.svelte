<script>
    import { metatags } from '@roxi/routify'
    metatags.title = 'Vo man'
    metatags.description = 'Prominente website gast!'
    import Engine from './Engine.svelte'
    let players
    let activePlayer;
</script>
<body>
    <div style="display: flex; align-items: center; flex-direction: column;">
        <div class="header">
            VOMB
        </div>
        <div>
        {#if activePlayer}
            <h2>
                Beurt: {activePlayer.name}
            </h2>
            <h3>Spelers: </h3>
            <p>{players.player1.name} Rating: {players.player1.rating}</p>
            <p>{players.player2.name} Rating: {players.player2.rating}</p>
            
        {/if}
        </div>
    </div>
    <Engine bind:currentPlayer={activePlayer} bind:players={players}/>
    <div/>

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
    
    .header {
        font-size: 3em;
        font-weight: bold;
        padding: 20px;
        text-transform: uppercase;
        text-align: center;
    }

</style>