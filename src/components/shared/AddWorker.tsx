import  { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { BiSolidLogInCircle } from 'react-icons/bi';
import { Input } from '../ui/input';
import { inputStyle } from '@/style/CustomStyles';
import { Label } from '../ui/label';
import { AiOutlineUser } from 'react-icons/ai';


import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { IoIosLock } from 'react-icons/io';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { FaFileExcel } from 'react-icons/fa6';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
const AddWorker = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  console.log(buttonRef.current?.innerText);
  const [date, setDate] = useState<Date>();
  return (
    <div className='overflow-y-auto '>
      <div className="p-[10px]">
        <div className="h-[50px] flex justify-end items-center">
          <Button className="text-[17px] shadow-neutral-400 flex items-center gap-[5px] bg-[#1d6f42] hover:bg-[##268f55">
            <FaFileExcel className="h-[20px] w-[20px]" /> Bulk Upload
          </Button>
        </div>
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0">
          <CardHeader className=' border-b p-0 px-[20px]  h-[70px] gap-0 flex justify-center '>
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Add Worker
            </CardTitle>
            <CardDescription>
              Here you can add workers in the database which will be shown in the result
            </CardDescription>
          </CardHeader>
          <CardContent className='py-[10px] h-[calc(100vh-330px)] overflow-x-auto'>
            <div className="grid grid-cols-3 gap-[20px]">
              <div className="floating-label-group">
                <Input required className={inputStyle} />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    First Name
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input required className={inputStyle} />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Middle Name
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input required className={inputStyle} />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Last Name
                  </span>
                </Label>
              </div>
              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Gender
                  </span>
                </Label>
                <Select>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Male</SelectItem>
                    <SelectItem value="dark">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Date Of Birth
                  </span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        `${inputStyle} w-full justify-start hover:bg-transparent`,
                        !date && 'text-[#9e9e9e]',
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="floating-label-group">
                <Input type='number' required className={inputStyle} />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <BsTelephone className="h-[18px] w-[18px]" />
                    Phone
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input type='email' required className={inputStyle} />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <CiMail className="h-[18px] w-[18px]" />
                    Email
                  </span>
                </Label>
              </div>
              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Department
                  </span>
                </Label>
                <Select>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Male</SelectItem>
                    <SelectItem value="dark">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Designation
                  </span>
                </Label>
                <Select>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Male</SelectItem>
                    <SelectItem value="dark">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="floating-label-group">
                <Input required className={inputStyle} />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <IoIosLock className="h-[18px] w-[18px]" />
                    Password
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input required className={inputStyle} />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <IoIosLock className="h-[18px] w-[18px]" />
                    Confirm Password
                  </span>
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-0 px-[20px] flex justify-end items-center border-t h-[50px] ">
            <Button className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400 flex items-center gap-[10px] ">
              <BiSolidLogInCircle className="h-[25px] w-[25px]" />
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AddWorker;
