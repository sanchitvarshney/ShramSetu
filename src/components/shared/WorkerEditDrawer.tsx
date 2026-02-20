import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover } from '@/components/ui/popover';
import {
  updateEmployeeDetails,
  fetchDepartments,
  fetchDesignations,
  Department,
  Designation,
} from '@/features/admin/adminPageSlice';
import { inputStyle } from '@/style/CustomStyles';
import { capitalizeName } from '@/lib/utils';
import { isValidAadhaar, isValidPan } from '@/lib/validations';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { DatePicker, DatePickerProps } from 'antd';
import { AiOutlineUser } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { PiCreditCard } from 'react-icons/pi';
import { LiaClipboardListSolid } from 'react-icons/lia';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export interface WorkerEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: any;
  employeeId: string | undefined;
  onSuccess?: () => void;
  onCloseDetails?: () => void;
}

const parseDOB = (val: string | undefined): Date | null => {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  // Try common formats
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

const WorkerEditDrawer: React.FC<WorkerEditDrawerProps> = ({
  open,
  onOpenChange,
  worker,
  employeeId,
  onSuccess,
  onCloseDetails,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { department: departmentList, designation: designationList } =
    useSelector((state: RootState) => state.adminPage);
  const [saving, setSaving] = useState(false);
  const [empDOBDate, setEmpDOBDate] = useState<Date | null>(null);
  const [empPhotoFile, setEmpPhotoFile] = useState<File | null>(null);
  const [empPhotoUrl, setEmpPhotoUrl] = useState<string | null>(null);
  /** Photo URL that came from API when drawer opened - used in payload when user does not change photo */
  const [initialPhotoUrl, setInitialPhotoUrl] = useState<string | null>(null);

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
  const [present_houseNo, setPresent_houseNo] = useState('');
  const [present_colony, setPresent_colony] = useState('');
  const [present_city, setPresent_city] = useState('');
  const [present_state, setPresent_state] = useState('');
  const [present_country, setPresent_country] = useState('');
  const [present_pincode, setPresent_pincode] = useState('');
  const [perma_houseNo, setPerma_houseNo] = useState('');
  const [perma_colony, setPerma_colony] = useState('');
  const [perma_city, setPerma_city] = useState('');
  const [perma_state, setPerma_state] = useState('');
  const [perma_country, setPerma_country] = useState('');
  const [perma_pincode, setPerma_pincode] = useState('');

  useEffect(() => {
    if (open) {
      dispatch(fetchDepartments());
      dispatch(fetchDesignations());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open || !worker) return;
    setEmpPhotoFile(null);
    setEmpPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    const existingPhoto =
      Array.isArray(worker?.empPhoto) && worker.empPhoto.length > 0
        ? worker.empPhoto[0]
        : worker?.empPhoto;
    setInitialPhotoUrl(
      typeof existingPhoto === 'string' && existingPhoto ? existingPhoto : null,
    );
    setEmpFirstName(worker?.empFirstName ?? '');
    setEmpMiddleName(worker?.empMiddleName ?? '');
    setEmpLastName(worker?.empLastName ?? '');
    setEmpDOBDate(parseDOB(worker?.empDOB));
    setEmpGender(worker?.empGender ?? '');
    setEmpMobile(worker?.empMobile ?? '');
    setEmpEmail(worker?.empEmail ?? '');
    setEmpMaritalStatus(worker?.empMaritalStatus ?? '');
    setEmpHobbies(worker?.empHobbies ?? '');
    setAdhaar((worker?.adhaar ?? '').replace(/\s/g, ''));
    setEmpPanNo(
      (worker?.empPanNo ?? worker?.panNo ?? '').toString().trim().toUpperCase(),
    );
    setEmpBloodGroup(worker?.empBloodGroup ?? '');
    const deptVal =
      departmentList?.find(
        (d: Department) =>
          d.value === worker?.empDepartment || d.text === worker?.empDepartment,
      )?.value ??
      worker?.empDepartment ??
      '';
    const desgVal =
      designationList?.find(
        (d: Designation) =>
          d.value === worker?.empDesignation ||
          d.text === worker?.empDesignation,
      )?.value ??
      worker?.empDesignation ??
      '';
    setEmpDepartment(deptVal);
    setEmpDesignation(desgVal);
    setPresent_houseNo(worker?.present_houseNo ?? '');
    setPresent_colony(worker?.present_colony ?? '');
    setPresent_city(worker?.present_city ?? '');
    setPresent_state(worker?.present_state ?? '');
    setPresent_country(worker?.present_country ?? '');
    setPresent_pincode(worker?.present_pincode ?? '');
    setPerma_houseNo(worker?.perma_houseNo ?? '');
    setPerma_colony(worker?.perma_colony ?? '');
    setPerma_city(worker?.perma_city ?? '');
    setPerma_state(worker?.perma_state ?? '');
    setPerma_country(worker?.perma_country ?? '');
    setPerma_pincode(worker?.perma_pincode ?? '');
  }, [open, worker, departmentList, designationList]);

  const onDOBChange: DatePickerProps['onChange'] = (date) => {
    setEmpDOBDate(date ? dayjs(date as any).toDate() : null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEmpPhotoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setEmpPhotoFile(file);
    }
    e.target.value = '';
  };

  useEffect(() => {
    return () => {
      if (empPhotoUrl) URL.revokeObjectURL(empPhotoUrl);
    };
  }, [empPhotoUrl]);

  const buildUpdatePayload = () => ({
    empId: employeeId,
    firstName: empFirstName?.trim() || '',
    middleName: empMiddleName?.trim() || '',
    lastName: empLastName?.trim() || '',
    DOB: empDOBDate ? format(empDOBDate, 'dd/MM/yyyy') : null,
    aadhaarNo: adhaar?.trim() || '',
    email: empEmail?.trim() || '',
    mobile: empMobile?.trim() || '',
    gender: empGender?.trim() || '',
    maritalStatus: empMaritalStatus?.trim() || '',
    hobbies: empHobbies?.trim() || '',
    panNo: empPanNo?.trim().toUpperCase() || '',
    bloodGroup: empBloodGroup?.trim() || '',
    department: empDepartment?.trim() || '',
    designation: empDesignation?.trim() || '',
    houseNoPresent: present_houseNo?.trim() || '',
    colonyPresent: present_colony?.trim() || '',
    cityPresent: present_city?.trim() || '',
    statePresent: present_state?.trim() || '',
    countryPresent: present_country?.trim() || '',
    pinCodePresent: present_pincode?.trim() || '',
    houseNoPermanent: perma_houseNo?.trim() || '',
    colonyPermanent: perma_colony?.trim() || '',
    cityPermanent: perma_city?.trim() || '',
    statePermanent: perma_state?.trim() || '',
    countryPermanent: perma_country?.trim() || '',
    pinCodePermanent: perma_pincode?.trim() || '',
    childCount: '',
    childData: [],
    identificationMark: '',
    spouse: '',
    fatherName: '',
    motherName: '',
    districtPermanent: '',
    companyData: [],
    educationData: [],
    bankDetail: { bankName: '', accountNo: '', ifsCode: '' },
    empFamilyKey: 'Chandra',
    esi: '',
    uan: '',
  });

  const urlToBlobViaCanvas = (url: string): Promise<Blob | null> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const getCurrentPhotoForPayload = async (): Promise<File | Blob | null> => {
    if (empPhotoFile) return empPhotoFile;
    const urlToUse = initialPhotoUrl;
    if (!urlToUse) return null;
    try {
      const res = await fetch(urlToUse, { mode: 'cors' });
      if (!res.ok) throw new Error('Fetch not ok');
      return await res.blob();
    } catch {
      const blob = await urlToBlobViaCanvas(urlToUse);
      return blob;
    }
  };

  const handleSubmit = async () => {
    if (!employeeId) return;
    const panTrimmed = empPanNo?.trim() ?? '';
    if (panTrimmed.length > 0 && !isValidPan(panTrimmed)) {
      return; // validation message already shown under the field
    }
    setSaving(true);
    try {
      const payload = buildUpdatePayload();
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const currentPhoto = await getCurrentPhotoForPayload();
      if (currentPhoto) {
        const file =
          currentPhoto instanceof File
            ? currentPhoto
            : new File([currentPhoto], 'photo.png', {
                type: (currentPhoto as Blob).type || 'image/png',
              });
        formData.append('image', file);
      } else if (initialPhotoUrl) {
        formData.append('existingPhotoUrl', initialPhotoUrl);
      }
      await dispatch(updateEmployeeDetails(formData)).unwrap();
      onOpenChange(false);
      onSuccess?.();
      onCloseDetails?.();
    } catch {
      // toast handled in slice
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col w-full max-w-[75vw] sm:max-w-4xl p-0 gap-0 overflow-hidden"
        onInteractOutside={(e: any) => e.preventDefault()}
      >
        <SheetHeader className="flex-shrink-0 px-6 py-4 border-b bg-slate-50/80">
          <SheetTitle className="text-lg font-semibold text-slate-800">
            Edit Worker
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-6">
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-5">
                <div className="w-1/3 bg-gray-50 p-4 rounded-xl shadow flex flex-col items-center shrink-0">
                  <div className="relative w-[120px] h-[120px] rounded-full bg-gray-200 overflow-hidden border-2 border-slate-200">
                    <img
                      src={
                        empPhotoUrl ||
                        (Array.isArray(worker?.empPhoto)
                          ? worker.empPhoto[0]
                          : worker?.empPhoto) ||
                        './ProfileImage.png'
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                      <label
                        htmlFor="worker-edit-photo-upload"
                        className="cursor-pointer text-white text-sm font-semibold"
                      >
                        Change
                      </label>
                    </div>
                  </div>
                  <input
                    id="worker-edit-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-teal-500 hover:bg-teal-600 text-white border-0"
                    asChild
                  >
                    <label
                      htmlFor="worker-edit-photo-upload"
                      className="cursor-pointer"
                    >
                      {empPhotoFile ? 'Change Image' : 'Upload Image'}
                    </label>
                  </Button>
                </div>
                <div className="w-2/3 grid grid-cols-3 gap-3">
                  <div className="floating-label-group">
                    <Input
                      className={inputStyle}
                      value={empFirstName}
                      onChange={(e) =>
                        setEmpFirstName(capitalizeName(e.target.value))
                      }
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <AiOutlineUser className="h-[18px] w-[18px]" />
                        First Name
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
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <AiOutlineUser className="h-[18px] w-[18px]" />
                        Middle Name
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
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <AiOutlineUser className="h-[18px] w-[18px]" />
                        Last Name
                      </span>
                    </Label>
                  </div>
                  <div>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <AiOutlineUser className="h-[18px] w-[18px]" />
                        Gender
                      </span>
                    </Label>
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
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <AiOutlineUser className="h-[18px] w-[18px]" />
                        Date Of Birth
                      </span>
                    </Label>
                    <Popover>
                      <DatePicker
                        onChange={onDOBChange}
                        value={empDOBDate ? dayjs(empDOBDate) : null}
                        className={`${inputStyle} input2 focus:ring-0 w-full`}
                        format="DD/MM/YYYY"
                      />
                    </Popover>
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
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <BsTelephone className="h-[18px] w-[18px]" />
                        Phone
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
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <CiMail className="h-[18px] w-[18px]" />
                        Email
                      </span>
                    </Label>
                  </div>
                  <div className="space-y-0.5">
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
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <PiCreditCard className="h-[18px] w-[18px]" />
                          Aadhaar Number
                        </span>
                      </Label>
                    </div>
                    {adhaar.length > 0 && (
                      <p
                        className={`text-xs mt-0.5 ${
                          isValidAadhaar(adhaar)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {isValidAadhaar(adhaar)
                          ? 'Aadhaar valid'
                          : 'Aadhaar not valid'}
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
                        const v = e.target.value
                          .replace(/[^A-Za-z0-9]/g, '')
                          .toUpperCase();
                        if (v.length <= 10) setEmpPanNo(v);
                      }}
                      placeholder="e.g. ABCDE1234F"
                    />
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                             <PiCreditCard className="h-[18px] w-[18px]" />
                        PAN No.
                        </span>
                      </Label>
                    </div>
                   {empPanNo.length > 0 && (
                      <p
                        className={`text-xs mt-0.5 ${
                          isValidPan(empPanNo)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {isValidPan(empPanNo)
                          ? 'PAN valid (5 letters + 4 digits + 1 letter)'
                          : 'PAN not valid — use format: ABCDE1234F'}
                      </p>
                    )}
                  </div>
            
                  <div>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                        Department
                      </span>
                    </Label>
                    <Select
                      value={empDepartment}
                      onValueChange={setEmpDepartment}
                    >
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
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                        Designation
                      </span>
                    </Label>
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

          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Current Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">House No. / Address</Label>
                <Input
                  className={inputStyle}
                  value={present_houseNo}
                  onChange={(e) => setPresent_houseNo(e.target.value)}
                  placeholder="House no"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Colony</Label>
                  <Input
                    className={inputStyle}
                    value={present_colony}
                    onChange={(e) => setPresent_colony(e.target.value)}
                    placeholder="Colony"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">City</Label>
                  <Input
                    className={inputStyle}
                    value={present_city}
                    onChange={(e) => setPresent_city(e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">State</Label>
                  <Input
                    className={inputStyle}
                    value={present_state}
                    onChange={(e) => setPresent_state(e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Country</Label>
                  <Input
                    className={inputStyle}
                    value={present_country}
                    onChange={(e) => setPresent_country(e.target.value)}
                    placeholder="Country"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Pin Code</Label>
                  <Input
                    className={inputStyle}
                    value={present_pincode}
                    onChange={(e) => setPresent_pincode(e.target.value)}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Permanent Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">House No. / Address</Label>
                <Input
                  className={inputStyle}
                  value={perma_houseNo}
                  onChange={(e) => setPerma_houseNo(e.target.value)}
                  placeholder="House no"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Colony</Label>
                  <Input
                    className={inputStyle}
                    value={perma_colony}
                    onChange={(e) => setPerma_colony(e.target.value)}
                    placeholder="Colony"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">City</Label>
                  <Input
                    className={inputStyle}
                    value={perma_city}
                    onChange={(e) => setPerma_city(e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">State</Label>
                  <Input
                    className={inputStyle}
                    value={perma_state}
                    onChange={(e) => setPerma_state(e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Country</Label>
                  <Input
                    className={inputStyle}
                    value={perma_country}
                    onChange={(e) => setPerma_country(e.target.value)}
                    placeholder="Country"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Pin Code</Label>
                  <Input
                    className={inputStyle}
                    value={perma_pincode}
                    onChange={(e) => setPerma_pincode(e.target.value)}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-shrink-0 flex justify-end gap-2 px-6 py-4 border-t bg-slate-50/80">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400"
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WorkerEditDrawer;
