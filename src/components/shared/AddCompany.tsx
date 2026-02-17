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
import { Building2, Mail, Phone, Tag } from 'lucide-react';
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
import { CircularProgress } from '@mui/material';
import { validateForm, addCompanySchema } from '@/lib/validations';

const AddCompany: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [company, setCompany] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [panNo, setPanNo] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [hsnList, setHsnList] = useState<string[]>(['']);
  const [sscList, setSscList] = useState<string[]>(['']);

  const { searchCompanies } = useSelector((state: RootState) => state.homePage);
  const { addcompanyLoading } = useSelector((state: RootState) => state.adminPage);

  useEffect(() => {
    dispatch(fetchSearchCompanies());
  }, [dispatch]);

  const handleAddCompany = () => {
    const hsnArray = hsnList
      .map((s) => s.trim().replace(/\s/g, ''))
      .filter(Boolean);
    const sscArray = sscList.map((s) => s.trim()).filter(Boolean);
    const validation = validateForm(addCompanySchema, {
      name: company ?? '',
      brandName: brandName.trim() || undefined,
      email,
      mobile,
      panNo,
      website,
      hsn: hsnArray.length ? hsnArray : undefined,
      ssc: sscArray.length ? sscArray : undefined,
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }

    const companyData = {
      email,
      mobile,
      name: company ?? '',
      panNo,
      website,
      ...(brandName.trim() && { brand: brandName.trim() }),
      ...(hsnArray.length > 0 && { hsn: hsnArray }),
      ...(sscArray.length > 0 && { ssc: sscArray }),
    };
    dispatch(addCompany(companyData)).then((response: any) => {
   
      if (response.payload.success) {
        setCompany('');
        setEmail('');
        setMobile('');
        setPanNo('');
        setWebsite('');
        setBrandName('');
        setHsnList(['']);
        setSscList(['']);
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
    const list = searchCompanies ?? [];
    return !list.some(
      (company: any) => company.name?.toLowerCase() === input.toLowerCase(),
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
                  (searchCompanies ?? []).map((data: any) => (
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
                    {(searchCompanies ?? []).filter((data: any) =>
                      data.name?.toLowerCase().includes(input.toLowerCase()),
                    ).length > 0 ? (
                      (searchCompanies ?? [])
                        .filter((data: any) =>
                          data.name?.toLowerCase().includes(input.toLowerCase()),
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
            <div className="grid grid-cols-2 gap-[20px] mt-[50px]">
         
              <div className="floating-label-group">
                <Input
                  className={inputStyle}
                  onChange={(e) => setBrandName(e.target.value)}
                  value={brandName}
                  placeholder="e.g. Company Brand"
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <Tag className="h-[18px] w-[18px]" /> Brand Name
                  </span>
                </Label>
              </div>
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
                  type="text"
                  inputMode="numeric"
                  maxLength={15}
                  required
                  className={inputStyle}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
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
                  className={`${inputStyle} uppercase`}
                  onChange={(e) => setPanNo(e.target.value.toUpperCase())}
                  value={panNo}
                  maxLength={10}
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
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FaCreditCard className="h-[18px] w-[18px]" /> HSN (multiple)
                </Label>
                {hsnList.map((val, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={8}
                      className={inputStyle}
                      value={val}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '');
                        if (v.length <= 8) {
                          const next = [...hsnList];
                          next[idx] = v;
                          setHsnList(next);
                        }
                      }}
                      placeholder="2, 4, 6 or 8 digits"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => {
                        if (hsnList.length > 1) {
                          setHsnList(hsnList.filter((_, i) => i !== idx));
                        }
                      }}
                      aria-label="Remove HSN"
                    >
                      −
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHsnList([...hsnList, ''])}
                >
                  + Add HSN
                </Button>
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FaCreditCard className="h-[18px] w-[18px]" /> SSC (multiple)
                </Label>
                {sscList.map((val, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      type="text"
                      maxLength={20}
                      className={inputStyle}
                      value={val}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^A-Za-z0-9/\-]/g, '');
                        if (v.length <= 20) {
                          const next = [...sscList];
                          next[idx] = v;
                          setSscList(next);
                        }
                      }}
                      placeholder="e.g. SSC/Q2210"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => {
                        if (sscList.length > 1) {
                          setSscList(sscList.filter((_, i) => i !== idx));
                        }
                      }}
                      aria-label="Remove SSC"
                    >
                      −
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSscList([...sscList, ''])}
                >
                  + Add SSC
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end px-6 py-4 border-t">
            <Button
              onClick={handleAddCompany}
              className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400 flex items-center gap-[10px]"
              disabled={addcompanyLoading}
            >
              {
                addcompanyLoading ? (
                  <CircularProgress size={20}  />
                ) :  <FaSave className="h-[20px] w-[20px]" />
              }
             
              Create 
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AddCompany;
