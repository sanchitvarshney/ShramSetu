import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { inputStyle } from '@/style/CustomStyles';
import { cn } from '@/lib/utils';

export interface LabeledFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /** Label text (e.g. "Enter Company Name") */
  label: string;
  /** Optional id for input and label htmlFor */
  id?: string;
  /** Extra class for the wrapper */
  wrapperClassName?: string;
  /** Extra class for the input (merged with inputStyle) */
  inputClassName?: string;
}

/**
 * Consistent field style: label on top, input below.
 * Uses inputStyle and flex flex-col gap-[10px].
 */
const LabeledField = React.forwardRef<HTMLInputElement, LabeledFieldProps>(
  (
    {
      label,
      id: idProp,
      wrapperClassName,
      inputClassName,
      ...inputProps
    },
    ref
  ) => {
    const id = idProp ?? `field-${label.replace(/\s/g, '-').toLowerCase()}`;
    return (
      <div className={cn('flex flex-col gap-[10px]', wrapperClassName)}>
        <Label htmlFor={id} className="gap-[10px]">
          {label}
        </Label>
        <Input
          ref={ref}
          id={id}
          className={cn(inputStyle, inputClassName)}
          {...inputProps}
        />
      </div>
    );
  }
);
LabeledField.displayName = 'LabeledField';

export { LabeledField };
