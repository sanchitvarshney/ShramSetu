import React, { useState, useCallback, useEffect } from 'react';
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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
import {
  buildResumeHtml,
  buildAddressLines,
  cleanAddrPart,
  fmt,
  convertMarital,
  convertGender,
  type ResumeData,
} from '@/lib/resumeHtml';
import { orshAxios } from '@/axiosIntercepter';
import { getWorkerImageAsBase64 } from '@/lib/workerImage';

interface WorkerDetailsProps {
  worker: any;
  toggleDetails?: (id?: string) => void;
  showEdit?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleStatus?: (status: 'APR' | 'REJ') => void;
  onWorkerUpdated?: () => void;
  /** When true, show loading state inside the sheet (e.g. while fetching GET /worker/details/:key) */
  detailsLoading?: boolean;
}

const getEmployeeId = (worker: any): string | undefined =>
  worker == null
    ? undefined
    : typeof worker === 'string'
      ? worker
      : (worker?.employeeID ?? worker?.empId ?? worker?.empCode ?? worker?.uid);

function workerToResumeData(w: any): ResumeData {
  const name =
    [w?.empFirstName, w?.empMiddleName, w?.empLastName]
      .filter(Boolean)
      .join(' ') || 'Worker';
  const presentLines = buildAddressLines(
    cleanAddrPart(w?.present_houseNo),
    cleanAddrPart(w?.present_colony),
    cleanAddrPart(w?.present_city),
    cleanAddrPart(w?.present_state),
    cleanAddrPart(w?.present_country),
    cleanAddrPart(w?.present_pincode),
  );

  let addressBlock = '';

  if (presentLines.length > 0) {
    addressBlock = presentLines
      .map((l) => `<div style="margin:0 0 2px 0;color:#475569;">${l}</div>`)
      .join('');
  }
  const employmentList = w?.companyInfo ?? [];
  const employment = Array.isArray(employmentList)
    ? employmentList.map((item: any) => ({
        companyName: item.companyName ?? item.company ?? '',
        role:
          typeof item.role === 'object' && item.role != null
            ? (item.role.text ?? item.role.value ?? '')
            : (item.role ?? item.designationName ?? ''),
        joining: item.empJoiningDate ?? item.joiningDate ?? item.joining ?? '',
        relieving:
          item.empRelievingDate ?? item.relievingDate ?? item.relieving ?? '',
        industry: item.industry ?? '',
      }))
    : [];
  const educationList = w?.educationList ?? w?.educationDetails ?? [];
  const education = Array.isArray(educationList)
    ? educationList.map((edu: any) => ({
        degree: edu.employeeDegree ?? edu.degree ?? '',
        stream: edu.employeeStream ?? edu.stream ?? '',
        university:
          edu.employeeUniversity ??
          edu.university ??
          edu.institution ??
          edu.school ??
          '',
        endYear: edu.endYear ?? edu.year ?? '',
      }))
    : [];
  const dob = w?.empDOB ?? '';
  const marital = w?.empMaritalStatus ?? '';
  const gender = w?.empGender ?? '';
  const nationality = w?.nationality ?? 'Indian';
  const aadhaar = fmt(w?.adhaar ?? w?.aadhaarNo);
  const pan = fmt(w?.empPanNo);
  const bloodGroup = fmt(w?.empBloodGroup ?? w?.bloodGroup);
  const hobbies = fmt(w?.empHobbies ?? '');
  const personalRows: { label: string; value: string }[] = [];
  if (dob) personalRows.push({ label: 'Date of Birth', value: fmt(dob) });
  if (marital)
    personalRows.push({
      label: 'Marital Status',
      value: convertMarital(marital),
    });
  if (gender)
    personalRows.push({ label: 'Gender', value: convertGender(gender) });
  personalRows.push({ label: 'Nationality', value: nationality });
  if (aadhaar) personalRows.push({ label: 'Aadhaar', value: aadhaar });
  if (pan) personalRows.push({ label: 'PAN', value: pan });
  if (bloodGroup)
    personalRows.push({ label: 'Blood Group', value: bloodGroup });
  if (hobbies) personalRows.push({ label: 'Hobbies', value: hobbies });
  const photoRaw = w?.empPhoto;
  const photoUrl =
    Array.isArray(photoRaw) && photoRaw.length > 0
      ? String(photoRaw[0]).trim()
      : typeof photoRaw === 'string' && photoRaw.trim()
        ? photoRaw.trim()
        : undefined;
  return {
    name,
    email: w?.empEmail ?? '',
    mobile: w?.empMobile ?? '',
    designation: w?.empDesignation ?? '',
    department: w?.empDepartment ?? '',
    addressBlock,
    careerObjective: w?.careerObjective ?? '',
    employment,
    education,
    personalRows,
    photoUrl: photoUrl || undefined,
  };
}

