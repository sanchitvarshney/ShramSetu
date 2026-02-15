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
import { companyUpdate, getCompanyInfo } from '@/features/admin/adminPageSlice';
import { validateForm, updateCompanySchema } from '@/lib/validations';
import { toast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';

/** Parse API hsn/ssc (string or array) into string[] for edit form. */
function parseHsnSscList(val: unknown): string[] {
  if (val == null) return [''];
  if (Array.isArray(val)) {
    const arr = val.map(String).filter(Boolean);
    return arr.length ? arr : [''];
  }
  if (typeof val === 'string') {
    const t = val.trim();
    if (!t) return [''];
    try {
      const parsed = JSON.parse(t);
      const arr = Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
      return arr.length ? arr : [''];
    } catch {
      return [t];
    }
  }
  return [''];
}

const UpdateCompany = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [panNo, setPanNo] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyWeb, setCompanyWeb] = useState('');
  const [hsnList, setHsnList] = useState<string[]>(['']);
  const [sscList, setSscList] = useState<string[]>(['']);

  const { companyInfo, iseditcompany } = useSelector((state: RootState) => state.adminPage);

  useEffect(() => {
    const c = companyInfo[0];
    if (!c) return;
    setCompanyName(c?.name ?? '');
    setEmail(c?.email ?? '');
    setMobile(c?.mobile ?? '');
    setPanNo(c?.panNo ?? '');
    setCompanyWeb(c?.website ?? '');
    setBrandName((c as any)?.brand ?? (c as any)?.brandName ?? '');
    setHsnList(parseHsnSscList((c as any)?.hsn));
    setSscList(parseHsnSscList((c as any)?.ssc));
  }, [companyInfo]);

  const handleUpdateCompany = async () => {
    const hsnArray = hsnList.map((s) => s.trim().replace(/\s/g, '')).filter(Boolean);
    const sscArray = sscList.map((s) => s.trim()).filter(Boolean);
    const validation = validateForm(updateCompanySchema, {
      name: companyName.trim(),
      brandName: brandName.trim() || undefined,
      email: email.trim(),
      mobile: mobile.trim(),
      panNo: panNo.trim(),
      website: companyWeb.trim(),
      hsn: hsnArray.length ? hsnArray : undefined,
      ssc: sscArray.length ? sscArray : undefined,
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    const payloadData: Record<string, unknown> = {
      companyID: companyInfo[0]?.companyID,
      email,
      name: companyName,
      panNo,
      website: companyWeb,
      mobile,
      ...(brandName.trim() && { brand: brandName.trim() }),
      ...(hsnArray.length > 0 && { hsn: hsnArray }),
      ...(sscArray.length > 0 && { ssc: sscArray }),
    };
    try {
      const res: any = await dispatch(companyUpdate(payloadData)).unwrap();
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
      const cid = companyInfo[0]?.companyID;
      if (cid) dispatch(getCompanyInfo(cid));
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
    setHsnList(['']);
    setSscList(['']);
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
          <div className="grid grid-cols-1 gap-2 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FaCreditCard className="h-[18px] w-[18px]" /> HSN (multiple)
              </Label>
              {hsnList.map((val, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    className={inputStyle}
                    value={val}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      if (v.length <= 8) {
                        const next = [...hsnList];
                        next[idx] = v;
                        setHsnList(next);
                      }
                    }}
                    placeholder="2, 4, 6 or 8 digits"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      if (hsnList.length > 1) setHsnList(hsnList.filter((_, i) => i !== idx));
                    }}
                    aria-label="Remove HSN"
                  >
                    −
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setHsnList([...hsnList, ''])}
              >
                + Add HSN
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FaCreditCard className="h-[18px] w-[18px]" /> SSC (multiple)
              </Label>
              {sscList.map((val, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    type="text"
                    maxLength={20}
                    className={inputStyle}
                    value={val}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^A-Za-z0-9/\-]/g, '');
                      if (v.length <= 20) {
                        const next = [...sscList];
                        next[idx] = v;
                        setSscList(next);
                      }
                    }}
                    placeholder="e.g. SSC/Q2210"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      if (sscList.length > 1) setSscList(sscList.filter((_, i) => i !== idx));
                    }}
                    aria-label="Remove SSC"
                  >
                    −
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSscList([...sscList, ''])}
              >
                + Add SSC
              </Button>
            </div>
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
