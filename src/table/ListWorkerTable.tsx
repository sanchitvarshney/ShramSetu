import { ColDef } from 'ag-grid-community';

const actionCellRenderer = (params: any) => {
  const { toggleShowDetails } = params.context;
  
  return (
    <div className="flex">
      <button
        onClick={() => toggleShowDetails(params.data)}
        className="text-teal-500 hover:text-teal-600"
        aria-label="Show Name"
      >
        {params.data.empFirstName + ' ' + params.data.empLastName  || '--'}
      </button>
    </div>
  );
};

export const columnDefs: ColDef[] = [
  {
    headerName: '',
    field: 'employeeID',
    width: 50,
    maxWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    suppressMenu: true,
    sortable: false,
    filter: false,
  },
  {
    headerName: 'Full Name',
    field: 'firstName',
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 20,
    cellRenderer: actionCellRenderer,
  },
 
  {
    headerName: 'Phone',
    field: 'empMobile',
    sortable: true,
    filter: true,
    flex: 1,
  },
  {
    headerName: 'E-mail',
    field: 'empEmail',
    sortable: true,
    filter: true,
    flex: 1,
  },
  { headerName: 'DOB', field: 'empDOB', sortable: true, filter: true, flex: 1 },
  { headerName: 'Gender', field: 'empGender', sortable: true, filter: true, flex: 1 },
   { headerName: 'Aadhar', field: 'adhaar', sortable: true, filter: true, flex: 1 },
    { headerName: 'BloodGroup', field: 'bloodGroup', sortable: true, filter: true, flex: 1 },
  { headerName: 'InsertedAt', field: 'empInsertedAt', sortable: true, filter: true, flex: 1 },
];

