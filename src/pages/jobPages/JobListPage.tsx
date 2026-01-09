import { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { jobColumnDefs, JobRowData } from '@/table/JobTableColumns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import Loading from '@/components/reusable/Loading';
import { toast } from '@/components/ui/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  fetchDepartments,
  fetchDesignations,
  fetchJobs,
} from '@/features/admin/adminPageSlice';
import { AlertDialogPopup } from '@/components/shared/AlertDialogPopup';
import { useForm } from 'react-hook-form';
import { inputStyle } from '@/style/CustomStyles';

const JobListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { department, designation } = useSelector(
    (state: RootState) => state.adminPage,
  );
  const [jobs, setJobs] = useState<JobRowData[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobRowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobRowData | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const form = useForm<JobRowData>({
    defaultValues: {
      jobTitle: '',
      jobType: '',
      department: '',
      designation: '',
      minSalary: 0,
      maxSalary: 0,
      experience: '',
      jobStatus: '',
      skills: '',
      qualification: '',
    },
  });

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [ isEditDialogOpen]);

  useEffect(() => {
    setLoading(true);
    // TODO: Replace with actual API call
    dispatch(fetchJobs()).then((response: any) => {
      setJobs(response.payload.data || []);
      setFilteredJobs(response.payload.data || []);
      setLoading(false);
    });
  }, [dispatch]);

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

    // TODO: Replace with actual API call
    // dispatch(updateJob({ jobId, field, value: newValue })).then(
    //   (response: any) => {
    //     if (response.payload.success) {
    //       toast({
    //         title: 'Success!!',
    //         description: 'Job updated successfully',
    //       });
    //     } else {
    //       toast({
    //         variant: 'destructive',
    //         title: 'Error',
    //         description: response.payload.message,
    //       });
    //     }
    //   },
    // );

    toast({
      title: 'Success!!',
      description: `${field} updated successfully`,
    });
  };

  const handleEdit = (job: JobRowData) => {
    setSelectedJob(job);
    form.reset({
      jobTitle: job.jobTitle || '',
      jobType: job.jobType || '',
      department: job.department || '',
      designation: job.designation || '',
      minSalary: job.minSalary || 0,
      maxSalary: job.maxSalary || 0,
      experience: job.experience || '',
      jobStatus: job.jobStatus || '',
      skills: job.skills || '',
      qualification: job.qualification || '',
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
    if (selectedJob) {
      const jobId = selectedJob.jobID || selectedJob.id;
      const updatedJob = {
        ...selectedJob,
        ...data,
      };

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.jobID === jobId || job.id === jobId ? updatedJob : job,
        ),
      );

      // TODO: Replace with actual API call
      // dispatch(updateJob({ jobId, ...data })).then((response: any) => {
      //   if (response.payload.success) {
      //     toast({
      //       title: 'Success!!',
      //       description: 'Job updated successfully',
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
        description: 'Job updated successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedJob(null);
    }
  };

  const getStatusCounts = () => {
    return {
      all: jobs.length,
      'currently-hiring': jobs.filter((j) => j.jobStatus === 'currently-hiring')
        .length,
      closed: jobs.filter((j) => j.jobStatus === 'closed').length,
      draft: jobs.filter((j) => j.jobStatus === 'draft').length,
      'on-hold': jobs.filter((j) => j.jobStatus === 'on-hold').length,
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
          {loading && <Loading />}
          <div className="mb-2 space-y-2">
            <div className="flex flex-wrap gap-4 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  {statusCounts.all}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  Currently Hiring:
                </span>
                <span className="text-lg font-bold text-green-700">
                  {statusCounts['currently-hiring']}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-600">Closed:</span>
                <span className="text-lg font-bold text-red-700">
                  {statusCounts.closed}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-yellow-600">Draft:</span>
                <span className="text-lg font-bold text-yellow-700">
                  {statusCounts.draft}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">On Hold:</span>
                <span className="text-lg font-bold text-blue-700">
                  {statusCounts['on-hold']}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSaveEdit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          className={inputStyle}
                          placeholder="Enter Job Title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputStyle}>
                            <SelectValue placeholder="Select Job Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      {department && department.length > 0 ? (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={inputStyle}>
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {department.map((dept: any) => (
                              <SelectItem key={dept.value} value={dept.text}>
                                {dept.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input
                            className={inputStyle}
                            placeholder="Enter Department"
                            {...field}
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      {designation && designation.length > 0 ? (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={inputStyle}>
                              <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {designation.map((desg: any) => (
                              <SelectItem key={desg.value} value={desg.text}>
                                {desg.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input
                            className={inputStyle}
                            placeholder="Enter Designation"
                            {...field}
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className={inputStyle}
                          placeholder="Enter Minimum Salary"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className={inputStyle}
                          placeholder="Enter Maximum Salary"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input
                          className={inputStyle}
                          placeholder="e.g., 2-5 years"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputStyle}>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="currently-hiring">
                            Currently Hiring
                          </SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        className={inputStyle}
                        placeholder="Enter required skills"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Textarea
                        className={inputStyle}
                        placeholder="Enter required qualifications"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedJob(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobListPage;
