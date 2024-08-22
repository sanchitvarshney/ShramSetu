import { useEffect, useState } from 'react';
import { ArrowLeft, Check, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
// import { RadioGroup } from '@radix-ui/react-dropdown-menu';
import { LabelInput } from '@/components/ui/EmpUpdate';
// import useApi from "@/hooks/useApi";
// import { createClient } from "@/api/master";

// interface PropTypes extends DialogPropType {
//   branches: AddedBranchType[];
// }

const AddClient = (props: any) => {
  const [stage, setStage] = useState<'branch' | 'details'>('branch');
  const [selectedBranch, setSelectedBranch] = useState<string>();
  const [fName, setFName] = useState('');
  const [mName, setMName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  //   const { execFun, loading } = useApi();

  const handleCreateClient = async () => {
    // const values = await form.validate();
    // if (selectedBranch) {
    //   const response = await execFun(
    //     () => createClient({ ...values, branch: selectedBranch }),
    //     'submit',
    //   );
    //   if (response.success) {
    //     setSelectedBranch(undefined);
    //     props.hide();
    //   }
    // }
  };

  useEffect(() => {
    console.log('this is the selected branch', selectedBranch);
    if (selectedBranch) {
      setStage('details');
    } else {
      setStage('branch');
    }
  }, [selectedBranch]);
  console.log(props.branches, stage, 'll');
  return (
    <Dialog open={props.show} onOpenChange={props.hide}>
      <DialogContent className={stage === 'details' && 'min-w-[800px]'}>
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <DialogDescription>
            Here you can add clients and generate their username and password.
          </DialogDescription>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          {stage === 'branch' && (
            <div>
              <div className="flex justify-center mb-4">
                <p className="text-center">
                  Please select a branch for creating a client
                </p>
              </div>

              <RadioGroup
                onValueChange={setSelectedBranch}
                defaultValue={selectedBranch}
              >
                <div className="flex justify-center">
                  <div className="flex flex-col  gap-y-4">
                    {props?.branches?.map((branch: any) => (
                      <div className="flex items-center gap-2">
                        <RadioGroup value={branch.id} id={branch.id} />
                        <Label className="cursor-pointer" htmlFor={branch.id}>
                          {branch.branchName}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {stage === 'details' && (
            <div>
              <div className="grid grid-cols-2 gap-2">
                <LabelInput
                  value={fName}
                  onChange={(e) => {
                    setFName(e.target.value);
                  }}
                  icon={User}
                  label="First Name"
                  required
                />
                <LabelInput
                  value={mName}
                  onChange={(e) => {
                    setMName(e.target.value);
                  }}
                  icon={User}
                  label="Middle Name"
                  required
                />
                <LabelInput
                  value={lName}
                  onChange={(e) => {
                    setLName(e.target.value);
                  }}
                  icon={User}
                  label="Last Name"
                  required
                />
                <LabelInput
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  icon={User}
                  label="Email"
                  required
                />
                <LabelInput
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                  icon={User}
                  label="Mobile Number"
                  required
                />
                <LabelInput
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  icon={User}
                  label="Password"
                  required
                />
              </div>
              <div className=" flex justify-between mt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBranch(undefined)}
                  icon={<ArrowLeft size={18} />}
                >
                  Select Branch
                </Button>

                <div>
                  <Button
                    onClick={handleCreateClient}
                    // loading={loading('submit')}
                    icon={<Check size={18} />}
                  >
                    Create Client
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClient;
