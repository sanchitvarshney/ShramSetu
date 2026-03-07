import React from 'react';
import { NavLink } from 'react-router-dom';
import { APP_ROUTES, Contractor_SIDEBAR_ORDER } from '@/config/appRoutes';
import { IoList, IoPersonAddOutline } from 'react-icons/io5';

interface Props {
  children: React.ReactNode;
}

const SIDEBAR_ICONS: Record<string, React.ReactNode> = {
  CONTRACTOR_LIST: <IoList className="h-[20px] w-[20px]" />,
  CONTRACTOR_CREATE: <IoPersonAddOutline className="h-[20px] w-[20px]" />,
};

const ContractorLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-[calc(100vh-70px)] w-[calc(100vw-20px)] grid grid-cols-[300px_1fr]">
      <div className="w-full border p-[10px] ">
        <nav className="w-full flex flex-col gap-[5px]">
          {Contractor_SIDEBAR_ORDER.map((key) => {
            const route = APP_ROUTES[key];
            if (!route?.inAdminSidebar) return null;
            const icon = SIDEBAR_ICONS[key];
            return (
              <NavLink
                key={key}
                to={route.path}
                className={({ isActive }) =>
                  `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                    isActive ? 'bg-[#115e59] text-white' : ''
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

export default ContractorLayout;
