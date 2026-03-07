import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LabeledField } from '@/components/ui/LabeledField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { sendOtp, changePasswordForgot } from '@/features/auth/authSlice';
import { AppDispatch } from '@/store';
import { useToast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import {
  validateForm,
  forgotPasswordSchema,
  otpSchema,
  forgotPasswordNewPasswordSchema,
} from '@/lib/validations';
import { PasswordInput } from '@/components/ui/passwordInput';
import { inputStyle } from '@/style/CustomStyles';

type Step = 'sendOtp' | 'enterOtpAndPassword' | 'done';

const FORGOT_PW_STORAGE_KEY = 'forgotPassword_otpSent';

function getStoredOtpStep(): { step: Step; userType: 'admin' | 'client'; userName: string } | null {
  try {
    const raw = sessionStorage.getItem(FORGOT_PW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { userType?: string; userName?: string };
    if (parsed?.userName && (parsed?.userType === 'admin' || parsed?.userType === 'client')) {
      return {
        step: 'enterOtpAndPassword',
        userType: parsed.userType as 'admin' | 'client',
        userName: String(parsed.userName).trim(),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function clearStoredOtpStep() {
  sessionStorage.removeItem(FORGOT_PW_STORAGE_KEY);
}

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stored = React.useMemo(() => getStoredOtpStep(), []);
  const [userType, setUserType] = useState<'admin' | 'client'>(
    stored?.userType ?? 'client',
  );
  const [userName, setUserName] = useState(stored?.userName ?? '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<Step>(stored?.step ?? 'sendOtp');
  const { loading } = useSelector((state: { auth: { loading: boolean } }) => state.auth);
  const { toast } = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm(forgotPasswordSchema, { userName: userName.trim() });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    const result = await dispatch(sendOtp({ type: userType, userName: userName.trim() }));
    if (sendOtp.fulfilled.match(result)) {
      sessionStorage.setItem(
        FORGOT_PW_STORAGE_KEY,
        JSON.stringify({ userType, userName: userName.trim() }),
      );
      setStep('enterOtpAndPassword');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValidation = validateForm(otpSchema, otp);
    if (!otpValidation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: otpValidation.message,
      });
      return;
    }
    const pwdValidation = validateForm(forgotPasswordNewPasswordSchema, {
      newPassword,
      confirmPassword,
    });
    if (!pwdValidation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: pwdValidation.message,
      });
      return;
    }
    const result = await dispatch(
      changePasswordForgot({
        type: userType,
        userName: userName.trim(),
        otp: otp.trim(),
        newPassword,
      }),
    );
    if (changePasswordForgot.fulfilled.match(result)) {
      clearStoredOtpStep();
      setStep('done');
    }
  };

  const handleBackToSendOtp = () => {
    clearStoredOtpStep();
    setStep('sendOtp');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Wrapper className="h-[100vh] w-[100vw] grid grid-cols-2">
      <div className="overflow-hidden max-h-[100vh] flex justify-center items-center left">
        <Card className="max-w-sm mx-auto w-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-600">Forgot password</CardTitle>
            <CardDescription>
              {step === 'sendOtp' &&
                'Select your account type and enter your email. We’ll send an OTP to your email.'}
              {step === 'enterOtpAndPassword' &&
                'Enter the OTP sent to your email, then set a new password.'}
              {step === 'done' && 'Your password has been changed. You can sign in with your new password.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'done' ? (
              <div className="grid gap-4">
                <p className="text-sm text-slate-600">
                  Password changed successfully. Please log in with your new password.
                </p>
                <Button asChild className="w-full bg-[#115e59] hover:bg-[#0d4a46]">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            ) : step === 'sendOtp' ? (
              <form onSubmit={handleSendOtp} className="grid gap-[10px]">
                <div className="grid gap-1">
                  <Label htmlFor="userType" className="text-sm font-medium text-slate-600">
                    Reset password as
                  </Label>
                  <Select value={userType} onValueChange={(v: 'admin' | 'client') => setUserType(v)}>
                    <SelectTrigger id="userType" className={inputStyle}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <LabeledField
                  label="E-Mail / Phone Number"
                  id="userName"
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full bg-[#115e59] hover:bg-[#0d4a46]"
                  disabled={loading}
                >
                  {loading && (
                    <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} />
                  )}
                  Send OTP
                </Button>
                <div className="mt-2 text-center">
                  <Link
                    to="/login"
                    className="text-sm font-[500] text-teal-600 hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="grid gap-[10px]">
                <LabeledField
                  label="OTP (sent to your email)"
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                />
                <div className="flex flex-col gap-[10px]">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New password
                  </Label>
                  <div className="relative">
                    <PasswordInput
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <PasswordInput
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#115e59] hover:bg-[#0d4a46]"
                  disabled={loading}
                >
                  {loading && (
                    <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} />
                  )}
                  Change password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToSendOtp}
                  disabled={loading}
                >
                  Back to send OTP
                </Button>
                <div className="mt-2 text-center">
                  <Link
                    to="/login"
                    className="text-sm font-[500] text-teal-600 hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="pt-[50px] w-full right">
        <h2 className="text-[20px] font-[600] text-slate-700">
          Welcome to MsCorpres Workers Hub
        </h2>
        <h1 className="text-[30px] font-[700] text-slate-700">Employee Search Portal</h1>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-image:
    linear-gradient(
      to right,
      rgb(218, 218, 218),
      rgb(212, 212, 212),
      rgba(226, 226, 226, 0.023),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    url('/login2.png');
  background-size: cover;
  background-repeat: no-repeat;
  .right,
  .left {
    background-image: linear-gradient(
      to bottom,
      rgb(218, 218, 218),
      rgb(218, 218, 218),
      rgba(226, 226, 226, 0),
      rgba(226, 226, 226, 0),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    );
  }
`;

export default ForgotPassword;
