import React from 'react';
import { NavLink } from 'react-router-dom';
import { BsBuildingUp } from 'react-icons/bs';
import { GrUserWorker } from 'react-icons/gr';
import { FaUserGroup } from "react-icons/fa6";
import { TbLayoutGridFilled } from 'react-icons/tb';
import { IoLibrary } from 'react-icons/io5';

interface Props {
  children: React.ReactNode;
}
const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-[calc(100vh-70px)] w-[calc(100vw-34px)] grid grid-cols-[300px_1fr]">
      <div className="w-full border p-[10px] ">
        <nav className="w-full flex flex-col gap-[5px]">
          <NavLink
            to="/company/list"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <BsBuildingUp />
            </div>
            Company
          </NavLink>
          <NavLink
            to="/client-user"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <FaUserGroup className="h-[20px] w-[20px]" />
            </div>
            Clients
          </NavLink>
          <NavLink
            to="/workers"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <GrUserWorker className="h-[20px] w-[20px]" />
            </div>
            Workers
          </NavLink>

          <NavLink
            to="/activity-log"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <TbLayoutGridFilled className="h-[20px] w-[20px]" />
            </div>
            Activity Log
          </NavLink>
          <NavLink
            to="/master"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <IoLibrary className="h-[20px] w-[20px]" />
            </div>
            Master
          </NavLink>
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AdminLayout;
