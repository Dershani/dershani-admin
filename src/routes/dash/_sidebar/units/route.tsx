import { PageTitle } from '@/hooks/page-title';
import { createFileRoute } from '@tanstack/react-router';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Datatable, TableNav } from '@/components/datatable';

import { queryApi } from '@/lib/api';
import { notFoundRedirectOptions } from '@/lib/redirect-route-options';

import { columns } from './-columns';

export const Route = createFileRoute('/dash/_sidebar/units')({
  ...notFoundRedirectOptions('/dash/units'),
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queryApi.queryOptions('get', '/units/'));
  },
});

function RouteComponent() {
  'use no memo';
  const queryData = queryApi.useQuery('get', '/units/');
  const table = useReactTable({
    data: queryData.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageSize: 14,
      },
    },
  });

  return (
    <div className="space-y-4">
      <PageTitle>Üniteler</PageTitle>
      <Datatable
        isLoading={queryData.isLoading}
        table={table}
        columns={columns}
      />
      <TableNav table={table} />
    </div>
  );
}
