import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import { useDispatch, useSelector } from 'react-redux';
import type { ColDef } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isPlaceholderDisplayValue } from '@/lib/utils';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchPendingCompanies,
  mergePendingCompanies,
} from '@/features/admin/adminPageSlice';
import Loading from '../reusable/Loading';

type CompanyRow = {
  companyID: string;
  name: string;
  email: string;
  mobile: string;
  website: string;
  activeStatus?: string;
};

const PendingCompanyList = () => {
  const gridRef = useRef<AgGridReactType<CompanyRow>>(null);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [targetCompanyId, setTargetCompanyId] = useState<string>('');
  const [newCompany, setNewCompany] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  const {
    pendingCompanies,
    pendingCompLoading,
    companies,
    mergeCompanyLoading,
  } = useSelector((state: RootState) => state.adminPage);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      sortable: true,
      resizable: true,
    }),
    [],
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: '#',
        maxWidth: 70,
        valueGetter: 'node.rowIndex + 1',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
      },
      { headerName: 'Company Name', field: 'name' },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: ({ value }: any) => (
          <span
            style={{
              color:
                value === 'Pending'
                  ? 'red'
                  : value === 'Approved'
                    ? 'green'
                    : 'gray',
              fontWeight: 500,
            }}
          >
            {isPlaceholderDisplayValue(value) ? '' : String(value)}
          </span>
        ),
      },
      { headerName: 'Inserted By', field: 'insertBy' },
      { headerName: 'Inserted Date', field: 'insertDt' },
    ],
    [],
  );

  useEffect(() => {
    if (pendingCompanies?.length > 0) {
      return;
    }
    dispatch(fetchPendingCompanies());
  }, [dispatch, pendingCompanies]);

  const openMergeModal = () => {
    const selectedRows = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selectedRows.length === 0) return;
    setIsMergeModalOpen(true);
  };

  const closeModal = () => {
    setIsMergeModalOpen(false);
    setTargetCompanyId('');
    setNewCompany('');
  };

  const handleFinish = async () => {
    const selectedRows = gridRef.current?.api?.getSelectedRows() ?? [];

    const payload = {
      targetId: targetCompanyId,
      oldCompany: selectedRows.map((row) => row.companyID),
      newCompany: targetCompanyId === 'other' ? newCompany : '',
    };
    const action = await dispatch(
      //@ts-ignore
      mergePendingCompanies(payload),
    );

    if (mergePendingCompanies.fulfilled.match(action)) {
      closeModal();
      gridRef.current?.api?.deselectAll();
      setSelectedCount(0);
      dispatch(fetchPendingCompanies());
    }
  };
  const finishDisabled =
    !targetCompanyId ||
    (targetCompanyId === 'other' && newCompany.trim() === '');

  return (
    <div className="h-[calc(100vh-80px)] p-2">
      {pendingCompLoading && <Loading />}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-700">
          Pending Company List
        </h2>
        <Button
          className="bg-[#115e59] hover:bg-[#0d4a46]"
          onClick={openMergeModal}
          disabled={selectedCount === 0}
        >
          Merge
        </Button>
      </div>

      <div className="ag-theme-quartz h-[calc(100%-56px)]">
        <AgGridReact
          ref={gridRef}
          rowData={pendingCompanies}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onSelectionChanged={() => {
            const count = gridRef.current?.api?.getSelectedRows()?.length ?? 0;
            setSelectedCount(count);
          }}
          suppressRowClickSelection
          pagination
          suppressCellFocus
          isRowSelectable={(node) => node.data?.status !== 'Approved'}
        />
      </div>

      <Dialog open={isMergeModalOpen} onOpenChange={setIsMergeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Pending Companies</DialogTitle>
            <DialogDescription>
              Selected rows: {selectedCount}. Choose merge type and finish.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Company</p>
              <Select
                value={targetCompanyId}
                onValueChange={setTargetCompanyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    ...(companies || []),
                    { value: 'other', text: 'Other' },
                  ].map((company: any) => (
                    <SelectItem
                      key={company.value || company.companyID}
                      value={(company.value || company.companyID)?.toString()}
                    >
                      {company.text || company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <p className="text-sm font-medium">Merge Option</p>
              <Select value={mergeType} onValueChange={setMergeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select merge option" />
                </SelectTrigger>
                <SelectContent>
                  {MERGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            {targetCompanyId === 'other' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Enter Company Name</p>
                <Input
                  value={newCompany}
                  onChange={(event) => setNewCompany(event.target.value)}
                  placeholder=""
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              className="bg-[#115e59] hover:bg-[#0d4a46]"
              onClick={handleFinish}
              disabled={finishDisabled || mergeCompanyLoading}
            >
              {mergeCompanyLoading ? 'Merging...' : 'Finish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingCompanyList;
