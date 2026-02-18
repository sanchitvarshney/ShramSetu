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

function buildResumeHtml(d: ApplicantDetail): { fullHtml: string; bodyContent: string } {
  const name = d.empName ?? d.applicantName ?? 'Applicant';
  const email = d.empEmail ?? '';
  const mobile = d.empMobile ?? '';
  const dob = d.dob ?? d.empDOB ?? '';
  const gender = d.gender ?? d.empGender ?? '';
  const marital = d.empMaritalStatus ?? d.marital ?? '';
  const hobbies = d.empHobbies ?? d.hobbies ?? '';
  const houseNo = d.presentHouseNo ?? d.present_houseNo ?? '';
  const colony = d.presentColony ?? d.present_colony ?? '';
  const district = d.present_district ?? d.presentDistrict ?? d.present_city ?? d.presentCity ?? '';
  const state = d.presentState ?? d.present_state ?? '';
  const pincode = d.presentPincode ?? d.present_pincode ?? '';
  const addressLine1 = [houseNo, colony, district].filter((x) => x && x !== '--').join(', ');
  const addressLine2 = [state, pincode].filter((x) => x && x !== '--').join(', ');

  const photoSrc = Array.isArray(d.empPhoto) ? d.empPhoto[0] : d.empPhoto;
  const photoHtml = photoSrc
    ? `<div style="flex-shrink:0;width:110px;height:130px;border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);"><img src="${photoSrc}" alt="" style="width:100%;height:100%;object-fit:cover;" /></div>`
    : '';

  const sections: string[] = [];

  // Document-style: title with underline accent
  sections.push(`
    <p style="text-align:center;font-size:20px;font-weight:700;margin:0 0 8px 0;color:#0f172a;text-transform:uppercase;letter-spacing:0.06em;">CURRICULUM VITAE</p>
    <div style="height:2px;width:48px;background:#0f172a;margin:0 auto 20px auto;"></div>
  `);

  // Header: Name + address + Mob + Email (left) | Photo (right). Email underlined.
  sections.push(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;">
      <div style="flex:1;min-width:0;">
        <p style="font-size:17px;font-weight:700;margin:0 0 6px 0;color:#0f172a;">${name}</p>
        ${addressLine1 ? `<p style="font-size:13px;margin:0 0 2px 0;color:#475569;">${addressLine1}</p>` : ''}
        ${addressLine2 ? `<p style="font-size:13px;margin:0 0 6px 0;color:#475569;">${addressLine2}</p>` : ''}
        <p style="margin:4px 0 0 0;font-size:13px;color:#334155;">Mob No: ${mobile || 'N/A'}</p>
        <p style="margin:2px 0 0 0;font-size:13px;color:#334155;">Email Id: <span style="text-decoration:underline;">${email || 'N/A'}</span></p>
      </div>
      ${photoHtml}
    </div>
    <div style="height:16px;"></div>
  `);

  // CAREER OBJECTIVE
  const careerObjective = d.careerObjective ?? 'To build career in a growing organization, where I can get the opportunities to prove my abilities by accepting challenges, fulfilling the organizational goal and climb the career ladder through continuous learning and commitment.';
  sections.push(`
    ${sectionTitle('CAREER OBJECTIVE')}
    <p style="margin:0;font-size:13px;line-height:1.6;color:#334155;">${careerObjective}</p>
    <div style="height:12px;"></div>
  `);

  // EXPERIENCE (companyInfo / employmentList)
  const employmentList = d.companyInfo ?? d.employmentList ?? d.employment ?? [];
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

  // EDUCATION (degree + university / stream + endYear)
  const degrees = Array.isArray(d.degree) ? d.degree : d.degree ? [d.degree] : [];
  const universities = Array.isArray(d.university) ? d.university : d.university ? [d.university] : [];
  const educationList = d.educationList ?? [];
  const hasEduList = Array.isArray(educationList) && educationList.length > 0;
  if (degrees.length > 0 || hasEduList) {
    sections.push(sectionTitle('EDUCATION'));
    if (hasEduList) {
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
    } else {
      degrees.forEach((deg: any, i: number) => {
        sections.push(`
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;gap:16px;">
            <p style="margin:0;font-size:13px;color:#334155;">${fmt(deg)}</p>
            <p style="margin:0;font-size:12px;color:#64748b;">${fmt(universities[i]) || 'N/A'}</p>
          </div>
        `);
      });
    }
    sections.push('<div style="height:12px;"></div>');
  }

  // PERSONAL DETAILS
  sections.push(sectionTitle('PERSONAL DETAILS'));
  sections.push(detailRow('Date of Birth', fmt(dob)));
  sections.push(detailRow('Marital Status', convertMarital(marital)));
  sections.push(detailRow('Sex', convertGender(gender)));
  sections.push(detailRow('Nationality', d.nationality ?? 'Indian'));
  sections.push(detailRow('Hobbies', fmt(hobbies)));
  sections.push('<div style="height:18px;"></div>');

  // DECLARATION (match PDF: paragraph then Date / Place on one line)
  sections.push(sectionTitle('DECLARATION'));
  sections.push(`
    <p style="margin:0;font-size:13px;line-height:1.6;color:#334155;">I solemnly declare that all the above information is correct to the best of my knowledge and belief.</p>
    <div style="height:20px;"></div>
    <p style="margin:0;font-size:13px;color:#334155;">Date ........... &nbsp; Place ...........</p>
  `);

  const bodyInner = sections.join('\n');
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${name} - Curriculum Vitae</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; max-width: 700px; margin: 0 auto; padding: 28px 32px; color: #334155; line-height: 1.5; background: #fff; }
    p { margin: 6px 0; font-size: 13px; }
  </style>
</head>
<body>
  ${bodyInner}
</body>
</html>`;

  const bodyContent = `<div style="font-family:'Segoe UI',system-ui,-apple-system,sans-serif;max-width:700px;margin:0;padding:28px 32px;color:#334155;line-height:1.5;background:#fff;box-sizing:border-box;box-shadow:0 1px 3px rgba(0,0,0,0.08);">${bodyInner}</div>`;
  return { fullHtml, bodyContent };
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
