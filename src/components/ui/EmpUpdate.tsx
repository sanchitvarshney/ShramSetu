import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { inputStyle } from '@/style/CustomStyles';
import {
  Calendar,
  CalendarIcon,
  LocateIcon,
  Navigation,
  Map,
  Trash2,
  PlusCircle,
  GraduationCap,
  Percent,
  Building,
  CalendarDays,
} from 'lucide-react';
import { AiOutlineUser } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { LiaClipboardListSolid } from 'react-icons/lia';
import { PiCreditCard, PiHouseLine } from 'react-icons/pi';
import { LuUsers2 } from 'react-icons/lu';
import IconButton from '@/components/ui/IconButton';

export default function EmpUpdate() {
  return (
    <div className="overflow-y-auto">
      <div className="p-[10px]">
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px] overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empFirstName}
                  // onChange={(e) => setEmpFirstName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
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
                  // value={empMiddleName}
                  // onChange={(e) => setEmpMiddleName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
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
                  // value={empLastName}
                  // onChange={(e) => setEmpLastName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Last Name
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  type="email"
                  required
                  className={inputStyle}
                  // value={empEmail}
                  // onChange={(e) => setEmpEmail(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <CiMail className="h-[18px] w-[18px]" />
                    Enter employee's E-mail
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  type="number"
                  required
                  className={inputStyle}
                  // value={empMobile}
                  // onChange={(e) => setEmpMobile(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <BsTelephone className="h-[18px] w-[18px]" />
                    Phone
                  </span>
                </Label>
              </div>

              <div>
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Gender
                  </span>
                </Label>
                <Select
                // onValueChange={(value) => setGender(value)}
                >
                  <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="floating-label gap-[10px]">
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
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {/* {empDOB ? format(empDOB, 'PPP') : 'Pick a date'} */}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      // selected={empDOB}
                      // onSelect={setEmpDOB}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* New Fields */}

              <div className="floating-label-group">
                <Select
                // onValueChange={(value) => setMaritalStatus(value)}
                >
                  <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">Single</SelectItem>
                    <SelectItem value="M">Married</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LuUsers2 className="h-[18px] w-[18px]" />
                    Marital Status
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empBloodGroup}
                  // onChange={(e) => setEmpBloodGroup(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Blood Group
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Select
                // onValueChange={(value) => setDesignation(value)}
                >
                  <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Developer</SelectItem>
                    <SelectItem value="pm">Project Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Designation
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Select
                // onValueChange={(value) => setDepartment(value)}
                >
                  <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Department
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empAdhaar}
                  // onChange={(e) => setEmpAdhaar(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <PiCreditCard className="h-[18px] w-[18px]" />
                    Aadhar Card Number
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empPan}
                  // onChange={(e) => setEmpPan(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <PiCreditCard className="h-[18px] w-[18px]" />
                    PAN Number
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empMark}
                  // onChange={(e) => setEmpMark(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Identification Mark
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empHobbies}
                  // onChange={(e) => setEmpHobbies(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Hobbies
                  </span>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0 mt-4">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px] overflow-x-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex flex-col gap-y-2 lg:pr-2 border-b pb-4 lg:border-b-0 lg:pb-0 lg:border-r">
                <div>
                  <p className="text-lg font-semibold text-muted-foreground">
                    Permanent Address
                  </p>
                </div>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        Pin Code
                      </span>
                    </Label>
                  </div>

                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        Area/Post Office
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        State
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <LocateIcon className="h-[18px] w-[18px]" />
                        City
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        District
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <PiHouseLine className="h-[18px] w-[18px]" />
                        House No.
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-2 2xl:flex-row justify-between">
                  <p className="text-lg font-semibold text-muted-foreground">
                    Corresponding Address
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      // checked={isChecked}
                      // onChange={(e) => setIsChecked(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none"
                    >
                      Same as permanent address
                    </label>
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        Pin Code
                      </span>
                    </Label>
                  </div>

                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        Area/Post Office
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Select
                    // onValueChange={(value) => setDepartment(value)}
                    >
                      <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">
                          Information Technology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Map className="h-[18px] w-[18px]" />
                        State
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <LocateIcon className="h-[18px] w-[18px]" />
                        City
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <Navigation className="h-[18px] w-[18px]" />
                        District
                      </span>
                    </Label>
                  </div>
                  <div className="floating-label-group">
                    <Input
                      required
                      className={inputStyle}
                      // value={empAdhaar}
                      // onChange={(e) => setEmpAdhaar(e.target.value)}
                    />
                    <Label className="floating-label gap-[10px]">
                      <span className="flex items-center gap-[10px]">
                        <PiHouseLine className="h-[18px] w-[18px]" />
                        House No.
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Family Info
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px]  overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empFirstName}
                  // onChange={(e) => setEmpFirstName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Father Name
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empMiddleName}
                  // onChange={(e) => setEmpMiddleName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Mother Name
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empLastName}
                  // onChange={(e) => setEmpLastName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Spouse Name
                  </span>
                </Label>
                <p className="text-zinc-400 text-sm">
                  Leave blank if not married
                </p>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empLastName}
                  // onChange={(e) => setEmpLastName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Children Count
                  </span>
                </Label>
                <p className="text-zinc-400 text-sm">
                  Leave blank if not married
                </p>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empLastName}
                  // onChange={(e) => setEmpLastName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Children Count
                  </span>
                </Label>
                <p className="text-zinc-400 text-sm">
                  Leave blank if not married
                </p>
              </div>
            </div>{' '}
            <div className="grid grid-cols-8 flex">
              <div className="flex col-span-7 flex-col gap-y-2 2xl:flex-row justify-between">
                <p className="text-lg font-semibold text-muted-foreground">
                  Children Information
                </p>{' '}
              </div>
              <div className="col-span-1">
                <IconButton
                  //   onClick={() =>
                  //     childrenForm.append(initialValues.childInfo)
                  //   }
                  icon={<PlusCircle />}
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2"> */}
            {/* {childrenForm?.fields?.map((item, index) => ( */}
            <div
            // key={item.id}
            // className={`grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-2 pb-3 my-2  ${
            // //   index < educationForm?.fields.length - 1
            // //     ? "border-b"
            // //     : "border-none"
            // }`}
            >
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empLastName}
                  // onChange={(e) => setEmpLastName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Spouse Name
                  </span>
                </Label>
                <p className="text-zinc-400 text-sm">
                  Leave blank if not married
                </p>
              </div>
              <div>
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <AiOutlineUser className="h-[18px] w-[18px]" />
                    Gender
                  </span>
                </Label>
                <Select
                // onValueChange={(value) => setGender(value)}
                >
                  <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="floating-label gap-[10px]">
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
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {/* {empDOB ? format(empDOB, 'PPP') : 'Pick a date'} */}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      // selected={empDOB}
                      // onSelect={setEmpDOB}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* {educationForm.fields.length > 1 && ( */}
              <div className="row-span-3 flex justify-center">
                <IconButton
                  // onClick={() => childrenForm.remove(index)}
                  icon={<Trash2 size={18} />}
                  hoverBackground="hover:bg-red-100"
                  hoverColor="hover:text-red-400"
                  color="text-red-400"
                />
              </div>
              {/* )} */}
            </div>
            {/* ))} */}
            {/* </div> */}
          </CardContent>
        </Card>
        <div className="flex gap-4">
          <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0 mt-4 w-1/2">
            <CardHeader className="border-b p-0 px-[20px] h-[120px] gap-0 flex justify-center">
              <CardTitle className="text-[20px] font-[650] text-slate-600 display-flex">
                Education Details
                <div className="float-right">
                  <IconButton
                    //   onClick={() =>
                    //     childrenForm.append(initialValues.childInfo)
                    //   }
                    icon={<PlusCircle />}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-[10px] overflow-x-auto">
              <div className="">
                <div className="">
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
                    <div className="floating-label-group">
                      <Select
                      // onValueChange={(value) => setDepartment(value)}
                      >
                        <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">
                            Information Technology
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <GraduationCap className="h-[18px] w-[18px]" />
                          Degree
                        </span>
                      </Label>
                    </div>

                    <div className="floating-label-group">
                      <Select
                      // onValueChange={(value) => setDepartment(value)}
                      >
                        <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">
                            Information Technology
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <GraduationCap className="h-[18px] w-[18px]" />
                          Subject
                        </span>
                      </Label>
                    </div>

                    <div className="floating-label-group">
                      <Input
                        required
                        className={inputStyle}
                        // value={empAdhaar}
                        // onChange={(e) => setEmpAdhaar(e.target.value)}
                      />
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <Percent className="h-[18px] w-[18px]" />
                          Grade
                        </span>
                      </Label>
                    </div>
                    <div className="floating-label-group">
                      <Select
                      // onValueChange={(value) => setDepartment(value)}
                      >
                        <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">
                            Information Technology
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <Building className="h-[18px] w-[18px]" />
                          University
                        </span>
                      </Label>
                    </div>
                    <div className="floating-label-group">
                      <Input
                        required
                        className={inputStyle}
                        // value={empAdhaar}
                        // onChange={(e) => setEmpAdhaar(e.target.value)}
                      />
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <CalendarDays className="h-[18px] w-[18px]" />
                          Starting Year
                        </span>
                      </Label>
                    </div>
                    <div className="floating-label-group">
                      <Input
                        required
                        className={inputStyle}
                        // value={empAdhaar}
                        // onChange={(e) => setEmpAdhaar(e.target.value)}
                      />
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <CalendarDays className="h-[18px] w-[18px]" />
                          Passing Year
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row-span-3 flex justify-center">
                <IconButton
                  // onClick={() => educationForm.remove(index)}
                  icon={<Trash2 size={18} />}
                  hoverBackground="hover:bg-red-100"
                  hoverColor="hover:text-red-400"
                  color="text-red-400"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0 mt-4 w-1/2">
            <CardHeader className="border-b p-0 px-[20px] h-[120px] gap-0 flex justify-center">
              <CardTitle className="text-[20px] font-[650] text-slate-600 display-flex">
                Employement Details
                <div className="float-right">
                  <IconButton
                    //   onClick={() =>
                    //     childrenForm.append(initialValues.childInfo)
                    //   }
                    icon={<PlusCircle />}
                  />
                </div>
              </CardTitle>
              <div className="text-[14px] font-[650] text-slate-600 display-flex">
                <p>Working Company Details</p>
              </div>
            </CardHeader>
            <CardContent className="py-[10px] overflow-x-auto">
              <div className="">
                <div className="">
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2">
                    <div className="floating-label-group">
                      <Select
                      // onValueChange={(value) => setDepartment(value)}
                      >
                        <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">
                            Information Technology
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          {/* <GraduationCap className="h-[18px] w-[18px]" /> */}
                          Company
                        </span>
                      </Label>
                    </div>

                    <div className="floating-label-group">
                      <Select
                      // onValueChange={(value) => setDepartment(value)}
                      >
                        <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">
                            Information Technology
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          {/* <GraduationCap className="h-[18px] w-[18px]" /> */}
                          Company Branch
                        </span>
                      </Label>
                    </div>

                    <div className="floating-label-group">
                      <Select
                      // onValueChange={(value) => setDepartment(value)}
                      >
                        <SelectTrigger className={`${inputStyle} focus:ring-0`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">
                            Information Technology
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <Building className="h-[18px] w-[18px]" />
                          Designation
                        </span>
                      </Label>
                    </div>
                    <div>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <AiOutlineUser className="h-[18px] w-[18px]" />
                          Date Of Joining
                        </span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              `${inputStyle} w-full justify-start hover:bg-transparent`,
                            )}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {/* {empDOB ? format(empDOB, 'PPP') : 'Pick a date'} */}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            // selected={empDOB}
                            // onSelect={setEmpDOB}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="floating-label gap-[10px]">
                        <span className="flex items-center gap-[10px]">
                          <AiOutlineUser className="h-[18px] w-[18px]" />
                          Date Of Leaving
                        </span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              `${inputStyle} w-full justify-start hover:bg-transparent`,
                            )}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {/* {empDOB ? format(empDOB, 'PPP') : 'Pick a date'} */}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            // selected={empDOB}
                            // onSelect={setEmpDOB}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row-span-3 flex justify-center">
                <IconButton
                  // onClick={() => educationForm.remove(index)}
                  icon={<Trash2 size={18} />}
                  hoverBackground="hover:bg-red-100"
                  hoverColor="hover:text-red-400"
                  color="text-red-400"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="rounded-lg max-h-[calc(100vh-210px)] overflow-hidden p-0 w-1/2">
          <CardHeader className="border-b p-0 px-[20px] h-[70px] gap-0 flex justify-center">
            <CardTitle className="text-[20px] font-[650] text-slate-600">
              Benifits Details
            </CardTitle>
          </CardHeader>
          <CardContent className="py-[10px] overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-1 gap-2">
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empFirstName}
                  // onChange={(e) => setEmpFirstName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Bank Name
                  </span>
                </Label>
              </div>

              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empMiddleName}
                  // onChange={(e) => setEmpMiddleName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    Account Number
                  </span>
                </Label>
              </div>
              <div className="floating-label-group">
                <Input
                  required
                  className={inputStyle}
                  // value={empMiddleName}
                  // onChange={(e) => setEmpMiddleName(e.target.value)}
                />
                <Label className="floating-label gap-[10px]">
                  <span className="flex items-center gap-[10px]">
                    <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                    IFSC Code
                  </span>
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="floating-label-group">
                  <Input
                    required
                    className={inputStyle}
                    // value={empMiddleName}
                    // onChange={(e) => setEmpMiddleName(e.target.value)}
                  />
                  <Label className="floating-label gap-[10px]">
                    <span className="flex items-center gap-[10px]">
                      <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                      ESI
                    </span>
                  </Label>
                </div>
                <div className="floating-label-group">
                  <Input
                    required
                    className={inputStyle}
                    // value={empMiddleName}
                    // onChange={(e) => setEmpMiddleName(e.target.value)}
                  />
                  <Label className="floating-label gap-[10px]">
                    <span className="flex items-center gap-[10px]">
                      <LiaClipboardListSolid className="h-[18px] w-[18px]" />
                      UAN
                    </span>
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="p-4">
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </div>
  );
}
