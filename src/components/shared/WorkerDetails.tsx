import React, {
  lazy,
  Suspense,
  useCallback,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { getLoggedInUserType } from '@/lib/routeAccess';
import { getEmployeeId } from './worker-details/getEmployeeId';
import { downloadWorkerResumePdf } from './worker-details/workerResumeDownload';
import type { WorkerDetailsProps } from './worker-details/types';

const WorkerDetailsSheetBody = lazy(() =>
  import('./worker-details/WorkerDetailsSheetBody'),
);

function SheetSectionsFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
      <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-teal-700 rounded-full" />
      <p className="text-sm">Loading details…</p>
    </div>
  );
}

const WorkerDetails: React.FC<WorkerDetailsProps> = ({
  worker,
  showEdit = true,
  open,
  onOpenChange,
  onWorkerUpdated,
  detailsLoading = false,
  title,
}) => {
  const employeeId = getEmployeeId(worker);
  const isAdmin = getLoggedInUserType() === 'admin';
  const canEdit = Boolean(showEdit && isAdmin && employeeId);
  const [downloadResumeLoading, setDownloadResumeLoading] = useState(false);

  const handleDownloadResume = useCallback(async () => {
    if (!worker) return;
    setDownloadResumeLoading(true);
    try {
      await downloadWorkerResumePdf(worker, employeeId);
    } finally {
      setDownloadResumeLoading(false);
    }
  }, [worker, employeeId]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="flex flex-col h-full w-full max-w-4xl sm:min-w-[1000px] p-0 gap-0 overflow-hidden"
          onInteractOutside={(e: any) => e.preventDefault()}
        >
          <SheetHeader className="flex-shrink-0 flex flex-row items-center justify-between px-6 py-4 border-b bg-slate-50/80">
            <SheetTitle className="text-lg font-semibold text-slate-800">
              {title ?? 'Worker Details'}
            </SheetTitle>
          </SheetHeader>

          {detailsLoading ? (
            <div className="flex-1 flex items-center justify-center flex-col px-6 py-12">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
              <p className="text-slate-500">Please wait...</p>
            </div>
          ) : worker ? (
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-slate-50/40">
              <Suspense fallback={<SheetSectionsFallback />}>
                <WorkerDetailsSheetBody
                  worker={worker}
                  employeeId={employeeId}
                  canEdit={canEdit}
                  onWorkerUpdated={onWorkerUpdated}
                />
              </Suspense>
            </div>
          ) : null}

          {!detailsLoading && worker && (
            <div className="flex-shrink-0 border-t border-slate-200/80 px-6 py-4 bg-white flex justify-end">
              <Button
                onClick={handleDownloadResume}
                variant="default"
                disabled={downloadResumeLoading}
              >
                {downloadResumeLoading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Preparing PDF...
                  </>
                ) : (
                  'Download Resume'
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default WorkerDetails;
export type { WorkerDetailsProps } from './worker-details/types';
