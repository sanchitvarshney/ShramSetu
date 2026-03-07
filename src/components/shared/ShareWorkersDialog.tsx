import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppDispatch, RootState } from '@/store';
import { searchCompanies, shareWorkers } from '@/features/admin/adminPageSlice';
import { inputStyle } from '@/style/CustomStyles';
import { CircularProgress } from '@mui/material';
import { toast } from '@/components/ui/use-toast';

export interface SelectedWorkerItem {
  empCode: string;
  mobile: string;
}

/** Ensure mobile has country code 91 (India). Prepends 91 if not present. */
function normalizeMobileWith91(mobile: string): string {
  const s = (mobile ?? '').trim().replace(/^\+/, '').replace(/^\s+|\s+$/g, '');
  if (!s) return s;
  const digits = s.replace(/\D/g, '');
  if (digits.startsWith('91')) return digits;
  return '91' + digits;
}

interface ShareWorkersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWorkers: SelectedWorkerItem[];
  onSuccess?: () => void;
}

const ShareWorkersDialog: React.FC<ShareWorkersDialogProps> = ({
  open,
  onOpenChange,
  selectedWorkers,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, loading } = useSelector((state: RootState) => state.adminPage);
  const [companyId, setCompanyId] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (open) {
      dispatch(searchCompanies());
      setCompanyId('');
      setContact('');
      setAddress('');
    }
  }, [open, dispatch]);

  const handleShare = async () => {
    if (!companyId.trim()) return;
    if (!contact.trim()) return;
    if (!address.trim()) return;
    const companyName =
      companies?.find((c: { companyID: string; name: string }) => c.companyID === companyId)?.name ?? companyId;
    // Only include workers that have both empCode and non-empty mobile (remove empty mobile from both arrays)
    const workersWithMobile = selectedWorkers.filter(
      (w) => w.empCode && (w.mobile ?? '').trim() !== ''
    );
    const empCode = workersWithMobile.map((w) => w.empCode);
    const mobile = workersWithMobile.map((w) => normalizeMobileWith91(w.mobile ?? ''));
    if (empCode.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No valid workers',
        description: 'Selected workers have no mobile number. Add mobile and try again.',
      });
      return;
    }

    const result = await dispatch(
      shareWorkers({
        empCode,
        mobile,
        company: companyName,
        address: address.trim(),
        contact: contact.trim(),
      }),
    );
    if (shareWorkers.fulfilled.match(result)) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const canShare =
    companyId.trim() !== '' &&
    contact.trim() !== '' &&
    address.trim() !== '' &&
    selectedWorkers.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share workers</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            {selectedWorkers.length} worker(s) selected. Fill details and click Share.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="share-company">Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger id="share-company" className={inputStyle}>
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
          <div className="grid gap-2">
            <Label htmlFor="share-contact">Contact</Label>
            <Input
              id="share-contact"
              className={inputStyle}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter contact"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="share-address">Address</Label>
            <Textarea
              id="share-address"
              className={inputStyle}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-[#115e59] hover:bg-[#0d4a46]"
            onClick={handleShare}
            disabled={!canShare || loading}
          >
            {loading && <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />}
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareWorkersDialog;
