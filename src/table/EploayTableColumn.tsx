import { ColDef } from 'ag-grid-community';
export const columnDefs: ColDef[] = [
    {
      headerName: 'Index',
      valueGetter: 'node.rowIndex + 1',
      width: 80,
      filter:false
    },
    { headerName: 'Name', field: 'firstName', sortable: true, filter: true },
    { headerName: 'Last Name', field: 'lastName', sortable: true, filter: true },
    { headerName: 'Gender', field: 'gender', sortable: true, filter: true },
    { headerName: 'DOB', field: 'dob', sortable: true, filter: true },
    { headerName: 'Department', field: 'department', sortable: true, filter: true },
    { headerName: 'Designation', field: 'designation', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    {
      headerName: 'Action',
      cellRenderer: () => (
        <button >Action</button>
      ),
      width: 100,
      filter:false
    },
  ];
  export const rowData = [
    // Example row data
    {
      name: 'John',
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
  