import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { jobColumnDefs, JobRowData } from '@/table/JobTableColumns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loading from '@/components/reusable/Loading';
import { toast } from '@/components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchDepartments,
  fetchDesignations,
  fetchJobs,
} from '@/features/admin/adminPageSlice';
import { fetchCompanies } from '@/features/homePage/homePageSlice';
import { AlertDialogPopup } from '@/components/shared/AlertDialogPopup';
import EditJobDialog from '@/components/shared/EditJobDialog';
import { useForm } from 'react-hook-form';
import { updatejobs } from '@/features/jobFeatures/jobsSlices';

const JobListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { department, designation,isFetchingJobsLoading } = useSelector(
    (state: RootState) => state.adminPage,
  );
  const { companies } = useSelector((state: RootState) => state.homePage);
  const [jobs, setJobs] = useState<JobRowData[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobRowData[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const form = useForm<JobRowData>({
    defaultValues: {
      jobTitle: '',
      jobType: '',
      company: '',
      department: '',
      designation: '',
      minSalary: 0,
      maxSalary: 0,
      experience: '',
      jobStatus: '',
      address: '',
      skills: '',
      qualification: '',
      jobDescription: '',
      facilities: '',
    },
  });

  useEffect(() => {
    if( department.length === 0 || designation.length === 0){
      dispatch(fetchDepartments());
    dispatch(fetchDesignations());
    dispatch(fetchCompanies());
    }
  }, [ isEditDialogOpen]);
  const handleFetchJobs = () => {
      dispatch(fetchJobs()).then((response: any) => {
      setJobs(response.payload.data || []);
      setFilteredJobs(response.payload.data || []);
     
    });
  }

  useEffect(() => {
  
    handleFetchJobs()
  
  }, []);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      resizable: true,
    }),
    [],
  );

  const handleJobUpdate = (jobId: string, field: string, newValue: any) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.jobID === jobId || job.id === jobId
          ? { ...job, [field]: newValue }
          : job,
      ),
    );

  };

  const handleEdit = (job: JobRowData) => {
    setSelectedJob(job);
    const companyName = job.companyName ?? job.company;
    const companyByName = companies?.find(
      (c: any) => (c.text ?? c.name) === companyName,
    );
    const companyId =
      companyByName?.value ??
      companyByName?.companyID ??
      (companies?.some(
        (c: any) => c.value === job.company || c.companyID === job.company,
      )
        ? job.company
        : '');
    const departmentId =
      department?.find((d: any) => d.text === job.department)?.value ??
      department?.find((d: any) => d.value === job.department)?.value ??
      job.department ??
      '';
    const designationId =
      designation?.find((d: any) => d.text === job.designation)?.value ??
      designation?.find((d: any) => d.value === job.designation)?.value ??
      job.designation ??
      '';
    form.reset({
      jobTitle: job.jobTitle || '',
      jobType: job.jobType || '',
      company: companyId || '',
      department: departmentId,
      designation: designationId,
      minSalary: job.minSalary || 0,
      maxSalary: job.maxSalary || 0,
      experience: job.experience || '',
      jobStatus: job.jobStatus || '',
      address: job.address ?? '',
      skills: job.skills || '',
      qualification: job.qualification || '',
      facilities: job.facilities || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (jobId: string) => {
    setJobToDelete(jobId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (jobToDelete) {
      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) => job.jobID !== jobToDelete && job.id !== jobToDelete,
        ),
      );

      // TODO: Replace with actual API call
      // dispatch(deleteJob(jobToDelete)).then((response: any) => {
      //   if (response.payload.success) {
      //     toast({
      //       title: 'Success!!',
      //       description: 'Job deleted successfully',
      //     });
      //   } else {
      //     toast({
      //       variant: 'destructive',
      //       title: 'Error',
      //       description: response.payload.message,
      //     });
      //   }
      // });

      toast({
        title: 'Success!!',
        description: 'Job deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleSaveEdit = (data: JobRowData) => {
    console.log(data, selectedJob,"data")
    if (!selectedJob) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a job to update',
      });
      return;
    }
    const jobId = String(selectedJob.uniqueID ?? selectedJob.id ?? '');
    if (!jobId) return;

    const updatedJob = { ...selectedJob, ...data };
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.jobID === jobId || job.id === jobId ? updatedJob : job,
      ),
    );

    const payload: any = {
      uniqueID: jobId,
      company: data.company,
      address: data.address,
      jobTitle: data.jobTitle ?? '',
      jobType: data.jobType ?? '',
      department: data.department ?? '',
      designation: data.designation ?? '',
      minSalary: Number(data.minSalary) || 0,
      maxSalary: Number(data.maxSalary) || 0,
      experience: data.experience ?? '',
      jobStatus: data.jobStatus ?? '',
      skills: data.skills,
      qualification: data.qualification,
      jobDescription: data.jobDescription,
      facilities: data.facilities,
    };

    dispatch(updatejobs(payload)).then((response: any) => {
      if (response.payload?.success) {
        toast({
          title: 'Success!!',
          description: 'Job updated successfully',
        });
        setIsEditDialogOpen(false);
        setSelectedJob(null);
        handleFetchJobs();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.payload?.message ?? 'Failed to update job',
        });
      }
    });
  };

  const getStatusCounts = () => {
    return {
      all: jobs.length,
      Active: jobs.filter((j) => j.jobStatus === 'Active').length,
      Cancel: jobs.filter((j) => j.jobStatus === 'Cancel').length,
      Hold: jobs.filter((j) => j.jobStatus === 'Hold').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="p-4 max-h-[calc(100vh-75px)] overflow-y-auto">
      <AlertDialogPopup
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
      />

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-[20px] font-[650] text-slate-600">
            Job List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingJobsLoading && <Loading />}
          <div className="mb-2 space-y-2">
            <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  {statusCounts.all}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">Active:</span>
                <span className="text-lg font-bold text-green-700">
                  {statusCounts.Active}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-600">Inactive:</span>
                <span className="text-lg font-bold text-red-700">
                  {statusCounts.Cancel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">Hold:</span>
                <span className="text-lg font-bold text-blue-700">
                  {statusCounts.Hold}
                </span>
              </div>
            </div>
          </div>

          <div className="ag-theme-quartz h-[calc(100vh-400px)] min-h-[450px]">
            <AgGridReact
              rowData={filteredJobs}
              columnDefs={jobColumnDefs(handleEdit, handleDelete)}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
              suppressCellFocus={true}
              singleClickEdit={true}
              stopEditingWhenCellsLoseFocus={true}
              onCellValueChanged={(params) => {
                const jobId = params.data.jobID || params.data.id;
                const field = params.colDef.field;
                const newValue = params.newValue;

                if (jobId && field) {
                  handleJobUpdate(jobId, field, newValue);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <EditJobDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        form={form}
        onSubmit={handleSaveEdit}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedJob(null);
        }}
        department={department}
        designation={designation}
        companies={companies}
      />
    </div>
  );
};

export default JobListPage;
