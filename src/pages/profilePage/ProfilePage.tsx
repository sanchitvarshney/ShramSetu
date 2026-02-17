import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tabTriggerStyle } from '@/style/CustomStyles';
import Profile from '@/components/shared/Profile';
import SetAppPassword from '@/pages/profilePage/SetAppPassword';

const WorkersPage: React.FC = () => {
  return (
    <Tabs defaultValue="profile" className="flex flex-col h-[calc(100vh-75px)]">
      <div className="shrink-0 flex items-center px-[10px] py-4">
        <TabsList className="h-[50px] gap-[20px] bg-white shadow-sm shadow-stone-300 px-[10px] rounded-full">
          <TabsTrigger value="profile" className={tabTriggerStyle}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="set-password" className={tabTriggerStyle}>
            Set App Password
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="profile" className="flex-1 min-h-0 overflow-y-auto m-0 data-[state=inactive]:hidden">
        <Profile />
      </TabsContent>
      <TabsContent value="set-password" className="flex-1 min-h-0 overflow-y-auto m-0 data-[state=inactive]:hidden">
        <SetAppPassword />
      </TabsContent>
    </Tabs>
  );
};

export default WorkersPage;
