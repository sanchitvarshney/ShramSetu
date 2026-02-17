import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddWorker from '@/components/shared/AddWorker';
import { tabTriggerStyle } from '@/style/CustomStyles';
import ListWorker from '@/components/shared/ListWorker';
import { FileUploadDialog } from '@/components/shared/FileUploadDialog';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';
const WorkersPage: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

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
          className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400 flex items-center gap-[10px]"
          onClick={() => navigate('/employee-list')}
        >
       <FilterListAltIcon />
          Filter
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
