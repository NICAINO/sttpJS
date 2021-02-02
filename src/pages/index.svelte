<script>
    import { metatags } from '@roxi/routify'
    metatags.title = 'Vo man'
    metatags.description = 'Prominente website gast!'
    import Engine from './Engine.svelte'
</script>
<body>

    <div class="header">
        VOMB
    </div>
    <Engine/>

</body>


<style>

    body {
        background-color: #fff;
        width: 100%;
        height: 100000px;
    }
    
    .header {
        font-size: 3em;
        font-weight: bold;
        padding: 20px;
        text-transform: uppercase;
        text-align: center;
    }

</style>