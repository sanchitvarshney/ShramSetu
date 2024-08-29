import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@/table/EploayTableColumn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TbFilterSearch } from 'react-icons/tb';
import { Badge } from '@/components/ui/badge';
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
import { advancedFilter } from '@/features/homePage/homePageSlice';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

const EmployeeData: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { advancedFilter: filterData, loading } = useSelector(
    (state: RootState) => state.homePage,
  );

  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [excludePreviousCompany, setExcludePreviousCompany] =
    useState<boolean>(false);
  const [excludePreviousIndustry, setExcludePreviousIndustry] =
    useState<boolean>(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (filterData) {
      setSelectedCompanies(
        filterData?.company?.map((company: any) => company.value),
      );
      setSelectedLocations(
        filterData?.location?.map((location: any) => location.value),
      );
      setSelectedGenders(
        filterData?.gender?.map((gender: any) => gender.value),
      );
      setSelectedIndustries(
        filterData?.industry?.map((industry: any) => industry.value),
      );
      setSelectedDistricts(
        filterData?.district?.map((district: any) => district.value),
      );
      setSelectedStates(filterData?.state?.map((state: any) => state.value));
    }
  }, [filterData]);

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }),
    [],
  );

  const toggleShowDetails = (empId?: string) => {
    setSelectedEmpId(empId ?? null);
  };

  // Extract options from filterData
  const extractOptions = (data: any) =>
    data?.map((item: any) => ({
      value: item.value,
      label: item.text,
    })) || [];

  const companyOptions = extractOptions(filterData?.company);
  const locationOptions = extractOptions(filterData?.location);
  const genderOptions = extractOptions(filterData?.gender);
  const industryOptions = extractOptions(filterData?.industry);
  const districtOptions = extractOptions(filterData?.district);
  const stateOptions = extractOptions(filterData?.state);

  const payload: any = {
    company: selectedCompanies,
    location: selectedLocations,
    gender: selectedGenders,
    industry: selectedIndustries,
    district: selectedDistricts,
    state: selectedStates,
    excludePreviousCompany,
    excludePreviousIndustry,
    limit: 100,
  };
  const handleSubmit = () => {
    dispatch(advancedFilter(payload));
  };

  return (
    <>
      <Sidebar open={open} onOpenChange={setOpen}>
        <SidebarContent className='min-w-[50%] p-0'>
          <WorkerDetails
            empId={selectedEmpId!}
            toggleDetails={toggleShowDetails}
            setOpen={setOpen}
          />
        </SidebarContent>
      </Sidebar>

      {/* {selectedEmpId && (
          <div className="absolute top-0 right-0 w-1/2 h-[calc(100vh-70px)] bg-white border-l border-gray-200">
           
          </div>
        )} */}
      <div className="grid grid-cols-[350px_1fr]">
        {loading && <Loading />}
        <div className="h-[calc(100vh-70px)] overflow-hidden border-r">
          <div className="h-[50px] w-full bg-[#e0f2f1] flex items-center justify-between px-[10px]">
            <p className="flex gap-[5px] items-center font-[600]">
              <TbFilterSearch />
              Filters
            </p>
            <Badge className="bg-teal-700 rounded-full hover:bg-teal-600">
              {filterData?.result?.length} Records
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
                    value={selectedCompanies}
                    onValueChange={setSelectedCompanies}
                    variant={'secondary'}
                    className="w-full"
                    PannelClassName="min-w-[320px]"
                    maxCount={2}
                    handleSubmit={handleSubmit}
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
                    value={selectedGenders}
                    onValueChange={setSelectedGenders}
                    variant={'secondary'}
                    className="w-full"
                    PannelClassName="min-w-[320px]"
                    maxCount={2}
                    handleSubmit={handleSubmit}
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
                    value={selectedLocations}
                    onValueChange={setSelectedLocations}
                    variant={'secondary'}
                    className="w-full"
                    PannelClassName="min-w-[320px]"
                    maxCount={2}
                    handleSubmit={handleSubmit}
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
                    value={selectedIndustries}
                    onValueChange={setSelectedIndustries}
                    variant={'secondary'}
                    className="w-full"
                    PannelClassName="min-w-[320px]"
                    maxCount={2}
                    handleSubmit={handleSubmit}
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
                    value={selectedDistricts}
                    onValueChange={setSelectedDistricts}
                    variant={'secondary'}
                    className="w-full"
                    PannelClassName="min-w-[320px]"
                    maxCount={2}
                    handleSubmit={handleSubmit}
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
                    value={selectedStates}
                    onValueChange={setSelectedStates}
                    variant={'secondary'}
                    className="w-full"
                    PannelClassName="min-w-[320px]"
                    maxCount={2}
                    handleSubmit={handleSubmit}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {loading && <Loading />}
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
            <div className="h-[50px] flex items-center gap-[10px] p-[10px]">
              <Input
                type="number"
                placeholder="Data limit"
                className="bg-white"
              />
              <Button
                className="bg-teal-700 shadow-sm hover:bg-teal-600 shadow-neutral-500"
                onClick={handleSubmit}
              >
                Fetch
              </Button>
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            className={`ag-theme-quartz h-[calc(100vh-70px)]`}
          >
            <AgGridReact
              suppressCellFocus={true}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowData={filterData?.result || []}
              pagination={true}
              context={{ toggleShowDetails, setOpen }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeData;
