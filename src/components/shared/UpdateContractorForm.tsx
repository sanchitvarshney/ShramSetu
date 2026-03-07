import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { updateContractor, type Contractor } from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import { validateForm, contractorSchema } from '@/lib/validations';

interface UpdateContractorFormProps {
  contractor: Contractor;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateContractorForm: React.FC<UpdateContractorFormProps> = ({
  contractor,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addContractorLoading } = useSelector((state: RootState) => state.adminPage);
  const [name, setName] = useState(contractor.name ?? '');
  const [panNo, setPanNo] = useState(contractor.panNo ?? '');
  const [mobile, setMobile] = useState(contractor.mobile ?? '');
  const [email, setEmail] = useState(contractor.email ?? '');
  const [activeStatus, setActiveStatus] = useState(contractor.activeStatus ?? 'A');

  useEffect(() => {
    setName(contractor.name ?? '');
    setPanNo(contractor.panNo ?? '');
    setMobile(contractor.mobile ?? '');
    setEmail(contractor.email ?? '');
    setActiveStatus(contractor.activeStatus ?? 'A');
  }, [contractor]);

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
      updateContractor({
        contractorID: contractor.contractorID,
        name: data.name,
        panNo: data.panNo,
        mobile: data.mobile,
        email: data.email,
        activeStatus: activeStatus,
      }),
    ).then((res: any) => {
      if (res?.payload?.success) {
        onSuccess();
      }
    });
  };

  const isFormValid =
    name.trim() &&
    panNo.trim() &&
    mobile.trim().length === 10 &&
    email.trim();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="edit-name">Contractor name *</Label>
        <Input
          id="edit-name"
          className={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contractor name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-panNo">PAN No *</Label>
        <Input
          id="edit-panNo"
          className={inputStyle}
          value={panNo}
          onChange={(e) => setPanNo(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          maxLength={10}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-mobile">Mobile (10 digits) *</Label>
        <Input
          id="edit-mobile"
          className={inputStyle}
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="Mobile"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-email">Email *</Label>
        <Input
          id="edit-email"
          type="email"
          className={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-status">Status</Label>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger id="edit-status" className={inputStyle}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Active</SelectItem>
            <SelectItem value="INA">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={addContractorLoading || !isFormValid}
          className="bg-[#115e59] hover:bg-[#0d4a46]"
        >
          {addContractorLoading ? <CircularProgress size={18} /> : 'Update'}
        </Button>
      </div>
    </div>
  );
};

export default UpdateContractorForm;
