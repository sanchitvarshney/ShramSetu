import { useEffect, useState } from 'react';
import { Check, RefreshCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LabeledField } from '@/components/ui/LabeledField';
import { inputStyle } from '@/style/CustomStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
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
    const c = companyInfo?.[0];
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
      companyID: companyInfo?.[0]?.companyID,
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
      const cid = companyInfo?.[0]?.companyID;
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
          <LabeledField
            label="Company Name"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <div className="mt-4">
            <LabeledField
              label="Brand Name"
              placeholder="e.g. Company Brand"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-[20px] mt-4">
            <LabeledField
              label="Email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LabeledField
              label="Mobile Number"
              type="text"
              inputMode="numeric"
              maxLength={15}
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            />
            <LabeledField
              label="PAN Number"
              required
              maxLength={10}
              value={panNo}
              onChange={(e) => setPanNo(e.target.value.toUpperCase())}
              inputClassName="uppercase"
            />
            <LabeledField
              label="Company Website"
              required
              value={companyWeb}
              onChange={(e) => setCompanyWeb(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">HSN (multiple)</Label>
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
              <Label className="text-sm font-medium">SSC (multiple)</Label>
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
                className="bg-[#115e59] hover:bg-[#0d4a46]"
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
