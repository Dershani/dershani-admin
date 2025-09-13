import { PageTitle } from '@/hooks/page-title';
import { lessonCollection } from '@/integrations/collections/lessons';
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

export const Route = createFileRoute('/dash/_sidebar/lessons')({
  ...notFoundRedirectOptions('/dash/lessons'),
  component: RouteComponent,
});

function RouteComponent() {
  'use no memo';
  const { data: lessons } = useLiveQuery(q =>
    q.from({ lesson: lessonCollection })
  );
  const table = useReactTable({
    data: lessons ?? [],
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
      <Datatable table={table} columns={columns} />
      <TableNav table={table} />
    </div>
  );
}
