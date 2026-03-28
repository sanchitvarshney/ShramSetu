import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Edit, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmployeePermanentAddress } from '@/features/admin/adminPageSlice';
import { AppDispatch } from '@/store';
import { inputStyle } from '@/style/CustomStyles';
import { SingleDetail } from './detailPrimitives';

export const PermanentAddressFlat = React.memo(function PermanentAddressFlat({
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [houseNo, setHouseNo] = useState('');
  const [colony, setColony] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (details) {
      setHouseNo(details?.perma_houseNo ?? '');
      setColony(details?.perma_colony ?? '');
      setCity(details?.perma_city ?? '');
      setStateVal(details?.perma_state ?? '');
      setCountry(details?.perma_country ?? '');
      setPincode(details?.perma_pincode ?? '');
    }
  }, [details, isEditing]);

  const handleUpdatePermanentAddress = async () => {
    if (!employeeId) return;
    setSaving(true);
    try {
      await dispatch(
        updateEmployeePermanentAddress({
          empId: employeeId,
          houseNoPermanent: houseNo?.trim() || '',
          colonyPermanent: colony?.trim() || '',
          cityPermanent: city?.trim() || '',
          statePermanent: stateVal?.trim() || '',
          countryPermanent: country?.trim() || '',
          pinCodePermanent: pincode?.trim() || '',
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
            Permanent Address
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
              onClick={handleUpdatePermanentAddress}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Permanent Address'}
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
              <Label className="text-xs">Colony</Label>
              <Input
                className={inputStyle}
                value={colony}
                onChange={(e) => setColony(e.target.value)}
                placeholder="Colony"
              />
            </div>
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
              <Label className="text-xs">State</Label>
              <Input
                className={inputStyle}
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Country</Label>
              <Input
                className={inputStyle}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Pin Code</Label>
              <Input
                className={inputStyle}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
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
          Permanent Address
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
        <div className="flex flex-col gap-0">
          <SingleDetail label="House No." value={details?.perma_houseNo} />
          <SingleDetail label="Colony" value={details?.perma_colony} />
          <SingleDetail label="City" value={details?.perma_city} />
          <SingleDetail label="State" value={details?.perma_state} />
          <SingleDetail label="Country" value={details?.perma_country} />
          <SingleDetail label="Pin Code" value={details?.perma_pincode} />
        </div>
      </CardContent>
    </Card>
  );
});
