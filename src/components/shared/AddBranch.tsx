import { useEffect, useState } from 'react';
import { Check, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LabeledField } from '@/components/ui/LabeledField';
import { SelectWithLabel } from '@/components/ui/EmpUpdate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  addBranch,
  fetchIndustry,
  fetchStates,
  getLocationsFromPinCode,
  searchCompanies,
} from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { validateForm, updateBranchSchema } from '@/lib/validations';
import { CircularProgress } from '@mui/material';
import { inputStyle } from '@/style/CustomStyles';

const AddBranch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [branchName, setBranchName] = useState('');
  const [industry, setIndustry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const {
    companies,
    states,
    industry: industryList,
    perPincode,
    isaddbranch,
  } = useSelector((state: RootState) => state.adminPage);


  useEffect(() => {
    dispatch(searchCompanies());
  }, []);

  useEffect(() => {
    dispatch(fetchIndustry());
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (pinCode?.length === 6) {
      dispatch(
        getLocationsFromPinCode({
          pinCode,
          addressType: 'permanent',
        }),
      );
    }
  }, [pinCode, dispatch]);

  const handleSubmit = () => {
    const validation = validateForm(updateBranchSchema, {
      branchName: branchName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      gstNo: gstNo.trim() || undefined,
      industry,
      pinCode: pinCode.trim(),
      state,
      city: city.trim(),
      address: address.trim() || undefined,
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    if (!selectedCompany) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a company',
      });
      return;
    }
    const payload:any = {
      companyID: selectedCompany,
      name: branchName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      gst: gstNo.trim(),
      industry,
      pinCode: pinCode.trim(),
      state,
      city: city.trim(),
      address: address.trim() || undefined,
    };
    dispatch(addBranch(payload)).then((response: any) => {
      if (response?.payload?.success) {
        toast({ title: 'Success', description: response.payload.message });
        setSelectedCompany('');
        setBranchName('');
        setEmail('');
        setMobile('');
        setGstNo('');
        setIndustry('');
        setPinCode('');
        setState('');
        setCity('');
        setAddress('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response?.payload?.message ?? 'Failed to add branch',
        });
      }
    });
  };

  const companyOptions = companies ?? [];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-70px)] p-4 overflow-auto">
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Add Branch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Company *</Label>
            <Select
              value={selectedCompany}
              onValueChange={setSelectedCompany}
            >
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companyOptions.map((c: any) => (
                  <SelectItem
                    key={c.companyID ?? c.value}
                    value={c.companyID ?? c.value}
                  >
                    {c.name ?? c.text ?? ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LabeledField
              label="Branch Name"
              required
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />
            <LabeledField
              label="Email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LabeledField
              label="Contact"
              type="text"
              inputMode="numeric"
              maxLength={15}
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            />
            <LabeledField
              label="GST Number"
              required
              value={gstNo}
              onChange={(e) => setGstNo(e.target.value)}
            />
            <SelectWithLabel
              label="Industry"
              value={industry}
              onValueChange={setIndustry}
              options={industryList ?? []}
              textKey="name"
              optionKey="industryID"
              icon={Map}
            />
            <LabeledField
              label="Pin Code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
            />
            <SelectWithLabel
              label="State"
              value={state}
              onValueChange={setState}
              options={states ?? []}
              textKey="text"
              optionKey="value"
              icon={Map}
            />
            <SelectWithLabel
              label="City/Area"
              value={city}
              onValueChange={setCity}
              options={perPincode ?? []}
              textKey="name"
              optionKey="name"
              icon={Map}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Address</Label>
            <Textarea
              placeholder="Street, building, landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className={inputStyle + ' resize-none min-h-[60px]'}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              className="bg-[#115e59] hover:bg-[#0d4a46]"
              disabled={!selectedCompany || !branchName?.trim() || !email?.trim() || isaddbranch}
            >
              {isaddbranch ? (
                <CircularProgress size={18} className="mr-2" />
              ) : (
                <Check size={18} className="mr-2" />
              )}
              Create Branch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBranch;
