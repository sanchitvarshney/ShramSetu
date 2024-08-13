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
  fetchDepartments,
  fetchDesignations,
  fetchMarriedStatus,
  fetchStates,
  fetchWorkerDetails,
  getCompanyBranchOptions,
  getEducationStatus,
  getLocationsFromPinCode,
  getStreams,
  universitiesSearch,
  updateEmployeeDetails,
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
    branches,
    universityList,
    streams,
    educationStatus,
    workerInfo,
    states,
    corPincode: corState,
    perPincode: perState,
  } = useSelector((state: RootState) => state.adminPage);
  const { searchCompanies } = useSelector((state: RootState) => state.homePage);
  const [empFirstName, setEmpFirstName] = useState<string>();
  const [empMiddleName, setEmpMiddleName] = useState<string>();
  const [empLastName, setEmpLastName] = useState<string>();
  const [empEmail, setEmpEmail] = useState<string>();
  const [empMobile, setEmpMobile] = useState<string>();
  const [gender, setGender] = useState<string>();
  const [empDOB, setEmpDOB] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState<string>();
  const [empBloodGroup, setEmpBloodGroup] = useState<string>();
  const [designation, setDesignation] = useState<string>();
  const [department, setDepartment] = useState<string>();
  const [empAdhaar, setEmpAdhaar] = useState<string>();
  const [empPan, setEmpPan] = useState<string>();
  const [empMark, setEmpMark] = useState<string>();
  const [empHobbies, setEmpHobbies] = useState<string>();
  const [bankName, setBankName] = useState<string>();
  const [accNo, setAccNo] = useState<string>();
  const [isfc, setIFSC] = useState<string>();
  const [esi, setESI] = useState<string>();
  const [uan, setUan] = useState<string>();
  const [fatherName, setFatherName] = useState<string>('');
  const [motherName, setMotherName] = useState<string>('');
  const [spouseName, setSpouseName] = useState<string>('');
  const [childrenCount, setChildrenCount] = useState<string>('');
  const [perPinCode, setPerPinCode] = useState<string>('');
  const [corPinCode, setCorPinCode] = useState<string>('');
  const [perHouseNo, setPerHouseNo] = useState<string>('');
  const [corHouseNo, setCorHouseNo] = useState<string>('');
  const [perArea, setPerArea] = useState<string>('');
  const [corArea, setCorArea] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [children, setChildren] = useState([]);
  const [educationDetails, setEducationDetails] = useState([
    {
      degree: workerInfo?.educationInfo?.degree || '',
      stream: workerInfo?.educationInfo?.educationId || '',
      grade: workerInfo?.educationInfo?.grade || '',
      university: workerInfo?.educationInfo?.university || '',
      startYear: workerInfo?.educationInfo?.startYear || '',
      endYear: workerInfo?.educationInfo?.ednYear || '',
    },
  ]);
  useEffect(() => {
    if (workerInfo) {
      setEmpFirstName(workerInfo?.basicInfo?.firstName || '');
      setEmpMiddleName(workerInfo?.basicInfo?.middleName || '');
      setEmpLastName(workerInfo?.basicInfo?.lastName || '');
      setEmpEmail(workerInfo?.basicInfo?.email || '');
      setEmpMobile(workerInfo?.basicInfo?.mobile || '');
      setGender(workerInfo?.basicInfo?.gender?.text || '');
      setEmpDOB(workerInfo?.basicInfo?.DOB || null);
      setEmpBloodGroup(workerInfo?.basicInfo?.bloodGroup || '');
      setMaritalStatus(workerInfo?.basicInfo?.maritalStatus || '');
      setDesignation(workerInfo?.basicInfo?.designation || '');
      setDepartment(workerInfo?.basicInfo?.department || '');
      setEmpAdhaar(workerInfo?.basicInfo?.aadhaarNo || '');
      setEmpPan(workerInfo?.basicInfo?.panNo || '');
      setEmpMark(workerInfo?.basicInfo?.identificationMark || '');
      setBankName(workerInfo?.bankDetails?.bankName || '');
      setEmpHobbies(workerInfo?.basicInfo?.hobbies || '');
      setAccNo(workerInfo?.bankDetails?.accountNo || '');
      setIFSC(workerInfo?.bankDetails?.ifsCode || '');
      setESI(workerInfo?.bankDetails?.esi || '');
      setUan(workerInfo?.bankDetails?.uan || '');
      setFatherName(workerInfo?.familyInfo?.fatherName || '');
      setMotherName(workerInfo?.familyInfo?.motherName || '');
      setSpouseName(workerInfo?.familyInfo?.spouseName || '');
      setChildrenCount(workerInfo?.familyInfo?.childCount || '');
      setPerPinCode(
        workerInfo?.basicInfo?.permanentAddress?.pincodePermanent || '',
      );
      setPerHouseNo(
        workerInfo?.basicInfo?.permanentAddress?.houseNoPermanent || '',
      );
      setPerArea(workerInfo?.basicInfo?.permanentAddress?.colonyPermanent);
      setCorArea(workerInfo?.basicInfo?.presentAddress?.colonyPresent);
    }
  }, [workerInfo]);
  console.log(workerInfo?.permanentAddress?.pincodePermanent);
  const [employmentDetails, setEmploymentDetails] = useState([
    {
      company: '',
      branch: '',
      role: '',
      joiningDate: null,
      relievingDate: null,
    },
  ]);

  const addChild = () => {
    setChildren([
      ...children,
      { childName: '', childGender: '', childDob: null },
    ]);
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
        educationId: '',
        grade: '',
        university: '',
        startYear: '',
        endYear: '',
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
        branch: '',
        role: '',
        joiningDate: null,
        relievingDate: null,
      },
    ]);
  };

  const handleRemoveEmployment = (index) => {
    setEmploymentDetails(employmentDetails.filter((_, i) => i !== index));
  };

  const handleInputEmpChange = (index, field, value) => {
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

  useEffect(() => {
    if (perPinCode.length === 6) {
      dispatch(
        getLocationsFromPinCode({
          pinCode: perPinCode,
          addressType: 'permanent',
        }),
      );
    }
    if (corPinCode.length === 6) {
      dispatch(
        getLocationsFromPinCode({
          pinCode: corPinCode,
          addressType: 'corresponding',
        }),
      );
    }
  }, [perPinCode, corPinCode]);
  const permanentResult = perState.find((item: any) => item.name === perArea);
  const perStateforAPI = states.find(
    (item: any) => item.text === permanentResult?.state,
  );
  const correspondingResult = corState.find(
    (item: any) => item.name === corArea,
  );
  const corrStateforAPI = states.find(
    (item: any) => item.text === correspondingResult?.state,
  );

  useEffect(() => {
    if (isChecked) {
      setCorPinCode(perPinCode);
      setCorHouseNo(perHouseNo);
      setCorArea(perArea);
    }
  }, [isChecked, perPinCode, perHouseNo, perArea]);

  const payload = {
    empId: 'emp-c5a9c5a6-b894-45cc-ac6e-8486812bf70e',
    firstName: empFirstName,
    middleName: empMiddleName,
    lastName: empLastName,
    DOB: empDOB,
    aadhaarNo: empAdhaar,
    bloodGroup: empBloodGroup,
    childCount: childrenCount,
    childData: children,
    email: empEmail,
    mobile: empMobile,
    panNo: empPan,
    esi: esi,
    identificationMark: empMark,
    hobbies: empHobbies,
    maritalStatus: maritalStatus,
    spouse: spouseName,
    fatherName: fatherName,
    motherName: motherName,
    houseNoPermanent: perHouseNo,
    colonyPermanent: perArea,
    cityPermanent: permanentResult?.block,
    districtPermanent: permanentResult?.district,
    statePermanent: perStateforAPI?.value,
    pinCodePermanent: perPinCode,
    houseNoPresent: corHouseNo,
    colonyPresent: corArea,
    cityPresent: correspondingResult?.block,
    districtPresent: correspondingResult?.district,
    statePresent: corrStateforAPI?.value,
    pinCodePresent: corPinCode,
    department: department,
    designation: designation,
    gender: gender,
    companyData: employmentDetails,
    educationData: educationDetails,
    bankDetail: {
      bankName: bankName,
      accountNo: accNo,
      ifsCode: isfc,
    },
    empFamilyKey: 'Chandra',
    uan: uan,
  };

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
              <LabelInput
                value={empFirstName}
                onChange={(e) => setEmpFirstName(e.target.value)}
                icon={AiOutlineUser}
                label="First Name"
                required
              />

              <LabelInput
                value={empMiddleName}
                onChange={(e) => setEmpMiddleName(e.target.value)}
                icon={AiOutlineUser}
                label="Middle Name"
                required
              />
              <LabelInput
                value={empLastName}
                onChange={(e) => setEmpLastName(e.target.value)}
                icon={AiOutlineUser}
                label="Last Name"
                required
              />
              <LabelInput
                value={empEmail}
                onChange={(e) => setEmpEmail(e.target.value)}
                icon={CiMail}
                label="Email"
                required
              />
              <LabelInput
                value={empMobile}
                onChange={(e) => setEmpMobile(e.target.value)}
                icon={BsTelephone}
                label="Phone"
                required
              />

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
              <DatePickerWithLabel
                label="Date Of Birth"
                date={empDOB}
                onDateChange={(value) => {
                  setEmpDOB(value);
                }}
                icon={AiOutlineUser}
                className="custom-class" // Optional custom class
              />

              <SelectWithLabel
                label="Marital Status"
                value={maritalStatus}
                onValueChange={(value) => setMaritalStatus(value)}
                options={marriedStatus}
                textKey="text"
                optionKey="value"
                icon={LiaClipboardListSolid}
              />
              <LabelInput
                value={empBloodGroup}
                onChange={(e) => setEmpBloodGroup(e.target.value)}
                icon={LiaClipboardListSolid}
                label="Blood Group"
                required
              />
              <SelectWithLabel
                label="Designation"
                value={designation}
                onValueChange={(value) => setDesignation(value)}
                options={designationList}
                textKey="text"
                optionKey="value"
                icon={LiaClipboardListSolid}
              />

              <SelectWithLabel
                label="Department"
                value={department}
                onValueChange={(value) => setDepartment(value)}
                options={departmentList}
                textKey="text"
                optionKey="value"
                icon={LiaClipboardListSolid}
              />

              <LabelInput
                value={empAdhaar}
                onChange={(e) => setEmpAdhaar(e.target.value)}
                icon={PiCreditCard}
                label="Aadhar Card Number"
                required
              />

              <LabelInput
                value={empPan}
                onChange={(e) => setEmpPan(e.target.value)}
                icon={PiCreditCard}
                label="PAN Number"
                required
              />
              <LabelInput
                value={empMark}
                onChange={(e) => setEmpMark(e.target.value)}
                icon={AiOutlineUser}
                label="Identification Mark"
                required
              />

              <LabelInput
                value={empHobbies}
                onChange={(e) => setEmpHobbies(e.target.value)}
                icon={AiOutlineUser}
                label="Hobbies"
                required
              />
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
                  <LabelInput
                    value={perPinCode}
                    onChange={(e) => setPerPinCode(e.target.value)}
                    icon={Navigation}
                    label="Pin Code"
                    required
                  />
                  <SelectWithLabel
                    label="Area/Post Office"
                    value={perArea}
                    onValueChange={(value) => {
                      setPerArea(value);
                    }}
                    options={perState}
                    textKey="name"
                    optionKey="name"
                    icon={Building}
                    blank
                  />
                  <LabelInput
                    value={permanentResult?.state}
                    onChange={() => {}}
                    icon={Map}
                    label="State"
                    required
                    readonly
                  />
                  <LabelInput
                    value={permanentResult?.block}
                    onChange={() => {}}
                    icon={LocateIcon}
                    label="City"
                    required
                    readonly
                  />
                  <LabelInput
                    value={permanentResult?.district}
                    onChange={() => {}}
                    icon={Navigation}
                    label="District"
                    required
                    readonly
                  />
                  <LabelInput
                    value={perHouseNo}
                    onChange={(e) => setPerHouseNo(e.target.value)}
                    icon={PiHouseLine}
                    label="House No."
                    required
                  />
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
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
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
                  <LabelInput
                    value={corPinCode}
                    onChange={(e) => setCorPinCode(e.target.value)}
                    icon={Navigation}
                    label="Pin Code"
                    required
                  />
                  <SelectWithLabel
                    label="Area/Post Office"
                    value={corArea}
                    onValueChange={(value) => {
                      setCorArea(value);
                    }}
                    options={corState}
                    textKey="name"
                    optionKey="name"
                    icon={Building}
                    blank
                  />
                  <LabelInput
                    value={correspondingResult?.state}
                    onChange={() => {}}
                    icon={Map}
                    label="State"
                    required
                    readonly
                  />
                  <LabelInput
                    value={correspondingResult?.block}
                    onChange={() => {}}
                    icon={LocateIcon}
                    label="City"
                    required
                    readonly
                  />
                  <LabelInput
                    value={correspondingResult?.district}
                    onChange={() => {}}
                    icon={Navigation}
                    label="District"
                    required
                    readonly
                  />
                  <LabelInput
                    value={corHouseNo}
                    onChange={(e) => setCorHouseNo(e.target.value)}
                    icon={PiHouseLine}
                    label="House No."
                    required
                  />
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
                  value={child.childName}
                  onChange={(e) =>
                    handleChange(index, 'childName', e.target.value)
                  }
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
                    value={child.childGender}
                    onValueChange={(value) =>
                      handleChange(index, 'childGender', value)
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
                <DatePickerWithLabel
                  label="Date Of Birth"
                  date={child.childDob}
                  onDateChange={(value) => {
                    handleChange(index, 'childDob', value);
                  }}
                  icon={AiOutlineUser}
                  className="custom-class" // Optional custom class
                />

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
                      value={detail.stream}
                      onValueChange={(value) =>
                        handleInputEduChange(index, 'stream', value)
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
                      value={detail.startYear}
                      onChange={(e) =>
                        handleInputEduChange(index, 'startYear', e.target.value)
                      }
                      icon={CalendarDays}
                      label="Starting Year"
                      required
                    />
                    <LabelInput
                      value={detail.endYear}
                      onChange={(e) =>
                        handleInputEduChange(index, 'endYear', e.target.value)
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
                      value={detail.branch}
                      onValueChange={(value) =>
                        handleInputEmpChange(index, 'branch', value)
                      }
                      options={branches}
                      textKey="branchName"
                      optionKey="branchID"
                    />

                    <SelectWithLabel
                      label="Designation"
                      value={detail.role}
                      onValueChange={(value) =>
                        handleInputEmpChange(index, 'role', value)
                      }
                      options={designationList}
                      icon={LiaClipboardListSolid}
                      textKey="text"
                      optionKey="value"
                    />
                    <DatePickerWithLabel
                      label="Date Of Joining"
                      date={detail.joiningDate}
                      onDateChange={(value) => {
                        handleInputEmpChange(index, 'joiningDate', value);
                      }}
                      icon={AiOutlineUser}
                      className="custom-class"
                    />
                    <DatePickerWithLabel
                      label="Date Of Leaving"
                      date={detail.relievingDate}
                      onDateChange={(value) => {
                        handleInputEmpChange(index, 'relievingDate', value);
                      }}
                      icon={AiOutlineUser}
                      className="custom-class"
                    />

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
          <Button
            type="submit"
            onClick={() => {
              console.log(payload);
              dispatch(updateEmployeeDetails(payload));
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

interface LabelInputProps {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  icon?: React.ElementType; // Use ElementType for component type
  blank?: boolean;
  readOnly?: boolean;
}

export const LabelInput: React.FC<LabelInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  icon: Icon,
  blank = false,
  readOnly = false, // Icon should be a component type
}) => {
  return (
    <div className="floating-label-group">
      <Input
        required={required}
        className={inputStyle}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
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
  blank?: boolean;
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
  blank = false,
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
        {blank && (
          <p className="text-zinc-400 text-sm">
            Select your area or post office after entering your pin code
          </p>
        )}
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
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
