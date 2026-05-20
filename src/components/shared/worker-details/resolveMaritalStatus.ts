import { marriedStatus } from '@/types/general';

const CODE_ALIASES: Record<string, string> = {
  M: 'M',
  MARRIED: 'M',
  U: 'U',
  UM: 'U',
  UNMARRIED: 'U',
  W: 'W',
  WIDOWED: 'W',
  D: 'D',
  DIVORCED: 'D',
};

/** Normalize API / worker object marital status to a Select option value (M, U, W, D). */
export function resolveMaritalStatusSelectValue(raw: unknown): string {
  if (raw == null) return '';

  let str = '';
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const o = raw as { value?: string; text?: string };
    str = String(o.value ?? o.text ?? '').trim();
  } else {
    str = String(raw).trim();
  }
  if (!str) return '';

  const upper = str.toUpperCase();
  if (CODE_ALIASES[upper]) return CODE_ALIASES[upper];

  const byValue = marriedStatus.find((opt) => opt.value.toUpperCase() === upper);
  if (byValue) return byValue.value;

  const byText = marriedStatus.find((opt) => opt.text.toUpperCase() === upper);
  if (byText) return byText.value;

  return str;
}

/** Read marital status from a flat worker details object or nested API shape. */
export function getMaritalStatusFromDetails(details: Record<string, unknown> | null | undefined): unknown {
  if (!details) return '';
  const personal = details.personalDetails as Record<string, unknown> | undefined;
  const basic = details.basicDetails as Record<string, unknown> | undefined;
  return (
    details.empMaritalStatus ??
    details.empMaritalstatus ??
    details.maritalStatus ??
    personal?.empMaritalStatus ??
    personal?.empMaritalstatus ??
    personal?.maritalStatus ??
    basic?.maritalStatus ??
    ''
  );
}
