

export function fmt(v: unknown): string {
  if (v === undefined || v === null || v === '') return '';
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  return String(v).trim();
}

export function sectionTitle(title: string): string {
  return `<div style="margin-top:20px;margin-bottom:10px;"><h2 style="font-size:11px;font-weight:700;margin:0;padding-bottom:6px;color:#1e293b;text-transform:uppercase;letter-spacing:0.1em;border-bottom:2px solid #1e293b;">${title}</h2></div>`;
}

export function convertMarital(m: string): string {
  if (m === 'M') return 'Married';
  if (m === 'U' || m === 'Um') return 'Unmarried';
  return m || '';
}

export function convertGender(g: string): string {
  if (g === 'M') return 'Male';
  if (g === 'F') return 'Female';
  return g || '';
}

export function cleanAddrPart(x: string | null | undefined): string {
  const v = x == null ? '' : String(x).trim();
  return v === '' || v === '--' ? '' : v;
}

export function buildAddressLines(
  houseNo: string,
  colony: string,
  city: string,
  state: string,
  country: string,
  pincode: string
): string[] {
  const parts1 = [houseNo, colony, city].filter(Boolean);
  const line1 = parts1.join(', ');
  const parts2 = [state, country, pincode].filter(Boolean);
  const line2 = parts2.join(', ');
  const lines: string[] = [];
  if (line1) lines.push(line1);
  if (line2) lines.push(line2);
  return lines;
}

export interface ResumeEmploymentItem {
  companyName: string;
  role: string;
  joining: string;
  relieving: string;
  industry: string;
}

export interface ResumeEducationItem {
  degree: string;
  stream: string;
  university: string;
  endYear: string;
}

export interface ResumeData {
  name: string;
  email: string;
  mobile: string;
  designation: string;
  department: string;
  addressBlock: string;
  careerObjective: string;
  employment: ResumeEmploymentItem[];
  education: ResumeEducationItem[];
  personalRows: { label: string; value: string }[];
}

const DEFAULT_CAREER_OBJECTIVE =
  'To build career in a growing organization, where I can get the opportunities to prove my abilities by accepting challenges, fulfilling the organizational goal and climb the career ladder through continuous learning and commitment.';


export function buildResumeHtml(data: ResumeData): { bodyContent: string; fullHtml: string } {
  const {
    name,
    email,
    mobile,
    designation,
    department,
    addressBlock,
    careerObjective,
    employment,
    education,
    personalRows,
  } = data;

  const sections: string[] = [];

  sections.push(`
    <div style="height:4px;background:#1e293b;margin:-28px -32px 20px -32px;"></div>
    <div style="margin-top:20px;">
      <p style="font-size:22px;font-weight:700;margin:0 0 4px 0;color:#0f172a;letter-spacing:0.02em;">${name}</p>
      ${designation || department ? `<p style="font-size:12px;margin:0 0 6px 0;color:#475569;">${[designation, department].filter(Boolean).join(' · ')}</p>` : ''}
      <p style="font-size:11px;margin:0 0 2px 0;color:#334155;">${mobile ? `Phone: ${mobile}` : ''}${mobile && email ? ' &nbsp;|&nbsp; ' : ''}${email ? `Email: ${email}` : ''}</p>
      ${addressBlock ? `<div style="margin-top:6px;">${addressBlock}</div>` : ''}
    </div>
    <div style="height:18px;"></div>
  `);

  const summary = careerObjective || DEFAULT_CAREER_OBJECTIVE;
  sections.push(`
    ${sectionTitle('Professional Summary')}
    <p style="margin:0;font-size:12px;line-height:1.55;color:#334155;">${summary}</p>
    <div style="height:4px;"></div>
  `);

  if (employment.length > 0) {
    sections.push(sectionTitle('Work Experience'));
    employment.forEach((item) => {
      const duration = [fmt(item.joining), item.relieving ? fmt(item.relieving) : 'Present'].filter(Boolean).join(' – ');
      sections.push(`
        <div style="margin-bottom:10px;">
          <p style="font-size:13px;font-weight:700;margin:0 0 2px 0;color:#0f172a;">${fmt(item.companyName)}</p>
          ${item.role ? `<p style="font-size:12px;margin:0 0 2px 0;color:#475569;">${fmt(item.role)}</p>` : ''}
          <p style="font-size:11px;margin:0;color:#64748b;">${duration}${item.industry ? ` · ${fmt(item.industry)}` : ''}</p>
        </div>
      `);
    });
    sections.push('');
  }

  if (education.length > 0) {
    sections.push(sectionTitle('Education'));
    education.forEach((edu) => {
      const rightPart = [edu.stream, edu.university, edu.endYear].filter(Boolean).join(' · ');
      sections.push(`
        <div style="margin-bottom:8px;">
          <p style="font-size:13px;font-weight:600;margin:0 0 2px 0;color:#0f172a;">${fmt(edu.degree)}</p>
          ${rightPart ? `<p style="font-size:12px;margin:0;color:#475569;">${rightPart}</p>` : ''}
        </div>
      `);
    });
    sections.push('');
  }

  if (personalRows.length > 0) {
    sections.push(sectionTitle('Personal Details'));
    sections.push('<table style="width:100%;border-collapse:collapse;font-size:12px;">');
    for (let i = 0; i < personalRows.length; i += 2) {
      const left = personalRows[i];
      const right = personalRows[i + 1];
      sections.push('<tr>');
      sections.push(`<td style="padding:2px 16px 2px 0;color:#64748b;font-weight:600;width:28%;">${left.label}</td><td style="padding:2px 0;color:#334155;">${left.value}</td>`);
      sections.push(right ? `<td style="padding:2px 16px 2px 0;color:#64748b;font-weight:600;width:28%;">${right.label}</td><td style="padding:2px 0;color:#334155;">${right.value}</td>` : '<td></td><td></td>');
      sections.push('</tr>');
    }
    sections.push('</table>');
    sections.push('<div style="height:8px;"></div>');
  }

  sections.push(sectionTitle('Declaration'));
  sections.push(`
    <p style="margin:0;font-size:12px;line-height:1.5;color:#334155;">I hereby declare that the information furnished above is true and correct to the best of my knowledge.</p>
    <p style="margin:12px 0 0 0;font-size:12px;color:#334155;">Date: _________________ &nbsp; Place: _________________</p>
  `);

  const bodyInner = sections.join('\n');
  const wrapperStyle =
    "font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:210mm;margin:0;padding:28px 32px;color:#334155;line-height:1.45;background:#fff;box-sizing:border-box;font-size:13px;";
  const bodyContent = `<div style="${wrapperStyle}">${bodyInner}</div>`;
  const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${name} - Resume</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;margin:0;padding:28px 32px;color:#334155;background:#fff;max-width:210mm;}</style></head><body>${bodyInner}</body></html>`;
  return { bodyContent, fullHtml };
}
