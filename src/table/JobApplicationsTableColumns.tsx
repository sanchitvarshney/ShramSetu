import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { JobApplication } from '@/features/jobFeatures/jobApplicationsSlice';

const statusConfig: Record<
  any,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
  }
> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  accepted: {
    label: 'Accepted',
    variant: 'default',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  declined: {
    label: 'Declined',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  hold: {
    label: 'Hold',
    variant: 'outline',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
};

export const applicationStatusCellRenderer = (params: ICellRendererParams) => {
  const status =
    params.value === 'PEN'
      ? 'pending'
      : params.value === 'APR'
        ? 'accepted'
        : params.value === 'REJ'
          ? 'declined'
          : 'hold';
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export const getJobApplicationsColumnDefs = (
  onAccept: (app: any) => void,
  onDecline: (app: any) => void,
  onHold: (app: any) => void,
  onView: (app: any) => void,
  isUpdating: boolean,
): ColDef<any>[] => [
  {
    headerName: 'Applicant Name',
    field: 'empName',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Email',
    field: 'empEmail',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 200,
  },
  {
    headerName: 'Mobile',
    field: 'empMobile',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 200,
  },
  {
    headerName: 'Job Title',
    field: 'jobTitle',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Company',
    field: 'company',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Current Salary',
    field: 'minSalary',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Expected Salary',
    field: 'maxSalary',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Applied Date',
    field: 'insertDt',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    cellRenderer: applicationStatusCellRenderer,
  },
  {
    headerName: 'Actions',
    //@ts-ignore
    field: 'actions',
    sortable: false,
    filter: false,
    flex: 1,
    minWidth: 320,
    cellRenderer: (params: ICellRendererParams<JobApplication>) => {
      const app = params.data;
      if (!app) return null;
      const status: any = app.status;
      return (
        <div className="flex items-center gap-2 h-full py-1 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="text-slate-700 border-slate-300 hover:bg-slate-50 text-xs h-8"
            onClick={() => onView(app)}
          >
            View
          </Button>
          {status !== 'APR' && (
            <Button
              size="sm"
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
              onClick={() => onAccept(app)}
              disabled={isUpdating}
            >
              Accept
            </Button>
          )}
          {status !== 'REJ' && (
            <Button
              size="sm"
              variant="destructive"
              className="text-xs h-8"
              onClick={() => onDecline(app)}
              disabled={isUpdating}
            >
              Decline
            </Button>
          )}
          {status !== 'HOLD' && (
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs h-8"
              onClick={() => onHold(app)}
              disabled={isUpdating}
            >
              Hold
            </Button>
          )}
        </div>
      );
    },
  },
];
