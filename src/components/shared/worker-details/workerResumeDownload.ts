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
import {
  PLACEHOLDER_PHOTO_DATAURL,
  WORKER_PHOTO_PROXY_PATH,
} from './constants';

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

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function resolvePhotoToBase64(url: string): Promise<string | undefined> {
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

  const toBase64 = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return blobToDataURL(await response.blob());
  };

  try {
    return await toBase64(url);
  } catch {
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      return await toBase64(proxyUrl);
    } catch {
      return undefined;
    }
  }
}

function waitForImages(el: HTMLElement, timeoutMs = 3000): Promise<void> {
  const imgs = el.querySelectorAll('img');
  if (imgs.length === 0) return Promise.resolve();
  //@ts-ignore
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

function fallbackDownloadHtml(html: string, baseName: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Worker-Resume-${baseName}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Builds PDF from worker resume HTML (loads jspdf + html2canvas on demand only).
 */
export async function downloadWorkerResumePdf(
  worker: any,
  employeeId: string | undefined,
): Promise<void> {
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
        ? ((await resolvePhotoToBase64(photoUrl)) ?? PLACEHOLDER_PHOTO_DATAURL)
        : (photoUrl ?? PLACEHOLDER_PHOTO_DATAURL);
  }
  const { bodyContent, fullHtml } = buildWorkerResumeHtml(worker, photoForPdf);

  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

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
  }
}
