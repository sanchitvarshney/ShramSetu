import { type ClassValue, clsx } from 'clsx';
import { format, parse } from 'date-fns';
import { twMerge } from 'tailwind-merge';

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

/** Capitalize the first letter of every word (e.g. "john doe" → "John Doe"). */
export function capitalizeName(value: string): string {
  if (!value.trim()) return value;
  return value
    .split(/\s+/)
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
