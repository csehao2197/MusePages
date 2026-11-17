/** @typedef {import("./types").Step} Step */
function recorder(input)
{
    const a = [...input];
    /** @type {Step[]} */
    const steps = [];
    return {
        a, steps,
        compare(i, j, range, pivot, values)
        {
            steps.push({ k: "compare", i, j, a: values ? values[0] : a[i], b: values ? values[1] : a[j], range, pivot });
        },
        swap(i, j, range, pivot)
        {
            steps.push({ k: "swap", i, j, range, pivot });
            [a[i], a[j]] = [a[j], a[i]];
        },
        write(i, value, range)
        {
            steps.push({ k: "write", i, value, prev: a[i], range });
            a[i] = value;
        },
        sorted(indices, range)
        {
            if (indices.length) steps.push({ k: "sorted", indices, range });
        }
    };
}

export function bubble(input)
{
    const r = recorder(input);
    const { a } = r;
    for (let end = a.length - 1; end >= 1; end--)
    {
        let changed = false;
        for (let i = 0; i < end; i++)
        {
            r.compare(i, i + 1, [0, end]);
            if (a[i] > a[i + 1])
            {
                r.swap(i, i + 1, [0, end]);
                changed = true;
            }
        }
        r.sorted([end], [0, end]);
        if (!changed)
        {
            r.sorted(Array.from({ length: end }, (_, i) => i), [0, end]);
            return r.steps;
        }
    }
    if (a.length) r.sorted([0]);
    return r.steps;
}

export function insertion(input)
{
    const r = recorder(input);
    const { a } = r;
    for (let i = 1; i < a.length; i++)
    {
        let j = i;
        while (j > 0)
        {
            r.compare(j - 1, j, [0, i]);
            if (a[j - 1] <= a[j]) break;
            r.swap(j - 1, j, [0, i]);
            j--;
        }
    }
    r.sorted(a.map((_, i) => i));
    return r.steps;
}

export function merge(input)
{
    const r = recorder(input);
    const { a } = r;
    function divide(lo, hi)
    {
        if (lo >= hi) return;
        const mid = Math.floor((lo + hi) / 2);
        divide(lo, mid);
        divide(mid + 1, hi);
        const buffer = a.slice(lo, hi + 1);
        const range = [lo, hi];
        let i = lo;
        let j = mid + 1;
        let k = lo;
        while (i <= mid && j <= hi)
        {
            r.compare(i, j, range, undefined, [buffer[i - lo], buffer[j - lo]]);
            r.write(k++, buffer[i - lo] <= buffer[j - lo] ? buffer[i++ - lo] : buffer[j++ - lo], range);
        }
        while (i <= mid) r.write(k++, buffer[i++ - lo], range);
        while (j <= hi) r.write(k++, buffer[j++ - lo], range);
    }
    divide(0, a.length - 1);
    r.sorted(a.map((_, i) => i));
    return r.steps;
}

export function quick(input)
{
    const r = recorder(input);
    const { a } = r;
    function partition(lo, hi)
    {
        if (lo > hi) return;
        if (lo === hi)
        {
            r.sorted([lo], [lo, hi]);
            return;
        }
        const range = [lo, hi];
        const pivot = a[hi];
        let store = lo;
        for (let j = lo; j < hi; j++)
        {
            r.compare(j, hi, range, hi);
            if (a[j] < pivot)
            {
                if (store !== j) r.swap(store, j, range, hi);
                store++;
            }
        }
        if (store !== hi) r.swap(store, hi, range, hi);
        r.sorted([store], range);
        partition(lo, store - 1);
        partition(store + 1, hi);
    }
    partition(0, a.length - 1);
    return r.steps;
}

export function heap(input)
{
    const r = recorder(input);
    const { a } = r;
    function siftDown(root, size)
    {
        const range = [0, size - 1];
        while (2 * root + 1 < size)
        {
            let child = 2 * root + 1;
            if (child + 1 < size)
            {
                r.compare(child, child + 1, range);
                if (a[child + 1] > a[child]) child++;
            }
            r.compare(root, child, range);
            if (a[root] >= a[child]) return;
            r.swap(root, child, range);
            root = child;
        }
    }
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) siftDown(i, a.length);
    for (let end = a.length - 1; end >= 1; end--)
    {
        r.swap(0, end, [0, end]);
        r.sorted([end], [0, end]);
        siftDown(0, end);
    }
    if (a.length) r.sorted([0]);
    return r.steps;
}

export const algorithms = { bubble, insertion, merge, quick, heap };
