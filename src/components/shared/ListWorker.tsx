import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@/table/ListWorkerTable';
import { DatePicker, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchCountStatus,
  fetchWorkers,
  fetchWorkerDetailsByKey,
  handleEmpStatus,
  type WorkerDetailsApiResponse,
} from '@/features/admin/adminPageSlice';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import WorkerDetails from '@/components/shared/WorkerDetails';
import Loading from '@/components/reusable/Loading';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { SearchOutlined } from '@mui/icons-material';
import { Download } from 'lucide-react';

const { RangePicker } = DatePicker;

const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL ?? '';


function normalizeWorkerDetailsFromApi(api: WorkerDetailsApiResponse | { data?: WorkerDetailsApiResponse }): any {
  const raw = (api as any).data && typeof (api as any).data === 'object' ? (api as any).data : api;
  const basic = raw.basicDetails ?? {};
  const personal = raw.personalDetails ?? {};
  const photoRaw = basic.empPhoto ?? (raw as any).empPhoto;
  const empPhoto = (() => {
    if (Array.isArray(photoRaw) && photoRaw.length > 0) {
      const url = photoRaw[0];
      return typeof url === 'string' ? url : undefined;
    }
    if (typeof photoRaw === 'string' && photoRaw.trim()) {
      const path = photoRaw.trim();
      return path.startsWith('http') ? path : `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
    return undefined;
  })();
  const empCode = basic.empCode ?? '';
  const employment = raw.employeementDetails;
  const companyInfo = Array.isArray(employment)
    ? employment
    : employment && typeof employment === 'object' && !Array.isArray(employment)
      ? Object.values(employment)
      : [];
  return {
    employeeID: empCode,
    empId: empCode,
    empCode,
    empFirstName: basic.firstName ?? '',
    empMiddleName: basic.middleName ?? '',
    empLastName: basic.lastName ?? '',
    empEmail: basic.empEmail ?? '',
    empMobile: basic.empPhone ?? '',
    adhaar: basic.adhaar ?? '',
    designation : basic.designationName ?? '',
    department : basic.departmentName ?? '',
    empPhoto,
    empDOB: personal.dob ?? '',
    empGender: personal.gender ?? '',
    empMaritalStatus: personal.empMaritalStatus ?? '',
    empHobbies: personal.empHobbies ?? '',
    empPanNo: basic.panNo ?? basic.empPanNo ?? personal.panNo ?? personal.empPanNo ?? '',
    present_houseNo: personal.present_houseNo ?? '',
    present_colony: personal.present_colony ?? '',
    present_city: personal.present_city ?? '',
    present_state: personal.present_state ?? '',
    present_district: personal.present_district ?? '',
    present_country: personal.present_country ?? '',
    present_pincode: personal.present_pincode ?? '',
    perma_houseNo: personal.perma_houseNo ?? '',
    perma_colony: personal.perma_colony ?? '',
    perma_city: personal.perma_city ?? '',
    perma_state: personal.perma_state ?? '',
    perma_district: personal.perma_district ?? '',
    perma_country: personal.perma_country ?? '',
    perma_pincode: personal.perma_pincode ?? '',
    educationList: raw.educationDetails ?? [],
    companyInfo,
  };
}



function workerToExcelRow(worker: any): Record<string, string | number | undefined> {
  return {
    'Employee ID': worker.employeeID ?? worker.empId ?? '',
    'First Name': worker.empFirstName ?? worker.firstName ?? '',
    'Last Name': worker.empLastName ?? worker.lastName ?? '',
    Phone: worker.empMobile ?? worker.mobile ?? '',
    'E-mail': worker.empEmail ?? worker.email ?? '',
    DOB: worker.empDOB ?? worker.DOB ?? '',
    'Inserted At': worker.empInsertedAt ?? worker.insertedAt ?? '',
    Gender: worker.gender ?? worker.empGender ?? '',
    'Blood Group': worker.bloodGroup ?? worker.empBloodGroup ?? '',
    'Aadhaar No': worker.aadhaarNo ?? worker.empAadhaarNo ?? '',
    Company: worker.companyName ?? worker.company ?? '',
    Branch: worker.branchName ?? worker.branch ?? '',
  };
}


const ListWorker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { workers, loading, loadingworkerlist } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const [selectedEmpId, setSelectedEmpId] = useState<any | null>(null);
  const [workerDetails, setWorkerDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [status, setStatus] = useState('PEN'); // Default status
  const [startDateRange, setStartDate] = useState<string>('');
  const [endDateRange, setEndDate] = useState<string>('');

  const detailsKey = selectedEmpId
    ? (selectedEmpId.employeeID ?? selectedEmpId.empId ?? selectedEmpId.empCode ?? selectedEmpId)
    : null;

  useEffect(() => {
    if (!detailsKey || typeof detailsKey !== 'string') {
      setWorkerDetails(null);
      return;
    }
    setWorkerDetails(null);
    setDetailsLoading(true);
    dispatch(fetchWorkerDetailsByKey(detailsKey))
      .unwrap()
      .then((data:any) => {
        setWorkerDetails(normalizeWorkerDetailsFromApi(data));
      })
      .catch(() => {
        setWorkerDetails(null);
      })
      .finally(() => {
        setDetailsLoading(false);
      });
  }, [detailsKey, dispatch]);

  const handleDateRangeUpdate = (dates: any) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      const formattedStartDate = format(startDate.toDate(), 'dd-MM-yyyy');
      const formattedEndDate = format(endDate.toDate(), 'dd-MM-yyyy');

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      // Dispatch the fetchWorkers with the formatted dates
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


  useEffect(() => {
     dispatch(
      //@ts-ignore
        fetchWorkers({}),
      );
  }, [])
  
  const handleStatusChange = (value: any) => {
    setStatus(value);
    dispatch(
      fetchWorkers({
        startDate: startDateRange,
        endDate: endDateRange,
      }),
    );
  };

  const toggleShowDetails = (empId?: string) => {
    setSelectedEmpId(empId ?? null);
  };

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }),
    [],
  );

  useEffect(() => {
    dispatch(fetchCountStatus());
  }, [dispatch]);

  const handleDownloadExcel = () => {
    if (!workers?.length) {
      toast({
        variant: 'destructive',
        title: 'No data',
        description: 'No employee details to download',
      });
      return;
    }
    const rows = workers.map(workerToExcelRow);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    const fileName = `employee-details-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast({
      title: 'Downloaded',
      description: `Exported ${workers.length} employee(s) to ${fileName}`,
    });
  };

  const handleStatus = (status: string) => {
    const empUid =
      typeof selectedEmpId === 'object' && selectedEmpId?.employeeID
        ? selectedEmpId.employeeID
        : selectedEmpId;
    if (!empUid) return;
    dispatch(
      handleEmpStatus({
        empUid,
        empStatus: status,
      }),
    ).then((response: any) => {
      if (response.payload.success) {
        toast({ title: 'Success!!', description: response.payload.message });
        dispatch(fetchCountStatus());
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.payload.message,
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      { (loading || loadingworkerlist) && <Loading />}
      <div className="mb-4 pl-5 pt-5">
        <Space direction="vertical" size={12} className="flex-row">
          <RangePicker
            onChange={handleDateRangeUpdate}
            format="DD-MM-YYYY"
            className="w-full"
          />
          {/* <Select
            defaultValue={status}
            onChange={(value) => {
              handleStatusChange(value);
            }}
            className="w-[120px]"
            style={{ marginBottom: '16px' }}
          >
            <Option value="APR">Approved</Option>
            <Option value="REJ">Reject</Option>
            <Option value="PEN">Pending</Option>
          </Select> */}
          <Button
            type="submit"
            className="shadow bg-teal-500 hover:bg-teal-600 shadow-slate-500 w-[120px] gap-2 h-8"
            onClick={() => handleStatusChange(status)}
          >
           <SearchOutlined />
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2 h-8"
            onClick={handleDownloadExcel}
            disabled={!workers?.length}
          >
            <Download className="h-4 w-4" />
            Download Excel
          </Button>
          {/* <div className="flex gap-4 pl-4 rounded-lg ">
            <p className="text-green-600 font-semibold text-[24px]">
              Approved:{' '}
              <span className="text-black">{workersStatusCount[0]?.apr}</span>
            </p>
            <p className="text-red-600 font-semibold text-[24px]">
              Rejected:{' '}
              <span className="text-black">{workersStatusCount[0]?.rej}</span>
            </p>
            <p className="text-yellow-600 font-semibold text-[24px]">
              Pending:{' '}
              <span className="text-black">{workersStatusCount[0]?.pen}</span>
            </p>
          </div> */}
        </Space>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 mr-4">
          <div className="ag-theme-quartz h-full">
            <AgGridReact
              rowData={workers}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              context={{ toggleShowDetails }}
              suppressCellFocus={true}
            />
          </div>
        </div>
        {selectedEmpId && (
          <WorkerDetails
            showEdit
            worker={workerDetails}
            open={Boolean(selectedEmpId)}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedEmpId(null);
                setWorkerDetails(null);
              }
            }}
            onWorkerUpdated={() => {
              if (detailsKey) {
                dispatch(fetchWorkerDetailsByKey(detailsKey))
                  .unwrap()
                  .then((data:any) => setWorkerDetails(normalizeWorkerDetailsFromApi(data)));
              }
            }}
            detailsLoading={detailsLoading}
            handleStatus={handleStatus}
          />
        )}
      </div>
    </div>
  );
};

export default ListWorker;
