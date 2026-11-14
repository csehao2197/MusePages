export function formatDate(value, locale = 'en-US') {
  const date = new Date(value + 'T12:00:00Z');
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium', timeZone: 'UTC'
  }).format(date);
}

console.log(formatDate("2026-11-12"));
