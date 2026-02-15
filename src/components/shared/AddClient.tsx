import { useEffect, useState } from 'react';
import { ArrowLeft, Check, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LabelInput } from '@/components/ui/EmpUpdate';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { addClient } from '@/features/admin/adminPageSlice';
import { toast } from '@/components/ui/use-toast';
import { validateForm, addClientSchema } from '@/lib/validations';

const AddClient = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [stage, setStage] = useState<'branch' | 'details'>('branch');
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>();
  const [fName, setFName] = useState('');
  const [mName, setMName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateClient = async () => {
    const validation = validateForm(addClientSchema, {
      branch: selectedBranch ?? '',

      firstName: fName.trim(),
      middleName: mName.trim() || undefined,
      lastName: lName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      password,
    });
    if (!validation.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: validation.message,
      });
      return;
    }
    const payload = {
      company: props?.companyId,
      branch: selectedBranch,
      email: email.trim(),
      firstName: fName.trim(),
      lastName: lName.trim(),
      middleName: mName.trim() || undefined,
      mobile: mobile.trim(),
      password,
    };
    dispatch(addClient(payload)).then((response: any) => {
      if (response.payload.success) {
        toast({ title: 'Success!!', description: response.payload.message });
        props.hide();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.payload.message,
        });
      }
    });
  };

  useEffect(() => {
    if (selectedBranch) {
      setStage('details');
    } else {
      setStage('branch');
    }
  }, [selectedBranch]);

  return (
    <Dialog open={props.show} onOpenChange={props.hide}>
      <DialogContent
        className={stage === 'details' ? 'min-w-[800px]' : undefined}
      >
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <DialogDescription>
            Here you can add clients and generate their username and password.
          </DialogDescription>
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
                value={selectedBranch}
                onValueChange={setSelectedBranch}
              >
                <div className="flex justify-center">
                  <div className="flex flex-col gap-y-4">
                    {props?.branches?.map((branch: any) => (
                      <div
                        key={branch?.branchID}
                        className="flex items-center gap-2"
                      >
                        <RadioGroupItem
                          value={branch?.branchID}
                          id={branch?.branchID}
                        />
                        <Label className="cursor-pointer" htmlFor={branch?.id}>
                          {branch?.branchName}
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
                  onChange={(e) => setFName(e.target.value)}
                  icon={User}
                  label="First Name"
                  required
                />
                <LabelInput
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  icon={User}
                  label="Middle Name"
                  required
                />
                <LabelInput
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}
                  icon={User}
                  label="Last Name"
                  required
                />
                <LabelInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={User}
                  label="Email"
                  required
                />
                <LabelInput
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  icon={User}
                  label="Mobile Number"
                  required
                />
                <LabelInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={User}
                  label="Password"
                  required
                />
              </div>
              <div className="flex justify-between mt-2">
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
                    icon={<Check size={18} />}
                    className="bg-teal-500 hover:bg-teal-600"
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
