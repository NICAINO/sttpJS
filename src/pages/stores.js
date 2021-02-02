import { writable } from 'svelte/store';

export const grid = writable(
    [
        //0  1  2  3  4
        [[],[],[],[],[]], //A
        [[],[],[],[],[]], //B
        [[],[],[],[],[]], //C
        [[],[],[],[],[]], //D
        [[],[],[],[],[]], //E
    ]
);