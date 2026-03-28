import type { Dispatch, SetStateAction } from 'react';

export interface WorkerDetailsProps {
  worker: any;
  toggleDetails?: (id?: string) => void;
  showEdit?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleStatus?: (status: 'APR' | 'REJ') => void;
  onWorkerUpdated?: () => void;
  /** When true, show loading state inside the sheet (e.g. while fetching GET /worker/details/:key) */
  detailsLoading?: boolean;
}
