import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@/table/WorkersTableColumns';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClientList,
  updateClientDetails,
} from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import Loading from '@/components/reusable/Loading';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { inputStyle } from '@/style/CustomStyles';
import { toast } from '@/components/ui/use-toast';
const ClientUserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clientList, loading } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  // const [panNo, setPanNo] = useState('');
  // const [gstNo, setGstNo] = useState('');

  const [setNewPasswordFlag, setSetNewPasswordFlag] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchClientList());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedClient) return;
    setFirstName(selectedClient.firstName ?? '');
    setLastName(selectedClient.lastName ?? '');
    setEmail(selectedClient.email ?? '');
    setMobile(selectedClient.mobile ?? '');
    // setPanNo(selectedClient.panNo ?? '');
    // setGstNo(selectedClient.gstNo ?? '');
    // Keep password state "off" when switching clients.
    setSetNewPasswordFlag(false);
    setNewPassword('');
    setConfirmPassword('');
  }, [selectedClient]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedClient(null);
    setSetNewPasswordFlag(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleUpdateClient = async () => {
    if (!selectedClient?.code) {
      toast({
        variant: 'destructive',
        title: 'No client selected',
        description: 'Please click a client row first.',
      });
      return;
    }

    // Basic front-end validation for a better UX.
    if (email.trim().length === 0) {
      toast({ variant: 'destructive', title: 'Email required' });
      return;
    }
    if (mobile.trim().length === 0) {
      toast({ variant: 'destructive', title: 'Mobile required' });
      return;
    }

    if (setNewPasswordFlag) {
      if (newPassword.length < 8) {
        toast({
          variant: 'destructive',
          title: 'Invalid password',
          description: 'Password must be at least 8 characters.',
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Password mismatch',
          description: 'New password and confirm password must match.',
        });
        return;
      }
    }

    setSaving(true);
    console.log(selectedClient, 'data');
    try {
      await dispatch(
        updateClientDetails({
          code: selectedClient.code,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          isPasswordChanged: setNewPasswordFlag,
          company: selectedClient?.companyID ?? '',
          branch: selectedClient?.branchCode ?? '',
          ...(setNewPasswordFlag && { password: newPassword.trim() }),
        }),
      ).unwrap();

      await dispatch(fetchClientList());
      closeDrawer();
    } catch {
      // Errors are toasted in thunks.
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ag-theme-quartz h-[calc(100vh-70px)] p-4">
      {loading && <Loading />}
      <AgGridReact
        rowData={clientList ?? []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        suppressCellFocus={true}
        onRowClicked={(event) => {
          setSelectedClient(event?.data ?? null);
          setDrawerOpen(true);
        }}
      />

      <Sheet
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) closeDrawer();
          else setDrawerOpen(open);
        }}
      >
        <SheetContent
          side="right"
          className="w-[520px] max-w-[92vw] p-0 flex flex-col"
          onInteractOutside={(e: any) => e.preventDefault()}
        >
          <SheetHeader className="flex-shrink-0 border-b px-6 py-4 bg-slate-50/80 flex items-start justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold text-slate-800">
                Client Details
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {!selectedClient ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                Select a client row to edit.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>First Name</Label>
                    <Input
                      className={inputStyle}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Last Name</Label>
                    <Input
                      className={inputStyle}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      className={inputStyle}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Mobile</Label>
                    <Input
                      className={inputStyle}
                      value={mobile}
                      inputMode="numeric"
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, ''))
                      }
                      disabled={saving}
                    />
                  </div>

                  {/* <div className="space-y-1.5">
                    <Label>PAN</Label>
                    <Input
                      className={inputStyle}
                      value={panNo}
                      onChange={(e) => setPanNo(e.target.value.toUpperCase())}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>GST</Label>
                    <Input
                      className={inputStyle}
                      value={gstNo}
                      onChange={(e) => setGstNo(e.target.value)}
                      disabled={saving}
                    />
                  </div> */}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <Label>Set New Password</Label>
                      <p className="text-xs text-slate-500">
                        Check this to show password fields.
                      </p>
                    </div>
                    <Checkbox
                      checked={setNewPasswordFlag}
                      onCheckedChange={(v) => {
                        const checked = v === true;
                        setSetNewPasswordFlag(checked);
                        if (!checked) {
                          setNewPassword('');
                          setConfirmPassword('');
                        }
                      }}
                      disabled={saving}
                      aria-label="Set new password"
                    />
                  </div>

                  {setNewPasswordFlag && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          className={inputStyle}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={saving}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          className={inputStyle}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={saving}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex-shrink-0 border-t px-6 py-4 bg-white">
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" onClick={closeDrawer} disabled={saving}>
                Cancel
              </Button>
              <Button
                className="bg-[#115e59] hover:bg-[#0d4a46]"
                onClick={handleUpdateClient}
                disabled={!selectedClient || saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClientUserPage;
