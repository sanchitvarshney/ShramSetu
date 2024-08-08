import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/dragger';
import {
  CloudUpload,
  Paperclip,
  RefreshCcw,
  Upload,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { bulkUpload } from '@/features/admin/adminPageSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { AppDispatch } from '@/store';

interface FileUploadDialogProps {
  onClose: () => void;
}

export function FileUploadDialog({ onClose }: FileUploadDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[] | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const validateHandler = async () => {
    if (files && files[0]) {
      setShowSubmitConfirm(true);
    }
  };

  const submitConfirm = async () => {
    if (files && files[0]) {
      dispatch(bulkUpload(files[0])).then((response: any) => {
        console.log(response, 'res');
        if (response.payload.success) {
          toast({ title: 'Success!!', description: response.payload.message });
          onClose();
          setShowSubmitConfirm(false);
          resetHandler();
        }
      });
    }
  };

  const resetHandler = async () => {
    setFiles(null);
  };

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <FileUploader
            value={files}
            onValueChange={setFiles}
            dropzoneOptions={dropZoneConfig}
            className="relative border-dashed border hover:bg-muted bg-white rounded-lg p-2"
          >
            <FileInput>
              <div className="flex text-muted-foreground items-center justify-center flex-col pt-3 pb-4 w-full">
                <CloudUpload size={80} />
                <p>Drop your file here</p>
                <p>Supported formats (xlsx)</p>
              </div>
            </FileInput>
            <FileUploaderContent>
              {files &&
                files.length > 0 &&
                files.map((file, i) => (
                  <FileUploaderItem key={i} index={i}>
                    <Paperclip className="h-4 w-4 stroke-current" />
                    <span>{file.name}</span>
                  </FileUploaderItem>
                ))}
            </FileUploaderContent>
          </FileUploader>
          <DialogFooter>
            <Button
              disabled={!files || files?.length === 0}
              onClick={resetHandler}
              variant={'outline'}
              icon={<RefreshCcw size={16} />}
            >
              Reset
            </Button>
            <Button
              disabled={!files || files?.length === 0}
              onClick={validateHandler}
              icon={<Upload size={18} />}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SubmitConfirm
        loading={true}
        show={showSubmitConfirm}
        hide={() => setShowSubmitConfirm(false)}
        submitHandler={submitConfirm}
      />
    </>
  );
}

interface SubmitPropTypes {
  submitHandler: () => Promise<void>;
  loading: boolean;
  show: boolean;
  hide: () => void;
}

const SubmitConfirm = (props: SubmitPropTypes) => {
  return (
    <Dialog open={props.show} onOpenChange={props.hide}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Upload</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to upload this file?</p>
        </div>
        <DialogFooter>
          <Button
            onClick={props.hide}
            variant={'outline'}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <Button
            // loading={props.loading}
            onClick={props.submitHandler}
            icon={<Check size={18} />}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
