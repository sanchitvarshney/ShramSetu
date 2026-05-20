import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, X } from 'lucide-react';
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
import dayjs from 'dayjs';
import { DatePicker, DatePickerProps } from 'antd';
import {
  updateEmployeeDetails,
  updateWorkerProfile,
  fetchDepartments,
  fetchDesignations,
  type Department,
  type Designation,
} from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import { inputStyle } from '@/style/CustomStyles';
import { capitalizeName, cn } from '@/lib/utils';
import { isValidAadhaar, isValidPan } from '@/lib/validations';
import { buildWorkerUpdatePayload } from '@/lib/workerUpdatePayload';
import { marriedStatus } from '@/types/general';
import { PLACEHOLDER_PHOTO_DATAURL } from './constants';
import { DetailRow, SingleDetail } from './detailPrimitives';
import {
  EditField,
  EDIT_FIELD_LABEL,
  EDIT_FORM_GRID,
} from './editFormPrimitives';
import { parseDOB } from './parseDob';
import {
  getMaritalStatusFromDetails,
  resolveMaritalStatusSelectValue,
} from './resolveMaritalStatus';

const selectTriggerClass = cn(inputStyle, 'input2 focus:ring-0 w-full');

export const BasicDetailsFlat = React.memo(function BasicDetailsFlat({
  details,
  employeeId,
  canEdit,
  onSuccess,
}: {
  details: any;
  employeeId: string | undefined;
  canEdit: boolean;
  onSuccess?: () => void;
}) {
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
      setEmpMaritalStatus(
        resolveMaritalStatusSelectValue(getMaritalStatusFromDetails(details)),
      );
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
      await dispatch(
        updateWorkerProfile({ empId: employeeId, image: file }),
      ).unwrap();
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

  const resolvedPhoto =
    Array.isArray(details?.empPhoto) && details.empPhoto.length > 0
      ? String(details.empPhoto[0] ?? '').trim()
      : typeof details?.empPhoto === 'string'
        ? details.empPhoto.trim()
        : '';
  const photoSrc = empPhotoUrl || resolvedPhoto || PLACEHOLDER_PHOTO_DATAURL;

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
              className="bg-[#115e59] hover:bg-[#0d4a46]"
              onClick={handleUpdateBasic}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Basic Details'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 worker-details-edit">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0 flex flex-col items-center sm:items-start gap-2">
              <Label className={EDIT_FIELD_LABEL}>Profile photo</Label>
              <label
                htmlFor="basic-details-photo"
                className="relative block w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 cursor-pointer group"
              >
                <img
                  src={photoSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                  Change
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="basic-details-photo"
              />
              <Label
                htmlFor="basic-details-photo"
                className="text-xs cursor-pointer text-teal-700 hover:text-teal-800 font-medium"
              >
                {empPhotoFile ? 'Change photo' : 'Upload photo'}
              </Label>
            </div>
            <div className={cn('flex-1 min-w-0', EDIT_FORM_GRID)}>
              <EditField label="First name">
                <Input
                  className={inputStyle}
                  value={empFirstName}
                  onChange={(e) =>
                    setEmpFirstName(capitalizeName(e.target.value))
                  }
                  placeholder="First name"
                />
              </EditField>
              <EditField label="Middle name">
                <Input
                  className={inputStyle}
                  value={empMiddleName}
                  onChange={(e) =>
                    setEmpMiddleName(capitalizeName(e.target.value))
                  }
                  placeholder="Middle name"
                />
              </EditField>
              <EditField label="Last name">
                <Input
                  className={inputStyle}
                  value={empLastName}
                  onChange={(e) =>
                    setEmpLastName(capitalizeName(e.target.value))
                  }
                  placeholder="Last name"
                />
              </EditField>
              <EditField label="Gender">
                <Select value={empGender} onValueChange={setEmpGender}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </EditField>
              <EditField label="Date of birth">
                <DatePicker
                  onChange={onDOBChange}
                  value={empDOBDate ? dayjs(empDOBDate) : null}
                  className={cn(inputStyle, 'input2 w-full')}
                  format="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                />
              </EditField>
              <EditField label="Phone">
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={15}
                  className={inputStyle}
                  value={empMobile}
                  onChange={(e) =>
                    setEmpMobile(e.target.value.replace(/\D/g, ''))
                  }
                  placeholder="Mobile number"
                />
              </EditField>
              <EditField label="Email" className="sm:col-span-2">
                <Input
                  type="email"
                  className={inputStyle}
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  placeholder="Email address"
                />
              </EditField>
              <EditField label="Marital status">
                <Select
                  value={
                    marriedStatus.some((o) => o.value === empMaritalStatus)
                      ? empMaritalStatus
                      : undefined
                  }
                  onValueChange={setEmpMaritalStatus}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {marriedStatus.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </EditField>
              <EditField label="Hobbies" className="sm:col-span-2">
                <Input
                  className={inputStyle}
                  value={empHobbies}
                  onChange={(e) => setEmpHobbies(e.target.value)}
                  placeholder="Hobbies"
                />
              </EditField>
              <EditField label="Blood group">
                <Input
                  className={inputStyle}
                  value={empBloodGroup}
                  onChange={(e) => setEmpBloodGroup(e.target.value)}
                  placeholder="e.g. O+"
                />
              </EditField>
              <EditField
                label="Aadhaar number"
                hint={
                  <span
                    className={cn(
                      adhaar.length > 0
                        ? isValidAadhaar(adhaar)
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'invisible',
                    )}
                  >
                    {adhaar.length > 0
                      ? isValidAadhaar(adhaar)
                        ? 'Valid Aadhaar'
                        : 'Invalid Aadhaar'
                      : '\u00a0'}
                  </span>
                }
              >
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  className={inputStyle}
                  value={adhaar}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v.length <= 12) setAdhaar(v);
                  }}
                  placeholder="12 digits"
                />
              </EditField>
              <EditField
                label="PAN number"
                hint={
                  <span
                    className={cn(
                      empPanNo.length > 0
                        ? isValidPan(empPanNo)
                          ? 'text-green-600'
                          : 'text-red-600'
                        : 'invisible',
                    )}
                  >
                    {empPanNo.length > 0
                      ? isValidPan(empPanNo)
                        ? 'Valid PAN'
                        : 'Format: 5 letters + 4 digits + 1 letter'
                      : '\u00a0'}
                  </span>
                }
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
              </EditField>
              <EditField label="Department">
                <Select value={empDepartment} onValueChange={setEmpDepartment}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList?.map((dept: Department) => (
                      <SelectItem key={dept?.value} value={dept?.value}>
                        {dept?.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </EditField>
              <EditField label="Designation">
                <Select
                  value={empDesignation}
                  onValueChange={setEmpDesignation}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designationList?.map((desg: Designation) => (
                      <SelectItem key={desg?.value} value={desg?.value}>
                        {desg?.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </EditField>
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
          <SingleDetail
            label="Gender"
            value={
              details?.empGender === 'M'
                ? 'Male'
                : details?.empGender === 'F'
                  ? 'Female'
                  : details?.empGender
            }
          />
          <SingleDetail label="Phone" value={details?.empMobile} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Email" value={details?.empEmail} />
          <SingleDetail
            label="Marital Status"
            value={
              details?.empMaritalStatus === 'M'
                ? 'Married'
                : details?.empMaritalStatus === 'U' ||
                    details?.empMaritalStatus === 'UM'
                  ? 'Unmarried'
                  : details?.empMaritalStatus
            }
          />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Hobbies" value={details?.empHobbies} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Aadhaar Number" value={details?.adhaar} />
          <SingleDetail
            label="PAN Number"
            value={
              details?.empPanNo
                ? String(details.empPanNo).toUpperCase()
                : undefined
            }
          />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Blood Group" value={details?.empBloodGroup} />
          <SingleDetail label="Department" value={details?.department} />
        </DetailRow>
        <DetailRow>
          <SingleDetail label="Designation" value={details?.designation} />
        </DetailRow>
      </CardContent>
    </Card>
  );
});
