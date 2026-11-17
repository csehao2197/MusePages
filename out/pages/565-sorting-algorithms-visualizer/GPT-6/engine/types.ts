export type Step =
    | { k: "compare"; i: number; j: number; a: number; b: number; range?: [number, number]; pivot?: number }
    | { k: "swap"; i: number; j: number; range?: [number, number]; pivot?: number }
    | { k: "write"; i: number; value: number; prev: number; range?: [number, number] }
    | { k: "sorted"; indices: number[]; range?: [number, number] };
