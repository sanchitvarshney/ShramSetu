import { useEffect, useCallback, useState, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchApplicationDetails,
  clearApplicationDetails,
  type ApplicantDetail,
} from '@/features/jobFeatures/jobApplicationsSlice';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Loading from '@/components/reusable/Loading';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  buildResumeHtml as buildResumeHtmlShared,
  buildAddressLines,
  cleanAddrPart,
  fmt,
  convertMarital,
  convertGender,
  type ResumeData,
} from '@/lib/resumeHtml';
import { getWorkerImageAsBase64 } from '@/lib/workerImage';

function applicantToResumeData(d: ApplicantDetail): ResumeData {
  const name = d.empName ?? d.applicantName ?? 'Applicant';
  const presentLines = buildAddressLines(
    cleanAddrPart(d.presentHouseNo ?? d.present_houseNo),
    cleanAddrPart(d.presentColony ?? d.present_colony),
    cleanAddrPart(d.present_city ?? d.presentCity ?? d.present_district ?? d.presentDistrict),
    cleanAddrPart(d.presentState ?? d.present_state),
    cleanAddrPart(d.present_country ?? d.presentCountry),
    cleanAddrPart(d.presentPincode ?? d.present_pincode),
  );
  const permaLines = buildAddressLines(
    cleanAddrPart(d.perma_houseNo ?? d.permaHouseNo),
    cleanAddrPart(d.perma_colony ?? d.permaColony),
    cleanAddrPart(d.perma_city ?? d.permaCity),
    cleanAddrPart(d.perma_state ?? d.permaState),
    cleanAddrPart(d.perma_country ?? d.permaCountry),
    cleanAddrPart(d.perma_pincode ?? d.permaPincode),
  );
  const hasPresent = presentLines.length > 0;
  const hasPerma = permaLines.length > 0;
  const sameAddress = hasPresent && hasPerma && presentLines.join(' ') === permaLines.join(' ');
  const showPerma = hasPerma && !sameAddress;
  let addressBlock = '';
  if (hasPresent) {
    addressBlock += presentLines.map((l) => `<p style="font-size:11px;margin:0 0 1px 0;color:#475569;">${l}</p>`).join('');
    if (showPerma) {
      addressBlock += `<p style="font-size:10px;margin:4px 0 1px 0;color:#64748b;font-weight:600;">Permanent:</p>`;
      addressBlock += permaLines.map((l) => `<p style="font-size:11px;margin:0 0 1px 0;color:#475569;">${l}</p>`).join('');
    }
  } else if (hasPerma) {
    addressBlock += permaLines.map((l) => `<p style="font-size:11px;margin:0 0 1px 0;color:#475569;">${l}</p>`).join('');
  }
  const employmentList = d.companyInfo ?? d.employmentList ?? d.employment ?? [];
  const employment = Array.isArray(employmentList)
    ? employmentList.map((item: any) => ({
        companyName: item.companyName ?? item.company ?? '',
        role: typeof item.role === 'object' && item.role != null ? (item.role.text ?? item.role.value ?? '') : (item.role ?? item.empDesignation ?? ''),
        joining: item.empJoiningDate ?? item.joiningDate ?? item.joining ?? '',
        relieving: item.empRelievingDate ?? item.relievingDate ?? item.relieving ?? '',
        industry: item.industry ?? '',
      }))
    : [];
  const educationList = d.educationList ?? [];
  const degrees = Array.isArray(d.degree) ? d.degree : d.degree ? [d.degree] : [];
  const universities = Array.isArray(d.university) ? d.university : d.university ? [d.university] : [];
  const education: ResumeData['education'] = [];
  if (Array.isArray(educationList) && educationList.length > 0) {
    educationList.forEach((edu: any) => {
      education.push({
        degree: edu.employeeDegree ?? edu.degree ?? '',
        stream: edu.employeeStream ?? edu.stream ?? '',
        university: edu.university ?? edu.institution ?? edu.school ?? '',
        endYear: edu.endYear ?? edu.year ?? '',
      });
    });
  } else {
    degrees.forEach((deg: any, i: number) => {
      education.push({ degree: fmt(deg), stream: '', university: fmt(universities[i]), endYear: '' });
    });
  }
  const dob = d.dob ?? d.empDOB ?? '';
  const marital = d.empMaritalStatus ?? d.marital ?? '';
  const gender = d.gender ?? d.empGender ?? '';
  const nationality = d.nationality ?? 'Indian';
  const aadhaar = fmt(d.adhaar ?? d.aadhaarNo);
  const pan = fmt(d.empPanNo ?? d.panNo);
  const bloodGroup = fmt(d.empBloodGroup ?? d.bloodGroup);
  const hobbies = fmt(d.empHobbies ?? d.hobbies ?? '');
  const personalRows: { label: string; value: string }[] = [];
  if (dob) personalRows.push({ label: 'Date of Birth', value: fmt(dob) });
  if (marital) personalRows.push({ label: 'Marital Status', value: convertMarital(marital) });
  if (gender) personalRows.push({ label: 'Gender', value: convertGender(gender) });
  personalRows.push({ label: 'Nationality', value: nationality });
  if (aadhaar) personalRows.push({ label: 'Aadhaar', value: aadhaar });
  if (pan) personalRows.push({ label: 'PAN', value: pan });
  if (bloodGroup) personalRows.push({ label: 'Blood Group', value: bloodGroup });
  if (hobbies) personalRows.push({ label: 'Hobbies', value: hobbies });
  const photoRaw = d.empPhoto ?? (d as any).empPhoto;
  const photoUrl =
    Array.isArray(photoRaw) && photoRaw.length > 0
      ? String(photoRaw[0]).trim()
      : typeof photoRaw === 'string' && photoRaw.trim()
        ? photoRaw.trim()
        : undefined;
  return {
    name,
    email: d.empEmail ?? '',
    mobile: d.empMobile ?? '',
    designation: d.designation ?? '',
    department: d.department ?? '',
    addressBlock,
    careerObjective: d.careerObjective ?? '',
    employment,
    education,
    personalRows,
    photoUrl: photoUrl || undefined,
  };
}

