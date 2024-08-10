import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { inputStyle } from '@/style/CustomStyles';
import { Building2, Mail, Phone } from 'lucide-react';
import { CgWebsite } from 'react-icons/cg';
import { FaCreditCard, FaSave } from 'react-icons/fa';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/model';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addCompany } from '@/features/admin/adminPageSlice';
import { fetchSearchCompanies } from '@/features/homePage/homePageSlice';
import { AiFillLike } from 'react-icons/ai';
import { Separator } from '../ui/separator';
import { FaRegCheckCircle } from 'react-icons/fa';
import { toast } from '@/components/ui/use-toast';

const AddCompany: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [company, setCompany] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [panNo, setPanNo] = useState<string>('');
  const [website, setWebsite] = useState<string>('');

  const { searchCompanies } = useSelector((state: RootState) => state.homePage);

  useEffect(() => {
    dispatch(fetchSearchCompanies());
  }, [dispatch]);

  const handleAddCompany = () => {
    if (!company || !email || !mobile || !panNo || !website) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'All fields are required.',
      });
      return;
    }

    const companyData = { email, mobile, name: company, panNo, website };
    dispatch(addCompany(companyData)).then((response: any) => {
      if (response.payload.success) {
        toast({ title: 'Success!!', description: response.payload.message });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.payload.message,
        });
      }
    });
  };

  const isCompanyUnique = (input: string) => {
    return !searchCompanies.some(
      (company: any) => company.name.toLowerCase() === input.toLowerCase(),
    );
  };

  return (
    <>
      <Modal open={modelOpen} onOpenChange={setModelOpen}>
        <ModalContent className="p-0 overflow-hidden min-w-[50vw]">
          <ModalHeader className="bg-[url(/addcompany.png)] h-[150px] flex justify-end pb-[10px] pl-[20px] bg-cover">
            <ModalTitle className="text-slate-600 text-[20px] font-[700]">
              Add Company
            </ModalTitle>
            <ModalDescription className="text-yellow-500 flex gap-[5px] text-[13px]">
              An existing company name or a copied name <br /> should not be
              added.
            </ModalDescription>
          </ModalHeader>
          <div className="modal-body px-[20px]">
            <div className="floating-label-group">
              <Input
                required
                className={inputStyle}
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <Label className="floating-label gap-[10px]">
                <span className="flex items-center gap-[10px]">
                  <Building2 className="h-[18px] w-[18px]" /> Enter Company Name
                </span>
              </Label>
            </div>

            <div className="mt-[20px]">
              <ModalTitle className="text-slate-600 text-[16px]">
                Existing Company List
              </ModalTitle>
              <ul className="list-disc text-[14px] mt-[10px] max-h-[200px] min-h-[200px] overflow-y-auto p-[10px] rounded-lg bg-blue-50 overflow-hidden flex flex-col gap-[5px]">
                {input === '' ? (
                  searchCompanies?.map((data: any) => (
                    <React.Fragment key={data.companyID}>
                      <li className="font-[500] hover:bg-slate-200 rounded-md px-[10px] py-[5px]">
                        {data.name}
                        <p className="text-[13px] font-[400]">
                          Lorem ipsum dolor sit amet...
                        </p>
                      </li>
                      <Separator className="bg-white" />
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    {searchCompanies.filter((data: any) =>
                      data.name.toLowerCase().includes(input.toLowerCase()),
                    ).length > 0 ? (
                      searchCompanies
                        .filter((data: any) =>
                          data.name.toLowerCase().includes(input.toLowerCase()),
                        )
                        .map((data: any) => (
                          <React.Fragment key={data.companyID}>
                            <li className="font-[500] hover:bg-slate-200 rounded-md px-[10px] py-[5px]">
                              {data.name}
                              <p className="text-[13px] font-[400]">
                                Lorem ipsum dolor sit amet...
                              </p>
                            </li>
                            <Separator className="bg-white" />
                          </React.Fragment>
                        ))
                    ) : (
                      <div className="flex items-center justify-center w-full h-[180px] gap-[20px] flex-col">
                        <FaRegCheckCircle className="h-[50px] w-[50px] text-green-600" />
                        <p className="text-green-600 flex items-center gap-[5px]">
                          <AiFillLike /> Nice! Your company name is looking good
                          and unique.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
          <ModalFooter className="h-[50px] justify-center items-center px-[20px] shadow border-t">
            <Button variant="outline" onClick={() => setModelOpen(false)}>
              Close
            </Button>
            <Button
              disabled={!isCompanyUnique(input)}
              onClick={() => {
                if (isCompanyUnique(input)) {
                  setCompany(input);
                  setModelOpen(false);
                }
              }}
              className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400"
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Add Company
            </CardTitle>
            <CardDescription>
              Here you can add companies to our company master
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="floating-label-group">
              <Button
                onClick={() => setModelOpen(true)}
                className="justify-start w-full bg-transparent rounded-none shadow-none text-[#9e9e9e] border-b border-neutral-400 hover:bg-transparent"
              >
                {company === null || company === '' ? (
                  <span className="flex items-center gap-[10px]">
                    <Building2 className="h-[18px] w-[18px]" /> Enter Company
                    Name
                  </span>
                ) : (
                  company
                )}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-[50px] mt-[50px]">
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <Mail className="h-[18px] w-[18px]" /> Email
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  onChange={(e) => setMobile(e.target.value)}
                  value={mobile}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <Phone className="h-[18px] w-[18px]" /> Phone Number
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  onChange={(e) => setPanNo(e.target.value)}
                  value={panNo}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <FaCreditCard className="h-[18px] w-[18px]" /> Pan No.
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  onChange={(e) => setWebsite(e.target.value)}
                  value={website}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <CgWebsite className="h-[18px] w-[18px]" /> Company Website
                  </span>
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end px-6 py-4 border-t">
            <Button
              onClick={handleAddCompany}
              className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400 flex items-center gap-[10px]"
            >
              <FaSave className="h-[20px] w-[20px]" />
              Add
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AddCompany;
