import React from 'react';
import { SelectOptionType } from '@/types/general';
import { isPlaceholderDisplayValue } from '@/lib/utils';

export const DetailRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-0">{children}</div>
);

export const SingleDetail = ({
  label,
  value,
}: {
  label: string;
  value?: string | false | SelectOptionType;
}) => {
  const display =
    value == null || value === ''
      ? '--'
      : typeof value === 'object' && value && !Array.isArray(value)
        ? ((value as { text?: string })?.text ?? '--')
        : String(value);
  if (isPlaceholderDisplayValue(display)) return null;
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-sm font-medium text-slate-500 shrink-0">
        {label}
      </span>
      <span className="text-sm text-slate-800 text-right break-words">
        {display}
      </span>
    </div>
  );
};
