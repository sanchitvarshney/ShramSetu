import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Edit, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchStates, updateEmployeeCurrentAddress } from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import { inputStyle } from '@/style/CustomStyles';
import {  SingleDetail } from './detailPrimitives';
import { SelectOptionType } from '@/types/general';
import { useToast } from '@/components/ui/use-toast';

type StateSelectMode = 'value' | 'text';

function resolveStateSelectValue(
  raw: string,
  opts: SelectOptionType[] | null | undefined,
): { mode: StateSelectMode; value: string } {
  const r = String(raw ?? '').trim();
  if (!r) return { mode: 'value', value: '' };

  const byValue = opts?.find((s) => String(s.value).trim() === r);
  if (byValue) return { mode: 'value', value: String(byValue.value) };

  const byText = opts?.find(
    (s) => String(s.text ?? '').trim().toUpperCase() === r.toUpperCase(),
  );
  if (byText) return { mode: 'text', value: String(byText.text) };

  // Fallback to existing raw (keeps current behavior if API returns unexpected format)
  return { mode: 'value', value: r };
}

export const CurrentAddressFlat = React.memo(function CurrentAddressFlat({
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
  const [houseNo, setHouseNo] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateSelectMode, setStateSelectMode] = useState<StateSelectMode>('value');
  const [stateManuallyEdited, setStateManuallyEdited] = useState(false);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (details) {
      setHouseNo(details?.present_houseNo ?? '');
      setCity(details?.present_city ?? '');
      setDistrict(details?.present_district ?? '');
      // Initial state value while entering edit mode; will be normalized once `states` is loaded.
      setStateVal(details?.present_state ?? '');
      // PIN code should be digits-only and max 6 digits
      setPincode(
        String(details?.present_pincode ?? '')
          .replace(/\D/g, '')
          .slice(0, 6),
      );
    }
  }, [details, isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    if (!details) return;
    if (stateManuallyEdited) return;

    const resolved = resolveStateSelectValue(details?.present_state ?? '', states);
    setStateSelectMode(resolved.mode);
    setStateVal(resolved.value);
  }, [details, isEditing, states, stateManuallyEdited]);

  const handleUpdateCurrentAddress = async () => {
    if (!employeeId) return;
    const pinDigits = String(pincode ?? '').replace(/\D/g, '');
    if (pinDigits.length > 0 && pinDigits.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid PIN code',
        description: 'PIN code must be exactly 6 digits.',
      });
      return;
    }
    setSaving(true);
    try {
      await dispatch(
        updateEmployeeCurrentAddress({
          empId: employeeId,
          houseNoPresent: houseNo?.trim() || '',
          districtPresent: district?.trim() || '',
          cityPresent: city?.trim() || '',
          statePresent: stateVal?.trim() || '',
          pinCodePresent: pinDigits.trim() || '',
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

  if (isEditing) {
    return (
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">
            Current Address
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
              onClick={handleUpdateCurrentAddress}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Current Address'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">House No. / Address</Label>
            <Input
              className={inputStyle}
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              placeholder="House no"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">City</Label>
              <Input
                className={inputStyle}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">District</Label>
              <Input
                className={inputStyle}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="District"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">State</Label>
              <Select
                value={stateVal}
                onValueChange={(v) => {
                  setStateManuallyEdited(true);
                  setStateVal(v);
                }}
              >
                <SelectTrigger className={inputStyle}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {(states ?? []).map((s:any) => (
                    <SelectItem
                      key={s.value}
                      value={stateSelectMode === 'value' ? s.value : s.text}
                    >
                      {s.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
         
            <div className="space-y-1.5">
              <Label className="text-xs">Pin Code</Label>
              <Input
                className={inputStyle}
                value={pincode}
                inputMode="numeric"
                maxLength={6}
                onChange={(e) =>
                  setPincode(
                    e.target.value.replace(/\D/g, '').slice(0, 6),
                  )
                }
                placeholder="Pincode"
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
          Current Address
        </CardTitle>
        {canEdit && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setStateManuallyEdited(false);
              setIsEditing(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-0">
          <SingleDetail
            label="House No. / Address"
            value={details?.present_houseNo}
          />

          <SingleDetail label="City" value={details?.present_city} />
          <SingleDetail label="District" value={details?.present_district} />
          <SingleDetail label="State" value={details?.present_state} />
          <SingleDetail label="Pin Code" value={details?.present_pincode} />
        </div>
      </CardContent>
    </Card>
  );
});
