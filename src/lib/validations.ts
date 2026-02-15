import { z } from 'zod';

// ─── Reusable field schemas ─────────────────────────────────────────────
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const mobileSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[6-9]\d{9}$|^\+?[\d\s-]{10,15}$/, 'Please enter a valid 10-digit mobile number');

const panSchema = z
  .string()
  .min(1, 'PAN number is required')
  .regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, 'PAN must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)');

const websiteSchema = z
  .string()
  .min(1, 'Website is required')
  .url('Please enter a valid URL (e.g. https://example.com)');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(32, 'Password must be at most 32 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const pinCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Pin code must be 6 digits');

const optionalGstSchema = z
  .string()
  .optional()
  .refine((v) => !v || /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d][A-Z]\d{4}$/i.test(v), 'Invalid GST format');

/**
 * Validates Aadhaar number: exactly 12 digits, only digits, and not the disallowed test number.
 * Use everywhere Aadhaar is accepted or validated.
 */
export function isValidAadhaar(aadhaarNumber: string | undefined | null): boolean {
  if (aadhaarNumber == null) return false;
  const reg = /^\d+$/;
  const disallowedAadhaar = '123412341234';
  const uid = aadhaarNumber.trim().replace(/\s+/g, '');

  // Check if Aadhaar number is 12 digits and contains only digits
  if (uid.length === 12 && reg.test(uid)) {
    if (disallowedAadhaar === uid) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

/** Aadhaar: optional. When provided, must pass isValidAadhaar (12 digits only, not disallowed). */
const aadhaarOptionalSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      const trimmed = (v ?? '').trim().replace(/\s/g, '');
      return trimmed === '' || isValidAadhaar(v ?? '');
    },
    { message: 'Aadhaar must be exactly 12 digits and cannot be the disallowed test number' },
  );

// ─── Form schemas ───────────────────────────────────────────────────────

/** HSN: optional array. When provided, each item must be 2, 4, 6 or 8 digits. */
const hsnArrayOptionalSchema = z
  .array(z.string())
  .optional()
  .refine(
    (arr) => {
      if (!arr || arr.length === 0) return true;
      const nonEmpty = arr.map((s) => s.trim().replace(/\s/g, '')).filter(Boolean);
      return nonEmpty.every((d) => /^\d+$/.test(d) && [2, 4, 6, 8].includes(d.length));
    },
    { message: 'Each HSN must be 2, 4, 6 or 8 digits' },
  );

/** SSC: optional array. When provided, each item max 20 chars, alphanumeric, / and -. */
const sscArrayOptionalSchema = z
  .array(z.string())
  .optional()
  .refine(
    (arr) => {
      if (!arr || arr.length === 0) return true;
      const nonEmpty = arr.map((s) => s.trim()).filter(Boolean);
      return nonEmpty.every((s) => s.length <= 20 && /^[A-Za-z0-9\/\-]+$/.test(s));
    },
    { message: 'Each SSC must be at most 20 characters (letters, numbers, / and -)' },
  );

/** Add Company form */
export const addCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200, 'Company name is too long'),
  brandName: z.string().max(200, 'Brand name is too long').optional(),
  branchName: z.string().max(200, 'Branch name is too long').optional(),
  email: emailSchema,
  mobile: mobileSchema,
  panNo: panSchema,
  website: websiteSchema,
  hsn: hsnArrayOptionalSchema,
  ssc: sscArrayOptionalSchema,
});
export type AddCompanyFormData = z.infer<typeof addCompanySchema>;

/** Update Company form */
export const updateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200, 'Company name is too long'),
  branchName: z.string().max(200, 'Branch name is too long').optional(),
  brandName: z.string().max(200, 'Brand name is too long').optional(),
  email: emailSchema,
  mobile: mobileSchema,
  panNo: panSchema,
  website: websiteSchema,
  hsn: hsnArrayOptionalSchema,
  ssc: sscArrayOptionalSchema,
});
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;

/** Add Worker form */
export const addWorkerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
    middleName: z.string().max(100).optional(),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
    email: emailSchema,
    dob: z.any().refine((v) => v != null && !isNaN(new Date(v).getTime()), 'Date of birth is required'),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    mobile: mobileSchema,
    gender: z.enum(['M', 'F'], { required_error: 'Gender is required' }),
    aadhaarNo: aadhaarOptionalSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type AddWorkerFormData = z.infer<typeof addWorkerSchema>;

/** Add Client form */
export const addClientSchema = z.object({
  branch: z.string().min(1, 'Please select a branch'),
  firstName: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
  email: emailSchema,
  mobile: mobileSchema,
  password: passwordSchema,
});
export type AddClientFormData = z.infer<typeof addClientSchema>;

/** Update Branch form */
export const updateBranchSchema = z.object({
  branchName: z.string().min(1, 'Branch name is required').max(200, 'Branch name is too long'),
  email: emailSchema,
  mobile: mobileSchema,
  gstNo: optionalGstSchema,
  industry: z.string().min(1, 'Industry is required'),
  subIndustry: z.string().optional(),
  pinCode: pinCodeSchema,
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City/Area is required'),
});
export type UpdateBranchFormData = z.infer<typeof updateBranchSchema>;

/** Login form */
export const loginSchema = z.object({
  userName: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

/** Change/Set password form */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be 8–16 characters')
      .max(16, 'Password must be 8–16 characters')
      .regex(/[A-Z]/, 'At least one uppercase letter')
      .regex(/\d/, 'At least one number')
      .regex(/[^A-Za-z0-9]/, 'At least one special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password do not match',
    path: ['confirmPassword'],
  });
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/** Job form (Add/Edit) */
export const jobFormSchema = z
  .object({
    company: z.string().min(1, 'Company is required'),
    branch: z.string().optional(),
    jobType: z.string().min(1, 'Job type is required'),
    jobTitle: z.string().min(1, 'Job title is required').max(200, 'Job title is too long'),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    minSalary: z.number().min(0, 'Minimum salary must be 0 or more'),
    maxSalary: z.number().min(0, 'Maximum salary must be 0 or more'),
    experience: z.string().min(1, 'Experience is required'),
    jobStatus: z.string().min(1, 'Job status is required'),
    address: z.string().min(1, 'Address is required'),
    skills: z.string().min(1, 'Skills are required'),
    qualification: z.string().min(1, 'Qualification is required'),
    jobDescription: z.string().optional(),
    facilities: z.string().min(1, 'Facilities are required'),
  })
  .refine((data) => data.maxSalary >= data.minSalary, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['maxSalary'],
  });
export type JobFormData = z.infer<typeof jobFormSchema>;

/** Helper: run a schema and return first error message or null */
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; message: string } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  const first = result.error.flatten().fieldErrors;
  const firstKey = Object.keys(first)[0];
  const msg = firstKey && first[firstKey as keyof typeof first]?.[0];
  return { success: false, message: (msg as string) || 'Invalid data' };
}
