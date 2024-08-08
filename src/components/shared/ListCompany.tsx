import React, { useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchCompanies } from '@/features/admin/adminPageSlice';
import { ColDef } from 'ag-grid-community';

const ListCompany: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies} = useSelector((state: RootState) => state.adminPage);

  const defaultColDef = useMemo(() => ({
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  }), []);

  useEffect(() => {
    dispatch(searchCompanies());
  }, [dispatch]);

  const columnDefs: ColDef[] = [
    { headerName: 'Company Name', field: 'name' },
    { headerName: 'Company ID', field: 'companyID' },
    { headerName: 'PAN No', field: 'panNo' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Mobile', field: 'mobile' },
    { headerName: 'Website', field: 'website' },
    { headerName: 'Active Status', field: 'activeStatus' },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-140px)]">
      <AgGridReact
        rowData={companies || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
      />
    </div>
  );
};

export default ListCompany;
