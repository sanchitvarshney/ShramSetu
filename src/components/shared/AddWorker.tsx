import { useEffect, useRef, useState } from 'react';
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
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Popover } from '@/components/ui/popover';
import { useDispatch, useSelector } from 'react-redux';
import {
  addWorker,
  Department,
  Designation,
  fetchDepartments,
  fetchDesignations,
} from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import { DatePicker, DatePickerProps } from 'antd';

const AddWorker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { department, designation } = useSelector(
    (state: RootState) => state.adminPage,
  );
  const [empFirstName, setEmpFirstName] = useState('');
  const [empMiddleName, setEmpMiddleName] = useState('');
  const [empLastName, setEmpLastName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDOB, setEmpDOB] = useState<any>(undefined);
  const [empDepartment, setEmpDepartment] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empGender, setEmpGender] = useState('');
  const [empPhoto, setEmpPhoto] = useState<any>(null);
  const [empPhotoUrl, setEmpPhotoUrl] = useState<any>(null);

  const onChange: DatePickerProps['onChange'] = (dateString) => {
    if (dateString) {
      setEmpDOB(dateString.toDate());
    } else {
      setEmpDOB(undefined);
    }
  };

  const handleSubmit = () => {
    if (
      empFirstName &&
      empLastName &&
      empEmail &&
      empMobile &&
      empPassword &&
      empDOB &&
      empDepartment &&
      empDesignation
    ) {
      const formData = new FormData();
    formData.append('empFirstName', empFirstName);
    formData.append('empMiddleName', empMiddleName);
    formData.append('empLastName', empLastName);
    formData.append('empEmail', empEmail);
    formData.append('empDOB', format(empDOB, 'dd-MM-yyyy'));
    formData.append('empDepartment', empDepartment);
    formData.append('empDesignation', empDesignation);
    formData.append('empMobile', empMobile);
    formData.append('empPassword', empPassword);
    formData.append('empGender', empGender);

    // Only append the photo if it is not null
    console.log(empPhoto)
    if (empPhoto instanceof File) {
      formData.append('empPhoto', empPhoto);  // Append the file object, not the URL
    }
      dispatch(
        addWorker(
        //   {
        //   empFirstName,
        //   empMiddleName,
        //   empLastName,
        //   empEmail,
        //   empDOB: format(empDOB, 'dd-MM-yyyy'),
        //   empDepartment,
        //   empDesignation,
        //   empMobile,
        //   empPassword,
        //   empGender,
        //   empPhoto,
        // }
        formData
      ),
      ).then((response: any) => {
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
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill all the mandatory fields.',
      });
    }
  };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setEmpPhoto(file);
      const imageUrl = URL.createObjectURL(file);  // Generate URL for the selected image file
      setEmpPhotoUrl(imageUrl);  // Store the URL in state for immediate display
    }
  };
  

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [dispatch]);

  return (
    <div className="overflow-y-auto ">
      <div className="p-[10px]">
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center ">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Add Worker
            </CardTitle>
            <CardDescription>
              Here you can add workers in the database which will be shown in
              the result
            </CardDescription>
          </CardHeader>
          <CardContent className="py-[10px] h-[calc(100vh-330px)] overflow-x-auto">
            <div className="flex gap-[20px]">
              {/* Left Section: Profile Photo Upload */}
              <div className="w-1/3 bg-gray-50 p-[20px] rounded-xl shadow-lg flex flex-col items-center">
                <div className="relative w-[150px] h-[150px] mb-4 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={empPhotoUrl || './ProfileImage.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {/* Optional overlay to indicate upload */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                    <label
                      htmlFor="profile-upload"
                      className="cursor-pointer text-white text-lg font-bold"
                    >
                      <span>Change</span>
                    </label>
                  </div>
                </div>

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button className="bg-teal-500 text-white rounded-md px-4 py-2 mt-2 hover:bg-teal-600 transition">
                  Upload Photo
                </button>
              </div>
            
            <div className="w-2/3 grid grid-cols-3 gap-[20px]">
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empFirstName}
                  onChange={(e) => setEmpFirstName(e.target.value)}
                />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    First Name
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empMiddleName}
                  onChange={(e) => setEmpMiddleName(e.target.value)}
                />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Middle Name
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  value={empLastName}
                  onChange={(e) => setEmpLastName(e.target.value)}
                />
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
                <Select onValueChange={setEmpGender}>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
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
                  <DatePicker
                    onChange={onChange}
                    className={`${inputStyle} input2  focus:ring-0 w-[100%]`}
                    format={'YYYY/MM/DD'}
                  />
                </Popover>
              </div>
              <div className="floating-label-group">
                <Input
                  type="number"
                  required
                  className={inputStyle}
                  value={empMobile}
                  onChange={(e) => setEmpMobile(e.target.value)}
                />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <BsTelephone className="h-[18px] w-[18px]" />
                    Phone
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  type="email"
                  required
                  className={inputStyle}
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                />
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
                <Select onValueChange={setEmpDepartment}>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {department?.map((department: Department) => (
                      <SelectItem
                        value={department?.value}
                        key={department?.value}
                      >
                        {department?.text}
                      </SelectItem>
                    ))}
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
                <Select onValueChange={setEmpDesignation}>
                  <SelectTrigger
                    className={`${inputStyle} input2  focus:ring-0`}
                    ref={buttonRef}
                  >
                    <SelectValue className="" placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    {designation?.map((designation: Designation) => (
                      <SelectItem
                        value={designation?.value}
                        key={designation?.value}
                      >
                        {designation?.text}
                      </SelectItem>
                    ))}
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
                <Input
                  required
                  className={inputStyle}
                  value={empPassword}
                  onChange={(e) => setEmpPassword(e.target.value)}
                />
                <Label className="floating-label  gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <IoIosLock className="h-[18px] w-[18px]" />
                    Confirm Password
                  </span>
                </Label>
              </div>
            </div></div>
          </CardContent>
          <CardFooter className="p-0 px-[20px] flex justify-end items-center border-t h-[50px]">
            <Button
              className="bg-teal-500 hover:bg-teal-600 shadow-neutral-400 flex items-center gap-[10px]"
              onClick={handleSubmit}
            >
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
