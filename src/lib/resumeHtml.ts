export function fmt(v: unknown): string {
  if (v === undefined || v === null || v === '') return '';
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  return String(v).trim();
}

/** Section heading in a light grey bar (matches reference CV) */
export function sectionTitle(title: string): string {
  return `
    <div style="
      width:100%;
      margin:16px 0 8px 0;
      page-break-inside:avoid;
      break-inside:avoid;
      box-sizing:border-box;
    ">
      <table style="
        width:100%;
        border-collapse:collapse;
        table-layout:fixed;
        background:#cbd5e1;
      ">
        <tr>
          <td style="
            padding:10px 14px;
            font-size:19px;
            font-weight:700;
            color:#0f172a;
            text-transform:uppercase;
            letter-spacing:0.04em;
            line-height:24px;
            vertical-align:middle;
            white-space:normal;
            overflow-wrap:break-word;
            word-break:break-word;
          ">${title}</td>
        </tr>
      </table>
    </div>
  `;
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
  pincode: string,
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
  /** Profile photo URL (shown top-right in CV layout) */
  photoUrl?: string;
}

const DEFAULT_CAREER_OBJECTIVE =
  'To build career in a growing organization, where I can get the opportunities to prove my abilities by accepting challenges, fulfilling the organizational goal and climb the career ladder through continuous learning and commitment.';

