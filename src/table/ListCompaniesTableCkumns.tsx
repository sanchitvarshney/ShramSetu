import { ColDef } from 'ag-grid-community';

export const columnDefs: ColDef[] = [
  { headerName: 'Company Name', field: 'companyName', sortable: true, filter: true },
  {
    headerName: 'PAN',
    field: 'pan',
    sortable: true,
    filter: true,
    valueFormatter: (params) =>
      params.value ? String(params.value).toUpperCase() : '',
  },
  { headerName: 'E-Mail', field: 'email', sortable: true, filter: true },
  { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
  { headerName: 'Website', field: 'website', sortable: true, filter: true },
  { headerName: 'Active?', field: 'active', sortable: true, filter: true, cellRenderer: (params:any) => params.value ? 'Yes' : 'No' },
];

export interface RowData {
    companyName: string;
    pan: string;
    email: string;
    phone: string;
    website: string;
    active: boolean;
  }
  export const DummyData: RowData[] = [
    { companyName: 'ABC Corp', pan: 'ABCDE1234F', email: 'abc@corp.com', phone: '1234567890', website: 'www.abccorp.com', active: true },
    { companyName: 'XYZ Ltd', pan: 'XYZEF5678G', email: 'xyz@ltd.com', phone: '0987654321', website: 'www.xyzltd.com', active: false },
    { companyName: 'Example Inc', pan: 'EXAMP1234H', email: 'example@inc.com', phone: '1112223334', website: 'www.exampleinc.com', active: true },
    // Add more rows as needed
  ];
  
  