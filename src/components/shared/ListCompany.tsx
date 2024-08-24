import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchCompanies } from '@/features/admin/adminPageSlice';
import { ColDef } from 'ag-grid-community';
import Loading from '@/components/reusable/Loading';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IoMdDownload } from 'react-icons/io';

const ListCompany: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies,loading } = useSelector((state: RootState) => state.adminPage);
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
      <div className="flex">
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
    {
      headerName: 'Active Status',
      field: 'activeStatus',
      valueGetter: (params) =>
        params.data.activeStatus === 'true' ? 'Active' : 'Not Active',
    },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-140px)]">
      {loading && <Loading />}
      <div className="h-[50px] flex items-center justify-end px-[20px]">
        <Button className="flex items-center gap-[5px] bg-teal-500 hover:bg-teal-600 shadow-neutral-400">
          <IoMdDownload className="h-[20px] w-[20px]" /> Download
        </Button>
      </div>
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
