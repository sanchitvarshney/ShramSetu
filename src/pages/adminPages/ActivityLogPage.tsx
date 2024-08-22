import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { IoMdDownload } from 'react-icons/io';
import {
  fetchActivityLogs,
  deleteActivityLog,
} from '@/features/admin/adminPageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { RowData } from '@/table/activityLogTable';
import { FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { AlertDialogPopup } from '@/components/shared/AlertDialogPopup';
import { toast } from '@/components/ui/use-toast';
import Loading from '@/components/reusable/Loading';

const ActivityLogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activityLogs } = useSelector((state: RootState) => state.adminPage);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchActivityLogs());
  }, [dispatch]);

  useEffect(() => {
    const transformedData =
      activityLogs?.map((log: any) => ({
        insertedBy: log.insertBy,
        insertDate: log.insertDt,
        action: '',
        value: log.value,
      })) || [];
    setRowData(transformedData);
  }, [activityLogs]);

  const handleDelete = (fileId: string) => {
    setSelectedFileId(fileId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFileId) {
      dispatch(deleteActivityLog(selectedFileId))
        .then((response: any) => {
          setRowData(
            rowData.filter((row: any) => row.value !== selectedFileId),
          );
          setIsDialogOpen(false);
          if (response.meta.requestStatus === 'fulfilled') {
            toast({
              title: 'Success!!',
              description: 'File Deleted Successfully',
            });
          }
        })
        .catch((error: any) => {
          console.error('Failed to delete log:', error);
          setIsDialogOpen(false);
        });
    }
  };

  const defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  const actionCellRenderer = (params: any) => (
    <div className="flex justify-center">
      <button
        onClick={() => handleDelete(params.data.value)}
        className="text-red-500 hover:text-red-700 pt-3"
        aria-label="Delete"
      >
        <FaTrash />
      </button>
    </div>
  );
  const indexCellRenderer = (params: any) => {
    return params.node.rowIndex + 1;
  };
  const enhancedColumns = [
    {
      headerName: '#',
      field: 'index',
      headerClass: 'custom-header',
      valueGetter: indexCellRenderer,
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
      cellRenderer: actionCellRenderer,
    },
  ];

  return (
    <div>
      {!Object.keys(activityLogs)?.length && <Loading />}
      <div className="h-[50px] flex items-center justify-end px-[20px]">
        <Button className="flex items-center gap-[5px] bg-teal-500 hover:bg-teal-600 shadow-neutral-400">
          <IoMdDownload className="h-[20px] w-[20px]" /> Download
        </Button>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-120px)]">
        <AgGridReact
          suppressCellFocus={false}
          defaultColDef={defaultColDef}
          columnDefs={enhancedColumns}
          rowData={rowData}
          pagination={true}
        />
      </div>
      <AlertDialogPopup
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Activity Log"
        description="Are you sure you want to delete this Activity Log? Please note that all records associated with this file will also be deleted."
      />
    </div>
  );
};

export default ActivityLogPage;
