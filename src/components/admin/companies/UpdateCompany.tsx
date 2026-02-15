import { useEffect, useState } from 'react';
import { Building, Check, RefreshCcw, Tag, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LabelInput } from '@/components/ui/EmpUpdate';
import { inputStyle } from '@/style/CustomStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { FaCreditCard } from 'react-icons/fa';
import {  companyUpdate } from '@/features/admin/adminPageSlice';
import { validateForm, updateCompanySchema } from '@/lib/validations';
import { toast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';

const UpdateCompany = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [panNo, setPanNo] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyWeb, setCompanyWeb] = useState('');

  const { companyInfo, iseditcompany } = useSelector((state: RootState) => state.adminPage);

  useEffect(() => {
    setCompanyName(companyInfo[0]?.name);
    setEmail(companyInfo[0]?.email);
    setMobile(companyInfo[0]?.mobile);
    setPanNo(companyInfo[0]?.panNo);
    setCompanyWeb(companyInfo[0]?.website);

    setBrandName((companyInfo[0] as any)?.brandName ?? '');
  }, [companyInfo,]);

  const handleUpdateCompany = async () => {
    const validation = validateForm(updateCompanySchema, {
      name: companyName.trim(),
      brandName: brandName.trim() || undefined,
      email: email.trim(),
      mobile: mobile.trim(),
      panNo: panNo.trim(),
      website: companyWeb.trim(),
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    try {
      const res: any = await dispatch(companyUpdate(payload)).unwrap();
      if (res?.success === false) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res?.message ?? 'Update failed',
        });
        return;
      }
      
   
      toast({
        title: 'Success!!',
        description: res?.message ?? 'Company and branch name updated.',
      });
      props.hide();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message ?? 'Update failed',
      });
    }
  };

  const handleRefresh = () => {
    setCompanyName('');
    setBrandName('');
    setEmail('');
    setMobile('');
    setPanNo('');
    setCompanyWeb('');
  };

  const payload: Record<string, unknown> = {
    companyID: companyInfo[0]?.companyID,
    email,
    name: companyName,
    panNo,
    website: companyWeb,
    mobile,
    ...(brandName.trim() && { brandName: brandName.trim() }),
  };
  return (
    <Dialog open={props.show} onOpenChange={props.hide}>
      <DialogContent
        className="min-w-[800px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update Company</DialogTitle>
        </DialogHeader>

        <div>
          <LabelInput
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            icon={Building}
            label="Company Name"
            required
          />
  
          <div className="floating-label-group mt-4">
            <Input
              className={inputStyle}
              onChange={(e) => setBrandName(e.target.value)}
              value={brandName}
              placeholder="e.g. Company Brand"
            />
            <Label className="floating-label gap-[10px]">
              <span className="flex items-center gap-[10px]">
                <Tag className="h-[18px] w-[18px]" /> Brand Name
              </span>
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <LabelInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={User}
              label="Email"
              required
            />
            <LabelInput
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              icon={User}
              label="Mobile Number"
              required
            />
            <LabelInput
              value={panNo}
              onChange={(e) => setPanNo(e.target.value.toUpperCase())}
              icon={FaCreditCard}
              label="PAN Number"
              required
            />
            <LabelInput
              value={companyWeb}
              onChange={(e) => setCompanyWeb(e.target.value)}
              icon={FaCreditCard}
              label="Company Website"
              required
            />
          </div>
          <div className="flex justify-between mt-2 float-right gap-5">
            <Button
              variant="outline"
              onClick={() => handleRefresh()}
              icon={<RefreshCcw size={18} />}
            >
              Reset
            </Button>

            <div>
              <Button
                onClick={handleUpdateCompany}
                icon={<Check size={18} />}
                disabled={!companyName || !email || iseditcompany}
                className="bg-teal-500 hover:bg-teal-600"
              >
                {iseditcompany && <CircularProgress size={20} />}
                Update
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCompany;
