import { LoggedInUserType } from '@/types/general';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

const socketLink: string = import.meta.env.VITE_REACT_APP_SOCKET_BASE_URL;
const imsLink: string = import.meta.env.VITE_REACT_APP_API_BASE_URL;

// interface LoggedInUser {
//   token: string;
// }

interface ErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    logout?: boolean;
  };
}

function doLogout(message?: string) {
  toast.error(message || 'Unauthorized access. Please log in again.');
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('companySelect');
  window.location.href = '/login';
}

// Endpoints that do not require auth token (e.g. login)
const PUBLIC_PATHS = ['/login/signin', 'login/signin'];

function isPublicUrl(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_PATHS.some((path) => url.includes(path));
}

function getTokenFromStorage(): string | null {
  try {
    const localUser = localStorage.getItem('loggedInUser');
    const parsed: LoggedInUserType | null = JSON.parse(localUser ?? 'null');
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

function getCompanyFromStorage(): string {
  return localStorage.getItem('companySelect') ?? '';
}

const orshAxios = axios.create({
  baseURL: imsLink,
});
orshAxios.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  const company = getCompanyFromStorage();

  if (!token && !isPublicUrl(config.url)) {
    return Promise.reject(
      new axios.CanceledError('No auth token; request skipped to avoid 500')
    );
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['auth-token'] = token;
  }
  if (company) {
    config.headers.company = company;
  }
  return config;
});

orshAxios.interceptors.response.use(
  (response: AxiosResponse<ErrorResponse>) => {
    const data = response.data;
    if (data?.success === false && data?.data?.logout === true) {
      doLogout(data?.message || 'Unauthorized access');
      return Promise.reject(new Error(data?.message || 'Unauthorized access'));
    }
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || 'Unauthorized. Please log in again.';
      doLogout(msg);
      return Promise.reject(error);
    }

    if (error.response && typeof error.response.data === 'object') {
      const errorData = error.response.data;

      if (errorData?.data?.logout === true) {
        doLogout(errorData?.message || 'Unauthorized access');
        return Promise.reject(error);
      }

      if (errorData.success !== undefined) {
        toast.error(errorData.message || 'Error occurred.');
        return Promise.reject(errorData);
      }

      if (errorData.message) {
        toast.error(errorData.message);
      } else {
        toast.error('Error while connecting to backend.');
      }

      return Promise.reject(errorData);
    }

    toast.error('An unexpected error occurred.');
    return Promise.reject(error);
  },
);

export { orshAxios, socketLink };
