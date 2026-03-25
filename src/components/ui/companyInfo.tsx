
import UpdateCompany from '@/components/admin/companies/UpdateCompany';
import AddClient from '@/components/shared/AddClient';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import IconButton from '@/components/ui/IconButton';
import {
  getCompanyBranchOptions,
  getCompanyInfo,
} from '@/features/admin/adminPageSlice';
import { AppDispatch, RootState } from '@/store';
import { Building2, Edit, Ellipsis, PlusIcon, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UpdateBranchModal from '../admin/companies/UpdateBranchModal';
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

function DetailField({ label, value }: { label: string; value?: string | null }) {
  const display =
    value == null || String(value).trim() === '' ? '—' : String(value);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-800 break-words leading-relaxed">
        {display}
      </span>
    </div>
  );
}
function branchFieldText(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'object' && 'text' in (val as object) && typeof (val as { text?: string }).text === 'string') {
    return (val as { text: string }).text.trim() || '';
  }
  return String(val).trim();
}

export interface CompanyInfoContentProps {
  companyId: string;
  embedded?: boolean;
}
export function CompanyInfoContent({ companyId, embedded,  }: CompanyInfoContentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    companyInfo: details,
    branches,
    loadingCompanyInfo,
    loadingCompanyBranches,
  } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [updatingBranch, setUpdatingBranch] = useState<any>(null);
  const [showAddClientDialog, setShowAddClientDialog] = useState<boolean>(false);
  const [showUpdateComDialog, setShowUpdateComDialog] = useState<boolean>(false);

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

  // const handleBranchActiveStatusChange = (branch: any, value: string) => {
  //   const companyID = details?.[0]?.companyID;
  //   if (!companyID || !branch?.branchID) return;
  //   const activeStatus = value as 'A' | 'INA';
  //   setUpdatingBranchStatusId(branch.branchID);
  //   const payload = {
  //     addressID: branch.branchID,
  //     companyID,
  //     name: branch.branchName,
  //     city: branch.city ?? '',
  //     email: branch.email ?? '',
  //     gst: branch.gst ?? '',
  //     mobile: (branch as any).mobile ?? '',
  //     pinCode: (branch as any).pinCode ?? '',
  //     state: (branch as any).state ?? '',
  //     industry: (branch as any).industry ?? '',
  //     activeStatus,
  //   };
  //   dispatch(branchUpdate(payload)).then((res: any) => {
  //     setUpdatingBranchStatusId(null);
  //     if (res.payload?.success !== false) {
  //       dispatch(getCompanyBranchOptions(companyId));
  //       toast({
  //         title: 'Updated',
  //         description: `Branch "${branch.branchName}" is now ${activeStatus === 'A' ? 'Active' : 'Inactive'}.`,
  //       });
  //     }
  //   });
  // };

  const wrapperClass = embedded
    ? 'flex-1 min-h-0 bg-white flex flex-col gap-4 p-6 overflow-y-auto'
    : 'flex-1 bg-white flex flex-col gap-6 border rounded-lg p-8';

  if (loadingCompanyInfo || loadingCompanyBranches) {
    return (
      <div
        className={
          embedded
            ? 'flex-1 min-h-0 flex flex-col bg-white'
            : 'flex-1 flex flex-col bg-white border rounded-lg'
        }
      >
        <div className="flex-1 flex items-center justify-center flex-col px-6 py-12">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
          <p className="text-slate-500">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 px-4 gap-x-8 gap-y-5">
        <DetailField label="Email" value={details?.[0]?.email} />
        <DetailField label="Contact number" value={details?.[0]?.mobile} />
        <DetailField label="Contact name" value={details?.[0]?.contactName} />
        <DetailField
          label="PAN"
          value={
            details?.[0]?.panNo
              ? String(details[0].panNo).toUpperCase()
              : undefined
          }
        />
        <DetailField label="Website" value={details?.[0]?.website} />
        <DetailField label="Brand" value={details?.[0]?.brand} />
        <DetailField
          label="HSN"
          value={formatHsnSsc((details?.[0] as any)?.hsn)}
        />
        <DetailField
          label="SSC"
          value={formatHsnSsc((details?.[0] as any)?.ssc)}
        />
        <DetailField label="Added on" value={details?.[0]?.createdOn} />
        <DetailField label="Last updated" value={details?.[0]?.updatedOn} />
        <DetailField
          label="Status"
          value={
            details?.[0]?.activeStatus === 'A'
              ? 'Active'
              : details?.[0]?.activeStatus
                ? 'Inactive'
                : undefined
          }
        />
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
                    {/* <Select
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
                    </Select> */}
                    <IconButton
                      icon={<Edit size={18} />}
                      onClick={() => openEditBranch(branch)}
                      aria-label="Edit branch"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
                  <DetailField
                    label="Branch name"
                    value={branch.branchName ?? branch.companyName}
                  />
                  <DetailField label="Email" value={branch.email} />
                  <DetailField label="Contact no." value={branch.mobile} />
                  <DetailField label="GST" value={branch.gst} />
                  <DetailField label="Pin code" value={branch.pinCode} />
                  <DetailField
                    label="State"
                    value={branchFieldText(branch.state)}
                  />
                  <DetailField label="City" value={branch.city} />
                  <DetailField
                    label="Industry"
                    value={branchFieldText(branch.industry)}
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
