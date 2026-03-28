import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateExperience, cn } from '@/lib/utils';
import { DetailRow, SingleDetail } from './detailPrimitives';

/** Spelling matches historical component name */
export const EmployementDetails = React.memo(function EmployementDetails({
  details,
}: {
  details: any;
}) {
  const list = details?.companyInfo ?? [];
  const hasList = Array.isArray(list) && list.length > 0;
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Employments
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {hasList &&
            list.map((emp: any, i: number) => (
              <div
                key={i}
                className={cn(
                  'px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50',
                )}
              >
                <SingleDetail label="Company" value={emp?.companyName} />
                <DetailRow>
                  <SingleDetail
                    label="Location"
                    value={emp?.empWorkingCompanyAddressID}
                  />
                  <SingleDetail label="Contractor" value={emp?.contractor} />
                </DetailRow>
                <DetailRow>
                  <SingleDetail
                    label="Department"
                    value={emp?.departmentName}
                  />
                  <SingleDetail
                    label="Designation"
                    value={emp?.designationName}
                  />
                </DetailRow>

                <DetailRow>
                  <SingleDetail label="Joined on" value={emp?.empJoiningDate} />
                  <SingleDetail
                    label="Releived on"
                    value={emp?.empRelievingDate}
                  />
                </DetailRow>
                <DetailRow>
                  {emp?.empJoiningDate && emp?.empRelievingDate && (
                    <SingleDetail
                      label="Experience"
                      value={calculateExperience(
                        emp?.empJoiningDate,
                        emp?.empRelievingDate,
                      )}
                    />
                  )}
                </DetailRow>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
});
