import React from 'react';
import { BasicDetailsFlat } from './BasicDetailsFlat';
import { CurrentAddressFlat } from './CurrentAddressFlat';
import { PermanentAddressFlat } from './PermanentAddressFlat';
import { EmployementDetails } from './EmployementDetails';
import { EducationDetailsFlat } from './EducationDetailsFlat';
import { BankDetailsFlat } from './BankDetailsFlat';

export type WorkerDetailsSheetBodyProps = {
  worker: any;
  employeeId: string | undefined;
  canEdit: boolean;
  onWorkerUpdated?: () => void;
};

/**
 * Detail sections for the worker sheet — loaded lazily from the parent for a smaller initial bundle.
 */
export default function WorkerDetailsSheetBody({
  worker,
  employeeId,
  canEdit,
  onWorkerUpdated,
}: WorkerDetailsSheetBodyProps) {
  return (
    <div className="space-y-5 pb-4">
      <BasicDetailsFlat
        details={worker}
        employeeId={employeeId}
        canEdit={canEdit}
        onSuccess={onWorkerUpdated}
      />
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <CurrentAddressFlat
          details={worker}
          employeeId={employeeId}
          canEdit={canEdit}
          onSuccess={onWorkerUpdated}
        />
        <PermanentAddressFlat
          details={worker}
          employeeId={employeeId}
          canEdit={canEdit}
          onSuccess={onWorkerUpdated}
        />
      </div>
      <EmployementDetails details={worker} />
      <EducationDetailsFlat details={worker} />
      <BankDetailsFlat
        details={worker}
        employeeId={employeeId}
        canEdit={canEdit}
        onSuccess={onWorkerUpdated}
      />
    </div>
  );
}
