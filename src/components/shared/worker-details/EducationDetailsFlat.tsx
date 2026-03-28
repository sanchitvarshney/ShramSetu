import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DetailRow, SingleDetail } from './detailPrimitives';

export const EducationDetailsFlat = React.memo(function EducationDetailsFlat({
  details,
}: {
  details: any;
}) {
  const list = details?.educationList ?? details?.educationDetails ?? [];
  const hasList = Array.isArray(list) && list.length > 0;
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3">
          {hasList &&
            list.map((edu: any, i: number) => (
              <div
                key={edu?.educationID ?? i}
                className={cn(
                  'px-4 py-3 rounded-lg border border-slate-200 bg-slate-50/50',
                )}
              >
                <SingleDetail
                  label="School / University"
                  value={
                    edu?.employeeUniversity ??
                    edu?.university ??
                    edu?.institution ??
                    edu?.school
                  }
                />
                <DetailRow>
                  <SingleDetail
                    label="Degree"
                    value={edu?.employeeDegree ?? edu?.degree}
                  />
                  <SingleDetail
                    label="Stream/Board"
                    value={edu?.employeeStream ?? edu?.stream}
                  />
                </DetailRow>

                <DetailRow>
                  <SingleDetail label="End Year" value={edu?.endYear} />
                </DetailRow>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
});
