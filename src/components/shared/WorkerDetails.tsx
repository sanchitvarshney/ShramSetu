import React, { useState, useCallback } from 'react';
import { Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IconButton from '@/components/ui/IconButton';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SelectOptionType } from '@/types/general';
import { cn } from '@/lib/utils';
import { differenceInDays, parse } from 'date-fns';
import { getLoggedInUserType } from '@/lib/routeAccess';
import WorkerEditDrawer from '@/components/shared/WorkerEditDrawer';
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
  onWorkerUpdated?: () => void;
}

const getEmployeeId = (worker: any): string | undefined =>
  worker == null ? undefined : typeof worker === 'string' ? worker : worker?.employeeID ?? worker?.empId ?? worker?.uid;

// --- Resume/CV layout (same as ApplicantDetailsDialog PDF style, with photo) ---
function fmt(v: any): string {
  if (v === undefined || v === null || v === '') return '';
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  return String(v);
}
function sectionTitle(title: string): string {
  return `<div style="margin-top:18px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" /><h2 style="font-size:11px;font-weight:700;margin:0;padding:8px 12px;background:#f8fafc;color:#475569;text-transform:uppercase;letter-spacing:0.08em;">${title}</h2></div><div style="margin-bottom:8px;"></div>`;
}
function detailRow(label: string, value: string): string {
  if (!value) return '';
  return `<p style="margin:2px 0;font-size:13px;color:#334155;">${label} ${value}</p>`;
}
function convertMarital(m: string): string {
  if (m === 'M') return 'Married';
  if (m === 'U' || m === 'Um') return 'Unmarried';
  return m || '';
}
function convertGender(g: string): string {
  if (g === 'M') return 'Male';
  if (g === 'F') return 'Female';
  return g || '';
}

function cleanAddrPart(x: string | null | undefined): string {
  const v = x == null ? '' : String(x).trim();
  return v === '' || v === '--' ? '' : v;
}

function buildAddressLines(houseNo: string, colony: string, city: string, state: string, country: string, pincode: string): string[] {
  const parts1 = [houseNo, colony, city].filter(Boolean);
  const line1 = parts1.join(', ');
  const parts2 = [state, country, pincode].filter(Boolean);
  const line2 = parts2.join(', ');
  const lines: string[] = [];
  if (line1) lines.push(line1);
  if (line2) lines.push(line2);
  return lines;
}

