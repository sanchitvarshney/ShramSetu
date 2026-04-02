import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchApplicationDetails,
  clearApplicationDetails,
} from '@/features/jobFeatures/jobApplicationsSlice';
import WorkerDetails from '@/components/shared/WorkerDetails';

interface ApplicantDetailsDialogProps {
  appliedKey: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ApplicantDetailsApiResponse = {
  status?: string;
  personalDetails?: Record<string, any>;
  employeementDetails?: Array<Record<string, any>>;
  basicDetails?: Record<string, any>;
  educationDetails?: Array<Record<string, any>>;
  bankDetails?: Array<Record<string, any>>;
  // Some APIs may return these at root as well:
  [key: string]: any;
};

function normalizeApplicantToWorker(a: ApplicantDetailsApiResponse | null | undefined): any | undefined {
  if (!a) return undefined;
  const basic = a.basicDetails ?? a;
  const personal = a.personalDetails ?? {};
  const employments = a.employeementDetails ?? [];
  const education = a.educationDetails ?? [];
  const bank = a.bankDetails ?? [];

  const departmentName = basic?.departmentName ?? '';
  const designationName = basic?.designationName ?? '';

  return {
    // Employee identity (used by WorkerDetails for edit permission & photo fetch for PDF)
    empCode: basic?.empCode ?? a?.empCode ?? a?.key,

    // Basic DetailsFlat expects these fields on the root object:
    empFirstName: basic?.firstName ?? basic?.empFirstName ?? '',
    empMiddleName: basic?.middleName ?? '',
    empLastName: basic?.lastName ?? basic?.empLastName ?? '',
    empDOB: personal?.dob ?? personal?.empDOB ?? '',
    empGender: personal?.gender ?? personal?.empGender ?? '',
    empMobile: basic?.empPhone ?? basic?.empMobile ?? '',
    empEmail: basic?.empEmail ?? basic?.empEmail ?? '',
    empMaritalStatus:
      personal?.empMaritalStatus ?? personal?.empMaritalstatus ?? '',
    empHobbies: personal?.empHobbies ?? '',

    adhaar: basic?.adhaar ?? basic?.aadhaar ?? '',
    empPanNo: basic?.empPanNo ?? basic?.empPan ?? '',
    empPhoto: basic?.empPhoto ?? basic?.empPhotoUrl ?? undefined,

    // UI display
    department: departmentName,
    designation: designationName,

    // Resume generator uses *_Department / *_Designation
    empDepartment: departmentName,
    empDesignation: designationName,

    // Address fields (used by CurrentAddressFlat/PermanentAddressFlat)
    present_houseNo: personal?.present_houseNo ?? personal?.present_houseNo ?? '',
    present_colony: personal?.present_colony ?? '',
    present_city: personal?.present_city ?? '',
    present_district: personal?.present_district ?? '',
    present_state: personal?.present_state ?? '',
    present_pincode: personal?.present_pincode ?? '',

    perma_houseNo: personal?.perma_houseNo ?? '',
    perma_colony: personal?.perma_colony ?? '',
    perma_city: personal?.perma_city ?? '',
    perma_district: personal?.perma_district ?? '',
    perma_state: personal?.perma_state ?? '',
    perma_pincode: personal?.perma_pincode ?? '',

    // Employment/Education/Bank blocks
    companyInfo: Array.isArray(employments) ? employments : [],
    educationDetails: Array.isArray(education) ? education : [],
    bankDetails: Array.isArray(bank) ? bank : [],
    uan: bank?.[0]?.uan ?? undefined,
  };
}

export default function ApplicantDetailsDialog({
  appliedKey,
  open,
  onOpenChange,
}: ApplicantDetailsDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { applicationDetails, applicationDetailsLoading } = useSelector(
    (state: RootState) => state.jobApplications,
  );

  const worker = useMemo(() => {
    return normalizeApplicantToWorker(applicationDetails as any);
  }, [applicationDetails]);

  useEffect(() => {
    if (open && appliedKey) {
      dispatch(fetchApplicationDetails(appliedKey));
      return;
    }
    if (!open) {
      dispatch(clearApplicationDetails());
    }
  }, [open, appliedKey, dispatch]);

  return (
    <WorkerDetails
      worker={worker}
      showEdit={false}
      open={open}
      onOpenChange={onOpenChange}
      detailsLoading={applicationDetailsLoading}
      title="Applicant Details"
    />
  );
}

