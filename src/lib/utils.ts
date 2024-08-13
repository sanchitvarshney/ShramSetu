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
