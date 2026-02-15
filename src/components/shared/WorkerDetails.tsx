import React from 'react';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// import IconButton from '@/components/ui/IconButton';
import { SelectOptionType } from '@/types/general';
import { cn } from '@/lib/utils';
import { differenceInDays, parse } from 'date-fns';
// import { Link } from 'react-router-dom';
// import { getCV } from '@/features/homePage/homePageSlice';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface WorkerDetailsProps {
  worker: any;
  toggleDetails?: (id?: string) => void;
  showEdit?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleStatus?: (status: 'APR' | 'REJ') => void;
}

const isFlatEmployee = (data: any): boolean =>
  data != null && typeof data === 'object' && ('empFirstName' in data || 'firstName' in data) && !('basicInfo' in data);

// const getEmployeeId = (worker: any): string | undefined =>
//   typeof worker === 'string' ? worker : worker?.employeeID ?? worker?.empId;

const WorkerDetails: React.FC<WorkerDetailsProps> = ({
  worker,
  // showEdit,
  open,
  onOpenChange,
}) => {
  // const dispatch = useDispatch<AppDispatch>();
  // const employeeId = getEmployeeId(worker);
  const flat = isFlatEmployee(worker);

  // const handleDownload = () => {
  //   if (!employeeId) return;
  //   dispatch(getCV(employeeId)).then((response: any) => {
  //     if (response.payload?.success) {
  //       window.open(response.payload.data, '_blank');
  //     }
  //   });
  // };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex flex-col h-full w-full max-w-4xl sm:min-w-[560px] p-0 gap-0 overflow-hidden"
        onInteractOutside={(e: any) => e.preventDefault()}
      >
        {/* Fixed header */}
        <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 py-4 border-b bg-slate-50/80">
          <SheetTitle className="text-lg font-semibold text-slate-800">
            Worker Details
          </SheetTitle>
          {/* <div className="flex items-center gap-2">
            {showEdit && employeeId && (
              <Link target="_blank" to={`/employee-update/:${employeeId}`}>
                <IconButton
                  color="text-primary"
                  tooltip="Update Worker"
                  icon={<Edit size={18} className="mt-0.5 text-slate-600" />}
                />
              </Link>
            )}
            <Button
              title="Download CV"
              onClick={handleDownload}
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-600 hover:text-slate-800"
            >
              <Download className="h-[18px] w-[18px]" />
            </Button>
          </div> */}
        </SheetHeader>

        {/* Scrollable middle */}
        {worker ? (
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-slate-50/40">
            <div className="space-y-5 pb-4">
              {flat ? (
                <>
                  <BasicDetailsFlat details={worker} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CurrentAddressFlat details={worker} />
                    <PermanentAddressFlat details={worker} />
                  </div>
                  <EmployementDetails details={{ companyInfo: worker.companyInfo ?? null }} />
                  {worker.bankDetails && (
                    <BankDetails details={worker.bankDetails} worker={worker} />
                  )}
                </>
              ) : (
                <>
                  {worker.basicInfo && (
                    <BasicDetails details={worker.basicInfo} empId={worker} />
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {worker.basicInfo?.presentAddress && (
                      <CurrentAddress details={worker.basicInfo.presentAddress} />
                    )}
                    {worker.basicInfo?.permanentAddress && (
                      <PermanentAddress details={worker.basicInfo.permanentAddress} />
                    )}
                  </div>
                  {worker.companyInfo && <EmployementDetails details={worker} />}
                  {worker.bankDetails && (
                    <BankDetails details={worker.bankDetails} worker={worker} />
                  )}
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* Fixed bottom
        <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t bg-white">
          <Button
            variant="outline"
            className="rounded-full border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            onClick={() => handleStatus?.('REJ')}
          >
            <X className="h-4 w-4 mr-1.5" /> Reject
          </Button>
          <Button
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleStatus?.('APR')}
          >
            <Check className="h-4 w-4 mr-1.5" /> Approve
          </Button>
        </div> */}
      </SheetContent>
    </Sheet>
  );
};
export default WorkerDetails;

const DetailRow = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-0">{children}</div>;
};

const SingleDetail = ({
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
        ? (value as { text?: string })?.text ?? '--'
        : String(value);
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-sm font-medium text-slate-500 shrink-0">{label}</span>
      <span className="text-sm text-slate-800 text-right break-words">{display}</span>
    </div>
  );
};

const BasicDetailsFlat = ({ details }: { details: any }) => {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-slate-800">
          Basic Details
        </CardTitle>
        {details?.empPhoto && (
          <img
            src={details.empPhoto}
            alt="No Image"
            className="h-16 w-16 rounded-full object-cover border-2 border-slate-200"
          />
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        <DetailRow>
          <SingleDetail label="First Name" value={details?.empFirstName} />
          <SingleDetail label="Middle Name" value={details?.empMiddleName} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Last Name" value={details?.empLastName} />
          <SingleDetail label="DOB" value={details?.empDOB} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Gender" value={details?.empGender === 'M' ? 'Male' : details?.empGender === 'F' ? 'Female' : details?.empGender} />
          <SingleDetail label="Phone" value={details?.empMobile} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Email" value={details?.empEmail} />
          <SingleDetail label="Marital Status" value={details?.MaritalStatus === 'M' ? 'Married' : details?.MaritalStatus === 'UM' ? 'Unmarried' : details?.MaritalStatus} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Hobbies" value={details?.empHobbies} />
          <SingleDetail label="Inserted At" value={details?.empInsertedAt} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Aadhaar Number" value={details?.empAadhaarNo} />
          <SingleDetail
            label="PAN Number"
            value={
              details?.empPanNo
                ? String(details.empPanNo).toUpperCase()
                : details?.empPanNo
            }
          />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Blood Group" value={details?.empBloodGroup} />
          <SingleDetail label="Department" value={details?.empDepartment} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Designation" value={details?.empDesignation} />
        </DetailRow>
      </CardContent>
    </Card>
  );
};

const CurrentAddressFlat = ({ details }: { details: any }) => {
  const hasAny =
    details?.present_houseNo ||
    details?.present_colony ||
    details?.present_city ||
    details?.present_state ||
    details?.present_country ||
    details?.present_pincode;
  if (!hasAny) return null;
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Current Address
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail label="House No." value={details?.present_houseNo} />
          <SingleDetail label="Colony" value={details?.present_colony} />
          <SingleDetail label="City" value={details?.present_city} />
          <SingleDetail label="State" value={details?.present_state} />
          <SingleDetail label="Country" value={details?.present_country} />
          <SingleDetail label="Pin Code" value={details?.present_pincode} />
        </div>
      </CardContent>
    </Card>
  );
};

const PermanentAddressFlat = ({ details }: { details: any }) => {
  const hasAny =
    details?.cityPermanent ||
    details?.districtPermanent ||
    (typeof details?.statePermanent === 'object' && details?.statePermanent?.text) ||
    details?.countryPermanent;
  if (!hasAny) return null;
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Permanent Address
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail label="State" value={details?.statePermanent} />
          <SingleDetail label="City" value={details?.cityPermanent} />
          <SingleDetail label="District" value={details?.districtPermanent} />
          <SingleDetail label="Country" value={details?.countryPermanent} />
        </div>
      </CardContent>
    </Card>
  );
};

const BasicDetails = ({ details, empId }: { details: any; empId: any }) => {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Basic Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        <DetailRow>
          <SingleDetail label="First Name" value={details?.firstName} />
          <SingleDetail label="Last Name" value={details?.lastName} />
        </DetailRow>
        <DetailRow>
          <SingleDetail
            label="Father's Name"
            value={empId?.familyInfo?.fatherName}
          />
          <SingleDetail label="DOB" value={details?.dob} />
        </DetailRow>
        <DetailRow>
          <SingleDetail
            label="Gender"
            value={typeof details?.gender === 'object' && details?.gender.text}
          />
          <SingleDetail label="Phone" value={details?.mobile} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Adhaar Number" value={details?.aadhaarNo} />
          <SingleDetail label="E-mail" value={details?.email} />
        </DetailRow>
      </CardContent>
    </Card>
  );
};

