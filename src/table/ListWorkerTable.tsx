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
        {params.data.firstName}
      </button>
    </div>
  );
};

export const columnDefs: ColDef[] = [
  {
    headerName: 'First Name',
    field: 'firstName',
    sortable: true,
    filter: true,
    flex: 1,
    cellRenderer: actionCellRenderer,
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    sortable: true,
    filter: true,
    flex: 1,
  },
  {
    headerName: 'Phone',
    field: 'mobile',
    sortable: true,
    filter: true,
    flex: 1,
  },
  {
    headerName: 'E-mail',
    field: 'email',
    sortable: true,
    filter: true,
    flex: 1,
  },
  { headerName: 'DOB', field: 'DOB', sortable: true, filter: true, flex: 1 },
];

interface RowData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dob: string;
}

export const dummyData: RowData[] = [
    { firstName: 'John', lastName: 'Doe', phone: '123-456-7890', email: 'john.doe@example.com', dob: '01/01/1990' },
    { firstName: 'Jane', lastName: 'Smith', phone: '234-567-8901', email: 'jane.smith@example.com', dob: '02/14/1985' },
    { firstName: 'Alice', lastName: 'Johnson', phone: '345-678-9012', email: 'alice.johnson@example.com', dob: '05/23/1992' },
    { firstName: 'Bob', lastName: 'Brown', phone: '456-789-0123', email: 'bob.brown@example.com', dob: '12/11/1987' }
];
