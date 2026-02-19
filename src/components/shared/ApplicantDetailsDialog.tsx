import { useEffect, useCallback } from 'react';
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
  DialogHeader,
  DialogTitle,
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
  };
}

function buildResumeHtml(d: ApplicantDetail): { fullHtml: string; bodyContent: string } {
  return buildResumeHtmlShared(applicantToResumeData(d));
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
    const baseName = (applicationDetails.empName ?? applicationDetails.empEmail ?? 'details').replace(/[^a-zA-Z0-9.-]/g, '_');
    const { fullHtml, bodyContent } = buildResumeHtml(applicationDetails);

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:-9999px;top:0;width:210mm;min-height:297mm;background:#fff;';
    wrap.innerHTML = bodyContent;
    document.body.appendChild(wrap);

    const el = wrap.firstElementChild as HTMLElement;
    if (!el) {
      wrap.remove();
      fallbackDownloadHtml(fullHtml, baseName);
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

      pdf.save(`Applicant-Resume-${baseName}.pdf`);
    } catch (err) {
      wrap.remove();
      console.error('PDF generation failed:', err);
      fallbackDownloadHtml(fullHtml, baseName);
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
  const resumePreview = d ? buildResumeHtml(d).bodyContent : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 max-w-3xl max-h-[90vh] w-full -translate-x-1/2 -translate-y-1/2 flex flex-col p-0 bg-white rounded-xl shadow-lg overflow-hidden">
        {applicationDetailsLoading && (
          <Loading message="Loading applicant..." variant="minimal" />
        )}
        {d && (
          <>
            <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2 border-b border-slate-200/80">
              <DialogTitle className="text-base font-semibold text-slate-600">
                Resume preview
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                This is how the resume will look when you download the PDF.
              </p>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-slate-50/40">
              <div
                className="resume-preview max-w-[700px] mx-auto bg-white rounded-lg border border-slate-200/80 shadow-sm p-6 text-left"
                dangerouslySetInnerHTML={{ __html: resumePreview ?? '' }}
              />
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
            <Button onClick={handleDownload} variant="default">
              Download Resume
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
