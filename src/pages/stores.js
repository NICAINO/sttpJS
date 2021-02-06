import { beforeUpdate } from 'svelte';
import { writable } from 'svelte/store';

export let grid = writable(
    [
        //0  1  2  3  4
        [[],[],[],[],[]], //A
        [[],[],[],[],[]], //B
        [[],[],[],[],[]], //C
        [[],[],[],[],[]], //D
        [[],[],[],[],[]], //E
    ]
);

export const log = writable( 
    []
)
