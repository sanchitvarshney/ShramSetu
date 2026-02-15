import React, { useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchCompanies } from '@/features/admin/adminPageSlice';
import { ColDef } from 'ag-grid-community';
import Loading from '@/components/reusable/Loading';

interface ListCompanyProps {
  onCompanyClick?: (companyId: string) => void;
}

const ListCompany: React.FC<ListCompanyProps> = ({ onCompanyClick }) => {
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
  }, [dispatch]);

  const actionCellRenderer = (params: any) => {
    const companyId = params.data?.companyID;
    const name = params.data?.name ?? '';
    return (
      <div className="flex">
        <button
          type="button"
          onClick={() => companyId && onCompanyClick?.(companyId)}
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
      headerName: 'Company Name',
      field: 'name',
      cellRenderer: actionCellRenderer,
    },
    {
      headerName: 'Brand',
      field: 'brand',
      valueFormatter: (params) => params.value ?? '—',
    },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Mobile', field: 'mobile' },
    { headerName: 'Website', field: 'website' },
    {
      headerName: 'Active Status',
      field: 'activeStatus',
      valueGetter: (params) =>
        params.data?.activeStatus === 'A' ? 'Active' : 'Not Active',
    },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-140px)]">
      {loading && <Loading />}
      <AgGridReact
        rowData={companies || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        suppressCellFocus={true}
      />
    </div>
  );
};

export default ListCompany;
