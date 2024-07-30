import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Separator } from '@/components/ui/separator';
import { FaRegPlayCircle } from 'react-icons/fa';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { PasswordInput } from '@/components/ui/passwordInput';
import { inputStyle } from '@/style/CustomStyles';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  return (
    <Wrapper className="h-[100vh] w-[100vw] grid grid-cols-2   ">
      <div className="overflow-hidden max-h-[100vh] flex justify-center items-center left">
        <Card className="max-w-sm mx-auto w-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-600">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-[20px]">
              <div className="grid gap-2 floating-label-group">
              
                <Input
                  id="email"
                  type="email"
                  required
                  className={inputStyle}
                  
                />
                  <Label htmlFor="email" className='floating-label'>Username</Label>
              </div>
              <div className="grid gap-2 floating-label-group">
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`${inputStyle} input`}
                  required
                />
                  <Label htmlFor="password" className='floating-label'>Password</Label>
              </div>
              <div className="flex items-center">
                
                <Link
                  to="#"
                  className="inline-block text-sm underline text-slate-600"
                >
                  Forgot password?
                </Link>
              </div> 
              <Link to={'/'}>
                <Button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-600"
                >
                  Login
                </Button>
              </Link>
            </div>
            <div className="mt-4 text-sm text-center">
              First time user?
              <Link to="#" className="font-[600] text-teal-600 ml-[5px]">
                REGISTER HERE
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
  background-image: linear-gradient(
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
