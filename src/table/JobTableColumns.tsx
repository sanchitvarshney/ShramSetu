import { ColDef, ICellRendererParams } from 'ag-grid-community';

const statusCellRenderer = (params: ICellRendererParams) => {
  const status = params.value;
  const statusMap: { [key: string]: { label: string; color: string } } = {
    'currently-hiring': { label: 'Currently Hiring', color: 'text-green-600' },
    closed: { label: 'Closed', color: 'text-red-600' },
    draft: { label: 'Draft', color: 'text-yellow-600' },
    'on-hold': { label: 'On Hold', color: 'text-blue-600' },
  };

  const statusInfo = statusMap[status] || { label: status, color: 'text-gray-600' };

  return (
    <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label.toUpperCase()}</span>
  );
};

export const jobColumnDefs = (
  onEdit?: (job: JobRowData) => void,
  onDelete?: (jobId: string) => void,
): ColDef[] => [
  {
    headerName: 'Job Title',
    field: 'jobTitle',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 250,
    editable: true,
    cellEditor: 'agTextCellEditor',
  },
  {
    headerName: 'Company',
    field: 'company',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 250,
    editable: false,

  },
  {
    headerName: 'Branch',
    field: 'address',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    editable: false,
  },
  {
    headerName: 'Job Type',
    field: 'jobType',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['full-time', 'part-time', 'contract', 'internship'],
    },
    valueFormatter: (params) => {
      if (!params.value) return '';
      return params.value
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
  },
  {
    headerName: 'Department',
    field: 'department',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    editable: false,
    // cellEditor: departments && departments.length > 0 ? 'agSelectCellEditor' : 'agTextCellEditor',
    // cellEditorParams: departments && departments.length > 0 ? {
    //   values: departments.map((dept) => dept.text || dept.value),
    // } : undefined,
  },
  {
    headerName: 'Designation',
    field: 'designation',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    editable: false,
    // cellEditor: designations && designations.length > 0 ? 'agSelectCellEditor' : 'agTextCellEditor',
    // cellEditorParams: designations && designations.length > 0 ? {
    //   values: designations.map((desg) => desg.text || desg.value),
    // } : undefined,
  },
  {
    headerName: 'Min Salary',
    field: 'minSalary',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    editable: true,
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: {
      min: 0,
      precision: 0,
    },
    valueFormatter: (params) => {
      if (!params.value) return '-';
      return `₹${params.value.toLocaleString()}`;
    },
  },
  {
    headerName: 'Max Salary',
    field: 'maxSalary',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    editable: true,
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: {
      min: 0,
      precision: 0,
    },
    valueFormatter: (params) => {
      if (!params.value) return '-';
      return `₹${params.value.toLocaleString()}`;
    },
  },
  {
    headerName: 'Experience',
    field: 'experience',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    editable: true,
    cellEditor: 'agTextCellEditor',
  },
  {
    headerName: 'Status',
    field: 'jobStatus',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 150,
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellRenderer: statusCellRenderer,
    cellEditorParams: {
      values: ['currently-hiring', 'closed', 'draft', 'on-hold'],
    },
  },
  {
    headerName: 'Created Date',
    field: 'insertDt',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 120,
    editable: false,
    valueFormatter: (params) => {
      if (!params.value) return '';
      const date = new Date(params.value);
      return date.toLocaleDateString('en-GB');
    },
  },
  {
    headerName: 'Actions',
    field: 'actions',
    sortable: false,
    filter: false,
    flex: 1,
    minWidth: 120,
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <div className="flex items-center gap-2 h-full">
          <button
            onClick={() => onEdit?.(params.data)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            aria-label="Edit Job"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(params.data.jobID || params.data.id)}
            className="text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
            aria-label="Delete Job"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];

export interface JobRowData {
  jobID?: string;
  id?: string;
  jobTitle: string;
  companyName: string;
  branchName: string;
  jobType: string;
  department: string;
  designation: string;
  minSalary: number;
  maxSalary: number;
  experience: string;
  jobStatus: string;
  createdAt?: string;
  skills?: string;
  qualification?: string;
}

