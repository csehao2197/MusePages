export function mulberry32(seed)
{
    return function ()
    {
        let value = seed += 0x6D2B79F5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}

export function applyTemperature(probabilities, temperature)
{
    const logits = probabilities.map((probability) => Math.log(probability) / temperature);
    const max = Math.max(...logits);
    const weights = logits.map((value) => Math.exp(value - max));
    const total = weights.reduce((sum, value) => sum + value, 0);
    return weights.map((value) => value / total);
}

export function sample(probabilities, random)
{
    let cumulative = 0;
    for (let index = 0; index < probabilities.length; index++)
    {
        cumulative += probabilities[index];
        if (random < cumulative) return index;
    }
    return probabilities.length - 1;
}
