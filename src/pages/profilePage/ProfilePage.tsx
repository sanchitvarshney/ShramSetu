import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tabTriggerStyle } from '@/style/CustomStyles';
import Profile from '@/components/shared/Profile';
import SetAppPassword from '@/pages/profilePage/SetAppPassword';

const WorkersPage: React.FC = () => {
  return (
    <Tabs defaultValue="profile">
      <div className="h-[70px] flex items-center px-[10px] justify-center"  style={{ backgroundColor: '#f5f5f5' }}>
        <TabsList className="h-[50px] gap-[20px] bg-white shadow-sm shadow-stone-300 px-[10px] rounded-full" >
          <TabsTrigger value="profile" className={tabTriggerStyle}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="set-password" className={tabTriggerStyle}>
            Set App Password
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="profile" className="h-[calc(100vh-140px)] m-0">
        <Profile />
      </TabsContent>
      <TabsContent value="set-password" className="h-[calc(100vh-140px)] m-0">
        <SetAppPassword />
      </TabsContent>
    </Tabs>
  );
};

export default WorkersPage;
