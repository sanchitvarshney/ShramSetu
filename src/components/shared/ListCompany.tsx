import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ColDef } from 'ag-grid-community';
import Loading from '@/components/reusable/Loading';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CompanyInfoContent } from '@/components/ui/companyInfo';
import { useToast } from '@/components/ui/use-toast';
import { Copy } from 'lucide-react';
import { toProperCaseName } from '@/lib/utils';

const ListCompany = () => {
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) setSelectedCompanyId(null);
  };

  const { companies, loadingCompaniesList } = useSelector(
    (state: RootState) => state.adminPage,
  );

  const defaultColDef = useMemo(
    () => ({
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }),
    [],
  );



  const actionCellRenderer = (params: any) => {
    const companyId = params.data?.companyID;
    const name = params.data?.name ?? '';
    return (
      <div className="flex">
        <button
          type="button"
          onClick={() => companyId && handleCompanyClick?.(companyId)}
          className="text-teal-500 hover:text-teal-600 hover:underline text-left cursor-pointer bg-transparent border-none"
          aria-label="Show Details"
        >
          {name}
        </button>
      </div>
    );
  };

  const websiteCellRenderer = (params: any) => {
    const website = params.value as string | undefined;

    const handleCopy = async () => {
      if (!website) return;
      try {
        await navigator.clipboard.writeText(website);
        toast({
          title: 'Copied',
          description: 'Website copied to clipboard.',
        });
      } catch {
        toast({
          variant: 'destructive',
          title: 'Copy failed',
          description: 'Unable to copy website.',
        });
      }
    };

    if (!website) return '—';

    const href = /^https?:\/\//i.test(website) ? website : `https://${website}`;

    return (
      <div className="flex items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-teal-500 hover:text-teal-600 hover:underline truncate"
        >
          {website}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="text-slate-600 hover:text-slate-800"
          aria-label="Copy website"
          title="Copy website"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const columnDefs: ColDef[] = [
    {
      headerName: '#',
      field: 'text',
      maxWidth: 60,
      valueGetter: 'node.rowIndex + 1',
    },
    {
      headerName: 'Company Name',
      field: 'name',
      cellRenderer: actionCellRenderer,
      valueFormatter: (params) => toProperCaseName(params.value ?? ''),
    },
    {
      headerName: 'Brand',
      field: 'brand',
      valueFormatter: (params) => params.value ?? '—',
    },
    {
      headerName: 'Contact Name',
      field: 'contactName',
      valueFormatter: (params) => toProperCaseName(params.value ?? ''),
    },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Mobile', field: 'mobile' },
    {
      headerName: 'Website',
      field: 'website',
      cellRenderer: websiteCellRenderer,
    },
    {
      headerName: 'Created by',
      field: 'insertBy',
    },
    { headerName: 'Created At', field: 'insertDt' },
    // {
    //   headerName: 'Active Status',
    //   field: 'activeStatus',
    //   valueGetter: (params) =>
    //     params.data?.activeStatus === 'A' ? 'Active' : 'Not Active',
    // },
  ];

  return (
    <div className="ag-theme-quartz h-[calc(100vh-80px)] p-2">
      {loadingCompaniesList && <Loading />}
      <AgGridReact
        rowData={companies || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        suppressCellFocus={true}
      />

      <Sheet open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
        <SheetContent
          side="right"
          className="flex flex-col h-full w-full sm:max-w-2xl overflow-hidden p-0 gap-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Company details</SheetTitle>
          </SheetHeader>
          {selectedCompanyId && (
            <CompanyInfoContent companyId={selectedCompanyId} embedded />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ListCompany;
