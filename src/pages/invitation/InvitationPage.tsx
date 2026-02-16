import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IoSearchOutline } from "react-icons/io5";

interface Props {
  children:React.ReactNode
}
 const InvitationPage: React.FC<Props> = ({children}) => {
  return (
    <div className=''>
      <Card className='overflow-hidden border-none rounded-none shadow-none'>
        <CardHeader className="flex flex-row items-center justify-between p-0  bg-neutral-200 px-[50px] pt-[30px] h-[120px] overflow-hidden">
          <div className="flex flex-row items-center p-0 ">
            <NavLink to={"/invitation/mail"} className={({isActive})=>`w-[150px] h-[100px] flex justify-center items-center flex-col transition-all ${isActive && "bg-[#e0f2f1] h-[100px] pb-[20px]"} rounded-t-lg`}>
              <img src="/mail.svg" alt=""  className='w-[50px]'/>
       <span>Email</span>
            </NavLink>
            <NavLink to={"/invitation/whatsapp"}  className={({isActive})=>`w-[150px] h-[100px] flex justify-center items-center flex-col  transition-all ${isActive && "bg-[#e0f2f1] h-[100px] pb-[20px]"} rounded-t-lg`}>
              <img src="/whatsapp.svg" alt=""  className='w-[50px]'/>
              <span>Whatsapp</span>
            </NavLink>
            <NavLink to={"/invitation/message"}  className={({isActive})=>`w-[150px] h-[100px] flex justify-center items-center flex-col  transition-all ${isActive && "bg-[#e0f2f1] h-[100px] pb-[20px]"} rounded-t-lg`}>
              <img src="/message.svg" alt="" className='w-[50px]'/>
              <span>SMS</span>
            </NavLink>
          </div>
       
          <div className='flex items-center gap-[10px]'>
            <Input className={"bg-#fff min-w-[300px] focus-visible:ring-0"} placeholder='Search...'/>
            <Button className='flex items-center gap-[5px] bg-teal-500 hover:bg-teal-600 shadow-neutral-400 shadow'><IoSearchOutline className='h-[20px] w-[20px]'/> Search</Button>
     
        </div>
        </CardHeader>
        <CardContent className='h-[calc(100vh-190px)] p-0 overflow-y-auto '>
          {children}
        </CardContent>
       
      </Card>
    </div>
  );
};

export default InvitationPage;
