
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
import { LabeledField } from '@/components/ui/LabeledField';
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
  Edit,
  Ellipsis,
  PlusIcon,
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

/** Get display text from branch field that may be { text, value } or string. */
function branchFieldText(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'object' && 'text' in (val as object) && typeof (val as { text?: string }).text === 'string') {
    return (val as { text: string }).text.trim() || '';
  }
  return String(val).trim();
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
  const [updatingBranch, setUpdatingBranch] = useState<any>(null);
  const [showAddClientDialog, setShowAddClientDialog] = useState<boolean>(false);
  const [showUpdateComDialog, setShowUpdateComDialog] = useState<boolean>(false);
  const [updatingBranchStatusId, setUpdatingBranchStatusId] = useState<string | null>(null);

  const openAddBranch = () => {
    setUpdatingBranch(null);
    setShowAddBranchDialog(true);
  };
  const openEditBranch = (branch: any) => {
    setUpdatingBranch(branch);
    setShowAddBranchDialog(true);
  };
  const hideBranchModal = () => {
    setShowAddBranchDialog(false);
    setUpdatingBranch(null);
    dispatch(getCompanyBranchOptions(companyId));
  };

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
        companyId={details?.[0]?.companyID ?? ''}
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
        hide={hideBranchModal}
        updatingBranch={updatingBranch}
        companyName={details?.[0]?.name}
      />
      <div className="flex justify-between items-center border-b-2 border-b-muted ">
        <div className="flex gap-2 items-center ml-[-10px]">
          <div className="flex gap-1 items-center">
            <Building2 />
            <p className="font-semibold text-xl">{details?.[0]?.name}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <DropDown
            onAddBranch={openAddBranch}
            setShowAddClientDialog={setShowAddClientDialog}
            setShowUpdateComDialog={setShowUpdateComDialog}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 px-4 gap-[20px]">
        <LabeledField
          label="Email"
          required
          readOnly
          value={details?.[0]?.email ?? ''}
          onChange={() => {}}
        />
        <LabeledField
          label="Contact No."
          required
          readOnly
          value={details?.[0]?.mobile ?? ''}
          onChange={() => {}}
        />
        <LabeledField
          label="PAN No."
          required
          readOnly
          value={details?.[0]?.panNo ? String(details?.[0]?.panNo).toUpperCase() : ''}
          onChange={() => {}}
        />
        <LabeledField
          label="Website"
          required
          readOnly
          value={details?.[0]?.website ?? ''}
          onChange={() => {}}
        />
        <LabeledField
          label="Brand Name"
          readOnly
          value={details?.[0]?.brand ?? ''}
          onChange={() => {}}
        />
        <LabeledField
          label="HSN"
          readOnly
          value={formatHsnSsc((details?.[0] as any)?.hsn)}
          onChange={() => {}}
        />
        <LabeledField
          label="SSC"
          readOnly
          value={formatHsnSsc((details?.[0] as any)?.ssc)}
          onChange={() => {}}
        />
        <LabeledField
          label="Company Added On"
          required
          readOnly
          value={details?.[0]?.createdOn ?? ''}
          onChange={() => {}}
        />
        <LabeledField
          label="Company Last Updated On"
          required
          readOnly
          value={details?.[0]?.updatedOn ?? ''}
          onChange={() => {}}
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

      {/* Branches section – same layout as Update Company with Edit per branch */}
      {branches && branches.length > 0 && (
        <div className="px-4 space-y-4">
          <div className="h-[2px] bg-muted" />
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Branches
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {branches.map((branch: any) => (
              <div
                key={branch.branchID}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="flex justify-between items-center border-b-2 border-b-muted mb-4">
                  <div className="flex gap-2 items-center">
                    <Building2 className="h-5 w-5 text-slate-600" />
                    <p className="font-semibold text-xl text-slate-800">
                      {branch.branchName ?? branch.companyName ?? '—'}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={branch.activeStatus === 'A' ? 'A' : 'INA'}
                      onValueChange={(value) =>
                        handleBranchActiveStatusChange(branch, value)
                      }
                      disabled={updatingBranchStatusId === branch.branchID}
                    >
                      <SelectTrigger className={inputStyle + ' w-[140px]'}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Active</SelectItem>
                        <SelectItem value="INA">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <IconButton
                      icon={<Edit size={18} />}
                      onClick={() => openEditBranch(branch)}
                      aria-label="Edit branch"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
                  <LabeledField
                    label="Branch Name"
                    readOnly
                    value={branch.branchName ?? branch.companyName ?? ''}
                    onChange={() => {}}
                  />
                  <LabeledField
                    label="Email"
                    readOnly
                    value={branch.email ?? ''}
                    onChange={() => {}}
                  />
                  <LabeledField
                    label="Contact No."
                    readOnly
                    value={branch.mobile ?? ''}
                    onChange={() => {}}
                  />
                  <LabeledField
                    label="GST Number"
                    readOnly
                    value={branch.gst ?? ''}
                    onChange={() => {}}
                  />
                  <LabeledField
                    label="Pin Code"
                    readOnly
                    value={branch.pinCode ?? ''}
                    onChange={() => {}}
                  />
                  <LabeledField
                    label="State"
                    readOnly
                    value={branchFieldText(branch.state)}
                    onChange={() => {}}
                  />
                  <LabeledField
                    label="City"
                    readOnly
                    value={branch.city ?? ''}
                    onChange={() => {}}
                  />
                  <LabeledField
                    label="Industry"
                    readOnly
                    value={branchFieldText(branch.industry)}
                    onChange={() => {}}
                  />
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
  setShowUpdateComDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onAddBranch: () => void;
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
          onClick={props.onAddBranch}
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
