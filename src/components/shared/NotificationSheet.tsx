import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Props } from '@/types/mainLayout';
import { RxCross1 } from 'react-icons/rx';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NotificationSheet: React.FC<Props> = ({ uiState }) => {
  const { notification, setNotification } = uiState;
  return (
    <Sidebar open={notification} onOpenChange={setNotification}>
      <SidebarContent
        side={'right'}
        className="min-w-[450px] h-auto rounded-xl bg-neutral-200 border-0  shadow shadow-stone-400 p-0 overflow-hidden top-[10px] bottom-[10px] right-[10px]"
      >
        <SidebarHeader className="flex flex-row items-center justify-between bg-white h-[50px]  px-[10px] shadow">
          <h3 className="text-[18px] font-[600] text-slate-600">
            Notifications
          </h3>
          <div>
           <Button variant={"ghost"} className='p-0 h-[30px] w-[30px]'>
           <RxCross1
              className="h-[20px] w-[20px] cursor-pointer"
              onClick={() => setNotification(false)}
            />
           </Button>
          </div>
        </SidebarHeader>
        <div className="h-[50px] flex justify-between items-center px-[10px]">
          <Button
            variant={'outline'}
            className="underline bg-transparent shadow-none text-slate-600"
          >
            Show unread only
          </Button>
          <Button
            variant={'outline'}
            className="underline bg-transparent shadow-none text-slate-600"
          >
            Mark all as read
          </Button>
        </div>
        <div className="h-[calc(100vh-170px)] overflow-y-auto flex flex-col gap-[10px] px-[10px] py-[20px]">
          <Card className="p-0 rounded-md">
            <CardHeader className="p-[10px] flex justify-between flex-row">
              <div>
                <CardTitle className="text-slate-600">
                  Website design meating
                </CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
              </div>
              <div>
                <Badge className="h-[12px] w-[12px] rounded-full bg-blue-300 p-0 hover:bg-blue-300" />
              </div>
            </CardHeader>
            <CardContent className="p-[10px] m-0">
              <div className="flex items-center justify-between mb-[10px]">
                <div className='flex gap-[5px] text-slate-600 font-[500]'>
                  <Avatar className='h-[30px] w-[30px]'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  Sachin Maurya
                </div>
                <div>
                  <p className="text-[14px] text-slate-600">6 hours ago</p>
                </div>
              </div>
              <div className="w-full bg-blue-100 rounded-md p-[5px] text-slate-600">
                <p className="text-[14px]">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Ullam laboriosam asperiores nulla distinctio saepe nostrum aut
                  explicabo, minus sint perferendis!
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0 rounded-md">
            <CardHeader className="p-[10px] flex justify-between flex-row">
              <div>
                <CardTitle className="text-slate-600">
                  Website design meeting
                </CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
              </div>
              <div>
                <Badge className="h-[12px] w-[12px] rounded-full bg-transparent border-2 border-blue-300 p-0 hover:bg-transparent " />
              </div>
            </CardHeader>
            <CardContent className="p-[10px] m-0">
              <div className="flex items-center justify-between mb-[10px]">
                <div className='flex gap-[5px] text-slate-600 font-[500]'>
                  <Avatar className='h-[30px] w-[30px]'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  Shiv Sir
                </div>
                <div>
                  <p className="text-[14px] text-slate-600">2 days ago</p>
                </div>
              </div>
               <div className="w-full bg-blue-100 rounded-md p-[5px] text-slate-600">
                <p className="text-[14px]">
                 <strong>Attachment</strong> <a href="#" className='underline'>Screenshot398412343--312343-e23e-32e32-e</a>
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-0 rounded-md">
            <CardHeader className="p-[10px] flex justify-between flex-row gap-[20px]">
              <div>
                <CardTitle className="text-slate-600">
                  Salary component compleate successfully
                </CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
              </div>
              <div>
                <Badge className="h-[12px] w-[12px] rounded-full bg-transparent border-2 border-blue-300 p-0 hover:bg-transparent " />
              </div>
            </CardHeader>
            <CardContent className="p-[10px] m-0">
              <div className="flex items-center justify-between mb-[10px]">
                <div className='flex gap-[5px] text-slate-600 font-[500]'>
                  <Avatar className='h-[30px] w-[30px]'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  Lovish Tuteja
                </div>
                <div>
                  <p className="text-[14px] text-slate-600">7 hours ago</p>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>
        <SidebarFooter className='bg-white h-[50px] shadow'>
          footer
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default NotificationSheet;
