import { ColDef } from 'ag-grid-community';

export const columnDefs: ColDef[] = [
  {
    headerName: 'Full Name',
    field: 'firstName',
    sortable: true,
    filter: true,
    cellRenderer: (params: any) => {
      return (
        <span className="text-blue-500 cursor-pointer">
          {params.data.firstName + ' ' + params.data.lastName}
        </span>
      );
    },
  },
  { headerName: 'Phone', field: 'mobile', sortable: true, filter: true },
  {
    headerName: 'E-mail',
    field: 'email',
    sortable: true,
    filter: true,
    width: 210,
  },
  { headerName: 'Company', field: 'companyName', sortable: true, filter: true },
  { headerName: 'Branch', field: 'branchName', sortable: true, filter: true },
];
export interface RowData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  company: string;
  branch: string;
}
