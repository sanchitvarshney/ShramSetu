import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchCompanies } from '@/features/admin/adminPageSlice';
import { getLoggedInUserType } from '@/lib/routeAccess';
import {
  getCompanyBranchOptions,
  createJob,
  fetchDepartments,
  fetchDesignations,
} from '@/features/admin/adminPageSlice';
import { inputStyle } from '@/style/CustomStyles';
import { toast } from '@/components/ui/use-toast';
import { jobFormSchema, type JobFormData } from '@/lib/validations';
import Loading from '@/components/reusable/Loading';

const JobAddPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, branches } = useSelector((state: RootState) => state.adminPage);
  const { department, designation, loading } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      company: '',
      branch: '',
      address: '',
      jobType: '',
      designation: '',
      department: '',
      minSalary: 0,
      maxSalary: 0,
      skills: '',
      jobTitle: '',
      qualification: '',
      experience: '',
      jobStatus: '',
      facilities: [
        { facility: 'Bus', paid: 'no' as const },
        { facility: 'Canteen', paid: 'no' as const },
      ],
    },
  });

  const selectedCompany = form.watch('company');
  const selectedBranchId = form.watch('branch');

  useEffect(() => {
    const userType = getLoggedInUserType() ?? 'admin';
    dispatch(searchCompanies(userType));
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCompany) {
      dispatch(getCompanyBranchOptions(selectedCompany));
      form.setValue('branch', '');
    }
  }, [selectedCompany, dispatch, form]);

  // Auto-fill address from selected branch (address, city, state)
  useEffect(() => {
    if (!selectedBranchId || !branches?.length) return;
    const branch = branches.find(
      (b: any) => b.branchID === selectedBranchId || b.branchID?.toString() === selectedBranchId,
    );
    if (!branch) return;
    const stateText =
      typeof branch.state === 'object' && branch.state?.text != null
        ? branch.state.text
        : branch.state ?? '';
    const fullAddress = branch.address?.trim()
      ? branch.address.trim()
      : [branch.city, stateText].filter(Boolean).join(', ');
    if (fullAddress) {
      form.setValue('address', fullAddress, { shouldValidate: true });
    }
  }, [selectedBranchId, branches, form]);

  const onSubmit: SubmitHandler<JobFormData> = async (data) => {
    const payload: any = {
      company: data.company,
      branch: data.branch,
      address: data.address,
      jobType: data.jobType,
      designation: data.designation,
      department: data.department,
      minSalary: data.minSalary,
      maxSalary: data.maxSalary,
      skills: data.skills,
      jobTitle: data.jobTitle,
      qualification: data.qualification,
      experience: data.experience,
      jobStatus: data.jobStatus,
     
      facilities: data.facilities,
    };
    try {
      const response = await dispatch(createJob(payload)).unwrap();
      if (response.success) {
        toast({
          title: 'Success!!',
          description: response.message || 'Job created successfully',
        });

        form.reset();
      }
    } catch (error: any) {
      console.error('Failed to create job:', error);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="p-4 max-h-[calc(100vh-75px)] overflow-y-auto">
        <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-[20px] font-[650] text-slate-600">
            Add Job
          </CardTitle>
          <CardDescription>
            Fill in the details to create a new job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Company Select */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputStyle}>
                            <SelectValue placeholder="Select Company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies?.map((company: any) => (
                            <SelectItem
                              key={company.value || company.companyID}
                              value={company.value || company.companyID}
                            >
                              {company.text || company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Branch Select - populated when company is selected */}
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedCompany}
                      >
                        <FormControl>
                          <SelectTrigger className={inputStyle}>
                            <SelectValue
                              placeholder={
                                selectedCompany
                                  ? 'Select Branch'
                                  : 'Select Company first'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches?.map((branch: any) => (
                            <SelectItem
                              key={branch.branchID}
                              value={branch.branchID}
                            >
                              {branch.branchName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Type */}
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type *</FormLabel>
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

                {/* Job Title */}
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title *</FormLabel>
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

                {/* Department */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
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
                          {department?.map((dept: any) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Designation */}
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation *</FormLabel>
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
                          {designation?.map((desg: any) => (
                            <SelectItem key={desg.value} value={desg.value}>
                              {desg.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Min Salary */}
                <FormField
                  control={form.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className={inputStyle}
                          placeholder="Enter Minimum Salary"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Salary */}
                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className={inputStyle}
                          placeholder="Enter Maximum Salary"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Experience */}
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputStyle}>
                            <SelectValue placeholder="Select Experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-2 Year">0-2 Year</SelectItem>
                          <SelectItem value="2-4 Year">2-4 Year</SelectItem>
                          <SelectItem value="4-6 Year">4-6 Year</SelectItem>
                          <SelectItem value="6-8 Year">6-8 Year</SelectItem>
                          <SelectItem value="8+ Year">8+ Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Status */}
                <FormField
                  control={form.control}
                  name="jobStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputStyle}>
                            <SelectValue placeholder="Select Job Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Cancel">Inactive</SelectItem>
                          <SelectItem value="Hold">Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        className={inputStyle}
                        placeholder="Enter Address (B-88, Sector 2, Noida, Uttar Pradesh, 201301)"
                        rows={3}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills *</FormLabel>
                    <FormControl>
                      <Textarea
                        className={inputStyle}
                        placeholder="Enter required skills (comma separated)"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Qualification */}
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification *</FormLabel>
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

              {/* Job Description */}
              {/* <FormField
                control={form.control}
                name=""
                rules={{ required: 'Job Description is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        className={inputStyle}
                        placeholder="Enter job description and responsibilities"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                  <FormField
                control={form.control}
                name="facilities"
                render={({ field }) => {
                  const list = field.value ?? [];
                  const bus = list.find((f) => f.facility === 'Bus') ?? { facility: 'Bus' as const, paid: 'no' as const };
                  const canteen = list.find((f) => f.facility === 'Canteen') ?? { facility: 'Canteen' as const, paid: 'no' as const };
                  const setPaid = (facility: 'Bus' | 'Canteen', paid: 'yes' | 'no') => {
                    const next = facility === 'Bus'
                      ? [{ ...bus, paid }, canteen]
                      : [bus, { ...canteen, paid }];
                    field.onChange(next);
                  };
                  return (
                    <FormItem>
                      <FormLabel>Facilities *</FormLabel>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Facility</TableHead>
                            <TableHead>Paid (Yes / No)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Bus</TableCell>
                            <TableCell>
                              <Select
                                value={bus.paid}
                                onValueChange={(paid: 'yes' | 'no') => setPaid('Bus', paid)}
                              >
                                <SelectTrigger className={inputStyle + ' w-[120px]'}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Canteen</TableCell>
                            <TableCell>
                              <Select
                                value={canteen.paid}
                                onValueChange={(paid: 'yes' | 'no') => setPaid('Canteen', paid)}
                              >
                                <SelectTrigger className={inputStyle + ' w-[120px]'}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <CardFooter className="flex justify-end px-0 pt-4">
                <Button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Submit'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </>
  );
};

export default JobAddPage;
