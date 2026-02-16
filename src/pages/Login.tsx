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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Separator } from '@/components/ui/separator';
import { FaRegQuestionCircle, FaRegPlayCircle } from 'react-icons/fa';
import { PasswordInput } from '@/components/ui/passwordInput';
import { inputStyle } from '@/style/CustomStyles';
import { login } from '@/features/auth/authSlice';
import { AppDispatch } from '@/store';
import { useToast } from '@/components/ui/use-toast';
import { CircularProgress } from '@mui/material';
import { validateForm, loginSchema } from '@/lib/validations';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'client'>('client');
  const { loading  } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm(loginSchema, { userName: email.trim(), password });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    dispatch(login({ userName: email.trim(), password, type: userType })).then((response: any) => {
      if (response.payload.success) {
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify(response?.payload?.data),
        );
        navigate('/');
        toast({ title: 'Success!!', description: response.payload.message });
      }
    });
  };

  return (
    <Wrapper className="h-[100vh] w-[100vw] grid grid-cols-2">
      <div className="overflow-hidden max-h-[100vh] flex justify-center items-center left">
        <Card className="max-w-sm mx-auto w-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-600">Login your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-[10px]">
              <div className="grid gap-1">
                <Label htmlFor="userType" className="text-sm font-medium text-slate-600">
                  Login as
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
              <div className="grid gap-1 floating-label-group">
                <Input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputStyle}
                />
                <Label htmlFor="email" className="floating-label">
                  E-Mail / Phone Number
                </Label>
              </div>
              <div className="grid gap-1 floating-label-group">
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`${inputStyle} input`}
                  required
                />
                <Label htmlFor="password" className="floating-label">
                  Password
                </Label>
              </div>
              <div className="flex items-center mt-[-20px]">
                <Link
                  to="#"
                  className="inline-block ml-auto text-xs underline text-slate-600 text-[12px]"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-600"
                disabled={loading}
              >
                {loading && (
                  <CircularProgress size={18} sx={{ color: 'white', mr: 1 }} />
                )}
                Login
              </Button>
            </form>
            {/* <div className="mt-4 text-sm text-center">
              Don't have account?
              <Link to="#" className="font-[600] text-teal-600 ml-[5px]">
                REGISTER HERE
              </Link>
            </div> */}
            <div className="mt-4 text-sm text-center">
              You agree to the
              <Link
                to="/terms-of-service"
                className="font-[600] text-teal-600 mx-[5px] underline"
              >
                Term of service
              </Link>
              &
              <Link
                to="/privacy-policy"
                className="font-[600] text-teal-600 ml-[5px] underline"
              >
                Privacy policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className=" pt-[50px] w-full right">
        <h2 className="text-[20px] font-[600] text-slate-700">
          Welcome to MsCorpres Workers Hub
        </h2>
        <h1 className="text-[30px] font-[700] text-slate-700">
          Employee Search Portal
        </h1>
        <div className="flex items-center gap-[20px] px-[20px] py-[10px] rounded-full bg-neutral-100 max-w-max mt-[20px] shadow">
          <Link to={'#'} className="font-[500]">
            NEED HELP?
          </Link>
          <Separator orientation="vertical" className="bg-slate-300 h-[20px]" />
          <Link
            to={'#'}
            className="flex items-center gap-[5px] text-teal-600 font-[500]"
          >
            <FaRegPlayCircle /> WATCH DEMO
          </Link>
          <Separator
            orientation="vertical"
            className="bg-slate-300 h-[20px] w-[2px]"
          />
          <Link
            to={'#'}
            className="flex items-center gap-[5px] text-teal-600 font-[500]"
          >
            <FaRegQuestionCircle />
            FAQS?
          </Link>
        </div>
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
  .floating-label-group {
    position: relative;
    margin-top: 15px;
    margin-bottom: 25px;

    .floating-label {
      font-size: 15px;
      color: #9e9e9e;
      position: absolute;
      pointer-events: none;
      top: 9px;
      left: 12px;
      transition: all 0.1s ease;
    }

    input:focus ~ .floating-label,
    input:not(:focus):valid ~ .floating-label {
      top: -15px;
      bottom: 0px;
      left: 0px;
      font-size: 14px;
      opacity: 1;
      color: #404040;
    }

    .input:focus ~ .floating-label,
    .input:not(:focus):valid ~ .floating-label {
      top: -15px;
      bottom: 0px;
      left: 0px;
      font-size: 14px;
      opacity: 1;
      color: #404040;
    }
  }

  .row {
    margin-top: 50px;
  }
`;
export default Login;