function buildWorkerResumeHtml(w: any): { bodyContent: string; fullHtml: string } {
  const name = [w?.empFirstName, w?.empMiddleName, w?.empLastName].filter(Boolean).join(' ') || 'Worker';
  const email = w?.empEmail ?? '';
  const mobile = w?.empMobile ?? '';
  const dob = w?.empDOB ?? '';
  const gender = w?.empGender ?? '';
  const marital = w?.empMaritalStatus ?? '';
  const hobbies = w?.empHobbies ?? '';

  const presentLines = buildAddressLines(
    cleanAddrPart(w?.present_houseNo),
    cleanAddrPart(w?.present_colony),
    cleanAddrPart(w?.present_city),
    cleanAddrPart(w?.present_state),
    cleanAddrPart(w?.present_country),
    cleanAddrPart(w?.present_pincode),
  );
  const permaLines = buildAddressLines(
    cleanAddrPart(w?.perma_houseNo),
    cleanAddrPart(w?.perma_colony),
    cleanAddrPart(w?.perma_city),
    cleanAddrPart(w?.perma_state),
    cleanAddrPart(w?.perma_country),
    cleanAddrPart(w?.perma_pincode),
  );
  const hasPresent = presentLines.length > 0;
  const hasPerma = permaLines.length > 0;
  const sameAddress = hasPresent && hasPerma && presentLines.join(' ') === permaLines.join(' ');
  const showPerma = hasPerma && !sameAddress;

  const photoSrc = Array.isArray(w?.empPhoto) ? w.empPhoto[0] : w?.empPhoto;
  const photoHtml = photoSrc
    ? `<div style="flex-shrink:0;width:110px;height:130px;border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);"><img src="${photoSrc}" alt="" style="width:100%;height:100%;object-fit:cover;" /></div>`
    : '';

  let addressBlock = '';
  if (hasPresent) {
    addressBlock += presentLines.map((line) => `<p style="font-size:13px;margin:0 0 2px 0;color:#475569;">${line}</p>`).join('');
    if (showPerma) {
      addressBlock += `<p style="font-size:11px;margin:6px 0 2px 0;color:#64748b;font-weight:600;">Permanent:</p>`;
      addressBlock += permaLines.map((line) => `<p style="font-size:13px;margin:0 0 2px 0;color:#475569;">${line}</p>`).join('');
    }
  } else if (hasPerma) {
    addressBlock += permaLines.map((line) => `<p style="font-size:13px;margin:0 0 2px 0;color:#475569;">${line}</p>`).join('');
  }

  const sections: string[] = [];

  sections.push(`
    <p style="text-align:center;font-size:20px;font-weight:700;margin:0 0 8px 0;color:#0f172a;text-transform:uppercase;letter-spacing:0.06em;">CURRICULUM VITAE</p>
    <div style="height:2px;width:48px;background:#0f172a;margin:0 auto 20px auto;"></div>
  `);
  sections.push(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;">
      <div style="flex:1;min-width:0;">
        <p style="font-size:17px;font-weight:700;margin:0 0 6px 0;color:#0f172a;">${name}</p>
        ${addressBlock || ''}
        <p style="margin:4px 0 0 0;font-size:13px;color:#334155;">Mob No: ${mobile || 'N/A'}</p>
        <p style="margin:2px 0 0 0;font-size:13px;color:#334155;">Email Id: <span style="text-decoration:underline;">${email || 'N/A'}</span></p>
      </div>
      ${photoHtml}
    </div>
    <div style="height:16px;"></div>
  `);

  const careerObjective = w?.careerObjective ?? 'To build career in a growing organization, where I can get the opportunities to prove my abilities by accepting challenges, fulfilling the organizational goal and climb the career ladder through continuous learning and commitment.';
  sections.push(`
    ${sectionTitle('CAREER OBJECTIVE')}
    <p style="margin:0;font-size:13px;line-height:1.6;color:#334155;">${careerObjective}</p>
    <div style="height:12px;"></div>
  `);

  const employmentList = w?.companyInfo ?? [];
  const hasEmployment = Array.isArray(employmentList) && employmentList.length > 0;
  if (hasEmployment) {
    sections.push(sectionTitle('EXPERIENCE'));
    employmentList.forEach((item: any) => {
      const companyName = item.companyName ?? item.company ?? '';
      const joining = item.empJoiningDate ?? item.joiningDate ?? item.joining ?? '';
      const relieving = item.empRelievingDate ?? item.relievingDate ?? item.relieving ?? '';
      sections.push(`
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;gap:16px;">
          <p style="font-size:13px;margin:0;flex:1;color:#334155;">${fmt(companyName)}</p>
          <p style="font-size:12px;margin:0;color:#64748b;white-space:nowrap;">${fmt(joining)} ${relieving ? '| ' + fmt(relieving) : ''}</p>
        </div>
      `);
    });
    sections.push('<div style="height:12px;"></div>');
  }

  const educationList = w?.educationList ?? [];
  const hasEduList = Array.isArray(educationList) && educationList.length > 0;
  if (hasEduList) {
    sections.push(sectionTitle('EDUCATION'));
    educationList.forEach((edu: any) => {
      const deg = edu.employeeDegree ?? edu.degree ?? '';
      const stream = edu.employeeStream ?? edu.stream ?? '';
      const endYear = edu.endYear ?? edu.year ?? '';
      sections.push(`
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;gap:16px;">
          <p style="margin:0;font-size:13px;color:#334155;">${fmt(deg)}</p>
          <p style="margin:0;font-size:12px;color:#64748b;white-space:nowrap;">${[stream, endYear].filter(Boolean).join(' | ')}</p>
        </div>
      `);
    });
    sections.push('<div style="height:12px;"></div>');
  }

  sections.push(sectionTitle('PERSONAL DETAILS'));
  sections.push(detailRow('Date of Birth', fmt(dob)));
  sections.push(detailRow('Marital Status', convertMarital(marital)));
  sections.push(detailRow('Sex', convertGender(gender)));
  sections.push(detailRow('Nationality', w?.nationality ?? 'Indian'));
  sections.push(detailRow('Hobbies', fmt(hobbies)));
  sections.push(detailRow('Aadhaar', fmt(w?.adhaar)));
  sections.push('<div style="height:18px;"></div>');

  sections.push(sectionTitle('DECLARATION'));
  sections.push(`
    <p style="margin:0;font-size:13px;line-height:1.6;color:#334155;">I solemnly declare that all the above information is correct to the best of my knowledge and belief.</p>
    <div style="height:20px;"></div>
    <p style="margin:0;font-size:13px;color:#334155;">Date ........... &nbsp; Place ...........</p>
  `);

  const bodyInner = sections.join('\n');
  const bodyContent = `<div style="font-family:'Segoe UI',system-ui,-apple-system,sans-serif;max-width:700px;margin:0;padding:28px 32px;color:#334155;line-height:1.5;background:#fff;box-sizing:border-box;box-shadow:0 1px 3px rgba(0,0,0,0.08);">${bodyInner}</div>`;
  const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>body{font-family:'Segoe UI',system-ui,sans-serif;margin:0;padding:28px 32px;color:#334155;background:#fff;}</style></head><body>${bodyInner}</body></html>`;
  return { bodyContent, fullHtml };
}

const WorkerDetails: React.FC<WorkerDetailsProps> = ({
  worker,
  showEdit = true,
  open,
  onOpenChange,
  onWorkerUpdated,
}) => {
  const employeeId = getEmployeeId(worker);
  const isAdmin = getLoggedInUserType() === 'admin';
  const canEdit = showEdit && isAdmin && employeeId;
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const handleDownloadResume = useCallback(async () => {
    if (!worker) return;
    const baseName = [worker?.empFirstName, worker?.empLastName].filter(Boolean).join('-') || 'worker';
    const safeName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const { bodyContent, fullHtml } = buildWorkerResumeHtml(worker);

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm;min-height:297mm;background:#fff;';
    wrap.innerHTML = bodyContent;
    document.body.appendChild(wrap);

    const el = wrap.firstElementChild as HTMLElement;
    if (!el) {
      wrap.remove();
      fallbackDownloadHtml(fullHtml, safeName);
      return;
    }

    await new Promise((r) => setTimeout(r, 100));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
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
    }
  }, [worker]);

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
          className="flex flex-col h-full w-full max-w-4xl sm:min-w-[560px] p-0 gap-0 overflow-hidden"
          onInteractOutside={(e: any) => e.preventDefault()}
        >
          <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 py-4 border-b bg-slate-50/80">
            <SheetTitle className="text-lg font-semibold text-slate-800">
              Worker Details
            </SheetTitle>
            {!canEdit && (
              <IconButton
                tooltip="Edit Worker"
                icon={<Edit size={18} className="mt-0.5 text-slate-600" />}
                onClick={() => setEditDrawerOpen(true)}
              />
            )}
          </SheetHeader>

          {worker ? (
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-slate-50/40">
              <div className="space-y-5 pb-4">
                <BasicDetailsFlat details={worker} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CurrentAddressFlat details={worker} />
                  <PermanentAddressFlat details={worker} />
                </div>
                {worker && <EmployementDetails details={worker} />}
              </div>
            </div>
          ) : null}

          {worker && (
            <div className="flex-shrink-0 border-t border-slate-200/80 px-6 py-4 bg-white flex justify-end">
              <Button onClick={handleDownloadResume} variant="default">
                Download Resume
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <WorkerEditDrawer
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        worker={worker}
        employeeId={employeeId}
        onSuccess={onWorkerUpdated}
        onCloseDetails={() => onOpenChange?.(false)}
      />
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
          <SingleDetail label="Marital Status" value={details?.empMaritalStatus === 'M' ? 'Married' : details?.empMaritalStatus === 'U' ? 'Unmarried' : details?.empMaritalStatus === "Um" ? "Unmarried" : details?.empMaritalStatus} />
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
 
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Permanent Address
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail label="House No." value={details?.perma_houseNo} />
          <SingleDetail label="State" value={details?.present_state} />
          <SingleDetail label="City" value={details?.perma_city} />
          <SingleDetail label="District" value={details?.perma_country} />
          <SingleDetail label="Pin Code" value={details?.perma_pincode} />
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


