import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { addContractor, fetchContractors } from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import { validateForm, contractorSchema } from '@/lib/validations';
import { UserPlus } from 'lucide-react';
import { FaSave } from 'react-icons/fa';
import { APP_ROUTES } from '@/config/appRoutes';

const AddContractor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { addContractorLoading } = useSelector((state: RootState) => state.adminPage);
  const [name, setName] = useState('');
  const [panNo, setPanNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    const validation = validateForm(contractorSchema, {
      name: name.trim(),
      panNo: panNo.trim().toUpperCase(),
      mobile: mobile.trim(),
      email: email.trim(),
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    const data = validation.data;
    dispatch(
      addContractor({
        name: data.name,
        panNo: data.panNo,
        mobile: data.mobile,
        email: data.email,
      }),
    ).then((res: any) => {
      if (res?.payload?.success) {
        setName('');
        setPanNo('');
        setMobile('');
        setEmail('');
        dispatch(fetchContractors());
        navigate(APP_ROUTES.CONTRACTOR_LIST.path);
      }
    });
  };

  const isFormValid =
    name.trim() &&
    panNo.trim() &&
    mobile.trim().length === 10 &&
    email.trim();

  return (
    <Card className="rounded-lg overflow-hidden p-0 m-4">
      <CardHeader>
        <CardTitle className="text-[20px] font-[650] text-slate-600 flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Contractor
        </CardTitle>
        <CardDescription>
          Add a new contractor. Name, PAN, email and 10-digit mobile are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Contractor name *</Label>
          <Input
            id="name"
            className={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ABC Contractors"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="panNo">PAN No *</Label>
          <Input
            id="panNo"
            className={inputStyle}
            value={panNo}
            onChange={(e) => setPanNo(e.target.value.toUpperCase())}
            placeholder="e.g. ABCDE1234F"
            maxLength={10}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile (10 digits) *</Label>
          <Input
            id="mobile"
            className={inputStyle}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-6 py-4 border-t">
        <Button
          variant="outline"
          onClick={() => navigate(APP_ROUTES.CONTRACTOR_LIST.path)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={addContractorLoading || !isFormValid}
          className="bg-[#115e59] hover:bg-[#0d4a46] shadow-neutral-400 flex items-center gap-2"
        >
          {addContractorLoading ? (
            <CircularProgress size={20} />
          ) : (
            <FaSave className="h-4 w-4" />
          )}
          Add Contractor
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddContractor;
