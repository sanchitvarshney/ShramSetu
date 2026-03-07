import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { inputStyle } from '@/style/CustomStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addContractor, fetchContractors, searchCompanies } from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import { validateForm, contractorSchema } from '@/lib/validations';
import { UserPlus } from 'lucide-react';
import { FaSave } from 'react-icons/fa';
import { APP_ROUTES } from '@/config/appRoutes';

const AddContractor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { addContractorLoading, companies } = useSelector((state: RootState) => state.adminPage);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  useEffect(() => {
    dispatch(searchCompanies());
  }, [dispatch]);

  const selectedCompanyName =
    companies?.find((c: { companyID: string; name: string }) => c.companyID === selectedCompanyId)?.name ?? '';

  const handleSubmit = () => {
    const validation = validateForm(contractorSchema, {
      name: name.trim(),
      contactPerson: contactPerson.trim() || undefined,
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim() || undefined,
      companyName: selectedCompanyId ? selectedCompanyName : undefined,
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
        contactPerson: data.contactPerson,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        companyName: data.companyName,
      }),
    ).then((res: any) => {
      if (res?.payload?.success) {
        setName('');
        setContactPerson('');
        setMobile('');
        setEmail('');
        setAddress('');
        setSelectedCompanyId('');
        dispatch(fetchContractors());
        navigate(APP_ROUTES.CONTRACTOR_LIST.path);
      }
    });
  };

  const isFormValid =
    name.trim() &&
    mobile.trim() &&
    email.trim();

  return (
    <Card className="rounded-lg overflow-hidden p-0 m-4">
      <CardHeader>
        <CardTitle className="text-[20px] font-[650] text-slate-600 flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Contractor
        </CardTitle>
        <CardDescription>
          Add a new contractor. Fill in the details below.
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
          <Label htmlFor="contactPerson">Contact person</Label>
          <Input
            id="contactPerson"
            className={inputStyle}
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="Contact person name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile *</Label>
          <Input
            id="mobile"
            className={inputStyle}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
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
        <div className="grid gap-2 col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            className={inputStyle}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full address"
            rows={3}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger id="company" className={inputStyle}>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {(companies ?? []).map((c: { companyID: string; name: string }) => (
                <SelectItem key={c.companyID} value={c.companyID}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
