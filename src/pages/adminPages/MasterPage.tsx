import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddDepartment from '@/components/master/AddDepartment';
import ListDepartments from '@/components/master/ListDepartments';
import AddDesignation from '@/components/master/AddDesignation';
import ListDesignations from '@/components/master/ListDesignations';
import { tabTriggerStyle } from '@/style/CustomStyles';
import { getLoggedInUserType } from '@/lib/routeAccess';

const MasterPage: React.FC = () => {
  const isAdmin = getLoggedInUserType() === 'admin';

  return (
    <Tabs defaultValue="department" className="w-full">
      <div className="h-[70px] flex items-center px-[10px]">
        <TabsList className="h-[50px] gap-[20px] bg-white shadow-sm shadow-stone-300 px-[10px] rounded-full">
          <TabsTrigger value="department" className={tabTriggerStyle}>
            Department
          </TabsTrigger>
          <TabsTrigger value="designation" className={tabTriggerStyle}>
            Designation
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="department" className="h-[calc(100vh-140px)] m-0 px-[10px]">
        <Tabs defaultValue={isAdmin ? 'add-department' : 'list-departments'} className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <TabsList className="h-[44px] gap-2 bg-white shadow-sm px-2 rounded-lg">
              {isAdmin && (
                <TabsTrigger value="add-department" className={tabTriggerStyle}>
                  Add Department
                </TabsTrigger>
              )}
              <TabsTrigger value="list-departments" className={tabTriggerStyle}>
                List Departments
              </TabsTrigger>
            </TabsList>
          </div>
          {isAdmin && (
            <TabsContent value="add-department" className="m-0">
              <AddDepartment />
            </TabsContent>
          )}
          <TabsContent value="list-departments" className="m-0">
            <ListDepartments />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="designation" className="h-[calc(100vh-140px)] m-0 px-[10px]">
        <Tabs defaultValue={isAdmin ? 'add-designation' : 'list-designations'} className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <TabsList className="h-[44px] gap-2 bg-white shadow-sm px-2 rounded-lg">
              {isAdmin && (
                <TabsTrigger value="add-designation" className={tabTriggerStyle}>
                  Add Designation
                </TabsTrigger>
              )}
              <TabsTrigger value="list-designations" className={tabTriggerStyle}>
                List Designations
              </TabsTrigger>
            </TabsList>
          </div>
          {isAdmin && (
            <TabsContent value="add-designation" className="m-0">
              <AddDesignation />
            </TabsContent>
          )}
          <TabsContent value="list-designations" className="m-0">
            <ListDesignations />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};

export default MasterPage;