function buildResumeHtml(d: ApplicantDetail, photoUrlOverride?: string): { fullHtml: string; bodyContent: string } {
  const data = applicantToResumeData(d);
  return buildResumeHtmlShared(photoUrlOverride != null ? { ...data, photoUrl: photoUrlOverride } : data);
}

/** Placeholder when no photo is available for PDF. */
const PLACEHOLDER_PHOTO_DATAURL =
  'data:image/svg+xml;base64,' +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" fill="#e2e8f0"/><text x="50" y="65" text-anchor="middle" fill="#64748b" font-size="11" font-family="sans-serif">No photo</text></svg>',
  );

/** Resolve image URL to base64 so PDF export can render it (avoids CORS/taint). */
async function resolvePhotoToBase64(url: string): Promise<string | undefined> {
  const fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;

  try {
    const res = await fetch(fullUrl, { mode: 'cors', credentials: 'include' });
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Fallback: load via Image and draw to canvas (works for same-origin or CORS-enabled)
    try {
      return await new Promise<string | undefined>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(undefined);
              return;
            }
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch {
            resolve(undefined);
          }
        };
        img.onerror = () => resolve(undefined);
        img.src = fullUrl;
      });
    } catch {
      return undefined;
    }
  }
}

/** Wait for all images inside element to load (so html2canvas can capture them). */
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
          })
      )
    ),
    new Promise<void>((r) => setTimeout(r, timeoutMs)),
  ]);
}

