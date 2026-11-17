import { levels } from "./levels.js";
import { traceBeam } from "./trace.js";

export const storageKey = "lumenwild-progress-v1";

export function cleanProgress(raw = {})
{
    return {
        current: Number.isInteger(raw.current) && raw.current >= 0 && raw.current < 12 ? raw.current : 0,
        solved: Array.isArray(raw.solved) ? [...new Set(raw.solved.filter((id) => Number.isInteger(id) && id >= 1 && id <= 12))] : [],
        best: Object.fromEntries(Object.entries(raw.best || {}).filter(([id, value]) => Number(id) >= 1 && Number(id) <= 12 && Number.isInteger(value) && value >= 1)),
        sound: raw.sound === true
    };
}

export function initialState(progress = {})
{
    const saved = cleanProgress(progress);
    return { ...saved, rotations: levels[saved.current].pieces.map((piece) => piece.initial), selected: 0, moves: 0, history: [], dialog: null };
}

export function reducer(state, action)
{
    const level = levels[state.current];
    if (action.type === "level")
    {
        return { ...state, current: action.index, rotations: levels[action.index].pieces.map((piece) => piece.initial), selected: 0, moves: 0, history: [], dialog: null };
    }
    if (action.type === "restart")
    {
        return { ...state, rotations: level.pieces.map((piece) => piece.initial), selected: 0, moves: 0, history: [], dialog: null };
    }
    if (action.type === "select") return { ...state, selected: (action.index + level.pieces.length) % level.pieces.length };
    if (action.type === "dialog") return { ...state, dialog: action.dialog };
    if (action.type === "sound") return { ...state, sound: !state.sound };
    if (action.type === "undo")
    {
        if (!state.history.length) return state;
        return { ...state, ...state.history.at(-1), history: state.history.slice(0, -1), dialog: null };
    }
    if (action.type !== "rotate") return state;
    const id = action.index ?? state.selected;
    const rotations = [...state.rotations];
    rotations[id] = (rotations[id] + 1) % 4;
    const next = {
        ...state, rotations, selected: id, moves: state.moves + 1, dialog: null,
        history: [...state.history, { rotations: [...state.rotations], moves: state.moves, selected: state.selected }]
    };
    if (traceBeam(level, rotations).solved)
    {
        next.solved = [...new Set([...state.solved, level.id])];
        next.best = { ...state.best, [level.id]: Math.min(state.best[level.id] ?? Infinity, next.moves) };
    }
    return next;
}

export function persisted(state)
{
    return { current: state.current, solved: state.solved, best: state.best, sound: state.sound };
}
