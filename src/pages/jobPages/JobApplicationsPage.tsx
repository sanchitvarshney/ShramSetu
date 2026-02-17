import { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loading from '@/components/reusable/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchJobApplications,
  updateApplicationStatus,
  setApplicationStatusLocal,
  type JobApplication,
  type ApplicationStatus,
} from '@/features/jobFeatures/jobApplicationsSlice';
import { getJobApplicationsColumnDefs } from '@/table/JobApplicationsTableColumns';
import { toast } from '@/components/ui/use-toast';
import ApplicantDetailsDialog from '@/components/shared/ApplicantDetailsDialog';

const JobApplicationsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    applications,
    isLoading,
    isUpdating,
  } = useSelector((state: RootState) => state.jobApplications);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAppliedKey, setSelectedAppliedKey] = useState<string | null>(null);

  const displayApplications = applications.length > 0 ? applications : [];

  useEffect(() => {
    dispatch(fetchJobApplications());
  }, [dispatch]);

  const handleViewDetails = useCallback((app: JobApplication) => {
    const key =  app.empKey;
    if (key) {
      setSelectedAppliedKey(String(key));
      setDetailsDialogOpen(true);
    }
  }, []);

  const handleStatusChange = useCallback(
    (app: any, newStatus: ApplicationStatus) => {
    
      dispatch(
        updateApplicationStatus({ appliedKey: app.key, status: newStatus })
      ).then((res: any) => {
        if (updateApplicationStatus.rejected.match(res)) {
          dispatch(setApplicationStatusLocal({ id: app.key, status: app.status }));
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update status.',
          });
        } else {
          toast({
            title: 'Updated',
            description: `Application status set to ${newStatus}.`,
          });
        }
      });
    },
    [dispatch]
  );

  const onAccept = useCallback((app: JobApplication) => handleStatusChange(app, 'accepted'), [handleStatusChange]);
  const onDecline = useCallback((app: JobApplication) => handleStatusChange(app, 'declined'), [handleStatusChange]);
  const onHold = useCallback((app: JobApplication) => handleStatusChange(app, 'hold'), [handleStatusChange]);

  const columnDefs = useMemo<ColDef<JobApplication>[]>(
    () => getJobApplicationsColumnDefs(onAccept, onDecline, onHold, handleViewDetails, isUpdating),
    [onAccept, onDecline, onHold, handleViewDetails, isUpdating]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      resizable: true,
    }),
    []
  );

  const statusCounts = useMemo(() => {
    const list = displayApplications;
    return {
      all: list.length,
      pending: list.filter((a:any) => a.status === 'PEN').length,
      accepted: list.filter((a:any) => a.status === 'APR').length,
      declined: list.filter((a:any) => a.status === 'REJ').length,
      hold: list.filter((a:any) => a.status === 'HOLD').length,
    };
  }, [displayApplications]);

  return (
    <div className="p-4 max-h-[calc(100vh-75px)] overflow-y-auto">
      <Card className="rounded-lg ">
        <CardHeader>
          <CardTitle className="text-[20px] font-[650] text-slate-600">
            Job Applications
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Review and manage applicants with Accept, Decline, or Hold.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading && <Loading />}
          <div className="mb-4 flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
            <span className="font-semibold text-gray-700">Total: {statusCounts.all}</span>
            <span className="text-amber-700 font-medium">Pending: {statusCounts.pending}</span>
            <span className="text-green-700 font-medium">Accepted: {statusCounts.accepted}</span>
            <span className="text-red-700 font-medium">Declined: {statusCounts.declined}</span>
            <span className="text-blue-700 font-medium">Hold: {statusCounts.hold}</span>
          </div>
          <div className="ag-theme-quartz h-[calc(100vh-400px)] min-h-[425px]">
            <AgGridReact<JobApplication>
              rowData={displayApplications}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={20}
              suppressCellFocus
            />
          </div>
        </CardContent>
      </Card>

      <ApplicantDetailsDialog
        appliedKey={selectedAppliedKey}
        open={detailsDialogOpen}
        onOpenChange={(open) => {
          setDetailsDialogOpen(open);
          if (!open) setSelectedAppliedKey(null);
        }}
      />
    </div>
  );
};

export default JobApplicationsPage;
