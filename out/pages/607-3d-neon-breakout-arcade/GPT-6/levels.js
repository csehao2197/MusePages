export const levels =
[
    { speed: 7.2, rows: ["ccccccccc", "sssssssss", "iiiiiiiii", "cscscscsc"], drops: [[2, 4, "scatter"], [1, 1, "needle"], [3, 7, "girder"]] },
    { speed: 8.1, rows: ["cscsicscs", "-s-c-c-s-", "c-scics-c", "-i-l-l-i-", "scscscscs"], drops: [[0, 4, "scatter"], [2, 0, "needle"], [4, 8, "girder"]] },
    { speed: 9, rows: ["lll---lll", "ccc---ccc", "sss---sss", "iii---iii", "csc---csc"], drops: [[1, 1, "scatter"], [2, 7, "needle"], [4, 0, "girder"]] },
    { speed: 9.9, rows: ["c-s-c-s-c", "-l-i-l-i-", "c-s-c-s-c", "-i-l-i-l-", "s-c-s-c-s", "-c-s-c-i-"], drops: [[2, 2, "scatter"], [3, 3, "needle"], [4, 8, "girder"]] },
    { speed: 10.8, rows: ["lclclclcl", "ss-c-c-ss", "ccclllccc", "ii-----ii", "s-c-i-c-s", "cscscscsc"], drops: [[0, 4, "scatter"], [2, 0, "needle"], [5, 8, "girder"]] }
];
export function mulberry32(seed)
{
    return () =>
    {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
