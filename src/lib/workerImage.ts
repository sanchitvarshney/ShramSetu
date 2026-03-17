import { orshAxios } from '@/axiosIntercepter';

/** API response: image as base64 string with mime type */
interface GetImageAdminResponse {
  success?: boolean;
  data?: {
    empPhoto?: string;
    mimeType?: string;
  };
  status?: string;
}

export async function getWorkerImageAsBase64(empCode: string): Promise<string | undefined> {
  const code = empCode?.trim();
  if (!code) return undefined;
  try {
    const { data } = await orshAxios.get<GetImageAdminResponse>(
      `/worker/getImageAdmin/${encodeURIComponent(code)}`,
    );
    const photo = data?.data?.empPhoto;
    const mimeType = data?.data?.mimeType || 'image/jpeg';
    if (photo && typeof photo === 'string' && photo.length > 0) {
      const base64 = photo.replace(/^data:image\/\w+;base64,/, '');
      return `data:${mimeType};base64,${base64}`;
    }
  } catch {
 
  }
  return undefined;
}
