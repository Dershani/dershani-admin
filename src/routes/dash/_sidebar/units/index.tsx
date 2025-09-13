import { PageTitle } from '@/hooks/page-title';
import { unitCollection } from '@/integrations/collections/units';
import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Datatable, TableNav } from '@/components/datatable';

import { notFoundRedirectOptions } from '@/lib/redirect-route-options';

import { columns } from './-columns';

export const Route = createFileRoute('/dash/_sidebar/units/')({
  ...notFoundRedirectOptions('/dash/units'),
  component: RouteComponent,
});

function RouteComponent() {
  'use no memo';
  const { data, isLoading } = useLiveQuery(q =>
    q.from({ lesson: unitCollection })
  );
  const table = useReactTable({
    data: data ?? [],
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
      <Datatable isLoading={isLoading} table={table} columns={columns} />
      <TableNav table={table} />
    </div>
  );
}
