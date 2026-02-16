import React from 'react';
import { NavLink } from 'react-router-dom';
import { BsBuildingUp } from 'react-icons/bs';
import { GrUserWorker } from 'react-icons/gr';
import { FaUserGroup } from 'react-icons/fa6';
import { TbLayoutGridFilled } from 'react-icons/tb';
import { IoLibrary } from 'react-icons/io5';
import {
  ADMIN_SIDEBAR_ORDER,
  CLIENT_SIDEBAR_ORDER,
  APP_ROUTES,
} from '@/config/appRoutes';
import { getLoggedInUserType } from '@/lib/routeAccess';
import type { RouteAccess } from '@/config/appRoutes';

interface Props {
  children: React.ReactNode;
}

const SIDEBAR_ICONS: Record<string, React.ReactNode> = {
  COMPANY_LIST: <BsBuildingUp className="h-[20px] w-[20px]" />,
  CLIENT_USER: <FaUserGroup className="h-[20px] w-[20px]" />,
  WORKERS: <GrUserWorker className="h-[20px] w-[20px]" />,
  ACTIVITY_LOG: <TbLayoutGridFilled className="h-[20px] w-[20px]" />,
  MASTER: <IoLibrary className="h-[20px] w-[20px]" />,
};

function canAccess(access: RouteAccess, isAdmin: boolean): boolean {
  if (access === 'both') return true;
  if (access === 'admin') return isAdmin;
  if (access === 'client') return !isAdmin;
  return false;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  const userType = getLoggedInUserType();
  const isAdmin = userType === 'admin';
  const sidebarOrder = isAdmin ? ADMIN_SIDEBAR_ORDER : CLIENT_SIDEBAR_ORDER;

  return (
    <div className="h-[calc(100vh-70px)] w-[calc(100vw-34px)] grid grid-cols-[300px_1fr]">
      <div className="w-full border p-[10px] ">
        <nav className="w-full flex flex-col gap-[5px]">
          {sidebarOrder.map((key) => {
            const route = APP_ROUTES[key];
            if (!route?.inAdminSidebar || !canAccess(route.access, isAdmin))
              return null;
            const icon = SIDEBAR_ICONS[key];
            return (
              <NavLink
                key={key}
                to={route.path}
                className={({ isActive }) =>
                  `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                    isActive ? 'bg-teal-500 text-white' : ''
                  }`
                }
              >
                <div className="h-[20px] w-[20px]">{icon}</div>
                {route.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout;
