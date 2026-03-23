import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchCompanies } from '@/features/admin/adminPageSlice';
import { ColDef } from 'ag-grid-community';
import Loading from '@/components/reusable/Loading';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CompanyInfoContent } from '@/components/ui/companyInfo';

const ListCompany = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) setSelectedCompanyId(null);
  };
  const dispatch = useDispatch<AppDispatch>();
  const { companies, loading } = useSelector(
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
    dispatch(searchCompanies());
  }, []);

  const actionCellRenderer = (params: any) => {
    const companyId = params.data?.companyID;
    const name = params.data?.name ?? '';
    return (
      <div className="flex">
        <button
          type="button"
          onClick={() => companyId && handleCompanyClick?.(companyId)}
          className="text-teal-500 hover:text-teal-600 hover:underline text-left cursor-pointer bg-transparent border-none"
          aria-label="Show Details"
        >
          {name}
        </button>
      </div>
    );
  };

  const columnDefs: ColDef[] = [
    {
      headerName: '#',
      field: 'text',
      maxWidth: 60,
      valueGetter: 'node.rowIndex + 1',
    },
    {
      headerName: 'Company Name',
      field: 'name',
      cellRenderer: actionCellRenderer,
    },
    {
      headerName: 'Brand',
      field: 'brand',
      valueFormatter: (params) => params.value ?? '—',
    },
    { headerName: 'Contact Name', field: 'contactName' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Mobile', field: 'mobile' },
    { headerName: 'Website', field: 'website' },
    {
      headerName: 'Created by',
      field: 'createdBy',
    },
    { headerName: 'Updated At', field: 'updatedAt' },
    // {
    //   headerName: 'Active Status',
    //   field: 'activeStatus',
    //   valueGetter: (params) =>
    //     params.data?.activeStatus === 'A' ? 'Active' : 'Not Active',
    // },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-80px)] p-2">
      {loading && <Loading />}
      <AgGridReact
        rowData={companies || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        suppressCellFocus={true}
      />

      <Sheet open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Company details</SheetTitle>
          </SheetHeader>
          {selectedCompanyId && (
            <CompanyInfoContent companyId={selectedCompanyId} embedded />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ListCompany;
