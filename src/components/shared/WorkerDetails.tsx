import React from 'react';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// import IconButton from '@/components/ui/IconButton';
import { SelectOptionType } from '@/types/general';
import { calculateExperience, cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { DatePicker, DatePickerProps } from 'antd';
import { getLoggedInUserType } from '@/lib/routeAccess';
import {
  updateEmployeeDetails,
  updateWorkerProfile,
  updateEmployeeCurrentAddress,
  updateEmployeePermanentAddress,
  fetchDepartments,
  fetchDesignations,
  type Department,
  type Designation,
} from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import { inputStyle } from '@/style/CustomStyles';
import { capitalizeName } from '@/lib/utils';
import { isValidAadhaar, isValidPan } from '@/lib/validations';
import { buildWorkerUpdatePayload } from '@/lib/workerUpdatePayload';
import { AiOutlineUser } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { PiCreditCard } from 'react-icons/pi';
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

const parseDOB = (val: string | undefined): Date | null => {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/[-/.]/);
  if (parts.length === 3) {
    const [a, b, c] = parts;
    const day = parseInt(a, 10);
    const month = parseInt(b, 10) - 1;
    const year = parseInt(c, 10);
    if (!isNaN(year) && year > 1900 && year < 2100) {
      const d = new Date(year, isNaN(month) ? 0 : month, isNaN(day) ? 1 : day);
      if (!isNaN(d.getTime())) return d;
    }
  }
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
};