/** Format date string for CV experience (e.g. "Jan 2024", "Jan 2026") */
function formatCvDate(s: string): string {
  if (!s || typeof s !== 'string') return '';
  const trimmed = String(s).trim();
  if (!trimmed) return '';
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return trimmed;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function buildResumeHtml(data: ResumeData): {
  bodyContent: string;
  fullHtml: string;
} {
  const {
    name,
    email,
    mobile,

    addressBlock,
    careerObjective,
    employment,
    education,
    personalRows,
    photoUrl,
  } = data;

  const sections: string[] = [];

  // Top: CURRICULUM VITAE centered, bold, underlined
  sections.push(`
<div style="text-align:center; margin-bottom:14px;">
  <p style="
    font-size:24px;
    font-weight:bold;
    margin:0 auto;
    color:#0f172a;
    letter-spacing:0.06em;
    display:block;
    width:fit-content;
    border-bottom:1px solid #0f172a;
    padding-bottom:6px;
    white-space:nowrap;
  ">
    CURRICULUM VITAE
  </p>
</div>
  `);
  // Row: left = name, address, Mob No, Email Id (labels bold, email as link); right = photo
  const emailLink = email
    ? `<a href="mailto:${email}" style="color:#0f172a;text-decoration:underline;">${email}</a>`
    : '';
  const photoHtml = photoUrl
    ? `<div style="flex-shrink:0;margin-left:20px;"><img src="${photoUrl}" alt="Photo" style="width:100px;height:120px;object-fit:cover;border:1px solid #cbd5e1;display:block;" /></div>`
    : '';

  const cleanAddress = addressBlock
    ?.replace(/font-size:\s*\d+px;?/g, '')
    ?.replace(/<p/g, '<div')
    ?.replace(/<\/p>/g, '</div>');
  sections.push(`
  <div style="display:flex;align-items:flex-start;margin-bottom:18px;">
  <div style="flex:1;min-width:0;">
    
    <p style="font-size:20px;font-weight:700;margin:0 0 8px 0;color:#0f172a;">
      ${name}
    </p>

    ${
      cleanAddress
        ? `<div style="font-size:16px;margin:0 0 6px 0;color:#0f172a; line-height:1.4; min-width:60%; max-width:60%;">
             ${cleanAddress}
           </div>`
        : ''
    }

    ${
      mobile
        ? `<p style="font-size:15px;margin:0;color:#0f172a;">
             <strong>Mob No:</strong> ${mobile}
           </p>`
        : ''
    }

    ${
      email
        ? `<p style="font-size:15px;margin:0;color:#0f172a;">
             <strong>Email Id:</strong> ${emailLink}
           </p>`
        : ''
    }

  </div>

  ${photoHtml}
</div>

<div style="height:4px;"></div>
  `);

  const summary = careerObjective || DEFAULT_CAREER_OBJECTIVE;
  sections.push(`
    ${sectionTitle('CAREER OBJECTIVE')}
    <p style="margin:0;font-size:18px;line-height:1.55;color:#0f172a;">${summary}</p>
    <div style="height:4px;"></div>
  `);

  if (employment.length > 0) {
    sections.push(sectionTitle('EXPERIENCE'));
    employment.forEach((item) => {
      const startStr = formatCvDate(item.joining);
      const endStr = item.relieving ? formatCvDate(item.relieving) : 'Present';
      const dateRange = [startStr, endStr].filter(Boolean).join(' | ');
      sections.push(`
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;gap:12px;">
          <span style="font-size:12px;font-weight:600;color:#0f172a;">${fmt(item.companyName)}</span>
          <span style="font-size:11px;color:#475569;flex-shrink:0;">${dateRange}</span>
        </div>
        ${item.role ? `<p style="font-size:11px;margin:0 0 4px 0;color:#475569;">${fmt(item.role)}</p>` : ''}
      `);
    });
    sections.push('');
  }

  if (education.length > 0) {
    sections.push(sectionTitle('EDUCATION'));
    education.forEach((edu) => {
      const rightPart = [fmt(edu.stream), fmt(edu.university), fmt(edu.endYear)]
        .filter(Boolean)
        .join(' | ');
      sections.push(`
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;gap:12px;">
          <span style="font-size:12px;color:#0f172a;">${fmt(edu.degree)}</span>
          <span style="font-size:11px;color:#475569;flex-shrink:0;">${rightPart || '—'}</span>
        </div>
      `);
    });
    sections.push('');
  }

  if (personalRows.length > 0) {
    sections.push(sectionTitle('PERSONAL DETAILS'));
    sections.push(
      '<table style="width:100%;border-collapse:collapse;font-size:12px;">',
    );
    for (let i = 0; i < personalRows.length; i += 2) {
      const left = personalRows[i];
      const right = personalRows[i + 1];
      const leftLabel = left.label === 'Gender' ? 'Gender' : left.label;
      const rightLabel =
        right && right.label === 'Gender' ? 'Gender' : (right?.label ?? '');
      sections.push('<tr>');
      sections.push(
        `<td style="padding:3px 12px 3px 0;color:#0f172a;font-weight:700;width:32%;">${leftLabel}</td><td style="padding:3px 0;color:#0f172a;">${left.value}</td>`,
      );
      sections.push(
        right
          ? `<td style="padding:3px 12px 3px 0;color:#0f172a;font-weight:700;width:32%;">${rightLabel}</td><td style="padding:3px 0;color:#0f172a;">${right.value}</td>`
          : '<td></td><td></td>',
      );
      sections.push('</tr>');
    }
    sections.push('</table>');
    sections.push('<div style="height:8px;"></div>');
  }

  sections.push(sectionTitle('DECLARATION'));
  sections.push(`
    <p style="margin:0;font-size:12px;line-height:1.5;color:#0f172a;">I solemnly declare that all the above information is correct to the best of my knowledge and belief.</p>
    <div style="display:flex;justify-content:space-between;margin-top:14px;font-size:12px;color:#0f172a;">
      <span>Date ..........</span>
      <span>Place ..........</span>
    </div>
  `);

  const bodyInner = sections.join('\n');
  const wrapperStyle =
    "font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;width:210mm;max-width:210mm;margin:0;padding:28px 32px;color:#0f172a;line-height:1.45;background:#fff;box-sizing:border-box;font-size:13px;";
  const bodyContent = `<div style="${wrapperStyle}">${bodyInner}</div>`;
  const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${name} - Curriculum Vitae</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;margin:0;padding:28px 32px;color:#0f172a;background:#fff;max-width:210mm;}</style></head><body>${bodyInner}</body></html>`;
  return { bodyContent, fullHtml };
}
