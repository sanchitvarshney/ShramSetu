import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@/table/EploayTableColumn';
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
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import WorkerDetails from '@/components/shared/WorkerDetails';
import Loading from '@/components/reusable/Loading';

const EmployeeData: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { advancedFilter } = useSelector((state: RootState) => state.homePage);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [excludePreviousCompany, setExcludePreviousCompany] =
    useState<boolean>(false);
  const [excludePreviousIndustry, setExcludePreviousIndustry] =
    useState<boolean>(false);

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  const toggleShowDetails = (empId?: string) => {
    setSelectedEmpId(empId ?? null);
  };

  const companyOptions =
    advancedFilter?.company?.map((c: any) => ({
      value: c.value,
      label: c.text,
    })) || [];

  const locationOptions =
    advancedFilter?.location?.map((l: any) => ({
      value: l.value,
      label: l.text,
    })) || [];

  const genderOptions =
    advancedFilter?.gender?.map((g: any) => ({
      value: g.value,
      label: g.text,
    })) || [];

  const industryOptions =
    advancedFilter?.industry?.map((s: any) => ({
      value: s.value,
      label: s.text,
    })) || [];

  const districtOptions =
    advancedFilter?.district?.map((d: any) => ({
      value: d.value,
      label: d.text,
    })) || [];

  const stateOptions =
    advancedFilter?.state?.map((s: any) => ({
      value: s.value,
      label: s.text,
    })) || [];

    const onSubmit = async () => {
      console.log("yse")
      const payload:any = {
        // company: companyOptions,
        excludePreviousCompany: excludePreviousCompany,
        excludePreviousIndustry: excludePreviousIndustry, 
        limit: 100,
      };
  
      try {
        await dispatch(advancedFilter(payload));
        console.log('Company added successfully');
      } catch (err) {
        console.error('Failed to add company:', err);
      }
    };

  console.log(advancedFilter);
  return (
    <div className="grid grid-cols-[350px_1fr]">
      {!advancedFilter?.result?.length && <Loading />}
      <div className="h-[calc(100vh-70px)] overflow-hidden border-r">
        <div className="h-[50px] w-full bg-[#e0f2f1] flex items-center justify-between px-[10px]">
          <p className="flex gap-[5px] items-center font-[600]">
            <TbFilterSearch />
            Filters
          </p>
          <Badge className="bg-teal-700 rounded-full hover:bg-teal-600">
            {advancedFilter?.result?.length} Records
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
                  options={companyOptions}
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
                <MultipleSelect
                  options={genderOptions}
                  onValueChange={(e) => console.log(e)}
                  variant={'secondary'}
                  className="w-full"
                  PannelClassName="min-w-[320px]"
                  maxCount={2}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-neutral-300">
              <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                Location
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[10px]">
                <MultipleSelect
                  options={locationOptions}
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
                  options={industryOptions}
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
                  options={districtOptions}
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
                  options={stateOptions}
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
        {!advancedFilter?.result?.length && <Loading />}
        <div className="bg-[#e0f2f1] h-[150px] w-full">
          <div className="h-[100px]">
            <div className="h-[50px] flex gap-[10px] items-center p-[10px]">
              <input
                type="checkbox"
                checked={excludePreviousIndustry}
                onChange={(e) => setExcludePreviousIndustry(e.target.checked)}
                className="form-checkbox"
              />
              <Label htmlFor="1" className="text-[13px] font-[400]">
                Exclude workers who are not working anymore in your interested
                industry but has a past experience.
              </Label>
            </div>
            <Separator />
            <div className="h-[50px] flex gap-[10px] items-center p-[10px]">
              <input
                type="checkbox"
                checked={excludePreviousCompany}
                onChange={(e) => setExcludePreviousCompany(e.target.checked)}
                className="form-checkbox"
              />
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
            <Button className="bg-teal-700 shadow-sm hover:bg-teal-600 shadow-neutral-500" onClick={()=>onSubmit()}>
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
