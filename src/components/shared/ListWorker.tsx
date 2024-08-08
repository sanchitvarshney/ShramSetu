import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@/table/ListWorkerTable';
import { DateRangePicker } from '../ui/dateRangePicker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchWorkers } from '@/features/admin/adminPageSlice';
import { format } from 'date-fns';

const ListWorker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const workers = useSelector((state: RootState) => state.adminPage.workers);

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }),
    [],
  );

  const handleDateRangeUpdate = (values: {
    range: { from: Date; to?: Date };
    rangeCompare?: { from: Date; to?: Date };
  }) => {
    const { range } = values;
    if (
      range &&
      range.from instanceof Date &&
      !isNaN(range.from.getTime()) &&
      (range.to === undefined ||
        (range.to instanceof Date && !isNaN(range.to.getTime())))
    ) {
      const startDate = new Date(range.from);
      const endDate = range.to ? new Date(range.to) : new Date(range.from);
      const formattedStartDate = format(startDate, 'MM-dd-yyyy');
      const formattedEndDate = format(endDate, 'MM-dd-yyyy');
      dispatch(
        fetchWorkers({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }),
      );
    } else {
      console.error('Invalid date range');
    }
  };

  return (
    <div>
      <div className="h-[50px] flex items-center px-[20px]">
        <DateRangePicker
          align="center"
          locale="en-US"
          onUpdate={handleDateRangeUpdate}
          showCompare={false}
        />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-190px)]">
        <AgGridReact
          rowData={workers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default ListWorker;
