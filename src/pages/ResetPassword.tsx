import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/passwordInput';
import { inputStyle } from '@/style/CustomStyles';
import { resetPassword } from '@/features/auth/authSlice';
import { AppDispatch } from '@/store';
import { useToast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import { validateForm, resetPasswordSchema } from '@/lib/validations';
import styled from 'styled-components';

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { loading } = useSelector((state: { auth: { loading: boolean } }) => state.auth);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Invalid link',
        description: 'This reset link is invalid or expired. Please request a new one.',
      });
    }
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm(resetPasswordSchema, {
      token,
      newPassword,
      confirmPassword,
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    const result = await dispatch(resetPassword({ token, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    }
  };

  if (!token) {
    return (
      <Wrapper className="h-[100vh] w-[100vw] flex justify-center items-center">
        <Card className="max-w-sm w-[500px]">
          <CardContent className="pt-6">
            <p className="text-slate-600 mb-4">This reset link is invalid or expired.</p>
            <Button asChild className="w-full bg-[#115e59] hover:bg-[#0d4a46]">
              <Link to="/forgot-password">Request new reset link</Link>
            </Button>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  if (success) {
    return (
      <Wrapper className="h-[100vh] w-[100vw] flex justify-center items-center">
        <Card className="max-w-sm w-[500px]">
          <CardContent className="pt-6">
            <p className="text-slate-600 mb-4">
              Your password has been reset. Redirecting to login...
            </p>
            <Button asChild className="w-full bg-[#115e59] hover:bg-[#0d4a46]">
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="h-[100vh] w-[100vw] grid grid-cols-2">
      <div className="overflow-hidden max-h-[100vh] flex justify-center items-center left">
        <Card className="max-w-sm mx-auto w-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-600">Set new password</CardTitle>
            <CardDescription>
              Enter your new password below. Use at least 8 characters with uppercase, number and
              special character.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-[10px]">
              <div className="flex flex-col gap-[10px]">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New password
                </Label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputStyle}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputStyle}
                  required
                  autoComplete="new-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#115e59] hover:bg-[#0d4a46]"
                disabled={loading}
              >
                {loading && (
                  <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} />
                )}
                Reset password
              </Button>
              <div className="mt-2 text-center">
                <Link to="/login" className="text-sm font-[500] text-teal-600 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
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

export default ResetPassword;
