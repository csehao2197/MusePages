export function createSeasons(state)
{
    let nightTarget = state.night;
    let rainTarget = state.rain;
    const mix = state.seasonMix;
    return {
        select(index)
        {
            state.season = index;
        },
        night(value)
        {
            nightTarget = value ? 1 : 0;
        },
        rain(value)
        {
            rainTarget = value ? 1 : 0;
        },
        update(dt)
        {
            const duration = state.reduced ? 0.13 : 0.8;
            for (let i = 0; i < 4; i++) mix[i] += ((state.season === i ? 1 : 0) - mix[i]) * (1 - Math.exp(-dt / duration));
            state.night += (nightTarget - state.night) * (1 - Math.exp(-dt / (state.reduced ? 0.13 : 0.6)));
            state.rain += (rainTarget - state.rain) * (1 - Math.exp(-dt / (rainTarget ? 0.83 : 1.33)));
        }
    };
}
