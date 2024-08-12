import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { inputStyle } from '@/style/CustomStyles';
import {
  CalendarIcon,
  LocateIcon,
  Navigation,
  Map,
  Trash2,
  PlusCircle,
  GraduationCap,
  Percent,
  Building,
  CalendarDays,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { AiOutlineUser } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { PiCreditCard, PiHouseLine } from 'react-icons/pi';
import IconButton from '@/components/ui/IconButton';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  Department,
  Designation,
  fetchDepartments,
  fetchDesignations,
  fetchMarriedStatus,
  fetchStates,
  fetchWorkerDetails,
  getCompanyBranchOptions,
  getEducationStatus,
  getStreams,
  universitiesSearch,
} from '@/features/admin/adminPageSlice';
import { format } from 'date-fns';
import { fetchSearchCompanies } from '@/features/homePage/homePageSlice';

export default function EmpUpdate() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    department: departmentList,
    designation: designationList,
    marriedStatus,
    states,
    branches,
    universityList,
    streams,
    educationStatus,
    workerInfo,
  } = useSelector((state: RootState) => state.adminPage);
  const { searchCompanies } = useSelector((state: RootState) => state.homePage);
  const [empFirstName, setEmpFirstName] = useState(
    workerInfo?.basicInfo?.firstName || '',
  );
  const [empMiddleName, setEmpMiddleName] = useState(
    workerInfo?.basicInfo?.middleName || '',
  );
  const [empLastName, setEmpLastName] = useState(
    workerInfo?.basicInfo?.lastName || '',
  );
  const [empEmail, setEmpEmail] = useState(workerInfo?.basicInfo?.email || '');
  const [empMobile, setEmpMobile] = useState(
    workerInfo?.basicInfo?.mobile || '',
  );
  const [gender, setGender] = useState(
    workerInfo?.basicInfo?.gender?.text || '',
  );
  const [empDOB, setEmpDOB] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState(
    workerInfo?.basicInfo?.maritalStatus || '',
  );
  const [empBloodGroup, setEmpBloodGroup] = useState(
    workerInfo?.basicInfo?.bloodGroup || '',
  );
  const [designation, setDesignation] = useState(
    workerInfo?.basicInfo?.designation || '',
  );
  const [department, setDepartment] = useState(
    workerInfo?.basicInfo?.department || '',
  );
  const [empAdhaar, setEmpAdhaar] = useState(
    workerInfo?.basicInfo?.aadhaarNo || '',
  );
  const [empPan, setEmpPan] = useState(workerInfo?.basicInfo?.panNo || '');
  const [empMark, setEmpMark] = useState(
    workerInfo?.basicInfo?.identificationMark || '',
  );
  const [empHobbies, setEmpHobbies] = useState(
    workerInfo?.basicInfo?.hobbies || '',
  );
  const [bankName, setBankName] = useState(
    workerInfo?.bankDetails?.bankName || '',
  );

  const [accNo, setAccNo] = useState(workerInfo?.bankDetails?.accountNo || '');
  const [isfc, setIFSC] = useState(workerInfo?.bankDetails?.ifsCode || '');
  const [esi, setESI] = useState(workerInfo?.bankDetails?.esi || '');
  const [uan, setUan] = useState(workerInfo?.bankDetails?.uan || '');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [childrenCount, setChildrenCount] = useState('');
  const [children, setChildren] = useState([
    {
      name: '',
      gender: '',
      dob: '',
    },
  ]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [educationDetails, setEducationDetails] = useState([
    {
      degree: workerInfo?.educationInfo?.degree || '',
      subject: workerInfo?.educationInfo?.subject || '',
      grade: workerInfo?.educationInfo?.grade || '',
      university: workerInfo?.educationInfo?.university || '',
      startingYear: workerInfo?.educationInfo?.startYear || '',
      passingYear: workerInfo?.educationInfo?.ednYear || '',
    },
  ]);
  const [employmentDetails, setEmploymentDetails] = useState([
    {
      company: '',
      companyBranch: '',
      designation: '',
      dateOfJoining: null,
      dateOfLeaving: null,
    },
  ]);

  const addChild = () => {
    setChildren([...children, { name: '', gender: '', dob: '' }]);
  };

  const removeChild = (index) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updatedChildren = [...children];
    updatedChildren[index][field] = value;
    setChildren(updatedChildren);
  };

  const handleAddEducation = () => {
    setEducationDetails([
      ...educationDetails,
      {
        degree: '',
        subject: '',
        grade: '',
        university: '',
        startingYear: '',
        passingYear: '',
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducationDetails(educationDetails.filter((_, i) => i !== index));
  };

  const handleInputEduChange = (index, field, value) => {
    const newDetails = [...educationDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setEducationDetails(newDetails);
  };

  const handleAddEmployment = () => {
    setEmploymentDetails([
      ...employmentDetails,
      {
        company: '',
        companyBranch: '',
        designation: '',
        dateOfJoining: null,
        dateOfLeaving: null,
      },
    ]);
  };

  const handleRemoveEmployment = (index) => {
    setEmploymentDetails(employmentDetails.filter((_, i) => i !== index));
  };

  const handleInputEmpChange = (index, field, value) => {
    console.log(index, field, value);
    const newDetails = [...employmentDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setEmploymentDetails(newDetails);
  };

  useEffect(() => {
    if (params?.id) {
      dispatch(fetchWorkerDetails(params?.id?.replace(':', '')));
      dispatch(fetchDepartments());
      dispatch(fetchDesignations());
      dispatch(fetchMarriedStatus());
      dispatch(universitiesSearch());
      dispatch(fetchStates());
      dispatch(getEducationStatus());
      dispatch(getStreams());
      dispatch(fetchSearchCompanies());
    }
  }, []);
  console.log(
    fatherName,
    motherName,
    spouseName,
    children,
    childrenCount,
    '+++++',
    branches,
  );
  return (
    <div className="overflow-y-auto">
      <div className="p-[10px]">
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px] overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
              {/* First Name */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empFirstName}
                  onChange={(e) => setEmpFirstName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    First Name
                  </span>
                </Label>
              </div>

              {/* Middle Name */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empMiddleName}
                  onChange={(e) => setEmpMiddleName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Middle Name
                  </span>
                </Label>
              </div>

              {/* Last Name */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empLastName}
                  onChange={(e) => setEmpLastName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Last Name
                  </span>
                </Label>
              </div>

              {/* Email */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <CiMail className="h-[18px] w-[18px]" />
                    Email
                  </span>
                </Label>
              </div>

              {/* Phone */}
              <div className="floating-label-group">
                <Input
                  type="number"
                  required
                  className={inputStyle}
                  value={empMobile}
                  onChange={(e) => setEmpMobile(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <BsTelephone className="h-[18px] w-[18px]" />
                    Phone
                  </span>
                </Label>
              </div>

              {/* Gender */}
              <div>
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Gender
                  </span>
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Of Birth */}

              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Date Of Birth
                  </span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        `${inputStyle} w-full justify-start hover:bg-transparent`,
                        !empDOB && 'text-[#9e9e9e]',
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {empDOB ? (
                        format(empDOB, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={empDOB}
                      onSelect={setEmpDOB}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* <div>
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Date Of Birth
                  </span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        `${inputStyle} w-full justify-start hover:bg-transparent`,
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {empDOB ? empDOB.toLocaleDateString() : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      value={empDOB}
                      onChange={setEmpDOB}
                    />
                  </PopoverContent>
                </Popover>
              </div> */}

              {/* Marital Status */}
              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Marital Status
                  </span>
                </Label>
                <Select onValueChange={setMaritalStatus}>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {marriedStatus?.map((status: Designation) => (
                      <SelectItem value={status?.value} key={status?.value}>
                        {status?.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Group */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empBloodGroup}
                  onChange={(e) => setEmpBloodGroup(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Blood Group
                  </span>
                </Label>
              </div>
              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Designation
                  </span>
                </Label>
                <Select onValueChange={setDesignation}>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {designationList?.map((designation: Designation) => (
                      <SelectItem
                        value={designation?.value}
                        key={designation?.value}
                      >
                        {designation?.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Department
                  </span>
                </Label>
                <Select onValueChange={setDepartment}>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList?.map((department: Department) => (
                      <SelectItem
                        value={department?.value}
                        key={department?.value}
                      >
                        {department?.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aadhar Card Number */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empAdhaar}
                  onChange={(e) => setEmpAdhaar(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <PiCreditCard className="h-[18px] w-[18px]" />
                    Aadhar Card Number
                  </span>
                </Label>
              </div>

              {/* PAN Number */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empPan}
                  onChange={(e) => setEmpPan(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <PiCreditCard className="h-[18px] w-[18px]" />
                    PAN Number
                  </span>
                </Label>
              </div>

              {/* Identification Mark */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empMark}
                  onChange={(e) => setEmpMark(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Identification Mark
                  </span>
                </Label>
              </div>

              {/* Hobbies */}
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empHobbies}
                  onChange={(e) => setEmpHobbies(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Hobbies
                  </span>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0 mt-4">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px] overflow-x-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex flex-col gap-y-2 lg:pr-2 border-b pb-4 lg:border-b-0 lg:pb-0 lg:border-r">
                <div>
                  <p className="text-lg font-semibold text-muted-foreground">
                    Permanent Address
                  </p>
                </div>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        Pin Code
                      </span>
                    </Label>
                  </div>

                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        Area/Post Office
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        State
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <LocateIcon className="h-[18px] w-[18px]" />
                        City
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        District
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <PiHouseLine className="h-[18px] w-[18px]" />
                        House No.
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-2 2xl:flex-row justify-between">
                  <p className="text-lg font-semibold text-muted-foreground">
                    Corresponding Address
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      // checked={isChecked}
                      // onChange={(e) => setIsChecked(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none"
                    >
                      Same as permanent address
                    </label>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        Pin Code
                      </span>
                    </Label>
                  </div>

                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        Area/Post Office
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        State
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <LocateIcon className="h-[18px] w-[18px]" />
                        City
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        District
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <PiHouseLine className="h-[18px] w-[18px]" />
                        House No.
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg h-full overflow-hidden p-0">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Family Info
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px]  overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
              <LabelInput
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                icon={AiOutlineUser}
                label="Father Name"
                required
              />
              <LabelInput
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                icon={AiOutlineUser}
                label="Mother Name"
                required
              />
              <LabelInput
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                icon={AiOutlineUser}
                label="Spouse Name"
                required
                blank
              />
              <LabelInput
                value={childrenCount}
                onChange={(e) => setChildrenCount(e.target.value)}
                icon={AiOutlineUser}
                label="Children Count"
                required
                blank
              />
            </div>
          </CardContent>
          <CardContent>
            <div className="grid grid-cols-8 flex">
              <div className="flex col-span-7 flex-col gap-y-2 2xl:flex-row justify-between">
                <p className="text-lg font-semibold text-muted-foreground">
                  Children Information
                </p>
              </div>
              <div className="col-span-1">
                <IconButton onClick={addChild} icon={<PlusCircle />} />
              </div>
            </div>
            {children.map((child, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-2 pb-3 my-2"
              >
                <LabelInput
                  value={child.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  icon={AiOutlineUser}
                  label="Child Name"
                  required
                />
                <div>
                  <Label className="floating-label gap-[10px]">
                    <span className="flex items-center gap-[10px]">
                      <AiOutlineUser className="h-[18px] w-[18px]" />
                      Gender
                    </span>
                  </Label>
                  <Select
                    value={child.gender}
                    onValueChange={(value) =>
                      handleChange(index, 'gender', value)
                    }
                  >
                    <SelectTrigger className={inputStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="floating-label  gap-[10px]">
                    <span className="flex items-center gap-[10px]">
                      <AiOutlineUser className="h-[18px] w-[18px]" />
                      Date Of Birth
                    </span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          `${inputStyle} w-full justify-start hover:bg-transparent`,
                          !empDOB && 'text-[#9e9e9e]',
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {empDOB ? (
                          format(empDOB, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={empDOB}
                        onSelect={setEmpDOB}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="row-span-3 flex justify-center">
                  <IconButton
                    onClick={() => removeChild(index)}
                    icon={<Trash2 size={18} />}
                    hoverBackground="hover:bg-red-100"
                    hoverColor="hover:text-red-400"
                    color="text-red-400"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex gap-4">
          <Card className="rounded-lg max-h-full overflow-auto p-0 mt-4 w-1/2">
            <CardHeader className="border-b p-0 px-[20px] h-[120px] gap-0 flex justify-center">
              <CardTitle className="text-[20px] font-[650] text-slate-600">
                Education Details
                <div className="float-right">
                  <IconButton
                    onClick={handleAddEducation}
                    icon={<PlusCircle />}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-[10px] overflow-auto flex-1">
              <div className="">
                {educationDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3"
                  >
                    <SelectWithLabel
                      label="Degree"
                      value={detail.degree}
                      onValueChange={(value) =>
                        handleInputEduChange(index, 'degree', value)
                      }
                      options={educationStatus}
                      textKey="text"
                      optionKey="value"
                      icon={GraduationCap}
                    />

                    <SelectWithLabel
                      label="Subject"
                      value={detail.subject}
                      onValueChange={(value) =>
                        handleInputEduChange(index, 'subject', value)
                      }
                      options={streams}
                      textKey="text"
                      optionKey="value"
                      icon={GraduationCap}
                    />
                    <LabelInput
                      value={detail.grade}
                      onChange={(e) =>
                        handleInputEduChange(index, 'grade', e.target.value)
                      }
                      icon={Percent}
                      label="Grade"
                      required
                    />

                    <SelectWithLabel
                      label="University"
                      value={detail.university}
                      onValueChange={(value) =>
                        handleInputEduChange(index, 'university', value)
                      }
                      options={universityList}
                      textKey="text"
                      optionKey="value"
                      icon={Building}
                    />
                    <LabelInput
                      value={detail.startingYear}
                      onChange={(e) =>
                        handleInputEduChange(
                          index,
                          'startingYear',
                          e.target.value,
                        )
                      }
                      icon={CalendarDays}
                      label="Starting Year"
                      required
                    />
                    <LabelInput
                      value={detail.passingYear}
                      onChange={(e) =>
                        handleInputEduChange(
                          index,
                          'passingYear',
                          e.target.value,
                        )
                      }
                      icon={CalendarDays}
                      label="Passing Year"
                      required
                    />

                    <div className="row-span-3 flex justify-center">
                      <IconButton
                        onClick={() => handleRemoveEducation(index)}
                        icon={<Trash2 size={18} />}
                        hoverBackground="hover:bg-red-100"
                        hoverColor="hover:text-red-400"
                        color="text-red-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg max-h-full overflow-hidden p-0 mt-4 w-1/2">
            <CardHeader className="border-b p-0 px-[20px] h-[120px] gap-0 flex justify-center">
              <CardTitle className="text-[20px] font-[650] text-slate-600 display-flex">
                Employment Details
                <div className="float-right">
                  <IconButton
                    onClick={handleAddEmployment}
                    icon={<PlusCircle />}
                  />
                </div>
              </CardTitle>
              <div className="text-[14px] font-[650] text-slate-600 display-flex">
                <p>Working Company Details</p>
              </div>
            </CardHeader>
            <CardContent className="py-[10px] overflow-x-auto flex-1">
              <div className="">
                {employmentDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2"
                  >
                    <SelectWithLabel
                      label="Company"
                      value={detail.company}
                      onValueChange={(value) => {
                        handleInputEmpChange(index, 'company', value);
                        dispatch(getCompanyBranchOptions(value));
                      }}
                      options={searchCompanies}
                      textKey="name"
                      optionKey="companyID"
                    />
                    <SelectWithLabel
                      label="Company Branch"
                      value={detail.companyBranch}
                      onValueChange={(value) =>
                        handleInputEmpChange(index, 'companyBranch', value)
                      }
                      options={branches}
                      textKey="branchName"
                      optionKey="branchID"
                    />

                    <SelectWithLabel
                      label="Designation"
                      value={detail.designation}
                      onValueChange={(value) =>
                        handleInputEmpChange(index, 'designation', value)
                      }
                      options={designationList}
                      icon={LiaClipboardListSolid}
                      textKey="text"
                      optionKey="value"
                    />
                    <DatePickerWithLabel
                      label="Date Of Joining"
                      date={detail.dateOfJoining}
                      onDateChange={(value) => {
                        {
                          console.log(value, 'val');
                        }
                        handleInputEmpChange(index, 'dateOfJoining', value);
                      }}
                      icon={AiOutlineUser}
                      className="custom-class" // Optional custom class
                    />

                    <div>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <AiOutlineUser className="h-[18px] w-[18px]" />
                          Date Of Joining
                        </span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              `${inputStyle} w-full justify-start hover:bg-transparent`,
                            )}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {detail.dateOfJoining
                              ? detail.dateOfJoining.toDateString()
                              : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            value={detail.dateOfJoining}
                            onChange={(value) =>
                              handleInputEmpChange(
                                index,
                                'dateOfJoining',
                                value,
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <AiOutlineUser className="h-[18px] w-[18px]" />
                          Date Of Leaving
                        </span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              `${inputStyle} w-full justify-start hover:bg-transparent`,
                            )}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {detail.dateOfLeaving
                              ? detail.dateOfLeaving.toDateString()
                              : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            value={detail.dateOfLeaving}
                            onChange={(value) =>
                              handleInputEmpChange(
                                index,
                                'dateOfLeaving',
                                value,
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="row-span-3 flex justify-center">
                      <IconButton
                        onClick={() => handleRemoveEmployment(index)}
                        icon={<Trash2 size={18} />}
                        hoverBackground="hover:bg-red-100"
                        hoverColor="hover:text-red-400"
                        color="text-red-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0 w-1/2">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Benifits Details
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px] overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-1 gap-2">
              <LabelInput
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                icon={LiaClipboardListSolid}
                label="Bank Name"
                required
              />
              <LabelInput
                value={accNo}
                onChange={(e) => setAccNo(e.target.value)}
                icon={LiaClipboardListSolid}
                label="Account Number"
                required
              />

              <LabelInput
                value={isfc}
                onChange={(e) => setIFSC(e.target.value)}
                icon={LiaClipboardListSolid}
                label="IFSC Code"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <LabelInput
                  value={esi}
                  onChange={(e) => setESI(e.target.value)}
                  icon={LiaClipboardListSolid}
                  label="ESI"
                  required
                />

                <LabelInput
                  value={uan}
                  onChange={(e: any) => setUan(e.target.value)}
                  icon={LiaClipboardListSolid}
                  label="UAN"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="p-4">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </div>
  );
}

interface LabelInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  icon?: React.ElementType; // Use ElementType for component type
  blank?: boolean;
}

export const LabelInput: React.FC<LabelInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  icon: Icon,
  blank = false, // Icon should be a component type
}) => {
  return (
    <div className="floating-label-group">
      <Input
        required={required}
        className={inputStyle}
        value={value}
        onChange={onChange}
      />
      <label className="floating-label gap-[10px]">
        <span className="flex items-center gap-[10px] font-medium">
          {Icon && <Icon className="h-[18px] w-[18px]" />}
          {label}
        </span>
      </label>
      {blank && (
        <p className="text-zinc-400 text-sm">Leave blank if not married</p>
      )}
    </div>
  );
};

interface SelectWithLabelProps<T> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: T[]; // Array of options with dynamic keys
  textKey: keyof T; // Key to get the text for SelectItem
  optionKey: keyof T; // Key to get the value for SelectItem
  className?: string; // Additional class names
  icon?: React.ElementType; // Optional icon component
}

export const SelectWithLabel = <T extends Record<string, any>>({
  label,
  value,
  onValueChange,
  options,
  textKey,
  optionKey,
  className = '',
  icon: Icon,
}: SelectWithLabelProps<T>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={className}>
      <label className="floating-label gap-[10px]">
        <span className="flex items-center gap-[10px]">
          {Icon && <Icon className="h-[18px] w-[18px]" />}
          {label}
        </span>
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={inputStyle} ref={buttonRef}>
          <SelectValue className="" placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option, index) => (
            <SelectItem value={option[optionKey] as string} key={index}>
              {option[textKey] as string}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface DatePickerWithLabelProps {
  label: string;
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  icon?: React.ElementType; // Optional icon component
  className?: string; // Additional class names
}

export const DatePickerWithLabel: React.FC<DatePickerWithLabelProps> = ({
  label,
  date,
  onDateChange,
  icon: Icon = AiOutlineUser,
  className = '',
}) => {
  return (
    <div className={className}>
      <Label className="floating-label gap-[10px]">
        <span className="flex items-center gap-[10px]">
          {Icon && <Icon className="h-[18px] w-[18px]" />}
          {label}
        </span>
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              `${inputStyle} w-full justify-start hover:bg-transparent`,
              !date && 'text-[#9e9e9e]',
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            value={date}
            onChange={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
