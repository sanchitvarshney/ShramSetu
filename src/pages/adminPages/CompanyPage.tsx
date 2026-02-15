import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddCompany from '@/components/shared/AddCompany';
import ListCompany from '@/components/shared/ListCompany';
import { tabTriggerStyle } from '@/style/CustomStyles';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CompanyInfoContent } from '@/components/ui/companyInfo';

const CompanyPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);


  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) setSelectedCompanyId(null);
  };

  return (
    <>
      <Tabs defaultValue="add-company" >
        <div className="h-[70px] flex items-center px-[10px]">
          <TabsList className="h-[50px] gap-[20px] bg-white shadow-sm shadow-stone-300 px-[10px] rounded-full">
            <TabsTrigger value="add-company" className={tabTriggerStyle}>
              Add company
            </TabsTrigger>
            <TabsTrigger value="list-company" className={tabTriggerStyle}>
              List Companies
            </TabsTrigger>
          </TabsList>
          {/* {activeTab === 'list-company' && (
            <div className="h-[50px] flex items-center justify-end flex-grow px-[10px]">
              <Button className="flex items-center gap-[5px] bg-teal-500 hover:bg-teal-600 shadow-neutral-400">
                <IoMdDownload className="h-[20px] w-[20px]" /> Download
              </Button>
            </div>
          )} */}
        </div>
        <TabsContent
          value="add-company"
          className="h-[calc(100vh-140px) m-0 px-[10px]"
        >
          <AddCompany />
        </TabsContent>
        <TabsContent value="list-company" className="h-[calc(100vh-140px) m-0">
          <ListCompany onCompanyClick={handleCompanyClick} />
        </TabsContent>
      </Tabs>

      <Sheet open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Company details</SheetTitle>
          </SheetHeader>
          {selectedCompanyId && (
            <CompanyInfoContent companyId={selectedCompanyId} embedded  />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CompanyPage;
