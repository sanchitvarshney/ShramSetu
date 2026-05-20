import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Label style for worker detail inline edit forms */
export const EDIT_FIELD_LABEL =
  'text-xs font-medium text-slate-600 leading-none block';

/** Standard responsive grid for edit sections (3 columns on large screens) */
export const EDIT_FORM_GRID =
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 items-start';

/** Two-column grid for address, bank, and similar sections */
export const EDIT_FORM_GRID_2 =
  'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 items-start';

/** Reserved space for validation hints so rows stay aligned */
export const EDIT_FIELD_HINT =
  'text-xs mt-1 min-h-[1rem] leading-tight';

export function EditField({
  label,
  htmlFor,
  className,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('min-w-0 space-y-1.5', className)}>
      <Label htmlFor={htmlFor} className={EDIT_FIELD_LABEL}>
        {label}
      </Label>
      {children}
      {hint !== undefined ? (
        <div className={EDIT_FIELD_HINT}>{hint}</div>
      ) : null}
    </div>
  );
}
