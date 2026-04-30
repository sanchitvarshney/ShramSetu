import { type ClassValue, clsx } from 'clsx';
import { format, parse } from 'date-fns';
import { twMerge } from 'tailwind-merge';

/** Inner string equals one of these after trim / quote-stripping → treat as "no value" for UI */
const PLACEHOLDER_INNER = new Set(['--', '\u2014', '\u2013']); // --, em dash, en dash

function stripOuterAsciiQuotes(s: string): string {
  let t = s.trim();
  for (let i = 0; i < 4; i += 1) {
    const quoted =
      (t.startsWith("'") && t.endsWith("'")) ||
      (t.startsWith('"') && t.endsWith('"'));
    if (!quoted) break;
    t = t.slice(1, -1).trim();
  }
  return t;
}

/**
 * True when a value should not be shown (missing data or API placeholders like `--`, `'--'`, `"--"`).
 * Also treats blank strings and typographic dashes used as empty markers (—, –).
 */
export function isPlaceholderDisplayValue(val: unknown): boolean {
  if (val == null) return true;
  if (
    typeof val === 'object' &&
    val !== null &&
    !Array.isArray(val) &&
    'text' in val
  ) {
    return isPlaceholderDisplayValue((val as { text?: unknown }).text);
  }
  if (typeof val === 'boolean') return false;
  const s = String(val).trim();
  if (s === '') return true;
  const inner = stripOuterAsciiQuotes(s);
  return PLACEHOLDER_INNER.has(inner);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | null): string => {
  return date ? format(date, 'dd-MM-yyyy') : 'Pick a date';
};

export const parseDated = (dateString: string | null): Date | null => {
  if (!dateString) return null;
  try {
    return parse(dateString, 'dd-MM-yyyy', new Date());
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};
export function capitalizeName(value: string): string {
  if (!value.trim()) return value;
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toProperCaseName(value: string): string {
  if (!value.trim()) return value;
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}


export const calculateExperience = (
  joiningDate?: string,
  relievingDate?: string
) => {
  if (!joiningDate) return '0 year 0 month';

  // Expected formats: "YYYY-MM" or "YYYY-MM-DD". We only care about year+month.
  const [startYearRaw, startMonthRaw] = joiningDate.split('-');
  const startYear = Number(startYearRaw);
  const startMonth = Number(startMonthRaw); // 1-12

  if (!startYear || !startMonth || startMonth < 1 || startMonth > 12) {
    return '0 year 0 month';
  }

  let endYear: number;
  let endMonth: number; // 1-12
  if (!relievingDate || relievingDate === 'Present') {
    const now = new Date();
    endYear = now.getFullYear();
    endMonth = now.getMonth() + 1;
  } else {
    const [endYearRaw, endMonthRaw] = relievingDate.split('-');
    endYear = Number(endYearRaw);
    endMonth = Number(endMonthRaw);
  }

  if (!endYear || !endMonth || endMonth < 1 || endMonth > 12) {
    return '0 year 0 month';
  }

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
  const safeMonths = Math.max(0, totalMonths);

  const years = Math.floor(safeMonths / 12);
  const months = safeMonths % 12;

  // Use wording exactly like "2 year 5 month" (no pluralization logic).
  return `${years} year ${months} month`;
};
