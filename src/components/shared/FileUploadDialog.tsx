import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/dragger';
import { Paperclip, RefreshCcw, Upload, Check } from 'lucide-react';
import { useState } from 'react';
import { bulkUpload } from '@/features/admin/adminPageSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { AppDispatch } from '@/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReloadIcon } from '@radix-ui/react-icons';
import { FaFileExcel } from 'react-icons/fa';

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
      onClose();
      dispatch(bulkUpload(files[0])).then((response: any) => {
        if (response.payload.success) {
          toast({ title: 'Success!!', description: response.payload.message });
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
  const loading = false;
  const isDragActive = true;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent
          className="grid grid-cols-2 gap-6 p-8 max-w-5xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center">
            <FileUploader
              value={files}
              onValueChange={setFiles}
              dropzoneOptions={dropZoneConfig}
              className="w-full flex flex-col items-center"
            >
              <FileInput>
                <div className="flex items-center flex-col justify-center h-full px-[20px]">
                  <input accept=".xlsx, .xls" />
                  <div className="flex items-center flex-col justify-center w-full h-full py-[20px] border-slate-400">
                    <div className="w-[150px] h-[150px] bg-[#21734621] rounded-full flex justify-center items-center">
                      {loading ? (
                        <ReloadIcon className="h-[50px] w-[50px] text-[#217346] animate-spin" /> // Placeholder for a spinner
                      ) : (
                        <FaFileExcel className="h-[50px] w-[50px] text-[#217346]" />
                      )}
                    </div>
                    <p className="text-[18px] font-[400] text-cyan-600 text-center mt-[20px]">
                      {isDragActive
                        ? 'Drop the file here...'
                        : loading
                        ? 'Uploading...'
                        : 'Click here to browse on your device'}
                    </p>
                    {/* {error && <p className='mt-2 text-red-500'>{error}</p>} */}
                  </div>
                </div>
              </FileInput>
              <FileUploaderContent>
                {files &&
                  files.length > 0 &&
                  files.map((file, i) => (
                    <FileUploaderItem
                      key={i}
                      index={i}
                      className="flex items-center mt-2"
                    >
                      <Paperclip className="h-5 w-5 text-gray-600" />
                      <span className="ml-2 text-gray-700">{file.name}</span>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
          </div>
          <div>
            <h2 className="text-[18px] text-slate-600 font-bold">
              Upload Instructions
            </h2>
            <br />
            <ol className="text-slate-500 text-[15px] ml-[10px] list-decimal">
              <li className="p-1">
                Please refer to the "References" sheet for the necessary code.
              </li>
              <li className="p-1">
                Do not delete, remove, or edit row number [1].
              </li>
              <li className="p-1">
                The colored cells in row 2 of the sheet named "Sample Data"
                indicate the corresponding columns and rows in the "References"
                sheet for "Value" and "Code."
              </li>
              <li className="p-1">
                Ensure the file being uploaded is in .csv format.
              </li>
              <li className="p-1">
                Download
                <a
                  href="https://esptest.mscorpres.net/UPLOADS/employeeSample/ESPSample.xlsx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 hover:underline"
                >
                  Sample File
                </a>
              </li>
            </ol>
            <div className="flex flex-row pt-24 gap-5">
              <Button
                disabled={!files || files.length === 0}
                onClick={resetHandler}
                variant="outline"
                icon={<RefreshCcw size={16} />}
                className="w-full"
              >
                Reset
              </Button>
              <Button
                disabled={!files || files.length === 0}
                onClick={validateHandler}
                icon={<Upload size={18} />}
                className="w-full bg-teal-500 hover:bg-teal-600"
              >
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showSubmitConfirm}
        onOpenChange={() => setShowSubmitConfirm(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-700">
              Confirm Upload
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to upload this file?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-500">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-teal-500 hover:bg-teal-600"
              onClick={submitConfirm}
            >
              <Check size={18} className="mr-2" />
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
