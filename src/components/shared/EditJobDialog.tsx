import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { inputStyle } from '@/style/CustomStyles';
import { JobRowData, type FacilityOption } from '@/table/JobTableColumns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { getCompanyBranchOptions } from '@/features/admin/adminPageSlice';
import Loading from '@/components/reusable/Loading';

const DEFAULT_FACILITIES: FacilityOption[] = [
  { facility: 'Bus', paid: 'no', provided: 'no' },
  { facility: 'Canteen', paid: 'no', provided: 'no' },
];

function normalizeFacilities(
  value: JobRowData['facilities'],
): FacilityOption[] {
  if (Array.isArray(value) && value.length >= 2) {
    const bus = value.find((f: any) => f.facility === 'Bus') ?? DEFAULT_FACILITIES[0];
    const canteen = value.find((f: any) => f.facility === 'Canteen') ?? DEFAULT_FACILITIES[1];
    return [
      { ...DEFAULT_FACILITIES[0], ...bus, facility: 'Bus' },
      { ...DEFAULT_FACILITIES[1], ...canteen, facility: 'Canteen' },
    ];
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return normalizeFacilities(parsed);
    } catch {
      // ignore
    }
  }
  return [...DEFAULT_FACILITIES];
}

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<JobRowData>;
  onSubmit: (data: JobRowData) => void;
  onCancel: () => void;
  department: any[];
  designation: any[];
  companies?: any[];
}

const EditJobDialog = ({
  open,
  onOpenChange,
  form,
  onSubmit,
  onCancel,
  department,
  designation,
  companies = [],
}: EditJobDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUpdateLoading } = useSelector((state: any) => state.jobslice);
  const { branches } = useSelector((state: RootState) => state.adminPage);
  const selectedCompany = form.watch('company');
  const selectedBranchId = form.watch('branch');

  useEffect(() => {
    if (open && selectedCompany) {
      dispatch(getCompanyBranchOptions(selectedCompany));
    }
  }, [open, selectedCompany, dispatch]);

  useEffect(() => {
    if (!selectedBranchId || !branches?.length) return;
    const branch = branches.find(
      (b: any) => b.branchID === selectedBranchId || String(b.branchID) === String(selectedBranchId),
    );
    if (!branch) return;
    const stateText =
      typeof branch.state === 'object' && branch.state?.text != null
        ? branch.state.text
        : branch.state ?? '';
    const fullAddress = branch.address?.trim()
      ? branch.address.trim()
      : [branch.city, stateText].filter(Boolean).join(', ');
    if (fullAddress) form.setValue('address', fullAddress, { shouldValidate: true });
  }, [selectedBranchId, branches, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isUpdateLoading && (
          <Loading message="Updating job..." variant="minimal" />
        )}
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Company – same as Create Job */}
              {companies && companies.length > 0 && (
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
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
                          {companies.map((company: any) => (
                            <SelectItem
                              key={company.value ?? company.companyID}
                              value={company.value ?? company.companyID}
                            >
                              {company.text ?? company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                              selectedCompany ? 'Select Branch' : 'Select Company first'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(branches ?? []).map((branch: any) => (
                          <SelectItem key={branch.branchID} value={branch.branchID}>
                            {branch.branchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            <SelectItem key={dept.value} value={dept.value}>
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
                            <SelectItem key={desg.value} value={desg.value}>
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
                name="vacancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vacancy</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className={inputStyle}
                        placeholder="Number of positions"
                        value={field.value ?? 0}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        onBlur={field.onBlur}
                        ref={field.ref}
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

            {/* Address – same as Create Job */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      className={inputStyle}
                      placeholder="Enter Address (e.g. B-88, Sector 2, Noida, Uttar Pradesh, 201301)"
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

            {/* Job Description – same as Create Job */}
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
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
            />

<FormField
                control={form.control}
                name="facilities"
                render={({ field }) => {
                  const list = normalizeFacilities(field.value);
                  const bus:any = list.find((f) => f.facility === 'Bus') ?? DEFAULT_FACILITIES[0];
                  const canteen:any = list.find((f) => f.facility === 'Canteen') ?? DEFAULT_FACILITIES[1];
                  const busWithProvided = 'provided' in bus ? bus : { ...bus, provided: 'no' as const };
                  const canteenWithProvided = 'provided' in canteen ? canteen : { ...canteen, provided: 'no' as const };
                  const setPaid = (facility: 'Bus' | 'Canteen', paid: 'yes' | 'no') => {
                    const next =
                      facility === 'Bus'
                        ? [{ ...busWithProvided, paid }, canteenWithProvided]
                        : [busWithProvided, { ...canteenWithProvided, paid }];
                    field.onChange(next);
                  };
                  const setProvided = (facility: 'Bus' | 'Canteen', provided: 'yes' | 'no') => {
                    const paid = provided === 'no' ? ('no' as const) : undefined;
                    if (facility === 'Bus') {
                      field.onChange([{ ...busWithProvided, provided, ...(paid && { paid }) }, canteenWithProvided]);
                    } else {
                      field.onChange([busWithProvided, { ...canteenWithProvided, provided, ...(paid && { paid }) }]);
                    }
                  };
                  return (
                    <FormItem>
                      <FormLabel>Facilities</FormLabel>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Facility</TableHead>
                            <TableHead>Provided (Yes / No)</TableHead>
                            <TableHead>Paid (Yes / No)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Bus</TableCell>
                            <TableCell>
                              <Select
                                value={busWithProvided.provided}
                                onValueChange={(v: 'yes' | 'no') => setProvided('Bus', v)}
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
                            <TableCell>
                              {busWithProvided.provided === 'yes' ? (
                                <Select
                                  value={busWithProvided.paid}
                                  onValueChange={(v: 'yes' | 'no') => setPaid('Bus', v)}
                                >
                                  <SelectTrigger className={inputStyle + ' w-[120px]'}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Canteen</TableCell>
                            <TableCell>
                              <Select
                                value={canteenWithProvided.provided}
                                onValueChange={(v: 'yes' | 'no') => setProvided('Canteen', v)}
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
                            <TableCell>
                              {canteenWithProvided.provided === 'yes' ? (
                                <Select
                                  value={canteenWithProvided.paid}
                                  onValueChange={(v: 'yes' | 'no') => setPaid('Canteen', v)}
                                >
                                  <SelectTrigger className={inputStyle + ' w-[120px]'}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button disabled={isUpdateLoading} type="submit" className="bg-teal-500 hover:bg-teal-600">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
