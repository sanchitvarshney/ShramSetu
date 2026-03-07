import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  const [contactPerson, setContactPerson] = useState(contractor.contactPerson ?? '');
  const [mobile, setMobile] = useState(contractor.mobile ?? '');
  const [email, setEmail] = useState(contractor.email ?? '');
  const [address, setAddress] = useState(contractor.address ?? '');
  const [companyName, setCompanyName] = useState(contractor.companyName ?? '');

  useEffect(() => {
    setName(contractor.name ?? '');
    setContactPerson(contractor.contactPerson ?? '');
    setMobile(contractor.mobile ?? '');
    setEmail(contractor.email ?? '');
    setAddress(contractor.address ?? '');
    setCompanyName(contractor.companyName ?? '');
  }, [contractor]);

  const handleSubmit = () => {
    const validation = validateForm(contractorSchema, {
      name: name.trim(),
      contactPerson: contactPerson.trim() || undefined,
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim() || undefined,
      companyName: companyName.trim() || undefined,
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
        contactPerson: data.contactPerson,
        mobile: data.mobile,
        email: data.email,
        address: data.address,
        companyName: data.companyName,
      }),
    ).then((res: any) => {
      if (res?.payload?.success) {
        onSuccess();
      }
    });
  };

  const isFormValid =
    name.trim() &&
    mobile.trim() &&
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
        <Label htmlFor="edit-contactPerson">Contact person</Label>
        <Input
          id="edit-contactPerson"
          className={inputStyle}
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          placeholder="Contact person"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-mobile">Mobile *</Label>
        <Input
          id="edit-mobile"
          className={inputStyle}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
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
        <Label htmlFor="edit-address">Address</Label>
        <Textarea
          id="edit-address"
          className={inputStyle}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          rows={3}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-companyName">Company name</Label>
        <Input
          id="edit-companyName"
          className={inputStyle}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company name"
        />
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
