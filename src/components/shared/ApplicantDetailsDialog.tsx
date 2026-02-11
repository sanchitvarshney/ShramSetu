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
import { Loader } from 'lucide-react';

function buildResumeHtml(d: ApplicantDetail): string {
  const name = d.empName ?? d.applicantName ?? 'Applicant';
  const fmt = (v: any) =>
    v === undefined || v === null || v === '' ? '' : String(v);

  const sections: string[] = [];

  sections.push(`
    <h1 style="font-size:22px;margin:0 0 8px 0;color:#0f766e;">${name}</h1>
    <p style="margin:0 0 16px 0;color:#64748b;">${[d.empEmail, d.empMobile].filter(Boolean).join(' | ')}</p>
    ${d.address ? `<p style="margin:0 0 16px 0;">${d.address}</p>` : ''}
  `);

  sections.push(`
    <h2 style="font-size:14px;color:#0f766e;border-bottom:1px solid #0d9488;padding-bottom:4px;margin:16px 0 8px 0;">JOB APPLIED</h2>
    <p><strong>Job Title:</strong> ${fmt(d.jobTitle)}</p>
    <p><strong>Company:</strong> ${fmt(d.company)}</p>
    <p><strong>Applied Date:</strong> ${fmt(d.insertDt)}</p>
    ${d.minSalary != null ? `<p><strong>Current/Expected Salary:</strong> ${d.minSalary}${d.maxSalary != null ? ' - ' + d.maxSalary : ''}</p>` : ''}
    ${d.experience ? `<p><strong>Experience:</strong> ${d.experience}</p>` : ''}
  `);

  if (d.qualification || d.education || d.skills) {
    sections.push(`
      <h2 style="font-size:14px;color:#0f766e;border-bottom:1px solid #0d9488;padding-bottom:4px;margin:16px 0 8px 0;">EDUCATION & SKILLS</h2>
      ${d.qualification ? `<p><strong>Qualification:</strong> ${d.qualification}</p>` : ''}
      ${d.education ? `<p><strong>Education:</strong> ${d.education}</p>` : ''}
      ${d.skills ? `<p><strong>Skills:</strong> ${d.skills}</p>` : ''}
    `);
  }

  if (d.department || d.designation || d.previousCompany) {
    sections.push(`
      <h2 style="font-size:14px;color:#0f766e;border-bottom:1px solid #0d9488;padding-bottom:4px;margin:16px 0 8px 0;">PROFESSIONAL</h2>
      ${d.department ? `<p><strong>Department:</strong> ${d.department}</p>` : ''}
      ${d.designation ? `<p><strong>Designation:</strong> ${d.designation}</p>` : ''}
      ${d.previousCompany ? `<p><strong>Previous Company:</strong> ${d.previousCompany}</p>` : ''}
    `);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${name} - Resume</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 24px auto; padding: 0 16px; color: #334155; line-height: 1.5; }
    h1 { font-size: 22px; color: #0f766e; }
    h2 { font-size: 14px; color: #0f766e; border-bottom: 1px solid #0d9488; padding-bottom: 4px; margin: 16px 0 8px 0; }
    p { margin: 4px 0; }
  </style>
</head>
<body>
  ${sections.join('\n')}
</body>
</html>`;
  return html;
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

  const handleDownload = useCallback(() => {
    if (!applicationDetails) return;
    const html = buildResumeHtml(applicationDetails);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Applicant-Resume-${(applicationDetails.empName ?? applicationDetails.empEmail ?? 'details').replace(/[^a-zA-Z0-9.-]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [applicationDetails]);

  const d = applicationDetails;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-xl shadow-lg">
        {applicationDetailsLoading && (
          <div className="flex items-center justify-center w-full h-full">
            <Loader />
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 mb-4">
            {d?.empName ?? 'Applicant Name'}
          </DialogTitle>
          <div className="flex gap-6 text-sm text-slate-600 mb-6">
            <span>Email: {d?.empEmail ?? 'N/A'}</span>
            <span>Mobile: {d?.empMobile ?? 'N/A'}</span>
            <span>DOB: {d?.dob ?? 'N/A'}</span>
            <span>Gender: {d?.gender ?? 'N/A'}</span>
          </div>
        </DialogHeader>

        { d && (
          <div className="space-y-6 text-sm">
            {/* Education */}
            <section>
              <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                Education
              </h2>
              {Array.isArray(d.degree) && Array.isArray(d.university) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {d.degree.map((deg: any, i: any) => (
                    <li key={i}>
                      <span className="font-medium">{deg}</span> -{' '}
                      {d.university[i] ?? 'N/A'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{d.degree ?? 'N/A'}</p>
              )}
            </section>

            {/* Skills */}
            {d.skills && (
              <section>
                <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                  Skills
                </h2>
                <p>
                  {Array.isArray(d.skills) ? d.skills.join(', ') : d.skills}
                </p>
              </section>
            )}

            {/* Professional */}
            <section>
              <h2 className="text-lg font-semibold mb-2 border-b pb-1">
                Professional Info
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <span className="font-medium">Department:</span>{' '}
                  {d.department ?? 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Designation:</span>{' '}
                  {d.designation ?? 'N/A'}
                </div>
              </div>
            </section>
          </div>
        )}

        { !d && open && appliedKey && (
          <p className="text-slate-500 py-4">No details available.</p>
        )}

        <DialogFooter className="border-t pt-4 flex justify-between">
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
