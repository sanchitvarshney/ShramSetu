import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Key, Save, X } from "lucide-react";

interface PropTypes {
  open: boolean;
  hide: () => void;
}
const AppPasswordDialog = ({ open, hide }: PropTypes) => {
  return (
    <Dialog open={open} onOpenChange={hide}>
      <DialogContent>
        <DialogHeader className="flex flex-row gap-2 justify-center items-center">
          <Key size={22} />
          <span className="text-lg">Set App Password</span>
        </DialogHeader>
        <DialogDescription>
          <p>
            This App password will be required if you want to send contact
            E-mails to the workers from your recruitment E-mail ID
          </p>

          <p className="mt-2">
            If the App password and recruitment E-mail is not set then the
            contact mails will be sent from our E-mail ID.
          </p>
        </DialogDescription>
        <Input placeholder="Enter App Password" prefix={<Key size={20} />} />
        <DialogFooter>
          <Button onClick={hide} icon={<X size={18} />} variant="outline">
            Cancel
          </Button>
            
            <Button icon={<Save size={19} /> }className="bg-[#115e59] hover:bg-[#0d4a46] shadow-neutral-400">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppPasswordDialog;
