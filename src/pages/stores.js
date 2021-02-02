import { writable } from 'svelte/store';

export const grid = writable(
    [
        // 0     1     2     3     4
        [[null],[null],[null],[null],[null]], //A
        [[null],[null],[null],[null],[null]], //B
        [[null],[null],[null],[null],[null]], //C
        [[null],[null],[null],[null],[null]], //D
        [[null],[null],[null],[null],[null]], //E
                ]
);