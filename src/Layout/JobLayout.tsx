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
    <div className="h-[calc(100vh-70px)] w-[calc(100vw-34px)] grid grid-cols-[300px_1fr]">
      <div className="w-full border p-[10px] ">
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
      <div className=" overflow-hidden flex flex-col">{children}</div>
    </div>
  );
};

export default JobLayout;
