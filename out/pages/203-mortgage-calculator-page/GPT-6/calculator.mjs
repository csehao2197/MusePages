export function payment(principal, annualRate, years)
{
    const months = years * 12;
    const rate = annualRate / 1200;
    return principal === 0 ? 0 : rate === 0 ? principal / months : principal * rate / (1 - (1 + rate) ** -months);
}

export function amortize(principal, annualRate, years, extra = 0, lump = 0)
{
    const scheduled = payment(principal, annualRate, years);
    let balance = Math.max(0, principal - lump);
    let totalInterest = 0;
    const rows = [];
    for (let month = 1; balance > 0.000001 && month <= years * 12; month++)
    {
        const interest = balance * annualRate / 1200;
        const amount = Math.min(balance + interest, scheduled + extra);
        const paidPrincipal = amount - interest;
        balance = Math.max(0, balance - paidPrincipal);
        totalInterest += interest;
        rows.push({ month, payment: amount, principal: paidPrincipal, interest, balance });
    }
    return { rows, totalInterest, months: rows.length, scheduled, total: principal + totalInterest };
}
