import React, { useEffect, useState } from 'react';

import {
  Card,
  CardContent,

  CardHeader,

} from '@/components/ui/card';
import { Search, SearchIcon,  } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MultipleSelect } from '../components/ui/Multiselecter';
import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  advancedFilter,
  // fetchCompanies,
  // fetchSearchCompanies,
  fetchTopSearchCompanies,
  // genderSearch,
  // presentDistrict,
  // presentIndustry,
  // presentState,
  SearchCompany,
} from '@/features/homePage/homePageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import Loading from '@/components/reusable/Loading';
// import { SelectOptionType } from '@/types/general';
// import { Industry } from '@/features/admin/adminPageSlice';

// interface RowData {
//   id: number;
//   filter: string;
//   companies: string[];
// }

// interface Company {
//   companyID: string;
//   name: string;
// }

const FormSchema = z.object({
  companies: z.array(z.string()).min(1, 'Please select at least one company.'),
});

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [companiesArray, setCompaniesArray] = useState<string[]>([]);
  const {
    // searchCompanies,
    loading,
    // gender,
    // districtSearch,
    // stateSearch,
    // industrySearch,
    topSearchCompanies,
  } = useSelector((state: RootState) => state.homePage);

  // const [company, setCompany] = useState<Company[]>([]);
  // const [states, setStates] = useState<SelectOptionType[]>([]);
  // const [districts, setDistricts] = useState<SelectOptionType[]>([]);
  // const [industries, setIndustries] = useState<Industry[]>([]);
  // const [genders, setGenders] = useState<SelectOptionType[]>([]);
  // const [adFilter, setAdFilter] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companies: [],
    },
  });

  // const [rows, setRows] = useState<RowData[]>([
  //   { id: Date.now(), filter: '', companies: [] },
  // ]);

  // const isValidFilter = (filter: string): filter is any => {
  //   return ['company', 'state', 'district', 'industry', 'gender'].includes(
  //     filter,
  //   );
  // };

  // const handleAddRow = () => {
  //   setRows([...rows, { id: Date.now(), filter: '', companies: [] }]);
  // };

  // const handleRemoveRow = (id: number) => {
  //   setRows(rows.filter((row) => row.id !== id));
  // };

  // const handleFilterChange = (id: number, value: string) => {
  //   setRows(
  //     rows.map((row) =>
  //       row.id === id ? { ...row, filter: value, companies: [] } : row,
  //     ),
  //   );
  // };

  // const handleCompanyChange = (id: number, filter: string, value: string[]) => {
  //   // Update the rows state
  //   const updatedRows = rows.map((row) =>
  //     row.id === id ? { ...row, companies: value } : row,
  //   );
  //   setRows(updatedRows);

  //   switch (filter) {
  //     case 'company':
  //       // Update the companies state
  //       setCompany(
  //         searchCompanies.filter((company: Company) =>
  //           value.includes(company.companyID),
  //         ),
  //       );
  //       break;
  //     case 'state':
  //       // Update the states state
  //       setStates(
  //         stateSearch.filter((state: SelectOptionType) =>
  //           value.includes(state.value),
  //         ),
  //       );
  //       break;
  //     case 'district':
  //       // Update the districts state
  //       setDistricts(
  //         districtSearch.filter((district: SelectOptionType) =>
  //           value.includes(district.value),
  //         ),
  //       );
  //       break;
  //     case 'industry':
  //       // Update the industries state
  //       setIndustries(
  //         industrySearch.filter((industry: Industry) =>
  //           value.includes(industry.industryID),
  //         ),
  //       );
  //       break;
  //     case 'gender':
  //       // Update the genders state
  //       setGenders(
  //         gender.filter((gender: SelectOptionType) =>
  //           value.includes(gender.value),
  //         ),
  //       );
  //       break;
  //   }
  // };

  const onSubmit = async () => {
    // const payload2 = {
    //   company: company.map((c) => c.companyID),
    //   district: districts.map((d) => d.value),
    //   gender: genders.map((g) => g.value),
    //   industry: industries.map((i) => i.industryID),
    //   state: states.map((s) => s.value),
    // };
    const payload1 = {
      company: companiesArray,
    };

    const payload: any = {
      ...payload1,
      excludePreviousCompany: false,
      excludePreviousIndustry: false,
      limit: 100,
    };

    try {
      const response = await dispatch(advancedFilter(payload)).unwrap();
      if (response.success) {
        navigate('/employee-list' );
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => {
    dispatch(fetchTopSearchCompanies());
  }, [dispatch]);

  const handleSubmitClick = async () => {
    try {
      const isValid = await form.trigger();

      if (isValid) {
        await form.handleSubmit(onSubmit)();
      }
    } catch (error) {
      console.error('Error during form submission', error);
    }
  };

  // useEffect(() => {
  //   if (adFilter) {
  //     dispatch(fetchSearchCompanies());
  //     dispatch(fetchCompanies());
  //     dispatch(presentIndustry());
  //     dispatch(presentDistrict());
  //     dispatch(presentState());
  //     dispatch(genderSearch());
  //   }
  // }, [adFilter]);

  return (
    <div className="w-full h-full">
      {loading && <Loading />}
      {/* <Tabs defaultValue="filter"> */}
      {/* <div className="flex items-center justify-center">
          <TabsList className="h-[50px] ml-[10px] gap-[20px] bg-white shadow-sm shadow-stone-300 mt-[10px] px-[10px] rounded-full">
            <TabsTrigger
              value="filter"
              className={tabTriggerStyle}
              onClick={() => setAdFilter(false)}
            >
              Filter
            </TabsTrigger>
            <TabsTrigger
              value="advanceFilter"
              className={tabTriggerStyle}
              onClick={() => setAdFilter(true)}
            >
              Advance filter
            </TabsTrigger>
          </TabsList>
        </div> */}
      {/* <TabsContent value="filter" className="m-0 h-[calc(100vh-130px)]"> */}
      <div className="flex items-center justify-center w-full h-full">
        <Card className="flex flex-col overflow-hidden rounded-lg   min-w-[600px] bg-transparent border-none shadow-none">
          <CardHeader className="flex items-center justify-center p-0">
            <img src="main-logo.svg" alt="" className="w-[400px]" />
          </CardHeader>
          <CardContent className="bg-transparent mt-[30px]">
            <Form {...form}>
              <div className="w-full flex flex-col gap-[20px] items-center justify-center">
                <div className="min-w-[300px] rounded ">
                  <FormField
                    control={form.control}
                    name="companies"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center ">
                        <FormControl className="w-auto">
                          <MultipleSelect
                            options={topSearchCompanies?.map(
                              (company: SearchCompany) => ({
                                value: company.companyID,
                                label: company.name,
                              }),
                            )}
                            onValueChange={(selected) => {
                              field.onChange(selected);
                              setCompaniesArray(selected);
                            }}
                            value={field.value} // Provide the value prop
                            placeholder="Select a company..."
                            variant="secondary"
                            maxCount={3}
                            className="min-w-[600px]  rounded-full h-[50px] bg-white border border-neutral-300 shadow hover:bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="flex items-center justify-center gap-[10px] flex-wrap flex-row pt-[20px] max-w-[60%]">
                          {topSearchCompanies
                            ?.filter(
                              (item: SearchCompany) =>
                                !field.value.includes(item.companyID),
                            )
                            .map((list: SearchCompany) => (
                              <Badge
                                onClick={() => {
                                  const updatedCompanies = [
                                    ...field.value,
                                    list.companyID,
                                  ];
                                  setCompaniesArray(updatedCompanies);
                                  form.setValue('companies', updatedCompanies);
                                }}
                                key={list.name}
                                className="hover:bg-white bg-white border-gray-200 shadow  max-w-max justify-between rounded-full text-slate-600 px-[18px] py-[5px] flex items-center gap-[10px] text-[15px] cursor-pointer"
                              >
                                <span className="flex items-center gap-[5px]">
                                  <Search className="w-4 h-4" /> {list.name}
                                </span>
                                <Search className="min-h-[15px] min-w-[15px] max-h-[15px] max-w-[15px]" />
                              </Badge>
                            ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  className="flex rounded-full gap-[10px] bg-teal-500 hover:bg-teal-400 text-white shadow-sm shadow-stone-500 mt-[20px] py-[20px] px-[20px]"
                  onClick={handleSubmitClick}
                >
                  <SearchIcon className="w-[20px] h-[20px]" />
                  Search
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
      {/* </TabsContent> */}
      {/* <TabsContent
          value="advanceFilter"
          className="m-0 h-[calc(100vh-130px)] overflow-y-auto "
        >
          <div className="flex items-center justify-center w-full mt-[20px]">
            <Card className="min-w-[80%] rounded-lg shadow-sm shadow-stone-300 overflow-hidden h-[calc(100vh-170px)]">
              <CardHeader className="p-0 h-[70px] bg-neutral-50 px-[10px] flex justify-between items-center flex-row text-slate-600 border-b border-neutral-200">
                <div>
                  <CardTitle className="text-[18px]">Advanced Filter</CardTitle>
                  <CardDescription className="text-slate-500">
                    Here you can add multiple filters to search for your desired
                    results.
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddRow}
                  className="max-w-max flex gap-[10px] items-center bg-white text-slate-600 hover:bg-white shadow-sm shadow-stone-400"
                >
                  <Plus /> Add Filter
                </Button>
              </CardHeader>
              <CardContent className="py-[30px] h-[calc(100vh-300px)] overflow-y-auto ">
                <ul className="flex flex-col gap-[20px] ">
                  {rows.map((row, index) => (
                    <li
                      key={row.id}
                      className="border rounded-lg py-[20px] px-[20px] flex items-center justify-between bg-neutral-100"
                    >
                      <div className="flex items-center gap-[20px]">
                        <span>{index + 1}</span>
                        <div className="flex items-center gap-[20px]">
                          <div>
                            <Select
                              value={row.filter}
                              onValueChange={(value) => {
                                handleFilterChange(row.id, value);
                              }}
                            >
                              <SelectTrigger className="w-[180px] shadow-none placeholder: py-[20px] bg-white">
                                <SelectValue placeholder="Select Filter" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="company">
                                  Company Wise
                                </SelectItem>
                                <SelectItem value="state">
                                  State Wise
                                </SelectItem>
                                <SelectItem value="district">
                                  District Wise
                                </SelectItem>
                                <SelectItem value="industry">
                                  Industry Wise
                                </SelectItem>
                                <SelectItem value="gender">
                                  Gender Wise
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <MultipleSelect
                              options={
                                isValidFilter(row.filter)
                                  ? row.filter === 'company'
                                    ? searchCompanies?.map(
                                        (company: Company) => ({
                                          value: company.companyID,
                                          label: company.name,
                                        }),
                                      )
                                    : row.filter === 'state'
                                    ? stateSearch?.map(
                                        (state: SelectOptionType) => ({
                                          value: state.value,
                                          label: state.text,
                                        }),
                                      )
                                    : row.filter === 'district'
                                    ? districtSearch?.map(
                                        (district: SelectOptionType) => ({
                                          value: district.value,
                                          label: district.text,
                                        }),
                                      )
                                    : row.filter === 'industry'
                                    ? industrySearch?.map(
                                        (industry: Industry) => ({
                                          value: industry.industryID,
                                          label: industry.name,
                                        }),
                                      )
                                    : row.filter === 'gender'
                                    ? gender?.map(
                                        (gender: SelectOptionType) => ({
                                          value: gender.value,
                                          label: gender.text,
                                        }),
                                      )
                                    : []
                                  : []
                              }
                              onValueChange={(value) => {
                                handleCompanyChange(row.id, row.filter, value);
                              }}
                              value={row.companies}
                              placeholder="Select an option..."
                              variant="secondary"
                              maxCount={3}
                              className="w-auto bg-white shadow-none hover:bg-white min-w-[600px]"
                              disabled={row.filter === ''}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={() => handleRemoveRow(row.id)}
                          variant="destructive"
                          className="shadow-stone-500"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="h-[60px] bg-neutral-50 shadow-sm border-t border-neutral-200">
                <Button
                  type="button"
                  className="flex gap-[10px] bg-teal-500 hover:bg-teal-400 text-white shadow-sm shadow-stone-500 mt-[20px] py-[20px] px-[20px]"
                  onClick={onSubmit}
                  disabled={rows.length <= 0}
                >
                  <SearchIcon className="w-[20px] h-[20px]" />
                  Search
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent> */}
      {/* </Tabs> */}
    </div>
  );
};

export default HomePage;
