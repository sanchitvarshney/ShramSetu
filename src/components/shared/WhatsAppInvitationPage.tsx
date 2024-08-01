import React, { useMemo } from 'react'

import { AgGridReact } from 'ag-grid-react';
import { columnDefs, dummyData } from '@/table/InvitationTable';

const WhatsAppInvitationPage:React.FC = () => {
  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);
  return (
    <div className="ag-theme-quartz h-[calc(100vh-190px)]">
    <AgGridReact
      suppressCellFocus={false}
      defaultColDef={defaultColDef}
      columnDefs={columnDefs}
      rowData={dummyData}
      pagination={true}
    />
  </div>
  )
}

export default WhatsAppInvitationPage
