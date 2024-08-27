import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Edit, X } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { fetchWorkerDetails } from '@/features/admin/adminPageSlice';
import { SelectOptionType } from '@/types/general';
import { cn } from '@/lib/utils';
import { differenceInDays, parse } from 'date-fns';
import { Link } from 'react-router-dom';
import Loading from '@/components/reusable/Loading';
import { getCV } from '@/features/homePage/homePageSlice';

interface WorkerDetailsProps {
  empId: string;
  toggleDetails: (empId?: string) => void;
  showEdit?: boolean;
}

const WorkerDetails: React.FC<WorkerDetailsProps> = ({
  empId,
  toggleDetails,
  showEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { workerInfo, loading } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const { loading: loading2 } = useSelector(
    (state: RootState) => state.homePage,
  );

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
    <Card className="h-full w-full">
      {loading || loading2 ? <Loading /> : null}
      <CardHeader className="flex py-0 flex-row justify-between items-center">
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
                    className="mt-2 group-hover:text-white text-black"
                  />
                }
              />
            </Link>
          )}
          <IconButton
            onClick={handleDownload}
            color="text-primary"
            tooltip="Download CV"
            icon={<Download />}
          />
          <IconButton
            onClick={() => toggleDetails()}
            hoverBackground="hover:bg-transparent"
            hoverColor="hover:text-black"
            icon={<X />}
          />
        </div>
      </CardHeader>
      {workerInfo && (
        <CardContent className="flex flex-col gap-2 h-full overflow-auto">
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
          {/* {workerInfo?.educationInfo && <EducationDetails details={workerInfo} />} */}
          {workerInfo?.companyInfo && (
            <EmployementDetails details={workerInfo} />
          )}
        </CardContent>
      )}
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
      <strong>{label}</strong>
      <p>{typeof value === 'object' ? value?.text : value ?? '--'}</p>
    </div>
  );
};
const BasicDetails = ({ details }: { details: any }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg py-0 my-0 text-primary">
          Basic Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DetailRow>
          <SingleDetail label="First Name" value={details?.firstName} />
          <SingleDetail label="Last Name" value={details?.lastName} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="DOB" value={details?.dob} />
          <SingleDetail
            label="Gender"
            value={typeof details?.gender === 'object' && details?.gender.text}
          />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Adhaar Number" value={details?.aadhaarNo} />
          <SingleDetail label="Phone" value={details?.mobile} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="E-mail" value={details?.email} />
          {/* <SingleDetail label="Phone" value={details.basic?.phone} /> */}
        </DetailRow>
      </CardContent>
    </Card>
  );
};

const CurrentAddress = ({ details }: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg py-0 my-0 text-primary">
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
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg py-0 my-0 text-primary">
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
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg py-0 my-0 text-primary">
          Employments
        </CardTitle>
        <p className="text-lg font-muted-foreground">
          {details.companyInfo?.length} Found
        </p>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-hidden flex pb-10">
        <div className="flex flex-col w-full overflow-y-scroll px-2 max-h-full">
          {details.companyInfo?.map((emp: any, index: any) => (
            <div
              className={cn(
                'px-4 py-3 rounded-lg',
                index % 2 === 0 && 'bg-muted',
              )}
            >
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
