import { useEffect, useState } from 'react';
import { Building, Check, Cross, Map, Phone, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LabelInput, SelectWithLabel } from '@/components/ui/EmpUpdate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { FaCreditCard } from 'react-icons/fa';
import {
  addBranch,
  branchUpdate,
  fetchIndustry,
  fetchStates,
  getLocationsFromPinCode,
} from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { validateForm, updateBranchSchema } from '@/lib/validations';

const UpdateBranchModal = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [branchName, setBranchName] = useState('');
  const [industry, setIndustry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const {
    companyInfo,
    states,
    industry: industryList,
    perPincode,
  } = useSelector((state: RootState) => state.adminPage);

  useEffect(() => {
    const b = props?.updatingBranch;
    if (!b) {
      setBranchName('');
      setEmail('');
      setMobile('');
      setGstNo('');
      setIndustry('');
      setPinCode('');
      setState('');
      setCity('');
      return;
    }
    setBranchName(b?.branchName ?? '');
    setEmail(b?.email ?? '');
    setMobile(b?.mobile ?? '');
    setGstNo(b?.gst ?? '');
    setIndustry(typeof b?.industry === 'object' && b?.industry?.value != null ? b.industry.value : b?.industry ?? '');
    setPinCode(b?.pinCode ?? '');
    setState(typeof b?.state === 'object' && b?.state?.value != null ? b.state.value : b?.state ?? '');
    setCity(b?.city ?? '');
  }, [props?.updatingBranch]);

  const handleEmpty = () => {
    setBranchName('');
    setEmail('');
    setMobile('');
    setGstNo('');
    setIndustry('');
    setPinCode('');
    setState('');
    setCity('');
  };
  const handleUpdateCompany = async () => {
    const validation = validateForm(updateBranchSchema, {
      branchName: branchName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      gstNo: gstNo.trim() || undefined,
      industry,
      pinCode: pinCode.trim(),
      state,
      city: city.trim(),
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    if (props?.updatingBranch !== null) {
      dispatch(branchUpdate(payload)).then((response: any) => {
        if (response.payload.success) {
          toast({ title: 'Success!!', description: response.payload.message });
          props.hide();
          handleEmpty();
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: response.payload.message,
          });
        }
      });
    } else {
      dispatch(addBranch(payload)).then((response: any) => {
        if (response.payload.success) {
          toast({ title: 'Success!!', description: response.payload.message });
          props.hide();
          handleEmpty();
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: response.payload.message,
          });
        }
      });
    }
  };

  const payload: any = {
    addressID: props?.updatingBranch?.branchID,
    companyID: companyInfo[0]?.companyID,
    city: city,
    email: email,
    gst: gstNo,
    industry: industry,
    name: branchName,
    pinCode: pinCode,
    state: state,
    mobile: mobile,
  };

  useEffect(() => {
    if (pinCode?.length === 6) {
      dispatch(
        getLocationsFromPinCode({
          pinCode: pinCode,
          addressType: 'permanent',
        }),
      );
    }
  }, [pinCode]);

  useEffect(() => {
    dispatch(fetchIndustry());
    dispatch(fetchStates());
  }, []);

  return (
    <Dialog open={props.show} onOpenChange={props.hide}>
      <DialogContent
        className="min-w-[800px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {props?.updatingBranch
              ? `Edit Branch${props?.companyName ? ` – ${props.companyName}` : ''}`
              : 'Add Branch'}
          </DialogTitle>
        </DialogHeader>

        <div>
          <div className="grid grid-cols-3 gap-2">
            <LabelInput
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              icon={Building}
              label="Branch Name"
              required
            />
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
              icon={Phone}
              label="Contact"
              required
            />
            <LabelInput
              value={gstNo}
              onChange={(e) => setGstNo(e.target.value)}
              icon={FaCreditCard}
              label="GST Number"
              required
            />
            <SelectWithLabel
              label="Industry"
              value={industry}
              onValueChange={(value) => setIndustry(value)}
              options={industryList}
              textKey="name"
              optionKey="industryID"
              icon={Building}
            />
            <LabelInput
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              icon={FaCreditCard}
              label="Pin Code"
              required
            />
            <SelectWithLabel
              label="State"
              value={state}
              onValueChange={(text) => setState(text)}
              options={states}
              textKey="text"
              optionKey="value"
              icon={Map}
            />
            <SelectWithLabel
              label="City/Area"
              value={city}
              onValueChange={(value) => setCity(value)}
              options={perPincode}
              textKey="name"
              optionKey="name"
              icon={Map}
            />
          </div>
          <div className="flex justify-between mt-2 float-right gap-5">
            <Button
              variant="outline"
              onClick={() => props.hide()}
              icon={<Cross size={18} />}
            >
              Cancel
            </Button>

            <div>
              <Button
                onClick={handleUpdateCompany}
                icon={<Check size={18} />}
                className="bg-teal-500 hover:bg-teal-600"
                disabled={!branchName || !email}
              >
                {props?.updatingBranch ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBranchModal;