interface ApplicantDetailsDialogProps {
  appliedKey: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplicantDetailsDialog({
  appliedKey,
  open,
  onOpenChange,
}: ApplicantDetailsDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { applicationDetails, applicationDetailsLoading } = useSelector(
    (state: RootState) => state.jobApplications,
  );
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    if (open && appliedKey) {
      dispatch(fetchApplicationDetails(appliedKey));
    }
    if (!open) {
      dispatch(clearApplicationDetails());
    }
  }, [open, appliedKey, dispatch]);

  const handleDownload = useCallback(async () => {
    if (!applicationDetails) return;
    setDownloadLoading(true);
    const baseName = (applicationDetails.empName ?? applicationDetails.empEmail ?? 'details').replace(/[^a-zA-Z0-9.-]/g, '_');
    const data = applicantToResumeData(applicationDetails);
    const photoUrl = data.photoUrl;

    const empCode =
      applicationDetails.empCode ??
      applicationDetails.key ??
      (applicationDetails as any).employeeID;
    let photoForPdf: string | undefined =
      empCode ? await getWorkerImageAsBase64(empCode) : undefined;

    if (photoForPdf == null) {
      const isDataUrl = photoUrl && photoUrl.startsWith('data:');
      photoForPdf =
        photoUrl && !isDataUrl
          ? (await resolvePhotoToBase64(photoUrl)) ?? PLACEHOLDER_PHOTO_DATAURL
          : photoUrl ?? PLACEHOLDER_PHOTO_DATAURL;
    }
    const { fullHtml, bodyContent } = buildResumeHtml(applicationDetails, photoForPdf);

    const wrap = document.createElement('div');
    wrap.style.cssText =
      'position:fixed;left:-9999px;top:0;width:210mm;min-height:297mm;background:#fff;overflow:visible;';
    wrap.innerHTML = bodyContent;
    document.body.appendChild(wrap);

    const el = wrap.firstElementChild as HTMLElement;
    if (!el) {
      wrap.remove();
      fallbackDownloadHtml(fullHtml, baseName);
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

      pdf.save(`Applicant-Resume-${baseName}.pdf`);
    } catch (err) {
      wrap.remove();
      console.error('PDF generation failed:', err);
      fallbackDownloadHtml(fullHtml, baseName);
    } finally {
      setDownloadLoading(false);
    }
  }, [applicationDetails]);

  function fallbackDownloadHtml(html: string, baseName: string) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Applicant-Resume-${baseName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const d = applicationDetails;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 max-w-3xl max-h-[90vh] w-full -translate-x-1/2 -translate-y-1/2 flex flex-col p-0 bg-white rounded-xl shadow-lg overflow-hidden">
        {applicationDetailsLoading && (
          <Loading message="Loading applicant..." variant="minimal" />
        )}
        {d && (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
              <div className="space-y-5 pb-4">
                <SectionTitle text="Applicant Details" />
                <DetailRow>
                  <SingleDetail label="Name" value={d.empName ?? d.applicantName ?? '--'} />
                  <SingleDetail label="Job Title" value={d.jobTitle ?? '--'} />
                </DetailRow>
                <DetailRow>
                  <SingleDetail label="Email" value={d.empEmail ?? d.email ?? '--'} />
                  <SingleDetail label="Mobile" value={d.empMobile ?? d.mobile ?? '--'} />
                </DetailRow>
                <DetailRow>
                  <SingleDetail label="Company" value={d.company ?? '--'} />
                  <SingleDetail label="Department" value={d.department ?? '--'} />
                </DetailRow>
                <DetailRow>
                  <SingleDetail label="Designation" value={d.designation ?? '--'} />
                  <SingleDetail label="Experience" value={d.experience ?? '--'} />
                </DetailRow>

                <SectionTitle text="Personal" />
                <DetailRow>
                  <SingleDetail label="DOB" value={d.empDOB ?? d.dob ?? '--'} />
                  <SingleDetail
                    label="Gender"
                    value={
                      d.empGender
                        ? convertGender(d.empGender)
                        : d.gender
                          ? convertGender(d.gender)
                          : '--'
                    }
                  />
                </DetailRow>

                <SectionTitle text="Education / Skills" />
                <SingleDetail
                  label="Qualification"
                  value={d.qualification ?? '--'}
                />
                <SingleDetail label="Skills" value={d.skills ?? '--'} />
                <SingleDetail label="Education" value={d.education ?? '--'} />

                <SectionTitle text="Salary" />
                <SingleDetail
                  label="Range"
                  value={
                    d.minSalary || d.maxSalary
                      ? `${d.minSalary ?? ''}${d.minSalary ? ' - ' : ''}${d.maxSalary ?? ''}`
                      : '--'
                  }
                />
              </div>
            </div>
          </>
        )}

        {!d && open && appliedKey && !applicationDetailsLoading && (
          <p className="text-slate-500 py-4 px-6">No details available.</p>
        )}

        <DialogFooter className="border-t border-slate-200/80 px-6 py-4 flex justify-between bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {d && (
            <Button
              onClick={handleDownload}
              variant="default"
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Preparing PDF...
                </>
              ) : (
                'Download Resume'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SectionTitle = ({ text }: { text: string }) => {
  return (
    <div className="bg-slate-200 text-slate-900 font-bold uppercase tracking-wide text-[13px] px-3 py-2">
      {text}
    </div>
  );
};

const DetailRow = ({ children }: { children: ReactNode }) => {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-0">{children}</div>;
};

const SingleDetail = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  const display = value == null || value === '' ? '--' : String(value);
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
