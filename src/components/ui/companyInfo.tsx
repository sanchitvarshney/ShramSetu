// import SingleDetail from '@/components/shared/SingleDetail';
import UpdateBranchModal from '@/components/admin/companies/UpdateBranchModal';
import UpdateCompany from '@/components/admin/companies/UpdateCompany';
import AddClient from '@/components/shared/AddClient';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LabelInput } from '@/components/ui/EmpUpdate';
import IconButton from '@/components/ui/IconButton';
import {
  getCompanyBranchOptions,
  getCompanyInfo,
} from '@/features/admin/adminPageSlice';
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
  User,
  Map,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function companyInfo() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const { companyInfo: details, branches } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);

  const [updatingBranch, setUpdatingBranch] = useState<null>(null);
  const [showAddClientDialog, setShowAddClientDialog] =
    useState<boolean>(false);
  const [showUpdateComDialog, setShowUpdateComDialog] =
    useState<boolean>(false);

  console.log(companyInfo);
  useEffect(() => {
    dispatch(getCompanyInfo(params?.id));
    dispatch(getCompanyBranchOptions(params?.id));
  }, []);
  return (
    <div className="flex-1 bg-white flex flex-col gap-6 border rounded-lg p-8">
      <AddClient
        branches={branches}
        show={showAddClientDialog}
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
          {/* <MyButton variant="goBack" /> */}
          <div className="flex gap-1 items-center">
            <Building2 />
            <p className="font-semibold text-xl">{details?.name}</p>
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
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 px-8 gap-4">
        <LabelInput
          value={details[0]?.email}
          onChange={() => {}}
          icon={Mail}
          label="Pin Code"
          required
        />
        <LabelInput
          value={details[0]?.mobile}
          onChange={() => {}}
          icon={Phone}
          label="Contact No."
          required
        />
        <LabelInput
          value={details[0]?.panNo}
          onChange={() => {}}
          icon={CreditCard}
          label="PAN No."
          required
        />

        <LabelInput
          value={details[0]?.website}
          onChange={() => {}}
          icon={Globe}
          label="Website"
          required
        />

        <LabelInput
          value={details[0]?.createdOn}
          onChange={() => {}}
          icon={CalendarIcon}
          label="Company Added On"
          required
        />

        <LabelInput
          value={details[0]?.updatedOn}
          onChange={() => {}}
          icon={CalendarIcon}
          label="Company Last Updated On"
          required
        />
        <LabelInput
          value={details?.isActive ? 'Yes' : 'No'}
          onChange={() => {}}
          icon={CalendarIcon}
          label="Is Company Active?"
          required
        />
      </div>
      <div className="h-[2px] bg-muted" />
      <div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
              <Building2 size={20} />
              <p className="font-semibold text-xl ">Branches</p>
            </div>
            {/* <IconButton
              onClick={() => setShowAddBranchDialog(true)}
              size="sm"
              icon={<PlusIcon size={18} />}
              background="bg-primary"
              tooltip="Add Branch"
              hoverBackground="hover:bg-accent"
              hoverColor="hover:text-white"
              color="text-white"
            /> */}
          </div>
          <p className="text-lg ml-2 text-muted-foreground">
            ({branches?.length} Found)
          </p>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {/* {!loading("fetch") && ( */}
          <Accordion type="single" collapsible>
            {branches?.map((row, index) => (
              <AccordionItem
                value={row.branchID}
                className="border-b-2 border-b-muted "
              >
                <AccordionTrigger>
                  <>
                    {console.log(row)}
                    <div className="flex justify-between h-full items-center flex-1">
                      <p>
                        {index + 1}. {row?.branchName}
                      </p>
                      <div>
                        <IconButton
                          onClick={() => {
                            setShowAddBranchDialog(true);
                            setUpdatingBranch(row);
                          }}
                          tooltip="Update Branch"
                          icon={<Edit size={17} />}
                        />
                      </div>
                    </div>
                  </>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    <LabelInput
                      value={row.email}
                      onChange={() => {}}
                      icon={Mail}
                      label="E-Mail"
                      required
                    />
                    <LabelInput
                      value={row.mobile}
                      onChange={() => {}}
                      icon={Phone}
                      label="Contact No."
                      required
                    />
                    <LabelInput
                      value={row.gst}
                      onChange={() => {}}
                      icon={CreditCard}
                      label="GST No."
                      required
                    />
                    <LabelInput
                      value={row.branchName}
                      onChange={() => {}}
                      icon={Building2}
                      label="HeadQuarters"
                      required
                    />
                    <LabelInput
                      value={row.state.text}
                      onChange={() => {}}
                      icon={Map}
                      label="State"
                      required
                    />
                    <LabelInput
                      value={row.city}
                      onChange={() => {}}
                      icon={Map}
                      label="City"
                      required
                    />
                    <LabelInput
                      value={row.pinCode}
                      onChange={() => {}}
                      icon={Map}
                      label="Pin Code"
                      required
                    />
                    <LabelInput
                      value={row.industry.text}
                      onChange={() => {}}
                      icon={Building2}
                      label="Industry"
                      required
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      {/* {params?.id && details && (
        <AddBranchDialog
          updatingBranch={updatingBranch}
          getDetails={handleFetchDetails}
          show={showAddBranchDialog}
          hide={close}
          companyId={params.id}
          companyName={details.name}
          editBranch={editBranch}
        />
      )} */}
    </div>
  );
}

interface PropTypes {
  setShowAddClientDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddBranchDialog: React.Dispatch<React.SetStateAction<boolean>>;
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
            <User
              size={18}
              className="text-muted-foreground group-hover:text-white"
            />
            Add As Client
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="group"
          onClick={() => props.setShowUpdateComDialog(true)}
        >
          <div className="flex items-center gap-2">
            <Edit
              size={16}
              className="text-muted-foreground group-hover:text-white"
            />
            Update Company
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="group"
          onClick={() => props.setShowAddBranchDialog(true)}
        >
          <div className="flex items-center gap-1 ">
            <PlusIcon
              size={18}
              className="text-muted-foreground group-hover:text-white"
            />
            Add Branch
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
