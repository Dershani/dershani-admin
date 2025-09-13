import { PageTitle } from '@/hooks/page-title';
import { subjectCollection } from '@/integrations/collections/subjects';
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

export const Route = createFileRoute('/dash/_sidebar/subjects/')({
  ...notFoundRedirectOptions('/dash/subjects'),
  component: RouteComponent,
});

function RouteComponent() {
  'use no memo';
  const { data } = useLiveQuery(q => q.from({ lesson: subjectCollection }));
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
      <PageTitle>Konular</PageTitle>
      <Datatable table={table} columns={columns} />
      <TableNav table={table} />
    </div>
  );
}
