
import UpdateCompany from '@/components/admin/companies/UpdateCompany';
import Loading from '@/components/reusable/Loading';
import AddClient from '@/components/shared/AddClient';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LabelInput } from '@/components/ui/EmpUpdate';
import IconButton from '@/components/ui/IconButton';
import {
  branchUpdate,
  companyUpdate,
  getCompanyBranchOptions,
  getCompanyInfo,
} from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { inputStyle } from '@/style/CustomStyles';
import { AppDispatch, RootState } from '@/store';
import {
  Building2,
  CalendarIcon,
  CreditCard,
  Edit,
  Ellipsis,
  Globe,
  Mail,
  Phone,
  PlusIcon,
  Tag,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UpdateBranchModal from '../admin/companies/UpdateBranchModal';

/** Parse API hsn/ssc (string like "[\"2456\",\"3566\"]" or array) and return display string. */
function formatHsnSsc(val: unknown): string {
  if (val == null) return '';
  if (Array.isArray(val)) return val.map(String).filter(Boolean).join(', ');
  if (typeof val === 'string') {
    const t = val.trim();
    if (!t) return '';
    try {
      const parsed = JSON.parse(t);
      return Array.isArray(parsed) ? parsed.map(String).filter(Boolean).join(', ') : t;
    } catch {
      return t;
    }
  }
  return String(val);
}

export interface CompanyInfoContentProps {
  companyId: string;
  /** When true, used inside drawer (slightly more compact). */
  embedded?: boolean;
}

/** Reusable company detail content. Use with companyId from route or from parent (e.g. drawer). */
export function CompanyInfoContent({ companyId, embedded,  }: CompanyInfoContentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { companyInfo: details, branches, loading } = useSelector(
    (state: RootState) => state.adminPage,
  );


  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [updatingBranch, _setUpdatingBranch] = useState<null>(null);
  const [showAddClientDialog, setShowAddClientDialog] = useState<boolean>(false);
  const [showUpdateComDialog, setShowUpdateComDialog] = useState<boolean>(false);
  const [updatingBranchStatusId, setUpdatingBranchStatusId] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    dispatch(getCompanyInfo(companyId));
    dispatch(getCompanyBranchOptions(companyId));
  }, [companyId, dispatch]);

  const handleActiveStatusChange = (value: string) => {
    const company = details?.[0];
    if (!company?.companyID) return;
    const activeStatus = value as 'A' | 'INA';
    dispatch(
      companyUpdate({
        companyID: company.companyID,
        name: company.name,
        email: company.email,
        mobile: company.mobile,
        panNo: company.panNo,
        website: company.website,
        activeStatus,
      }),
    ).then((res: any) => {
      if (res.payload !== undefined) {
        dispatch(getCompanyInfo(companyId));
        toast({
          title: 'Updated',
          description: `Company is now ${activeStatus === 'A' ? 'Active' : 'Inactive'}.`,
        });
      }
    });
  };

  const handleBranchActiveStatusChange = (branch: any, value: string) => {
    const companyID = details?.[0]?.companyID;
    if (!companyID || !branch?.branchID) return;
    const activeStatus = value as 'A' | 'INA';
    setUpdatingBranchStatusId(branch.branchID);
    const payload = {
      addressID: branch.branchID,
      companyID,
      name: branch.branchName,
      city: branch.city ?? '',
      email: branch.email ?? '',
      gst: branch.gst ?? '',
      mobile: (branch as any).mobile ?? '',
      pinCode: (branch as any).pinCode ?? '',
      state: (branch as any).state ?? '',
      industry: (branch as any).industry ?? '',
      subIndustry: (branch as any).subIndustry ?? '',
      activeStatus,
    };
    dispatch(branchUpdate(payload)).then((res: any) => {
      setUpdatingBranchStatusId(null);
      if (res.payload?.success !== false) {
        dispatch(getCompanyBranchOptions(companyId));
        toast({
          title: 'Updated',
          description: `Branch "${branch.branchName}" is now ${activeStatus === 'A' ? 'Active' : 'Inactive'}.`,
        });
      }
    });
  };

  const wrapperClass = embedded
    ? 'flex-1 bg-white flex flex-col gap-4 p-6'
    : 'flex-1 bg-white flex flex-col gap-6 border rounded-lg p-8';

  return (
    <div className={wrapperClass}>
      {loading && <Loading />}
      <AddClient
        branches={branches}
        show={showAddClientDialog}
        companyId={details[0]?.companyID ?? ''}
        hide={() => setShowAddClientDialog(false)}
      />
      <UpdateCompany
        branches={branches}
        show={showUpdateComDialog}
        hide={() => setShowUpdateComDialog(false)}
      />
      <UpdateBranchModal
        branches={branches}
        show={showAddBranchDialog}
        hide={() => setShowAddBranchDialog(false)}
        updatingBranch={updatingBranch}
      />
      <div className="flex justify-between items-center border-b-2 border-b-muted ">
        <div className="flex gap-2 items-center ml-[-10px]">
          <div className="flex gap-1 items-center">
            <Building2 />
            <p className="font-semibold text-xl">{details[0]?.name}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <DropDown
            setShowAddBranchDialog={setShowAddBranchDialog}
            setShowAddClientDialog={setShowAddClientDialog}
            setShowUpdateComDialog={setShowUpdateComDialog}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2  px-4 gap-4">
        <LabelInput
          value={details[0]?.email}
          onChange={() => {}}
          icon={Mail}
          label="Email"
          required
          stacked
        />
        <LabelInput
          value={details[0]?.mobile}
          onChange={() => {}}
          icon={Phone}
          label="Contact No."
          required
          stacked
        />
        <LabelInput
          value={details[0]?.panNo ? String(details[0].panNo).toUpperCase() : ''}
          onChange={() => {}}
          icon={CreditCard}
          label="PAN No."
          required
          stacked
        />
        <LabelInput
          value={details[0]?.website}
          onChange={() => {}}
          icon={Globe}
          label="Website"
          required
          stacked
        />
        <LabelInput
          value={details[0]?.brand ?? ''}
          onChange={() => {}}
          icon={Tag}
          label="Brand Name"
          stacked
        />
        <LabelInput
          value={formatHsnSsc((details[0] as any)?.hsn)}
          onChange={() => {}}
          icon={CreditCard}
          label="HSN"
          stacked
        />
        <LabelInput
          value={formatHsnSsc((details[0] as any)?.ssc)}
          onChange={() => {}}
          icon={CreditCard}
          label="SSC"
          stacked
        />
        <LabelInput
          value={details[0]?.createdOn}
          onChange={() => {}}
          icon={CalendarIcon}
          label="Company Added On"
          required
          stacked
        />
        <LabelInput
          value={details[0]?.updatedOn}
          onChange={() => {}}
          icon={CalendarIcon}
          label="Company Last Updated On"
          required
          stacked
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Is Company Active?
          </label>
          <Select
            value={
              details?.[0]?.activeStatus === 'A' ? 'A' : 'INA'
            }
            onValueChange={handleActiveStatusChange}
            disabled={!details?.[0]?.companyID}
          >
            <SelectTrigger className={inputStyle}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Active</SelectItem>
              <SelectItem value="INA">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Branches section with names and Active/Inactive */}
      {branches && branches.length > 0 && (
        <div className="px-4 space-y-3">
          <div className="h-[2px] bg-muted" />
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Branches
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {branches.map((branch: any) => (
              <div
                key={branch.branchID}
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {branch.branchName}
                  </p>
                  {branch.city && (
                    <p className="text-xs text-slate-500">{branch.city}</p>
                  )}
                </div>
                <div className="flex-shrink-0 w-full sm:w-[140px]">
                  <Select
                    value={
                      branch.activeStatus === 'A' ? 'A' : 'INA'
                    }
                    onValueChange={(value) =>
                      handleBranchActiveStatusChange(branch, value)
                    }
                    disabled={updatingBranchStatusId === branch.branchID}
                  >
                    <SelectTrigger className={inputStyle}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Active</SelectItem>
                      <SelectItem value="INA">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-[2px] bg-muted" />
    </div>
  );
}

export default function CompanyInfo() {
  const params = useParams<{ id: string }>();
  const companyId = params?.id ?? '';

  if (!companyId) return null;

  return <CompanyInfoContent companyId={companyId} />;
}

interface PropTypes {
  setShowAddClientDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddBranchDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUpdateComDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDown = (props: PropTypes) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton icon={<Ellipsis size={19} />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="group"
          onClick={() => props.setShowAddClientDialog(true)}
        >
          <div className="flex  items-center gap-1">
            <User size={18} className="text-muted-foreground" />
            Add As Client
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="group"
          onClick={() => props.setShowUpdateComDialog(true)}
        >
          <div className="flex items-center gap-2">
            <Edit size={16} className="text-muted-foreground" />
            Update Company
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="group"
          //@ts-ignore
          onClick={() => props?.setShowAddBranchDialog(true)}
        >
          <div className="flex items-center gap-1 ">
            <PlusIcon size={18} className="text-muted-foreground" />
            Add Branch
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
