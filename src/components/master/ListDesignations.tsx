import React, { useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchDesignations } from '@/features/admin/adminPageSlice';
import { ColDef } from 'ag-grid-community';
import Loading from '@/components/reusable/Loading';

const ListDesignations: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { designation, loading } = useSelector((state: RootState) => state.adminPage);

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }),
    [],
  );

  useEffect(() => {
    dispatch(fetchDesignations());
  }, [dispatch]);

  const columnDefs: ColDef[] = [
    { headerName: 'Designation Name', field: 'text', flex: 1 },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-200px)] min-h-[300px]">
      {loading && <Loading />}
      <AgGridReact
        rowData={designation ?? []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
        suppressCellFocus={true}
      />
    </div>
  );
};

export default ListDesignations;
