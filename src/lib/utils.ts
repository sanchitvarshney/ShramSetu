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
  if (!joiningDate) return '0.0';

  const [startYear, startMonth] = joiningDate.split('-').map(Number);
  const startDate = new Date(startYear, startMonth - 1);

  let endDate: Date;

  if (!relievingDate || relievingDate === 'Present') {
    endDate = new Date(); // currently working
  } else {
    const [endYear, endMonth] = relievingDate.split('-').map(Number);
    endDate = new Date(endYear, endMonth - 1);
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '0.0';
  }

  const diffTime = endDate.getTime() - startDate.getTime();
  const years = diffTime / (1000 * 60 * 60 * 24 * 365.25);

  return years.toFixed(1);
};
