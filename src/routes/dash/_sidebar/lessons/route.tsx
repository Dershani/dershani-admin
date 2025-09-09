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

export const Route = createFileRoute('/dash/_sidebar/lessons')({
  ...notFoundRedirectOptions('/dash/lessons'),
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queryApi.queryOptions('get', '/lessons/'));
  },
});

function RouteComponent() {
  'use no memo';
  const queryData = queryApi.useQuery('get', '/lessons/');
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
      <PageTitle>Dersler</PageTitle>
      <Datatable
        isLoading={queryData.isLoading}
        table={table}
        columns={columns}
      />
      <TableNav table={table} />
    </div>
  );
}
