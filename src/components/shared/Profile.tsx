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
import Loading from '@/components/reusable/Loading';

/** API returns "true"/"false" or boolean; true = show Verify button (field is not verified) */
function isNotVerified(value: unknown): boolean {
  return value !== 'true' && value !== true;
}

function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { userProfile, loading } = useSelector(
    (state: RootState) => state.profilePage,
  );
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [supportEmail, setSupportEmail] = useState<string>('');
  const [recruitmentEmail, setRecruitmentEmail] = useState<string>('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [fieldToVerify, setFieldToVerify] = useState('');

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile?.length > 0) {
      const p = userProfile[0];
      setMobile(p?.phoneNumber ?? '');
      setEmail(p?.email ?? '');
      setSupportEmail(p?.emailSupport ?? '');
      setRecruitmentEmail(p?.emailRecruitment ?? '');
    }
  }, [userProfile]);

  const updateUserData = async (field: string, value: string, type: string) => {
    if (
      field === 'mobile' ||
      field === 'adminEmail' ||
      field === 'supportEmail' ||
      field === 'recruitmentEmail'
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

  return (
    <div className="h-full min-h-0">
      {loading && <Loading />}
      {userProfile && (
        <div className="flex flex-col items-center w-full px-4 py-6 sm:px-6">
          <div className="w-full max-w-3xl flex flex-col gap-6">
            <Card className="shadow-sm border-border/80 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
                  <div className="flex gap-3 items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#115e59]/10 text-[#115e59]">
                      <User size={22} />
                    </div>
                    <span className="truncate">{userProfile[0]?.name}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-wrap items-center  gap-x-2 gap-y-1">
                    <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium shrink-0">
                      <Building2 size={18} className="shrink-0" />
                      Company
                    </span>
                    <span className="text-foreground font-medium">
                      {userProfile[0]?.nameOfCompany || '—'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium shrink-0">
                      <Building2 size={18} className="shrink-0" />
                      Branch
                    </span>
                    <span className="text-foreground font-medium">
                      {userProfile[0]?.nameOfBranch || '—'}
                    </span>
                  </div>
                </div>
                <div className="border-t border-border" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SingleItem
                    label="Contact No."
                    icon={<Phone size={19} />}
                    value={mobile}
                    editable
                    notVerified={isNotVerified(userProfile[0]?.phoneVerify)}
                    onUpdate={(newValue) => {
                      const digitsOnly = String(newValue ?? '').replace(
                        /\D/g,
                        '',
                      );
                      setMobile(digitsOnly);
                      updateUserData('mobile', digitsOnly, 'mobile');
                    }}
                    onVerify={() =>
                      handleVerifyClick('mobile', mobile, 'mobile')
                    }
                  />
                  <SingleItem
                    label="E-Mail"
                    icon={<Mail size={19} />}
                    value={email}
                    editable
                    notVerified={isNotVerified(userProfile[0]?.emailVerify)}
                    onUpdate={(newValue) => {
                      setEmail(newValue);
                      updateUserData('email', newValue, 'email');
                    }}
                    onVerify={() => handleVerifyClick('email', email, 'email')}
                  />
                  <SingleItem
                    label="Support E-mail"
                    icon={<Mail size={19} />}
                    value={supportEmail}
                    editable
                    notVerified={isNotVerified(
                      userProfile[0]?.supportEmailVerify,
                    )}
                    onUpdate={(newValue) => {
                      setSupportEmail(newValue);
                      updateUserData('email', newValue, 'supportEmail');
                    }}
                    onVerify={() =>
                      handleVerifyClick('email', supportEmail, 'supportEmail')
                    }
                  />
                  <SingleItem
                    label="Recruitment E-mail"
                    icon={<Mail size={19} />}
                    value={recruitmentEmail}
                    editable
                    notVerified={isNotVerified(
                      userProfile[0]?.recruitmentEmailVerify,
                    )}
                    onUpdate={(newValue) => {
                      setRecruitmentEmail(newValue);
                      updateUserData('email', newValue, 'recruitmentEmail');
                    }}
                    onVerify={() =>
                      handleVerifyClick(
                        'email',
                        recruitmentEmail,
                        'recruitmentEmail',
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
            <InfoCard />
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
    </div>
  );
}
export default Profile;

interface PropTypes {
  icon: ReactNode;
  label: string;
  value: string;
  editable?: boolean;
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
    setInputValue(e.target.value);
    setHasChanges(true); // Mark as changed when user types
  };

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

const InfoCard = () => {
  return (
    <div className="rounded-lg border border-border p-5 w-full bg-amber-50">
      <div className="text-muted-foreground mb-4 flex">
        <Info size={20} />
      </div>
      <ul className="flex flex-col gap-2 text-muted-foreground">
        <li>
          <p>
            <strong>Support Email</strong> is used if we need any support from
            you or your technical team.
          </p>
        </li>
        <li>
          <p>
            <strong>Recruitment Email</strong> is used when you contact workers
            through e-mail.
          </p>
          <p>
            You will need to create and set a <strong>App Password</strong> with
            your <strong>Recruitment Email</strong> so we can use that e-mail to
            send mails otherwise the e-mails will be sent through our E-mail ID.
          </p>
        </li>
      </ul>
    </div>
  );
};
