export function parseDOB(val: string | undefined): Date | null {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/[-/.]/);
  if (parts.length === 3) {
    const [a, b, c] = parts;
    const day = parseInt(a, 10);
    const month = parseInt(b, 10) - 1;
    const year = parseInt(c, 10);
    if (!isNaN(year) && year > 1900 && year < 2100) {
      const d = new Date(year, isNaN(month) ? 0 : month, isNaN(day) ? 1 : day);
      if (!isNaN(d.getTime())) return d;
    }
  }
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}
