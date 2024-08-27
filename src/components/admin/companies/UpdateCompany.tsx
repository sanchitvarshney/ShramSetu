import { useEffect, useState } from 'react';
import { Building, Check, RefreshCcw, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LabelInput } from '@/components/ui/EmpUpdate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { FaCreditCard } from 'react-icons/fa';
import { companyUpdate } from '@/features/admin/adminPageSlice';

const UpdateCompany = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [companyName, setCompanyName] = useState('');
  const [panNo, setPanNo] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyWeb, setCompanyWeb] = useState('');

  const { companyInfo } = useSelector((state: RootState) => state.adminPage);

  useEffect(() => {
    setCompanyName(companyInfo[0]?.name);
    setEmail(companyInfo[0]?.email);
    setMobile(companyInfo[0]?.mobile);
    setPanNo(companyInfo[0]?.panNo);
    setCompanyWeb(companyInfo[0]?.website);
  }, [companyInfo]);

  const handleUpdateCompany = async () => {
    dispatch(companyUpdate(payload));
    props.hide();
  };

  const handleRefresh = () => {
    setCompanyName('');
    setEmail('');
    setMobile('');
    setPanNo('');
    setCompanyWeb('');
  };

  const payload: {} = {
    companyID: companyInfo[0]?.companyID,
    email: email,
    name: companyName,
    panNo: panNo,
    website: companyWeb,
    mobile: mobile,
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
              onChange={(e) => setMobile(e.target.value)}
              icon={User}
              label="Mobile Number"
              required
            />
            <LabelInput
              value={panNo}
              onChange={(e) => setPanNo(e.target.value)}
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
                disabled={!companyName || !email}
                className="bg-teal-500 hover:bg-teal-600"
              >
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
