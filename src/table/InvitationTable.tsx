import { ColDef } from "ag-grid-community";

export interface RowData {
    name: string;
    message: string;
    sendTime: string;
    status: string;
  }
  
export  const columnDefs: ColDef[] = [
    { 
      headerName: '#', 
      valueGetter: 'node.rowIndex + 1', 
      sortable: true ,
      maxWidth:50,
      filter:false
    },
    { headerName: 'Name', field: 'name', sortable: true, filter: true,flex:1 },
    { headerName: 'Message', field: 'message', sortable: true, filter: true ,flex:2},
    { headerName: 'Send Time', field: 'sendTime', sortable: true, filter: true,flex:1 },
    { 
      headerName: 'Deliver Status', 
      field: 'status', 
      sortable: true, 
      filter: false,
      minWidth:150
    }
  ];
  
 export  const dummyData: RowData[] = [
    // { name: 'John Doe', message: 'Hello', sendTime: '2024-08-01 10:00', status: "yes" },
    // { name: 'Jane Smith', message: 'Hi', sendTime: '2024-08-01 11:00', status: "no" }
  ];
  