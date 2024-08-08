import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, dummyData } from '@/table/ListWorkerTable';
import { DateRangePicker } from '../ui/dateRangePicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store'; // Adjust the import path for your store type
import { fetchWorkers } from '@/features/admin/adminPageSlice';

const ListWorker: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const dispatch = useDispatch();
  const workers = useSelector((state: RootState) => state.adminPage.workers); // Adjust the state path

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  const handleDateRangeUpdate = (values: { range: { startDate: string; endDate: string }; rangeCompare?: { startDate: string; endDate: string } }) => {
    const { range } = values;
    console.log(range,"range")
    setDateRange(range);
    if (range) {
      dispatch(fetchWorkers(range));
    }
  };

  return (
    <div>
      <div className="h-[50px] flex items-center px-[20px]">
        <DateRangePicker
          align="center"
          locale="en-US"
          onUpdate={(e) => console.log(e)}
          showCompare={false}
        />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-190px)]">
        <AgGridReact
          rowData={workers || dummyData} // Fallback to dummyData if workers is null
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default ListWorker;
