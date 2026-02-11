import { BellRing, Home, Mail, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { NavLink, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CustomTooltip from '@/components/reusable/CustomTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { NavlinkStyle } from '@/style/CustomStyles';
import NotificationSheet from '@/components/shared/NotificationSheet';
import { logout } from '@/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCompanies } from '@/features/homePage/homePageSlice';
import { IoAddOutline, IoSettingsOutline } from 'react-icons/io5';
import { FiLogOut } from 'react-icons/fi';
import { AlertDialogPopup } from '@/components/shared/AlertDialogPopup';

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { companies } = useSelector((state: RootState) => state.homePage);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  let user = localStorage.getItem('loggedInUser') ?? 'null';
  const data = JSON.parse(user);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (companies?.length > 0) {
      

      const defaultCompany = companies[0]?.companyID;
      setSelectedCompany(defaultCompany);
    }
  }, [companies]);

  useEffect(() => {
    // Persist selected company to local storage
    localStorage.setItem('companySelect', selectedCompany);
  }, [selectedCompany]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast({ description: 'Logged Out Successfully' });
  };

  return (
    <>
      <AlertDialogPopup
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleLogout}
        title="Log Out"
        description="Are you sure you want to Logout."
      />
      <NotificationSheet uiState={{ notification, setNotification }} />
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Sidebar open={open} onOpenChange={setOpen}>
          <SidebarContent
            side={'left'}
            className=" bg-transparent border-none shadow-none p-[20px]"
          >
            <div className=" relative  rounded-xl bg-teal-800 border-0 min-w-[300px] shadow shadow-stone-400 p-[20px] h-[calc(100vh-40px)]  ">
              <SidebarHeader className="bg-blue-100 rounded-lg p-[20px] ">
                <img src="/main-logo.svg" alt="" className="w-[100%]" />
              </SidebarHeader>
              <aside className="flex-col mt-[20px] rounded-lg">
                <nav className="grid grid-cols-3 gap-[10px] p-[10px]">
                  <NavLink
                    to="/"
                    className={NavlinkStyle}
                    onClick={() => setOpen(false)}
                  >
                    <Home className="w-5 h-5" />
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/invitation/mail"
                    className={NavlinkStyle}
                    onClick={() => setOpen(false)}
                  >
                    <Mail className="w-5 h-5" />
                    Invitation
                  </NavLink>
                  <NavLink
                    to="/company/list"
                    className={NavlinkStyle}
                    onClick={() => setOpen(false)}
                  >
                    <MdOutlineAdminPanelSettings className="w-6 h-6" />
                    Admin
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={NavlinkStyle}
                    onClick={() => setOpen(false)}
                  >
                    <User className="w-6 h-6" />
                    Profile
                  </NavLink>
                  <NavLink
                    to="/company/list"
                    className={NavlinkStyle}
                    onClick={() => setOpen(false)}
                  >
                    <IoSettingsOutline className="w-6 h-6" />
                    Setting
                  </NavLink>
                  <NavLink
                    to="/job/job-create"
                    className={NavlinkStyle}
                    onClick={() => setOpen(false)}
                  >
                    <IoAddOutline className="w-6 h-6" />
                    Add Job
                  </NavLink>
                </nav>
              </aside>
              <SidebarFooter className="absolute bottom-[20px] left-[20px] right-[20px] bg-white/20 rounded-lg p-[10px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild ref={buttonRef}>
                    <div className="flex items-center justify-between w-full cursor-pointer">
                      <div className="flex items-center gap-[5px]">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Separator orientation="vertical" className="" />
                        <div className="flex flex-col font-[500] gap-0 text-white">
                          {data?.firstName} {data?.lastName}
                          <span className="text-[13px] font-[400]">
                            Software Developer
                          </span>
                        </div>
                      </div>
                      <div>
                        <FaChevronDown className="h-[20px] w-[20px] text-white/70 mr-[10px]" />
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={`shadow-sm  shadow-stone-500 mb-[10px] bg-white/20 text-white border-white/20 w-[274px]`}
                    side="top"
                    align="center"
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/20" />

                    <DropdownMenuItem
                      onClick={() => navigate('/profile')}
                      className="cursor-pointer"
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarFooter>
            </div>
          </SidebarContent>
        </Sidebar>
        <div className="border-t-[10px] border-[#04b0a8] h-[70px] flex shadow shadow-neutral-300 fixed top-0 left-0 right-0 z-[30] bg-white">
          <div className="bg-[#04b0a8] w-[300px] h-[50px] flex justify-end">
            <img
              src="/lightlogov2.svg"
              alt="Brand logo"
              className="w-[170px]"
            />
          </div>
          <header className="z-30 flex justify-between bg-[#fff] min-h-[50px] w-full pr-[20px]">
            <div className="flex">
              <img src="/navcurve.jpg" alt="" className="h-[50px]" />
              <img src="/subtext.svg" alt="Brand logo" className="w-[200px]" />
            </div>
            <div className="flex items-center gap-[20px]">
              <div>
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose Company" />
                  </SelectTrigger>
                  <SelectContent className="shadow-sm shadow-stone-500">
                    {companies?.map((company: any) => (
                      <SelectItem
                        value={company?.companyID}
                        key={company?.companyID}
                      >
                        {company?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="download">
                <DownloadIndecator />
              </div> */}

              <CustomTooltip message="Notification" side="bottom">
                <div
                  className="relative flex items-center justify-center bg-indigo-50 cursor-pointer notification max-w-max p-[5px] rounded-md"
                  onClick={() => setNotification(true)}
                >
                  <BellRing className="h-[25px] w-[25px] text-slate-600" />
                  {/* <Badge className="bg-teal-600 hover:bg-teal-600 h-[15px] w-[15px] rounded-full p-0 flex justify-center items-center absolute top-[-1px] right-[2px]">
                    0
                  </Badge> */}
                </div>
              </CustomTooltip>
              <CustomTooltip message="Notification" side="bottom">
                <div
                  className="relative flex items-center justify-center bg-indigo-50 cursor-pointer notification max-w-max p-[5px] rounded-md"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <FiLogOut className="h-[25px] w-[25px] text-slate-600" />
                </div>
              </CustomTooltip>
            </div>
          </header>
        </div>
        <div
          className="sidebar z-[20] fixed h-[100vh] bg-white w-[20px] left-0 top-0 bottom-0 flex justify-center items-center shadow shadow-neutral-300 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <CustomTooltip message="Menubar" side="right">
            <Button
              onClick={() => setOpen(true)}
              className="p-0 min-h-[50px] min-w-[50px] rounded-full bg-white text-slate-600 shadow shadow-neutral-300 hover:bg-ehite flex justify-end"
            >
              <FaChevronRight className="mr-[5px]" />
            </Button>
          </CustomTooltip>
        </div>

        <div className="flex flex-col max-w-[calc(100vw-20px)] ml-[20px]">
          <main className="grid items-start flex-1 gap-4 sm:py-0 md:gap-8 bg-white min-h-[calc(100vh-70px)] mt-[70px]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
