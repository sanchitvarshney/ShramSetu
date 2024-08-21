import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchCompanies } from '@/features/admin/adminPageSlice';
import { ColDef } from 'ag-grid-community';
import Loading from '@/components/reusable/Loading';
import { Link } from 'react-router-dom';

const ListCompany: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies } = useSelector((state: RootState) => state.adminPage);
  const [companyId, setCompanyId] = useState<string | null>(null);

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
    return (
      <div className="flex justify-center">
        <Link
          to={`/company/${params.data.companyID}`} // Adjust the path as needed
          className="text-teal-500 hover:text-teal-600"
          aria-label="Show Details"
        >
          {params.data.name}
        </Link>
      </div>
    );
  };

  const columnDefs: ColDef[] = [
    {
      headerName: 'Company Name',
      field: 'name',
      cellRenderer: actionCellRenderer,
    },
    { headerName: 'Company ID', field: 'companyID' },
    { headerName: 'PAN No', field: 'panNo' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Mobile', field: 'mobile' },
    { headerName: 'Website', field: 'website' },
    { headerName: 'Active Status', field: 'activeStatus' },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-140px)]">
      {!companies?.length && <Loading />}
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
