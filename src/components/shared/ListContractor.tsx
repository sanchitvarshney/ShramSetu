import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchContractors, type Contractor } from '@/features/admin/adminPageSlice';
import { ColDef } from 'ag-grid-community';
import Loading from '@/components/reusable/Loading';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import UpdateContractorForm from '@/components/shared/UpdateContractorForm';

const ListContractor: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { contractors, contractorLoading } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }),
    [],
  );

  useEffect(() => {
    dispatch(fetchContractors());
  }, [dispatch]);

  const handleEditClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setSelectedContractor(null);
  };

  const onUpdateSuccess = () => {
    dispatch(fetchContractors());
    setSheetOpen(false);
    setSelectedContractor(null);
  };

  const actionCellRenderer = (params: any) => {
    const row = params.data as Contractor;
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleEditClick(row)}
          className="text-teal-500 hover:text-teal-600 hover:underline cursor-pointer bg-transparent border-none text-left"
          aria-label="Edit contractor"
        >
          Edit
        </button>
      </div>
    );
  };

  const columnDefs: ColDef[] = [
    { headerName: 'Contractor Name', field: 'name', flex: 1, minWidth: 200 },
    { headerName: 'Contractor Mobile', field: 'mobile', flex: 1,minWidth: 200 },
    { headerName: 'Contract Name', field: 'contactName', flex: 1, minWidth: 200 },
    { headerName: 'Contract Mobile', field: 'contactMobile', flex: 1, minWidth: 200 },
    { headerName: 'PAN No', field: 'panNo', flex: 1, minWidth: 200 },
  { headerName: 'GST No', field: 'gstNo', flex: 1, minWidth: 200 },
    { headerName: 'Email', field: 'email', flex: 1, minWidth: 200 },
    { headerName: 'Address', field: 'address', flex: 1, minWidth: 200 },
    {
      headerName: 'Status',
      field: 'activeStatus',
      flex: 1,
       minWidth: 200,
      valueFormatter: (p) => (p.value === 'A' ? 'Active' : p.value === 'INA' ? 'Inactive' : p.value ?? '—'),
    },
    {
      headerName: 'Actions',
      field: 'contractorID',
      width: 100,
      cellRenderer: actionCellRenderer,
      filter: false,
      sortable: false,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-75px)] p-4">
      {contractorLoading && <Loading />}
      <div className="ag-theme-quartz h-full">
        <AgGridReact
          rowData={contractors ?? []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          suppressCellFocus={true}
        />
      </div>

      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Update contractor</SheetTitle>
          </SheetHeader>
          {selectedContractor && (
            <UpdateContractorForm
              contractor={selectedContractor}
              onSuccess={onUpdateSuccess}
              onCancel={() => handleSheetOpenChange(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ListContractor;
