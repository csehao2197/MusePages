export function simulate({ monthly, ratePct, years, perYear = 12 })
{
    if (![monthly, ratePct, years, perYear].every(Number.isFinite) ||
        monthly < 0 || ratePct < 0 || !Number.isInteger(years) || years < 0 ||
        ![1, 4, 12, 365].includes(perYear))
    {
        throw new RangeError("Expected nonnegative deposits, rate and whole years, and a supported frequency.");
    }
    const i = Math.expm1((perYear / 12) * Math.log1p(ratePct / 100 / perYear));
    const rows = [{ year: 0, deposits: 0, interest: 0, balance: 0 }];
    let balance = 0;
    for (let month = 1; month <= years * 12; month++)
    {
        balance = balance * (1 + i) + monthly;
        if (month % 12 === 0)
        {
            const deposits = monthly * month;
            rows.push({ year: month / 12, deposits, interest: Math.max(0, balance - deposits), balance });
        }
    }
    return rows;
}

export function toReal(value, inflationPct, year)
{
    return value / (1 + inflationPct / 100) ** year;
}

export function crossoverYear(rows)
{
    return rows.find((row) => row.interest > row.deposits)?.year ?? null;
}

export function formulaBalance({ monthly, ratePct, years, perYear = 12 })
{
    const i = Math.expm1(perYear / 12 * Math.log1p(ratePct / 100 / perYear));
    return i === 0 ? monthly * 12 * years : monthly * Math.expm1(12 * years * Math.log1p(i)) / i;
}
