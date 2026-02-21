import { format } from 'date-fns';

/** Shared input for worker basic-details update (no FormData) */
export interface WorkerUpdatePayloadInput {
  empId: string | undefined;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  maritalStatus: string;
  hobbies: string;
  panNo: string;
  bloodGroup: string;
  department: string;
  designation: string;
  aadhaar: string;
  dob?: Date | null;
  houseNoPresent?: string;
  colonyPresent?: string;
  cityPresent?: string;
  statePresent?: string;
  countryPresent?: string;
  pinCodePresent?: string;
  houseNoPermanent?: string;
  colonyPermanent?: string;
  cityPermanent?: string;
  statePermanent?: string;
  countryPermanent?: string;
  pinCodePermanent?: string;
}

/** Builds worker update payload as plain object (JSON). Use for basic-only or full update. */
export function buildWorkerUpdatePayload(
  input: WorkerUpdatePayloadInput,
  options?: { full?: boolean }
): Record<string, unknown> {
  const aadhaarDigits = (input.aadhaar ?? '').replace(/\s/g, '').trim();
  const payload: Record<string, unknown> = {
    empId: input.empId ?? '',
    firstName: input.firstName?.trim() ?? '',
    middleName: input.middleName?.trim() ?? '',
    lastName: input.lastName?.trim() ?? '',
    email: input.email?.trim() ?? '',
    mobile: input.mobile?.trim() ?? '',
    gender: input.gender?.trim() ?? '',
    maritalStatus: input.maritalStatus?.trim() ?? '',
    hobbies: input.hobbies?.trim() ?? '',
    panNo: input.panNo?.trim().toUpperCase() ?? '',
    bloodGroup: input.bloodGroup?.trim() ?? '',
    department: input.department?.trim() ?? '',
    designation: input.designation?.trim() ?? '',
    dob: input.dob ? format(input.dob, 'dd/MM/yyyy') : null,
    aadhaar: aadhaarDigits,
  };

  if (options?.full) {
    payload.houseNoPresent = input.houseNoPresent?.trim() ?? '';
    payload.colonyPresent = input.colonyPresent?.trim() ?? '';
    payload.cityPresent = input.cityPresent?.trim() ?? '';
    payload.statePresent = input.statePresent?.trim() ?? '';
    payload.countryPresent = input.countryPresent?.trim() ?? '';
    payload.pinCodePresent = input.pinCodePresent?.trim() ?? '';
    payload.houseNoPermanent = input.houseNoPermanent?.trim() ?? '';
    payload.colonyPermanent = input.colonyPermanent?.trim() ?? '';
    payload.cityPermanent = input.cityPermanent?.trim() ?? '';
    payload.statePermanent = input.statePermanent?.trim() ?? '';
    payload.countryPermanent = input.countryPermanent?.trim() ?? '';
    payload.pinCodePermanent = input.pinCodePermanent?.trim() ?? '';
    payload.childCount = '';
    payload.childData = [];
    payload.identificationMark = '';
    payload.spouse = '';
    payload.fatherName = '';
    payload.motherName = '';
    payload.districtPermanent = '';
    payload.companyData = [];
    payload.educationData = [];
    payload.bankDetail = { bankName: '', accountNo: '', ifsCode: '' };
    payload.empFamilyKey = 'Chandra';
    payload.esi = '';
    payload.uan = '';
  }

  return payload;
}
