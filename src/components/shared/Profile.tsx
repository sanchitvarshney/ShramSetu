import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IconButton from '@/components/ui/IconButton';
import { Input } from '@/components/ui/input';
import { Building2, Info, Mail, Pen, Phone, User, Check } from 'lucide-react';
import OtpModal from '@/components/shared/OtpModal'; // Import the OTP modal component
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  changePassword,
  fetchUserProfile,
  sentOtp,
  verifyOtp,
} from '@/features/profile/profilePageSlice';
import {
  getCompanyBranchOptions,
  searchCompanies,
} from '@/features/admin/adminPageSlice';
import Loading from '@/components/reusable/Loading';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { isPlaceholderDisplayValue } from '@/lib/utils';

/** API returns "true"/"false" or boolean; true = show Verify button (field is not verified) */
function isNotVerified(value: unknown): boolean {
  return value !== 'true' && value !== true;
}

function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { userProfile, loading } = useSelector(
    (state: RootState) => state.profilePage,
  );
  const { companies, branches } = useSelector((state: RootState) => state.adminPage);
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [fieldToVerify, setFieldToVerify] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(searchCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile?.length > 0) {
      const p = userProfile[0];
      setMobile(p?.phoneNumber ?? '');
      setEmail(p?.email ?? '');
      setFirstName(p?.firstName ?? '');
      setMiddleName(p?.middleName ?? '');
      setLastName(p?.lastName ?? '');
      setCompany(String(p?.companyID ?? p?.company ?? ''));
      setBranch(String(p?.branchID ?? p?.branch ?? ''));
    }
  }, [userProfile]);

  useEffect(() => {
    if (company) {
      dispatch(getCompanyBranchOptions(company));
    }
  }, [company, dispatch]);

  const updateUserData = async (field: string, value: string, type: string) => {
    if (
      field === 'mobile' ||
      field === 'adminEmail' ||
      field === 'supportEmail'
    ) {
      setFieldToVerify(type);
      dispatch(
        sentOtp({ body: { [field]: value }, type: `${type}=true` }),
      ).then((response: any) => {
        if (response.payload.code === 'NOTOK') {
          setShowOtpModal(true);
        }
      });
    } else {
      dispatch(changePassword({ body: { [field]: value }, type }));
    }
  };

  const handleVerifyClick = (field: string, value: string, type: string) => {
    setFieldToVerify(type);
    dispatch(sentOtp({ body: { [field]: value }, type: `${type}=true` })).then(
      (response: any) => {
        if (response.payload.code === 'NOTOK') {
          setShowOtpModal(true);
        }
      },
    );
  };

  const handleOpenEditModal = () => {
    if (!userProfile?.length) return;
    const p = userProfile[0];
    setFirstName(p?.firstName ?? '');
    setMiddleName(p?.middleName ?? '');
    setLastName(p?.lastName ?? '');
    setCompany(String(p?.companyID ?? p?.company ?? ''));
    setBranch(String(p?.branchID ?? p?.branch ?? ''));
    setMobile((p?.phoneNumber ?? '').replace(/\D/g, ''));
    setEmail(p?.email ?? '');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!userProfile?.length) return;
    const p = userProfile[0];

    const normalizedMobile = String(mobile ?? '').replace(/\D/g, '');
    const profileBody = {
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      company: company,
      branch: branch,
    };

    setSavingProfile(true);
    try {
      await dispatch(
        changePassword({ body: profileBody, type: 'profile=true' }),
      ).unwrap();

      if (normalizedMobile !== String(p?.phoneNumber ?? '').replace(/\D/g, '')) {
        await updateUserData('mobile', normalizedMobile, 'mobile');
      }
      if (email.trim() !== String(p?.email ?? '').trim()) {
        await updateUserData('email', email.trim(), 'email');
      }

      await dispatch(fetchUserProfile());
      setShowEditModal(false);
    } catch {
      // Errors are toasted by thunks.
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="h-full min-h-0">
      {loading && <Loading />}
      {userProfile && (
        <div className="flex flex-col items-center w-full px-4 py-6 sm:px-6">
          <div className="w-full max-w-3xl flex flex-col gap-6">
            <Card className="shadow-sm border-border/80 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
                  <div className="flex gap-3 items-center justify-between w-full">
                    <div className="flex gap-3 items-center min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#115e59]/10 text-[#115e59]">
                      <User size={22} />
                    </div>
                    <span className="truncate">{userProfile[0]?.name}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#115e59] hover:bg-[#0d4a46]"
                      onClick={handleOpenEditModal}
                    >
                      <Pen size={14} className="mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {!isPlaceholderDisplayValue(
                    userProfile[0]?.nameOfCompany,
                  ) && (
                    <div className="flex flex-wrap items-center  gap-x-2 gap-y-1">
                      <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium shrink-0">
                        <Building2 size={18} className="shrink-0" />
                        Company
                      </span>
                      <span className="text-foreground font-medium">
                        {userProfile[0]?.nameOfCompany}
                      </span>
                    </div>
                  )}
                  {!isPlaceholderDisplayValue(
                    userProfile[0]?.nameOfBranch,
                  ) && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium shrink-0">
                        <Building2 size={18} className="shrink-0" />
                        Branch
                      </span>
                      <span className="text-foreground font-medium">
                        {userProfile[0]?.nameOfBranch}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t border-border" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SingleItem
                    label="Contact No."
                    icon={<Phone size={19} />}
                    value={mobile}
                    numericOnly
                    notVerified={isNotVerified(userProfile[0]?.phoneVerify)}
                    onVerify={() =>
                      handleVerifyClick('mobile', mobile, 'mobile')
                    }
                  />
                  <SingleItem
                    label="E-Mail"
                    icon={<Mail size={19} />}
                    value={email}
                    notVerified={isNotVerified(userProfile[0]?.emailVerify)}
                    onVerify={() => handleVerifyClick('email', email, 'email')}
                  />
                </div>
              </CardContent>
            </Card>
      
          </div>
        </div>
      )}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onOtpVerified={(otp) => {
          setShowOtpModal(false);
          dispatch(
            verifyOtp({
              body: { otp, emailType: fieldToVerify },
            }),
          );
        }}
      />
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={savingProfile}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Middle Name</Label>
              <Input
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                disabled={savingProfile}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={savingProfile}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Select
                value={company}
                onValueChange={(value) => {
                  setCompany(value);
                  setBranch('');
                }}
                disabled={savingProfile}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((c: any) => (
                    <SelectItem
                      key={c.value || c.companyID}
                      value={String(c.value || c.companyID)}
                    >
                      {c.text || c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Branch</Label>
              <Select
                value={branch}
                onValueChange={setBranch}
                disabled={savingProfile || !company}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={company ? 'Select Branch' : 'Select Company first'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((b: any) => (
                    <SelectItem key={b.branchID} value={String(b.branchID)}>
                      {b.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Mobile No.</Label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={savingProfile}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>E-Mail</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                disabled={savingProfile}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={savingProfile}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#115e59] hover:bg-[#0d4a46]"
              onClick={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Profile;

interface PropTypes {
  icon: ReactNode;
  label: string;
  value: string;
  editable?: boolean;
  numericOnly?: boolean;
  notVerified?: boolean;
  extra?: ReactNode;
  onUpdate?: (newValue: string) => void;
  onVerify?: () => void; // Added onVerify prop
}

const SingleItem = ({
  icon,
  label,
  value,
  editable,
  numericOnly = false,
  notVerified,
  extra,
  onUpdate,
  onVerify, // Destructure onVerify
}: PropTypes) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setInputValue(value); // Update inputValue when value changes
    setHasChanges(false); // Reset change flag when value is updated from outside
  }, [value]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(inputValue);
    }
    setIsEditing(false);
    setHasChanges(false); // Reset change flag after saving
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = numericOnly
      ? e.target.value.replace(/\D/g, '')
      : e.target.value;
    setInputValue(nextValue);
    setHasChanges(true); // Mark as changed when user types
  };

  if (isPlaceholderDisplayValue(value)) return null;

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-1 justify-between text-muted-foreground">
        <div className="flex gap-1 items-center">
          {icon}
          <strong>{label}</strong>
        </div>

        {notVerified && (
          <div className="bg-white text-black">
            <IconButton
              tooltip={
                <div className="flex items-center p-2 flex-col gap-2 w-[200px] bg-white text-black">
                  <p className="font-semibold">{label} is not verified</p>
                  <Button
                    className="w-full h-[27px] bg-[#115e59] hover:bg-[#0d4a46] shadow-neutral-400"
                    onClick={onVerify} // Trigger OTP modal
                  >
                    Verify
                  </Button>
                </div>
              }
              color="text-yellow-700"
              hoverBackground="hover:bg-white"
              hoverColor="hover:text-yellow-900"
              noSpace
              icon={<Info size={15} />}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center justify-between pr-10 pl-5">
        {isEditing ? (
          <>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              inputMode={numericOnly ? 'numeric' : undefined}
              pattern={numericOnly ? '[0-9]*' : undefined}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleSave}
              className="ml-2"
              disabled={!hasChanges} // Disable save button if no changes
            >
              <Check size={16} />
            </Button>
          </>
        ) : (
          <>
            <p>{value}</p>
            {editable && (
              <IconButton
                hoverBackground="hover:bg-transparent"
                noSpace={true}
                icon={<Pen size={16} />}
                onClick={() => setIsEditing(true)}
              />
            )}
          </>
        )}
      </div>
      {extra}
    </div>
  );
};

// const InfoCard = () => {
//   return (
//     <div className="rounded-lg border border-border p-5 w-full bg-amber-50">
//       <div className="text-muted-foreground mb-4 flex">
//         <Info size={20} />
//       </div>
//       <ul className="flex flex-col gap-2 text-muted-foreground">
//         <li>
//           <p>
//             <strong>Support Email</strong> is used if we need any support from
//             you or your technical team.
//           </p>
//         </li>
//         <li>
//           <p>
//             <strong>Recruitment Email</strong> is used when you contact workers
//             through e-mail.
//           </p>
//           <p>
//             You will need to create and set a <strong>App Password</strong> with
//             your <strong>Recruitment Email</strong> so we can use that e-mail to
//             send mails otherwise the e-mails will be sent through our E-mail ID.
//           </p>
//         </li>
//       </ul>
//     </div>
//   );
// };
