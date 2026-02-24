import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoPersonOutline } from 'react-icons/io5';
import { IoLockClosedOutline } from 'react-icons/io5';

interface Props {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] h-full min-h-0 overflow-hidden flex-1">
      <div className="w-full border p-[10px] shrink-0">
        <nav className="w-full flex flex-col gap-[5px]">
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive ? 'bg-[#115e59] text-white' : ''
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <IoPersonOutline className="h-[20px] w-[20px]" />
            </div>
            Profile
          </NavLink>
          <NavLink
            to="/profile/set-password"
            className={({ isActive }) =>
              `px-[10px] py-[8px] text-slate-600 rounded-lg font-[500] flex items-center gap-[10px] ${
                isActive ? 'bg-[#115e59] text-white' : ''
              }`
            }
          >
            <div className="h-[20px] w-[20px]">
              <IoLockClosedOutline className="h-[20px] w-[20px]" />
            </div>
            Set App Password
          </NavLink>
        </nav>
      </div>
      <div className="min-h-0 overflow-y-auto p-[10px]">{children}</div>
    </div>
  );
};

export default ProfileLayout;
