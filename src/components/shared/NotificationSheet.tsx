import React, { useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
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
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '@/features/homePage/homePageSlice';

const NotificationSheet: React.FC<Props> = ({ uiState }) => {
  const { notification, setNotification } = uiState;
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector((state: RootState) => state.homePage);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

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
            <Button variant={'ghost'} className="p-0 h-[30px] w-[30px]">
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
          {notifications?.length > 0 ? (
            notifications?.map((notification: any, index: any) => (
              <Card key={index} className="p-0 rounded-md">
                <CardHeader className="p-[10px] flex justify-between flex-row">
                  <div>
                    <CardTitle className="text-slate-600">
                      {notification.title}
                    </CardTitle>
                    <CardDescription>{notification.message}</CardDescription>
                  </div>
                  <div>
                    <Badge
                      className={`h-[12px] w-[12px] rounded-full ${
                        notification.type === 'balance'
                          ? 'bg-red-300'
                          : 'bg-blue-300'
                      } p-0`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-[10px] m-0">
                  <div className="flex items-center justify-between mb-[10px]">
                    <div className="flex gap-[5px] text-slate-600 font-[500]">
                      <Avatar className="h-[30px] w-[30px]">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {/* Assuming you want to display the sender's name or similar info */}
                      Sender Name
                    </div>
                    <div>
                      <p className="text-[14px] text-slate-600">
                        {notification.notiInsertedAt}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-100 rounded-md p-[5px] text-slate-600">
                    <p className="text-[14px]">{notification.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-slate-600">
              No notifications available
            </p>
          )}
        </div>
        <div className="bg-white h-[50px] border-t shadow border-neutral-200  w-full flex justify-center items-center">
          <Button
            variant={'outline'}
            className="underline bg-transparent border-none shadow-none text-slate-600"
          >
            See All Notifications
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default NotificationSheet;
