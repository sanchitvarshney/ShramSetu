import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData } from '@/table/EploayTableColumn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TbFilterSearch } from 'react-icons/tb';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MultipleSelect } from '@/components/ui/Multiselecter';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import WorkerDetails from '@/components/shared/WorkerDetails';

const options = [
  { value: 'Company1', label: 'light1' },
  { value: 'Company2', label: 'light2' },
];
const EmployeeData: React.FC = () => {
  const { advancedFilter } = useSelector((state: RootState) => state.homePage);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  const toggleShowDetails = (empId?: string) => {
    setSelectedEmpId(empId ?? null);
  };

  return (
    <div className="grid grid-cols-[350px_1fr]">
      <div className="h-[calc(100vh-70px)] overflow-hidden border-r">
        <div className="h-[50px] w-full bg-[#e0f2f1] flex items-center justify-between px-[10px]">
          <p className="flex gap-[5px] items-center font-[600]">
            <TbFilterSearch />
            Filters
          </p>
          <Badge className="bg-teal-700 rounded-full hover:bg-teal-600">
            100 Records
          </Badge>
        </div>
        <div className="h-[calc(100vh-270px)] overflow-y-auto px-[10px] bg-neutral-white">
          <Accordion type="multiple">
            <AccordionItem value="item-1" className="border-neutral-300">
              <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                Companies
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[10px]">
                <MultipleSelect
                  options={options}
                  onValueChange={(e) => console.log(e)}
                  variant={'secondary'}
                  className="w-full"
                  PannelClassName="min-w-[320px]"
                  maxCount={2}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-neutral-300">
              <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                Gender
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[10px]">
                <div className="flex gap-[10px] text-slate-600">
                  <Checkbox />
                  Male
                </div>
                <div className="flex gap-[10px] text-slate-600 items-center">
                  <Checkbox />
                  Female
                </div>

                <Separator className="bg-neutral-300" />
                <div className="flex gap-[10px] text-slate-700 font-[500] items-center">
                  <Checkbox />
                  Select All
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-neutral-300">
              <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                Location
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[10px]">
                <MultipleSelect
                  options={options}
                  onValueChange={(e) => console.log(e)}
                  variant={'secondary'}
                  className="w-full"
                  PannelClassName="min-w-[320px]"
                  maxCount={2}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-neutral-300">
              <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                Industry
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[10px]">
                <MultipleSelect
                  options={options}
                  onValueChange={(e) => console.log(e)}
                  variant={'secondary'}
                  className="w-full"
                  PannelClassName="min-w-[320px]"
                  maxCount={2}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border-neutral-300">
              <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                District
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[10px]">
                <MultipleSelect
                  options={options}
                  onValueChange={(e) => console.log(e)}
                  variant={'secondary'}
                  className="w-full"
                  PannelClassName="min-w-[320px]"
                  maxCount={2}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className="border-neutral-300">
              <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                State
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[10px]">
                <MultipleSelect
                  options={options}
                  onValueChange={(e) => console.log(e)}
                  variant={'secondary'}
                  className="w-full"
                  PannelClassName="min-w-[320px]"
                  maxCount={2}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="bg-[#e0f2f1] h-[150px] w-full">
          <div className="h-[100px]">
            <div className="h-[50px] flex gap-[10px] items-center p-[10px]">
              <Checkbox id="1" />
              <Label htmlFor="1" className="text-[13px] font-[400]">
                Exclude workers who are not working anymore in your interested
                industry but has a past experience.
              </Label>
            </div>
            <Separator />
            <div className="h-[50px] flex gap-[10px] items-center p-[10px]">
              <Checkbox id="2" />
              <Label htmlFor="2" className="text-[13px] font-[400]">
                Exclude workers who are not working anymore in your interested
                company but has a past experience.
              </Label>
            </div>
          </div>
          <div className="h-[50px] flex items-center gap-[10px] p-[10px] ">
            <Input
              type="number"
              placeholder="Data limit"
              className="bg-white"
            />
            <Button className="bg-teal-700 shadow-sm hover:bg-teal-600 shadow-neutral-500">
              Fetch
            </Button>
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          className={`ag-theme-quartz h-[calc(100vh-70px)] ${
            selectedEmpId ? 'w-1/2' : 'w-full'
          }`}
        >
          <AgGridReact
            suppressCellFocus={false}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            rowData={advancedFilter?.result || []}
            pagination={true}
            context={{ toggleShowDetails }}
          />
        </div>
        {selectedEmpId && (
          <div className="absolute top-0 right-0 w-1/2 h-[calc(100vh-70px)] bg-white border-l border-gray-200">
            <WorkerDetails
              empId={selectedEmpId} 
              toggleDetails={toggleShowDetails} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeData;
