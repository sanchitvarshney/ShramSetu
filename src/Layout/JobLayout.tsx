import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoAddOutline } from 'react-icons/io5';
import { FaList } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';

interface Props {
  children: React.ReactNode;
}
const JobLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] h-full min-h-0 overflow-hidden flex-1">
      <div className="w-full border p-[10px] shrink-0">
        <nav className="w-full flex flex-col gap-[5px]">
          <NavLink
            to="/job/job-create"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <IoAddOutline />
            </div>
            Add Job
          </NavLink>
          <NavLink
            to="/job/job-list"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <FaList className="h-[20px] w-[20px]" />
            </div>
            Job List
          </NavLink>
          <NavLink
            to="/job/job-applications"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive && 'bg-teal-500 text-white'
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <FaUserFriends className="h-[20px] w-[20px]" />
            </div>
            Job Applications
          </NavLink>
        </nav>
      </div>
      <div className="min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
};

export default JobLayout;