const CurrentAddress = ({ details }: any) => {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Current Address
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail label="House No." value={details?.houseNoPresent} />
          <SingleDetail label="Area" value={details?.colonyPresent} />
          <SingleDetail label="State" value={details?.statePresent} />
          <SingleDetail label="City" value={details?.cityPresent} />
          <SingleDetail label="District" value={details?.districtPresent} />
          <SingleDetail label="Pin Code" value={details?.pincodePresent} />
        </div>
      </CardContent>
    </Card>
  );
};
const PermanentAddress = ({ details }: any) => {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Permanent Address
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail label="House No." value={details?.houseNoPermanent} />
          <SingleDetail label="Area" value={details?.colonyPermanent} />
          <SingleDetail label="District" value={details?.districtPermanent} />
          <SingleDetail label="City" value={details?.cityPermanent} />
          <SingleDetail label="Pin Code" value={details?.pincodePermanent} />
        </div>
      </CardContent>
    </Card>
  );
};

const EmployementDetails = ({ details }: any) => {
  const calculateExperience = (joiningDate: string, relievingDate: string) => {
    const format = 'dd-MM-yyyy';
    const startDate = parse(joiningDate, format, new Date());
    const endDate = parse(relievingDate, format, new Date());
    const daysDifference = differenceInDays(endDate, startDate);
    const yearsDifference = daysDifference / 365.25;
    return yearsDifference.toFixed(1);
  };

  const list = details?.companyInfo ?? [];
  const hasList = Array.isArray(list) && list.length > 0;
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Employments
        </CardTitle>
        <span className="text-sm text-slate-500">
          {hasList ? `${list.length} found` : 'No employment details'}
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {hasList && list.map((emp: any, i: number) => (
            <div key={i} className={cn('px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50')}>
              <SingleDetail label="Company" value={emp?.companyName} />
              <SingleDetail label="Industry" value={emp?.industry} />
              <DetailRow>
                <SingleDetail label="Joined on" value={emp?.joiningDate} />
                <SingleDetail
                  label="Releived on"
                  value={emp?.relievingDate ?? '--'}
                />
              </DetailRow>
              <DetailRow>
                <SingleDetail
                  label="Role"
                  value={typeof emp.role === 'object' ? emp?.role?.text : '--'}
                />
                {emp?.joiningDate && emp?.relievingDate && (
                  <SingleDetail
                    label="Experience"
                    value={`${calculateExperience(
                      emp.joiningDate,
                      emp.relievingDate,
                    )} years`}
                  />
                )}
              </DetailRow>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const BankDetails = ({ details, worker }: { details: any; worker?: any }) => {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Bank details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail label="Bank Name" value={details?.bankName} />
          <SingleDetail label="Account Number" value={details?.accountNo} />
          <SingleDetail label="IFSC Code" value={details?.ifsCode} />
          <SingleDetail label="ESI" value={worker?.basicInfo?.esi ?? details?.esi} />
          <SingleDetail label="UAN" value={worker?.basicInfo?.uan ?? details?.uan} />
        </div>
      </CardContent>
    </Card>
  );
};
