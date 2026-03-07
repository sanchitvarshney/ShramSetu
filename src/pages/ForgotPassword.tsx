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
import { LabeledField } from '@/components/ui/LabeledField';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { forgotPassword } from '@/features/auth/authSlice';
import { AppDispatch } from '@/store';
import { useToast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import { validateForm, forgotPasswordSchema } from '@/lib/validations';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userName, setUserName] = useState('');
  const { loading } = useSelector((state: { auth: { loading: boolean } }) => state.auth);
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    const result = await dispatch(forgotPassword({ userName: userName.trim() }));
    if (forgotPassword.fulfilled.match(result)) {
      setSubmitted(true);
    }
  };

  return (
    <Wrapper className="h-[100vh] w-[100vw] grid grid-cols-2">
      <div className="overflow-hidden max-h-[100vh] flex justify-center items-center left">
        <Card className="max-w-sm mx-auto w-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-600">Forgot password</CardTitle>
            <CardDescription>
              Enter your email or phone number and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="grid gap-4">
                <p className="text-sm text-slate-600">
                  If an account exists for that email/phone, you will receive reset instructions.
                  Please check your inbox and follow the link to set a new password.
                </p>
                <Button asChild className="w-full bg-[#115e59] hover:bg-[#0d4a46]">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-[10px]">
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
                  Send reset link
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