function buildWorkerResumeHtml(
  w: any,
  photoUrlOverride?: string,
): { bodyContent: string; fullHtml: string } {
  const data = workerToResumeData(w);
  return buildResumeHtml(
    photoUrlOverride != null ? { ...data, photoUrl: photoUrlOverride } : data,
  );
}

/** API path: backend fetches image from S3 and returns it (avoids CORS). Change if your API uses a different path. */
const WORKER_PHOTO_PROXY_PATH = '/worker/photo-proxy';

/** Small transparent PNG placeholder when photo cannot be loaded (e.g. CORS). */
const PLACEHOLDER_PHOTO_DATAURL =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" fill="#e2e8f0"/><text x="50" y="65" text-anchor="middle" fill="#64748b" font-size="11" font-family="sans-serif">No photo</text></svg>',
  );

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Fetch image from URL and return as base64 data URL.
 * 1) Tries backend API (GET /worker/photo-proxy?url=...) so server can fetch S3 image without CORS.
 * 2) Then direct fetch; 3) then CORS proxy. Returns undefined on failure so PDF still generates.
 */
async function resolvePhotoToBase64(url: string): Promise<string | undefined> {
  // 1) Call your API with the image URL – backend fetches from S3 and returns the image
  try {
    const { data } = await orshAxios.get<Blob>(WORKER_PHOTO_PROXY_PATH, {
      params: { url },
      responseType: 'blob',
    });
    if (data && data.size > 0) {
      return await blobToDataURL(data);
    }
  } catch {
    // API not implemented or failed – fallback to direct fetch / CORS proxy
  }

  // 2) Direct fetch (works if S3 has CORS headers)
  const toBase64 = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return blobToDataURL(await response.blob());
  };

  try {
    return await toBase64(url);
  } catch {
    // 3) CORS proxy fallback
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      return await toBase64(proxyUrl);
    } catch {
      return undefined;
    }
  }
}

function waitForImages(el: HTMLElement, timeoutMs = 3000): Promise<any> {
  const imgs = el.querySelectorAll('img');
  if (imgs.length === 0) return Promise.resolve();
  return Promise.race([
    Promise.all(
      Array.from(imgs).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
    ),
    new Promise<void>((r) => setTimeout(r, timeoutMs)),
  ]);
}

