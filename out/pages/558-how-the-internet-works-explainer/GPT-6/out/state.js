import { content as C } from "./content.js";

let state =
{
    activeStage: -1,
    distance: "country",
    lossPercent: 0,
    warmReload: false,
    dnsCache: new Set(),
    handshakeStep: 0
};
const listeners = new Set();
export const store =
{
    get: () => state,
    set(patch)
    {
        state = { ...state, ...patch };
        listeners.forEach((listener) => listener(state));
    },
    subscribe(listener)
    {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
};

export function timeline(s = state)
{
    const n = C.numbers;
    const route = C.routes[s.distance];
    const oneWay = route.oneWay;
    const lost = Math.round(n.packetCount * s.lossPercent / 100);
    const transfer = 2 * oneWay + n.server + lost * 2 * oneWay;
    const response = n.dns + 4 * oneWay + transfer;
    const total = response + n.paint;
    const warmTransfer = 2 * oneWay + n.server;
    return {
        oneWay, lost, transfer, total, hops: route.hops,
        milestones: [0, n.dns, n.dns + oneWay, n.dns + 2 * oneWay, n.dns + 4 * oneWay, response, total],
        durations: [n.dns, 2 * oneWay, 2 * oneWay, transfer, n.paint],
        warmDurations: [0, 0, 0, warmTransfer, n.warmPaint],
        warmTotal: warmTransfer + n.warmPaint
    };
}
