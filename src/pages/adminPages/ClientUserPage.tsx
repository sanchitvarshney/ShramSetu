import React, { useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@/table/WorkersTableColumns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientList } from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import Loading from '@/components/reusable/Loading';
const ClientUserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clientList,loading } = useSelector((state: RootState) => state.adminPage);

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  useEffect(() => {
    dispatch(fetchClientList());
  }, [dispatch]);

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-70px)]">
      {loading && <Loading />}
      <AgGridReact
        rowData={clientList}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        suppressCellFocus={true}
      />
    </div>
  );
};

export default ClientUserPage;
