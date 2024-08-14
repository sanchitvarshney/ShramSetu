import { ColDef } from 'ag-grid-community';

const actionCellRenderer = (params: any) => {
  const { toggleShowDetails } = params.context;

  return (
    <div className="flex justify-center">
      <button
        onClick={() => toggleShowDetails(params?.data?.employeeCode)}
        className="text-teal-500 hover:text-teal-600"
        aria-label="Show Name"
      >
        {params.data.firstName}
      </button>
    </div>
  );
};

export const columnDefs: ColDef[] = [
  {
    headerName: 'Index',
    valueGetter: 'node.rowIndex + 1',
    width: 80,
    filter: false,
  },
  {
    headerName: 'Name',
    field: 'firstName',
    sortable: true,
    filter: true,
    cellRenderer: actionCellRenderer,
  },
  { headerName: 'Last Name', field: 'lastName', sortable: true, filter: true },
  { headerName: 'Gender', field: 'gender', sortable: true, filter: true },
  { headerName: 'DOB', field: 'dob', sortable: true, filter: true },
  {
    headerName: 'Department',
    field: 'department',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Designation',
    field: 'designation',
    sortable: true,
    filter: true,
  },
  { headerName: 'Email', field: 'email', sortable: true, filter: true },
  { headerName: 'Phone', field: 'mobile', sortable: true, filter: true },
  // {
  //   headerName: 'Action',
  //   cellRenderer: () => (
  //     <button >Action</button>
  //   ),
  //   width: 100,
  //   filter:false
  // },
];
export const rowData = [
  // Example row data
  {
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male',
    dob: '1990-01-01',
    department: 'IT',
    designation: 'Developer',
    email: 'john.doe@example.com',
    phone: '1234567890',
  },
  // Add more rows as needed
];
