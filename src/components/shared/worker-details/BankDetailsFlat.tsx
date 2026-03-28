import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Map, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { SelectWithLabel } from '@/components/ui/EmpUpdate';
import {
  fetchStates,
  updateWorkerBankDetails,
} from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import { inputStyle } from '@/style/CustomStyles';
import { cn } from '@/lib/utils';
import { SelectOptionType } from '@/types/general';
import { DetailRow, SingleDetail } from './detailPrimitives';

function resolveStateSelectValue(
  raw: string,
  states: SelectOptionType[] | null | undefined,
): string {
  const r = raw.trim();
  if (!r) return '';
  const byValue = states?.find((s) => s.value === r);
  if (byValue) return String(byValue.value);
  const byText = states?.find(
    (s) => s.text?.toUpperCase() === r.toUpperCase(),
  );
  return byText ? String(byText.value) : '';
}

function stateDisplayLabel(
  raw: string | undefined,
  states: SelectOptionType[] | null | undefined,
): string | undefined {
  if (raw == null || String(raw).trim() === '') return undefined;
  const r = String(raw).trim();
  const byValue = states?.find((s) => s.value === r);
  if (byValue) return byValue.text;
  const byText = states?.find(
    (s) => s.text?.toUpperCase() === r.toUpperCase(),
  );
  if (byText) return byText.text;
  return r;
}

export function getBankRowFromDetails(details: any): Record<string, unknown> {
  const raw = details?.bankDetails;
  if (Array.isArray(raw) && raw.length > 0)
    return raw[0] as Record<string, unknown>;
  if (raw && typeof raw === 'object' && !Array.isArray(raw))
    return raw as Record<string, unknown>;
  return {};
}

export const BankDetailsFlat = React.memo(function BankDetailsFlat({
  details,
  employeeId,
  canEdit,
  onSuccess,
}: {
  details: any;
  employeeId: string | undefined;
  canEdit: boolean;
  onSuccess?: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { states } = useSelector((s: RootState) => s.adminPage);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifsCode, setIfsCode] = useState('');
  const [branch, setBranch] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [bankState, setBankState] = useState('');
  const [uan, setUan] = useState('');

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (details) {
      const row = getBankRowFromDetails(details);
      setBankName(String(row?.bankName ?? ''));
      setAccountNo(String(row?.accountNo ?? ''));
      setIfsCode(String(row?.ifsCode ?? '').toUpperCase());
      setBranch(String(row?.branch ?? ''));
      setBankAddress(String(row?.bankAddress ?? ''));
      setBankState(
        resolveStateSelectValue(String(row?.bankState ?? ''), states),
      );
      setUan(String(row?.uan ?? details?.uan ?? ''));
    }
  }, [details, isEditing, states]);

  const handleUpdateBank = async () => {
    if (!employeeId) return;
    const ifscNorm = ifsCode.replace(/\s/g, '').toUpperCase();
    if (ifscNorm.length > 0 && ifscNorm.length !== 11) {
      toast({
        variant: 'destructive',
        title: 'Invalid IFSC',
        description: 'IFSC must be exactly 11 characters, or leave it empty.',
      });
      return;
    }
    if (!bankName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing bank name',
        description: 'Enter the bank name.',
      });
      return;
    }
    const stateLabel =
      states?.find((s:any) => s.value === bankState)?.text?.trim() ??
      bankState.trim();

    setSaving(true);
    try {
      await dispatch(
        updateWorkerBankDetails({
          code: employeeId,
          bank: bankName.trim(),
          ac: accountNo.trim(),
          ifsc: ifscNorm,
          branch: branch.trim(),
          address: bankAddress.trim(),
          state: stateLabel,
          uan: uan.trim(),
        }),
      ).unwrap();
      setIsEditing(false);
      onSuccess?.();
    } catch {
      // toast in slice
    } finally {
      setSaving(false);
    }
  };

  const row = getBankRowFromDetails(details);
  const hasAnyDisplay =
    String(row?.bankName ?? '').trim() !== '' ||
    String(row?.accountNo ?? '').trim() !== '' ||
    String(row?.ifsCode ?? '').trim() !== '' ||
    String(row?.branch ?? '').trim() !== '' ||
    String(row?.bankAddress ?? '').trim() !== '' ||
    String(row?.bankState ?? '').trim() !== '' ||
    String(row?.uan ?? details?.uan ?? '').trim() !== '';

  if (isEditing) {
    return (
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">
            Bank Details
          </CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-[#115e59] hover:bg-[#0d4a46]"
              onClick={handleUpdateBank}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Bank Details'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Bank name</Label>
              <Input
                className={inputStyle}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">IFSC code</Label>
              <Input
                className={inputStyle}
                value={ifsCode}
                onChange={(e) =>
                  setIfsCode(e.target.value.replace(/\s/g, '').toUpperCase())
                }
                placeholder="11-character IFSC"
                maxLength={11}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Branch</Label>
              <Input
                className={inputStyle}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Branch"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Bank address</Label>
              <Textarea
                className={cn(inputStyle, 'min-h-[72px] resize-y')}
                value={bankAddress}
                onChange={(e) => setBankAddress(e.target.value)}
                placeholder="Branch address"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <SelectWithLabel
                label="State"
                value={bankState}
                onValueChange={setBankState}
                options={states ?? []}
                textKey="text"
                optionKey="value"
                icon={Map}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Account number</Label>
              <Input
                className={inputStyle}
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Account number"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">UAN</Label>
              <Input
                className={inputStyle}
                value={uan}
                onChange={(e) => setUan(e.target.value.replace(/\D/g, ''))}
                placeholder="UAN"
                maxLength={12}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Bank Details
        </CardTitle>
        {canEdit && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {hasAnyDisplay ? (
          <div
            className={cn(
              'px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50',
            )}
          >
            <SingleDetail label="Bank Name" value={row?.bankName as string} />
            <DetailRow>
              <SingleDetail
                label="Account Number"
                value={row?.accountNo as string}
              />
              <SingleDetail label="IFSC Code" value={row?.ifsCode as string} />
            </DetailRow>
            <DetailRow>
              <SingleDetail label="Branch" value={row?.branch as string} />
              <SingleDetail
                label="UAN"
                value={(row?.uan ?? details?.uan) as string}
              />
            </DetailRow>
            <SingleDetail
              label="Bank Address"
              value={row?.bankAddress as string}
            />
            <SingleDetail
              label="State"
              value={stateDisplayLabel(row?.bankState as string, states)}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-2">
            No bank details on file.
            {canEdit ? ' Click Edit to add.' : ''}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
