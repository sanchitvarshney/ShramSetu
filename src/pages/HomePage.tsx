import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tabTriggerStyle } from '@/style/CustomStyles';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Search, SearchIcon, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { advancedFilter, fetchSearchCompanies, SearchCompany } from '@/features/homePage/homePageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';

const companyOptions = {
  light: [
    { value: 'Company1', label: 'light1' },
    { value: 'Company2', label: 'light2' },
  ],
  dark: [
    { value: 'Company3', label: 'dark3' },
    { value: 'Company4', label: 'dark4' },
  ],
  system: [
    { value: 'Company5', label: 'system1' },
    { value: 'Company6', label: 'system2' },
  ],
  empty: [],
};

type FilterKeys = keyof typeof companyOptions;

interface RowData {
  id: number;
  filter: string;
  companies: string[];
}

const FormSchema = z.object({
  companies: z.array(z.string()).min(1, 'Please select at least one company.'),
});

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [companiesArray , setCompaniesArray] = useState([]);
  const { searchCompanies } = useSelector((state: RootState) => state.homePage);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companies: [],
    },
  });

  const [rows, setRows] = useState<RowData[]>([
    { id: Date.now(), filter: '', companies: [] },
  ]);

  const isValidFilter = (filter: string): filter is FilterKeys => {
    return ['light', 'dark', 'system'].includes(filter);
  };

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), filter: '', companies: [] }]);
  };

  const handleRemoveRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleChange = (id: number, name: string, value: any) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [name]: value } : row)));
  };

  const handleFilterChange = (id: number, value: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, filter: value, companies: [] } : row)));
  };

  const handleCompanyChange = (id: number, selectedCompanies: string[]) => {
    handleChange(id, 'companies', selectedCompanies);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data.companies);
    navigate('/employee-list');
    const payload = {
      company: companiesArray,
      excludePreviousCompany: false, // Adjust as needed
      excludePreviousIndustry: false, // Adjust as needed
      limit: 100, // Adjust as needed
    };

    try {
      await dispatch(advancedFilter(payload)).unwrap();
      console.log('Company added successfully');
    } catch (err) {
      console.error('Failed to add company:', err);
    }
  };

  useEffect(() => {
    dispatch(fetchSearchCompanies());
  }, [dispatch]);


  return (
    <>
      <Tabs defaultValue="filter">
        <div className="flex items-center justify-center">
          <TabsList className="h-[50px] ml-[10px] gap-[20px] bg-white shadow-sm shadow-stone-300 mt-[10px] px-[10px] rounded-full">
            <TabsTrigger value="filter" className={tabTriggerStyle}>
              Filter
            </TabsTrigger>
            <TabsTrigger value="advanceFilter" className={tabTriggerStyle}>
              Advance filter
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="filter" className="m-0 h-[calc(100vh-130px)]">
          <div className="flex items-center justify-center w-full h-full">
            <Card className="flex flex-col overflow-hidden rounded-lg max-w-max min-w-[600px] bg-transparent border-none shadow-none">
              <CardHeader className="flex items-center justify-center p-0">
                <img src="main-logo.svg" alt="" className="w-[400px]" />
              </CardHeader>
              <CardContent className="bg-transparent mt-[30px]">
                <Form {...form}>
                  <form
                    // onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-[20px] items-center justify-center"
                  >
                    <div className="min-w-[300px] rounded">
                      <FormField
                        control={form.control}
                        name="companies"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <MultipleSelect
                                options={searchCompanies?.map(
                                  (company: SearchCompany) => ({
                                    value: company.companyID,
                                    label: company.name,
                                  }),
                                )}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                                placeholder="Select a company..."
                                variant="secondary"
                                maxCount={3}
                                className="min-w-[600px] rounded-full h-[50px] bg-white border border-neutral-300 shadow hover:bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                            <div className="flex items-center justify-center gap-[10px] flex-wrap flex-row pt-[20px] max-w-[550px]">
                              {searchCompanies
                                ?.filter(
                                  (item: SearchCompany) =>
                                    !field.value.includes(item.companyID),
                                )
                                .map((list: SearchCompany) => (
                                  <Badge
                                    onClick={() =>{
                                      setCompaniesArray(field.value)
                                      console.log(...field.value,"val")
                                      form.setValue('companies', [
                                        ...field.value,
                                        list.companyID,
                                      ])}
                                    }
                                    key={list.name}
                                    className="hover:bg-white bg-white border-gray-200 shadow min-w-[calc((100%/3)-10px)] justify-between rounded-full text-slate-600 px-[18px] py-[5px] flex items-center gap-[10px] text-[15px] cursor-pointer"
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
                      type="submit"
                      className="flex rounded-full gap-[10px] bg-teal-500 hover:bg-teal-400 text-white shadow-sm shadow-stone-500 mt-[20px] py-[20px] px-[20px]"
                    onClick={onSubmit}
                    >
                      <SearchIcon className="w-[20px] h-[20px]" />
                      Search
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent
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
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="empty">Empty</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <MultipleSelect
                              options={
                                isValidFilter(row.filter)
                                  ? companyOptions[row.filter]
                                  : []
                              }
                              onValueChange={(value) => {
                                handleCompanyChange(row.id, value);
                              }}
                              defaultValue={row.companies}
                              placeholder="Select a company..."
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
                <Link to={'/employee-list'}>
                  <Button
                    type="submit"
                    className="flex gap-[10px] bg-teal-500 hover:bg-teal-400 text-white shadow-sm shadow-stone-500 mt-[20px] py-[20px] px-[20px]"
                    disabled={rows.length <= 0}
                  >
                    <SearchIcon className="w-[20px] h-[20px]" />
                    Search
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default HomePage;
