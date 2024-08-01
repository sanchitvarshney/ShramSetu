import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, dummyData } from '@/table/InvitationTable';
import styled from 'styled-components';

const MessageInvitationPage: React.FC = () => {
  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);
  return (
    <Wrapper>
      <div className="ag-theme-quartz h-[calc(100vh-190px)]">
        <AgGridReact
          suppressCellFocus={false}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          rowData={dummyData}
          pagination={true}
        />
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
.ag-theme-quartz .ag-paging-panel {
  background-color: #e0f2f1;
}
`
export default MessageInvitationPage;
