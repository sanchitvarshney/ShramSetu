import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AddWorker from '@/components/shared/AddWorker';
import { tabTriggerStyle } from '@/style/CustomStyles';
import { FaFileExcel } from 'react-icons/fa6';
import ListWorker from '@/components/shared/ListWorker';
import { FileUploadDialog } from '@/components/shared/FileUploadDialog';

const WorkersPage: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <Tabs defaultValue="add-worker">
      <div className="h-[70px] flex items-center px-[10px] justify-between">
        <TabsList className="h-[50px] gap-[20px] bg-white shadow-sm shadow-stone-300 px-[10px] rounded-full">
          <TabsTrigger value="add-worker" className={tabTriggerStyle}>
            Add Worker
          </TabsTrigger>
          <TabsTrigger value="list-worker" className={tabTriggerStyle}>
            List Worker
          </TabsTrigger>
        </TabsList>
        <Button
          className="text-[17px] shadow-neutral-400 flex items-center gap-[5px] bg-[#1d6f42] hover:bg-[#268f55]"
          onClick={() => setDialogOpen(true)}
        >
          <FaFileExcel className="h-[20px] w-[20px]" /> Bulk Upload
        </Button>
      </div>
      {isDialogOpen && (
        <FileUploadDialog onClose={() => setDialogOpen(false)} />
      )}
      <TabsContent value="add-worker" className="h-[calc(100vh-140px)] m-0">
        <AddWorker />
      </TabsContent>
      <TabsContent value="list-worker" className="h-[calc(100vh-140px)] m-0">
        <ListWorker />
      </TabsContent>
    </Tabs>
  );
};

export default WorkersPage;