const WorkerDetails: React.FC<WorkerDetailsProps> = ({
  worker,
  showEdit = true,
  open,
  onOpenChange,
  onWorkerUpdated,
  detailsLoading = false,
}) => {
  const employeeId = getEmployeeId(worker);
  const isAdmin = getLoggedInUserType() === 'admin';
  const canEdit = Boolean(showEdit && isAdmin && employeeId);
  const [downloadResumeLoading, setDownloadResumeLoading] = useState(false);

  const handleDownloadResume = useCallback(async () => {
    if (!worker) return;
    setDownloadResumeLoading(true);
    const baseName =
      [worker?.empFirstName, worker?.empLastName].filter(Boolean).join('-') ||
      'worker';
    const safeName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const data = workerToResumeData(worker);
    const photoUrl = data.photoUrl;

    const empCode =
      employeeId ??
      worker?.empCode ??
      worker?.employeeID ??
      worker?.empId ??
      worker?.uid;
    let photoForPdf: string | undefined = empCode
      ? await getWorkerImageAsBase64(empCode)
      : undefined;

    if (photoForPdf == null) {
      const isDataUrl = photoUrl && photoUrl.startsWith('data:');
      photoForPdf =
        photoUrl && !isDataUrl
          ? ((await resolvePhotoToBase64(photoUrl)) ??
            PLACEHOLDER_PHOTO_DATAURL)
          : (photoUrl ?? PLACEHOLDER_PHOTO_DATAURL);
    }
    const { bodyContent, fullHtml } = buildWorkerResumeHtml(
      worker,
      photoForPdf,
    );

    const wrap = document.createElement('div');
    wrap.style.cssText =
      'position:fixed;left:-9999px;top:0;width:210mm;min-height:297mm;background:#fff;overflow:visible;';
    wrap.innerHTML = bodyContent;
    document.body.appendChild(wrap);

    const el = wrap.firstElementChild as HTMLElement;
    if (!el) {
      wrap.remove();
      fallbackDownloadHtml(fullHtml, safeName);
      return;
    }

    el.style.width = '210mm';

    await waitForImages(el);
    await new Promise((r) => setTimeout(r, 400));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
      });
      wrap.remove();

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = -heightLeft;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Worker-Resume-${safeName}.pdf`);
    } catch (err) {
      wrap.remove();
      console.error('PDF generation failed:', err);
      fallbackDownloadHtml(fullHtml, safeName);
    } finally {
      setDownloadResumeLoading(false);
    }
  }, [worker, employeeId]);

  function fallbackDownloadHtml(html: string, baseName: string) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Worker-Resume-${baseName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="flex flex-col h-full w-full max-w-4xl sm:min-w-[1000px] p-0 gap-0 overflow-hidden"
          onInteractOutside={(e: any) => e.preventDefault()}
        >
          <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 py-4 border-b bg-slate-50/80">
            <SheetTitle className="text-lg font-semibold text-slate-800">
              Worker Details
            </SheetTitle>
          </SheetHeader>

          {detailsLoading ? (
            <div className="flex-1 flex items-center justify-center flex-col px-6 py-12">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
              <p className="text-slate-500">Please wait...</p>
            </div>
          ) : worker ? (
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-slate-50/40">
              <div className="space-y-5 pb-4">
                <BasicDetailsFlat
                  details={worker}
                  employeeId={employeeId}
                  canEdit={canEdit}
                  onSuccess={onWorkerUpdated}
                />
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <CurrentAddressFlat
                    details={worker}
                    employeeId={employeeId}
                    canEdit={canEdit}
                    onSuccess={onWorkerUpdated}
                  />
                  <PermanentAddressFlat
                    details={worker}
                    employeeId={employeeId}
                    canEdit={canEdit}
                    onSuccess={onWorkerUpdated}
                  />
                </div>
                {worker && <EmployementDetails details={worker} />}
                {worker && <EducationDetailsFlat details={worker} />}
              </div>
            </div>
          ) : null}

          {!detailsLoading && worker && (
            <div className="flex-shrink-0 border-t border-slate-200/80 px-6 py-4 bg-white flex justify-end">
              <Button
                onClick={handleDownloadResume}
                variant="default"
                disabled={downloadResumeLoading}
              >
                {downloadResumeLoading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Preparing PDF...
                  </>
                ) : (
                  'Download Resume'
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
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
        ? ((value as { text?: string })?.text ?? '--')
        : String(value);
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-sm font-medium text-slate-500 shrink-0">
        {label}
      </span>
      <span className="text-sm text-slate-800 text-right break-words">
        {display}
      </span>
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

  const photoSrc =
    empPhotoUrl ||
    (Array.isArray(details?.empPhoto)
      ? details.empPhoto[0]
      : details?.empPhoto) ||
    '/profile.png';

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
                      const v = e.target.value
                        .replace(/[^A-Za-z0-9]/g, '')
                        .toUpperCase();
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
};

const CurrentAddressFlat = ({
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [houseNo, setHouseNo] = useState('');
  const [colony, setColony] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (details) {
      setHouseNo(details?.present_houseNo ?? '');
      setColony(details?.present_colony ?? '');
      setCity(details?.present_city ?? '');
      setStateVal(details?.present_state ?? '');
      setCountry(details?.present_country ?? '');
      setPincode(details?.present_pincode ?? '');
    }
  }, [details, isEditing]);

  const handleUpdateCurrentAddress = async () => {
    if (!employeeId) return;
    setSaving(true);
    try {
      await dispatch(
        updateEmployeeCurrentAddress({
          empId: employeeId,
          houseNoPresent: houseNo?.trim() || '',
          colonyPresent: colony?.trim() || '',
          cityPresent: city?.trim() || '',
          statePresent: stateVal?.trim() || '',
          countryPresent: country?.trim() || '',
          pinCodePresent: pincode?.trim() || '',
        }),
      ).unwrap();
      setIsEditing(false);
      onSuccess?.();
    } catch {
      // toast in slice
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">
            Current Address
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
              onClick={handleUpdateCurrentAddress}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Current Address'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">House No. / Address</Label>
            <Input
              className={inputStyle}
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="House no"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Colony</Label>
              <Input
                className={inputStyle}
                value={colony}
                onChange={(e) => setColony(e.target.value)}
                placeholder="Colony"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">City</Label>
              <Input
                className={inputStyle}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">State</Label>
              <Input
                className={inputStyle}
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Country</Label>
              <Input
                className={inputStyle}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Pin Code</Label>
              <Input
                className={inputStyle}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Current Address
        </CardTitle>
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

const PermanentAddressFlat = ({
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [houseNo, setHouseNo] = useState('');
  const [colony, setColony] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (details) {
      setHouseNo(details?.perma_houseNo ?? '');
      setColony(details?.perma_colony ?? '');
      setCity(details?.perma_city ?? '');
      setStateVal(details?.perma_state ?? '');
      setCountry(details?.perma_country ?? '');
      setPincode(details?.perma_pincode ?? '');
    }
  }, [details, isEditing]);

  const handleUpdatePermanentAddress = async () => {
    if (!employeeId) return;
    setSaving(true);
    try {
      await dispatch(
        updateEmployeePermanentAddress({
          empId: employeeId,
          houseNoPermanent: houseNo?.trim() || '',
          colonyPermanent: colony?.trim() || '',
          cityPermanent: city?.trim() || '',
          statePermanent: stateVal?.trim() || '',
          countryPermanent: country?.trim() || '',
          pinCodePermanent: pincode?.trim() || '',
        }),
      ).unwrap();
      setIsEditing(false);
      onSuccess?.();
    } catch {
      // toast in slice
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">
            Permanent Address
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
              onClick={handleUpdatePermanentAddress}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Permanent Address'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">House No. / Address</Label>
            <Input
              className={inputStyle}
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="House no"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Colony</Label>
              <Input
                className={inputStyle}
                value={colony}
                onChange={(e) => setColony(e.target.value)}
                placeholder="Colony"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">City</Label>
              <Input
                className={inputStyle}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">State</Label>
              <Input
                className={inputStyle}
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Country</Label>
              <Input
                className={inputStyle}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Pin Code</Label>
              <Input
                className={inputStyle}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Permanent Address
        </CardTitle>
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
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail label="House No." value={details?.perma_houseNo} />
          <SingleDetail label="Colony" value={details?.perma_colony} />
          <SingleDetail label="City" value={details?.perma_city} />
          <SingleDetail label="State" value={details?.perma_state} />
          <SingleDetail label="Country" value={details?.perma_country} />
          <SingleDetail label="Pin Code" value={details?.perma_pincode} />
        </div>
      </CardContent>
    </Card>
  );
};

const EmployementDetails = ({ details }: any) => {
  const list = details?.companyInfo ?? [];
  const hasList = Array.isArray(list) && list.length > 0;
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Employments
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {hasList &&
            list.map((emp: any, i: number) => (
              <div
                key={i}
                className={cn(
                  'px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50',
                )}
              >
                <SingleDetail label="Company" value={emp?.companyName} />
                <SingleDetail label="Industry" value={emp?.industry} />
                <DetailRow>
                  <SingleDetail label="Joined on" value={emp?.empJoiningDate} />
                  <SingleDetail
                    label="Releived on"
                    value={emp?.empRelievingDate ?? '--'}
                  />
                </DetailRow>
                <DetailRow>
                  <SingleDetail
                    label="Role"
                    value={emp?.designationName ?? '--'}
                  />
                  {emp?.empJoiningDate && emp?.empRelievingDate && (
                    <SingleDetail
                      label="Experience"
                      value={calculateExperience(
                        emp?.empJoiningDate,
                        emp?.empRelievingDate,
                      )}
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

const EducationDetailsFlat = ({ details }: { details: any }) => {
  const list = details?.educationList ?? details?.educationDetails ?? [];
  const hasList = Array.isArray(list) && list.length > 0;
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {hasList &&
            list.map((edu: any, i: number) => (
              <div
                key={edu?.educationID ?? i}
                className={cn(
                  'px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50',
                )}
              >
                     <SingleDetail
                  label="School / University"
                  value={
                    edu?.employeeUniversity ??
                    edu?.university ??
                    edu?.institution ??
                    edu?.school ??
                    '--'
                  }
                />
                <DetailRow>
                  <SingleDetail
                    label="Degree"
                    value={edu?.employeeDegree ?? edu?.degree ?? '--'}
                  />
                  <SingleDetail
                    label="Stream"
                    value={edu?.employeeStream ?? edu?.stream ?? '--'}
                  />
                </DetailRow>
               
                <DetailRow>
              
                  <SingleDetail
                    label="Board / Type"
                    value={edu?.educationType ?? '--'}
                  />
            <SingleDetail
                    label="Start Year"
                    value={edu?.startYear ?? '--'}
                  />
                </DetailRow>
                <DetailRow>
                
                  <SingleDetail label="End Year" value={edu?.endYear ?? '--'} />
                </DetailRow>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
