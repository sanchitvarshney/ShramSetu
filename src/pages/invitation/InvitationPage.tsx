import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { NavLink } from 'react-router-dom';
interface Props {
  children:React.ReactNode
}
 const InvitationPage: React.FC<Props> = ({children}) => {
  return (
    <div className='p-[10px]'>
      <Card className='overflow-hidden'>
        <CardHeader className="flex flex-row items-center p-0  bg-neutral-200 px-[50px] pt-[50px] h-[200px]">
          <div className="flex flex-row items-center p-0 ">
            <NavLink to={"/invitation/mail"} className={({isActive})=>`w-[200px] h-[150px] flex justify-center items-center flex-col gap-[10px] transition-all ${isActive && "bg-white h-[200px] pb-[30px]"} rounded-t-lg`}>
              <img src="/mail.svg" alt="" />
              <p>Mail</p>
            </NavLink>
            <NavLink to={"/invitation/whatsapp"} className={({isActive})=>`w-[200px] h-[150px] flex justify-center items-center flex-col gap-[10px] transition-all ${isActive && "bg-white h-[200px] pb-[30px]"} rounded-t-lg `}>
              <img src="/whatsapp.svg" alt="" />
              <p>Whatsapp</p>
            </NavLink>
            <NavLink to={"/invitation/message"} className={({isActive})=>`w-[200px] h-[150px] flex justify-center items-center flex-col gap-[10px] transition-all ${isActive && "bg-white h-[200px] pb-[30px]"} rounded-t-lg `}>
              <img src="/message.svg" alt="" />
              <p>Message</p>
            </NavLink>
          </div>
        </CardHeader>
        <CardContent className='h-[calc(100vh-292px)] p-0 overflow-y-auto'>
          {children}
        </CardContent>
       
      </Card>
    </div>
  );
};

export default InvitationPage;
