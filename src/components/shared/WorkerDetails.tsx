import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Download, Edit, X } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { fetchWorkerDetails } from '@/features/admin/adminPageSlice';
import { SelectOptionType } from '@/types/general';
import { cn } from '@/lib/utils';
import { differenceInDays, parse } from 'date-fns';
import { Link } from 'react-router-dom';
// import Loading from '@/components/reusable/Loading';
import { getCV } from '@/features/homePage/homePageSlice';
// import CustomTooltip from '../reusable/CustomTooltip';
import { Button } from '../ui/button';

interface WorkerDetailsProps {
  empId: string;
  toggleDetails: (empId?: string) => void;
  showEdit?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkerDetails: React.FC<WorkerDetailsProps> = ({
  empId,
  setOpen,
  showEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { workerInfo } = useSelector((state: RootState) => state.adminPage);

  useEffect(() => {
    dispatch(fetchWorkerDetails(empId));
  }, [empId]);

  const handleDownload = () => {
    dispatch(getCV(empId)).then((response: any) => {
      if (response.payload.success) {
        window.open(response?.payload?.data, '_blank');
      }
    });
  };

  return (
    <Card className="relative w-full h-[calc(100vh-230px)] border-none shadow-none flex flex-col">
      {/* {loading || loading2 ? <Loading /> : null} */}
      <CardHeader className="flex flex-row items-center justify-between py-0 bg-muted h-[50px] border-b">
        <CardTitle>Worker Details</CardTitle>
        <div className="flex items-center gap-2">
          {showEdit && (
            <Link target="_blank" to={`/employee-update/:${empId}`}>
              <IconButton
                color="text-primary"
                tooltip="Update Worker"
                icon={
                  <Edit
                    size={20}
                    className="mt-2 text-black group-hover:text-white"
                  />
                }
              />
            </Link>
          )}
          <Button
            title="Download CV"
            onClick={handleDownload}
            variant={'outline'}
            className="p-0 bg-transparent border-none hover:bg-transparent"
          >
            <Download className="h-[20px] w-[20px] text-slate-500" />
          </Button>
          <IconButton
            onClick={() => setOpen && setOpen(false)}
            hoverBackground="hover:bg-transparent"
            hoverColor="hover:text-black"
            icon={<X />}
          />
        </div>
      </CardHeader>
      {workerInfo && (
        <CardContent className="flex-grow overflow-y-auto p-[20px]">
          {workerInfo?.basicInfo && (
            <BasicDetails details={workerInfo?.basicInfo} />
          )}
          {workerInfo?.basicInfo && (
            <div className="grid grid-cols-2 gap-2">
              {workerInfo?.basicInfo?.presentAddress && (
                <CurrentAddress
                  details={workerInfo?.basicInfo?.presentAddress}
                />
              )}
              {workerInfo?.basicInfo?.permanentAddress && (
                <PermanentAddress
                  details={workerInfo?.basicInfo?.permanentAddress}
                />
              )}
            </div>
          )}
          {workerInfo?.companyInfo && (
            <EmployementDetails details={workerInfo} />
          )}
          {workerInfo?.bankDetails && (
            <BankDetails details={workerInfo?.bankDetails} />
          )}
        </CardContent>
      )}
      <div className="flex justify-end p-2 bg-white">
        <Button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 me-2">
          <X className="h-[18px] w-[18px] pr-2px" /> Reject
        </Button>
        <Button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5">
          <Check className="h-[18px] w-[18px] pr-2px" />
          Approve
        </Button>
      </div>
    </Card>
  );
};

export default WorkerDetails;

const DetailRow = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-2 gap-4 my-2">{children}</div>;
};

const SingleDetail = ({
  label,
  value,
}: {
  label: string;
  value?: string | false | SelectOptionType;
}) => {
  return (
    <div className="flex justify-between">
      <p className="font-[500]">{label}</p>
      <p>{typeof value === 'object' ? value?.text : value ?? '--'}</p>
    </div>
  );
};
const BasicDetails = ({ details }: { details: any }) => {
  const { workerInfo } = useSelector((state: RootState) => state.adminPage);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="py-0 my-0 text-lg text-primary">
          Basic Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DetailRow>
          <SingleDetail label="First Name" value={details?.firstName} />
          <SingleDetail label="Last Name" value={details?.lastName} />
        </DetailRow>
        <DetailRow>
          <SingleDetail
            label="Father's Name"
            value={workerInfo?.familyInfo?.fatherName}
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="py-0 my-0 text-lg text-primary">
          Current Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <SingleDetail label="House No." value={details?.houseNoPresent} />
          <SingleDetail label="Area" value={details?.colonyPresent} />
          <SingleDetail label="State" value={details?.statePresent} />
          <SingleDetail label="City" value={details?.cityPresent} />
          <SingleDetail label="District" value={details?.districtPresent} />
          <SingleDetail label="Pin Code" value={details.pincodePresent} />
        </div>
      </CardContent>
    </Card>
  );
};
const PermanentAddress = ({ details }: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="py-0 my-0 text-lg text-primary">
          Permanent Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <SingleDetail label="House No." value={details?.houseNoPermanent} />
          <SingleDetail label="Area" value={details?.colonyPermanent} />
          <SingleDetail label="District" value={details?.districtPermanent} />
          <SingleDetail label="City" value={details?.cityPermanent} />
          <SingleDetail label="District" value={details?.districtPermanent} />
          <SingleDetail label="Pin Code" value={details?.pincodePermanent} />
        </div>
      </CardContent>
    </Card>
  );
};

const EmployementDetails = ({ details }: any) => {
  const calculateExperience = (joiningDate: string, relievingDate: string) => {
    const format = 'dd-MM-yyyy'; // Your date format
    const startDate = parse(joiningDate, format, new Date());
    const endDate = parse(relievingDate, format, new Date());

    // Calculate the difference in days
    const daysDifference = differenceInDays(endDate, startDate);

    // Convert days to years (1 year ≈ 365.25 days)
    const yearsDifference = daysDifference / 365.25;

    return yearsDifference.toFixed(1); // Return with one decimal place
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="py-0 my-0 text-lg text-primary">
          Employments
        </CardTitle>
        <p className="text-lg font-muted-foreground">
          {details.companyInfo?.length} Found
        </p>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-hidden flex pb-10">
        <div className="flex flex-col w-full max-h-full px-2 overflow-y-auto gap-2">
          {details?.companyInfo?.map((emp: any) => (
            <div className={cn('px-4 py-3 rounded-lg border-2')}>
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

const BankDetails = ({ details }: any) => {
  const { workerInfo } = useSelector((state: RootState) => state.adminPage);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="py-0 my-0 text-lg text-primary">
          Bank details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <SingleDetail label="Bank Name" value={details?.bankName} />
          <SingleDetail label="Account Number" value={details?.accountNo} />
          <SingleDetail label="IFSC Code" value={details?.ifsCode} />
          <SingleDetail label="ESI" value={workerInfo?.basicInfo?.esi} />
          <SingleDetail label="UAN" value={workerInfo?.basicInfo?.uan} />
        </div>
      </CardContent>
    </Card>
  );
};
