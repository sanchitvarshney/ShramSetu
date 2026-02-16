import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from '@/table/EploayTableColumn';
import { Button } from '@/components/ui/button';
import { TbFilterSearch } from 'react-icons/tb';
import { Badge } from '@/components/ui/badge';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MultipleSelect } from '@/components/ui/Multiselecter';
import { LocationSelect } from '@/components/ui/LocationSelect';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import WorkerDetails from '@/components/shared/WorkerDetails';
import Loading from '@/components/reusable/Loading';
import { advancedFilter } from '@/features/homePage/homePageSlice';
import { searchCompanies } from '@/features/admin/adminPageSlice';
import { getLoggedInUserType } from '@/lib/routeAccess';

const EmployeeData: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { advancedFilter: filterData, loading } =
    useSelector((state: RootState) => state.homePage);
  const { companies } = useSelector((state: RootState) => state.adminPage);

  const [selectedEmpId, setSelectedEmpId] = useState<any | null>(null);
  // const [excludePreviousCompany, setExcludePreviousCompany] =
  //   useState<boolean>(false);
  // const [excludePreviousIndustry, setExcludePreviousIndustry] =
  //   useState<boolean>(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  // const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const [open, setOpen] = useState<boolean>(false);


  useEffect(() => {
    const userType = getLoggedInUserType() ?? 'admin';
    dispatch(searchCompanies(userType));
  }, [dispatch]);

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }),
    [],
  );

  const toggleShowDetails = (empIdOrRow?: string | any) => {
    setSelectedEmpId(empIdOrRow ?? null);
  };

  // Extract options from filterData
  const extractOptions = (data: any) =>
    data?.map((item: any) => ({
      value: item.value || item.companyID,
      label: item.text || item.name
    })) || [];

  const companyOptions = extractOptions(companies);
  const districtOptions = extractOptions(filterData?.district);
  const stateOptions = extractOptions(filterData?.state);

  const payload: any = {
    company: selectedCompanies,
    location: selectedLocations,

    district: selectedDistricts,
    state: selectedStates,
  };
  const handleSubmit = () => {
    dispatch(advancedFilter(payload));
  };

  return (
    <>
      {/* <Sidebar open={open} onOpenChange={setOpen}>
        <SidebarContent className='min-w-[50%] p-0'> */}
          {selectedEmpId && (
            <WorkerDetails
              worker={selectedEmpId}
              toggleDetails={toggleShowDetails}
              setOpen={setOpen}
              open={open && !!selectedEmpId}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setSelectedEmpId(null);
                  setOpen(false);
                }
              }}
            />
          )}
        {/* </SidebarContent>
      </Sidebar> */}

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
              {(Array.isArray(filterData) ? filterData : filterData?.result ?? [])?.length} Records
            </Badge>
          </div>
          <div className="h-[calc(100vh-0px)] overflow-y-auto px-[10px] bg-neutral-white">
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
              <AccordionItem value="item-3" className="border-neutral-300">
                <AccordionTrigger className="text-slate-600 text-[17px] hover:no-underline">
                  Location
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-[10px]">
                  <LocationSelect
                    value={selectedLocations}
                    onChange={setSelectedLocations}
                    placeholder="Type to search locations..."
                    className="w-full"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="bg-teal-700 hover:bg-teal-600 text-white"
                    onClick={handleSubmit}
                  >
                    Apply
                  </Button>
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
          {/* <div className="bg-[#e0f2f1] h-[150px] w-full">
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
          </div> */}
        </div>
        <div className="relative">
          <div
            className={`ag-theme-quartz h-[calc(100vh-70px)]`}
          >
            <AgGridReact
              suppressCellFocus={true}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowData={Array.isArray(filterData) ? filterData : (filterData?.result ?? [])}
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
