import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { inputStyle } from '@/style/CustomStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addDepartment, fetchDepartments } from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import { validateForm, addDepartmentSchema } from '@/lib/validations';
import { Building2 } from 'lucide-react';
import { FaSave } from 'react-icons/fa';

const AddDepartment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const { addDepartmentLoading } = useSelector((state: RootState) => state.adminPage);

  const handleSubmit = () => {
    const validation = validateForm(addDepartmentSchema, { name: name.trim() });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    dispatch(addDepartment({ departmentName: validation.data.name })).then((res: any) => {
      const payload = res?.payload;
      if (payload?.success) {
        setName('');
        dispatch(fetchDepartments());
        toast({ title: 'Success', description: payload?.message ?? 'Department added.' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: payload?.message ?? 'Failed to add department',
        });
      }
    });
  };

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-[20px] font-[650] text-slate-600 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Add Department
        </CardTitle>
        <CardDescription>
          Add departments to the master. These will be available when adding workers and jobs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="floating-label-group">
          <Input
            className={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Engineering, HR"
          />
          <Label className="floating-label">Department Name</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end px-6 py-4 border-t">
        <Button
          onClick={handleSubmit}
          disabled={addDepartmentLoading || !name.trim()}
          className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400 flex items-center gap-2"
        >
          {addDepartmentLoading ? (
            <CircularProgress size={20} />
          ) : (
            <FaSave className="h-4 w-4" />
          )}
          Add Department
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddDepartment;