const BasicDetailsFlat = ({
  details,
  employeeId,
  canEdit,
  onSuccess,
}: {
  details: any;
  employeeId: string | undefined;
  canEdit: boolean;
  onSuccess?: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { department: departmentList, designation: designationList } =
    useSelector((state: RootState) => state.adminPage);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [empDOBDate, setEmpDOBDate] = useState<Date | null>(null);
  const [empPhotoFile, setEmpPhotoFile] = useState<File | null>(null);
  const [empPhotoUrl, setEmpPhotoUrl] = useState<string | null>(null);
  const [empFirstName, setEmpFirstName] = useState('');
  const [empMiddleName, setEmpMiddleName] = useState('');
  const [empLastName, setEmpLastName] = useState('');
  const [empGender, setEmpGender] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empMaritalStatus, setEmpMaritalStatus] = useState('');
  const [empHobbies, setEmpHobbies] = useState('');
  const [adhaar, setAdhaar] = useState('');
  const [empPanNo, setEmpPanNo] = useState('');
  const [empBloodGroup, setEmpBloodGroup] = useState('');
  const [empDepartment, setEmpDepartment] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');

  useEffect(() => {
    if (details && (isEditing || !isEditing)) {
      setEmpFirstName(details?.empFirstName ?? '');
      setEmpMiddleName(details?.empMiddleName ?? '');
      setEmpLastName(details?.empLastName ?? '');
      setEmpDOBDate(parseDOB(details?.empDOB));
      setEmpGender(details?.empGender ?? '');
      setEmpMobile(details?.empMobile ?? '');
      setEmpEmail(details?.empEmail ?? '');
      setEmpMaritalStatus(details?.empMaritalStatus ?? '');
      setEmpHobbies(details?.empHobbies ?? '');
      setAdhaar((details?.adhaar ?? '').replace(/\s/g, ''));
      setEmpPanNo((details?.empPanNo ?? '').toString().trim().toUpperCase());
      setEmpBloodGroup(details?.empBloodGroup ?? '');
      const deptVal =
        departmentList?.find(
          (d: Department) =>
            d.value === details?.department || d.text === details?.department,
        )?.value ??
        details?.department ??
        '';
      const desgVal =
        designationList?.find(
          (d: Designation) =>
            d.value === details?.designation || d.text === details?.designation,
        )?.value ??
        details?.designation ??
        '';
      setEmpDepartment(deptVal);
      setEmpDesignation(desgVal);
    }
  }, [details, isEditing, departmentList, designationList]);

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchDepartments());
      dispatch(fetchDesignations());
    }
  }, [isEditing, dispatch]);

  const onDOBChange: DatePickerProps['onChange'] = (date) => {
    setEmpDOBDate(date ? dayjs(date as any).toDate() : null);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employeeId) {
      e.target.value = '';
      return;
    }
    setEmpPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setEmpPhotoFile(file);
    try {
      await dispatch(updateWorkerProfile({ empId: employeeId, image: file })).unwrap();
      onSuccess?.();
    } catch {
      // toast in slice
    }
    e.target.value = '';
  };

  const handleUpdateBasic = async () => {
    if (!employeeId) return;
    const panTrimmed = empPanNo?.trim() ?? '';
    if (panTrimmed.length > 0 && !isValidPan(panTrimmed)) return;
    setSaving(true);
    try {
      const payload = buildWorkerUpdatePayload({
        empId: employeeId,
        firstName: empFirstName,
        middleName: empMiddleName,
        lastName: empLastName,
        email: empEmail,
        mobile: empMobile,
        gender: empGender,
        maritalStatus: empMaritalStatus,
        hobbies: empHobbies,
        panNo: empPanNo ?? '',
        bloodGroup: empBloodGroup,
        department: empDepartment,
        designation: empDesignation,
        aadhaar: adhaar,
        dob: empDOBDate ?? undefined,
      });
      await dispatch(updateEmployeeDetails(payload)).unwrap();
      setIsEditing(false);
      onSuccess?.();
    } catch {
      // toast in slice
    } finally {
      setSaving(false);
    }
  };

  const photoSrc =
    empPhotoUrl ||
    (Array.isArray(details?.empPhoto)
      ? details.empPhoto[0]
      : details?.empPhoto) ||
    './ProfileImage.png';

  if (isEditing) {
    return (
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            Basic Details
          </CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-teal-500 hover:bg-teal-600"
              onClick={handleUpdateBasic}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Basic Details'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-5">
            <div className="w-28 shrink-0 flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-slate-200">
                <img
                  src={photoSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white text-xs">
                  Change
                </label>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="basic-details-photo"
              />
              <Label
                htmlFor="basic-details-photo"
                className="mt-2 text-xs cursor-pointer text-teal-600"
              >
                {empPhotoFile ? 'Change' : 'Upload'}
              </Label>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="floating-label-group">
                <Input
                  className={inputStyle}
                  value={empFirstName}
                  onChange={(e) =>
                    setEmpFirstName(capitalizeName(e.target.value))
                  }
                />
                <Label className="floating-label">
                  <span className="flex items-center gap-1">
                    <AiOutlineUser className="h-4 w-4" /> First Name
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  className={inputStyle}
                  value={empMiddleName}
                  onChange={(e) =>
                    setEmpMiddleName(capitalizeName(e.target.value))
                  }
                />
                <Label className="floating-label">
                  <span className="flex items-center gap-1">
                    <AiOutlineUser className="h-4 w-4" /> Middle Name
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  className={inputStyle}
                  value={empLastName}
                  onChange={(e) =>
                    setEmpLastName(capitalizeName(e.target.value))
                  }
                />
                <Label className="floating-label">
                  <span className="flex items-center gap-1">
                    <AiOutlineUser className="h-4 w-4" /> Last Name
                  </span>
                </Label>
              </div>
              <div>
                <Label className="floating-label">Gender</Label>
                <Select value={empGender} onValueChange={setEmpGender}>
                  <SelectTrigger
                    className={`${inputStyle} input2 focus:ring-0`}
                  >
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="floating-label">DOB</Label>
                <DatePicker
                  onChange={onDOBChange}
                  value={empDOBDate ? dayjs(empDOBDate) : null}
                  className={`${inputStyle} input2 w-full`}
                  format="DD/MM/YYYY"
                />
              </div>
              <div className="floating-label-group">
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={15}
                  className={inputStyle}
                  value={empMobile}
                  onChange={(e) =>
                    setEmpMobile(e.target.value.replace(/\D/g, ''))
                  }
                />
                <Label className="floating-label">
                  <span className="flex items-center gap-1">
                    <BsTelephone className="h-4 w-4" /> Phone
                  </span>
                </Label>
              </div>
              <div className="floating-label-group col-span-2">
                <Input
                  type="email"
                  className={inputStyle}
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                />
                <Label className="floating-label">
                  <span className="flex items-center gap-1">
                    <CiMail className="h-4 w-4" /> Email
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  className={inputStyle}
                  value={adhaar}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v.length <= 12) setAdhaar(v);
                  }}
                  placeholder="12 digits"
                />
                <Label className="floating-label">
                  <span className="flex items-center gap-1">
                    <PiCreditCard className="h-4 w-4" /> Aadhaar
                  </span>
                </Label>
                {adhaar.length > 0 && (
                  <p
                    className={cn(
                      'text-xs mt-0.5',
                      isValidAadhaar(adhaar)
                        ? 'text-green-600'
                        : 'text-red-600',
                    )}
                  >
                    {isValidAadhaar(adhaar) ? 'Valid' : 'Invalid'}
                  </p>
                )}
              </div>
              <div className="space-y-0.5">
                <div
                  className={`floating-label-group${empPanNo.trim() ? ' has-value' : ''}`}
                >
                  <Input
                    type="text"
                    maxLength={10}
                    className={inputStyle}
                    value={empPanNo}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                      if (v.length <= 10) setEmpPanNo(v);
                    }}
                    placeholder="e.g. ABCDE1234F"
                  />
                  <Label className="floating-label">
                    <span className="flex items-center gap-1">
                      <PiCreditCard className="h-4 w-4" /> PAN No.
                    </span>
                  </Label>
                </div>
                {empPanNo.length > 0 && (
                  <p
                    className={cn(
                      'text-xs mt-0.5',
                      isValidPan(empPanNo) ? 'text-green-600' : 'text-red-600',
                    )}
                  >
                    {isValidPan(empPanNo)
                      ? 'PAN valid'
                      : 'Invalid — use 5 letters + 4 digits + 1 letter'}
                  </p>
                )}
              </div>
              <div>
                <Label className="floating-label">Department</Label>
                <Select value={empDepartment} onValueChange={setEmpDepartment}>
                  <SelectTrigger
                    className={`${inputStyle} input2 focus:ring-0`}
                  >
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList?.map((dept: Department) => (
                      <SelectItem key={dept?.value} value={dept?.value}>
                        {dept?.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="floating-label">Designation</Label>
                <Select
                  value={empDesignation}
                  onValueChange={setEmpDesignation}
                >
                  <SelectTrigger
                    className={`${inputStyle} input2 focus:ring-0`}
                  >
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {designationList?.map((desg: Designation) => (
                      <SelectItem key={desg?.value} value={desg?.value}>
                        {desg?.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-slate-800">
          Basic Details
        </CardTitle>
        <div className="flex items-center gap-2">
          {details?.empPhoto && (
            <img
              src={
                Array.isArray(details.empPhoto)
                  ? details.empPhoto[0]
                  : details.empPhoto
              }
              alt="No Image"
              className="h-16 w-16 rounded-full object-cover border-2 border-slate-200"
            />
          )}
          {canEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>
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
