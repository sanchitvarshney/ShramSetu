import { Button } from '@/components/ui/button'; // Ensure columns is correctly defined
import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';
import { IoMdDownload } from 'react-icons/io';
import { fetchActivityLogs } from '@/features/admin/adminPageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { RowData } from '@/table/activityLogTable';
import { FaTrash } from 'react-icons/fa'; // Import delete icon

const ActivityLogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activityLogs } = useSelector((state: RootState) => state.adminPage);
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    dispatch(fetchActivityLogs());
  }, [dispatch]);

  useEffect(() => {
    // Transform API data to match dummyData format
    const transformedData = activityLogs.map((log: any, index: number) => ({
      id: log.id || index + 1, // Ensure a unique ID
      insertedBy: log.insertBy,
      insertDate: log.insertDt,
      action: '', // Placeholder, will be replaced by the custom renderer
    }));
    setRowData(transformedData);
  }, [activityLogs]);

  const deleteRow = (id: number) => {
    setRowData(rowData.filter((row) => row.id !== id));
    // Optionally dispatch an action to remove the item from the backend as well
  };

  const defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  const actionCellRenderer = (params: any) => (
    <div className="flex justify-center">
      <button
        onClick={() => deleteRow(params.data.id)}
        className="text-red-500 hover:text-red-700 pt-3"
        aria-label="Delete"
      >
        <FaTrash />
      </button>
    </div>
  );

  // Define columns, ensuring there’s only one action column
  const enhancedColumns = [
    {
      headerName: '#',
      field: 'id',
      headerClass: 'custom-header',
      filter: false,
      maxWidth: 50,
    },
    {
      headerName: 'Inserted By',
      field: 'insertedBy',
      headerClass: 'custom-header',
      flex: 2,
    },
    {
      headerName: 'Insert Date',
      field: 'insertDate',
      headerClass: 'custom-header',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'action',
      headerClass: 'custom-header',
      flex: 1,
      cellRenderer: actionCellRenderer, // Use the custom renderer
    },
  ];

  return (
    <div>
      <div className="h-[50px] flex items-center justify-end px-[20px]">
        <Button className="flex items-center gap-[5px] bg-teal-500 hover:bg-teal-600 shadow-neutral-400">
          <IoMdDownload className="h-[20px] w-[20px]" /> Download
        </Button>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-120px)]">
        <AgGridReact
          suppressCellFocus={false}
          defaultColDef={defaultColDef}
          columnDefs={enhancedColumns} // Use enhanced columns with custom renderer
          rowData={rowData} // Use transformed data here
          pagination={true}
        />
      </div>
    </div>
  );
};

export default ActivityLogPage;
