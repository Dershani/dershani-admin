import { PageTitle } from '@/hooks/page-title';
import { collections } from '@/integrations/collections';
import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Datatable, TableNav } from '@/components/datatable';

import { notFoundRedirectOptions } from '@/lib/redirect-route-options';

import { columns } from './-columns';

export const Route = createFileRoute('/dash/_sidebar/lessons')({
  ...notFoundRedirectOptions('/dash/lessons'),
  component: RouteComponent,
});

function RouteComponent() {
  'use no memo';
  const { data: lessons, isLoading } = useLiveQuery(q =>
    q.from({ lesson: collections.lessons })
  );
  const table = useReactTable({
    data: lessons ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      <Datatable isLoading={isLoading} table={table} columns={columns} />
      <TableNav table={table} />
    </div>
  );
}
