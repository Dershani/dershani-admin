import { PageTitle } from '@/hooks/page-title';
import { usePagination } from '@/hooks/use-pagination';
import { collections } from '@/integrations/collections';
import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type } from 'arktype';

import { Datatable, TableNav } from '@/components/datatable';

import { notFoundRedirectOptions } from '@/lib/redirect-route-options';

import { columns } from './-columns';

export const Route = createFileRoute('/dash/_sidebar/subjects/')({
  ...notFoundRedirectOptions('/dash/subjects'),
  component: RouteComponent,
  validateSearch: type({
    'page?': 'number',
  }),
});

function RouteComponent() {
  'use no memo';
  const { pagination, onPaginationChange } = usePagination();
  const { data, isLoading } = useLiveQuery(q =>
    q.from({ subjects: collections.subjects })
  );
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: {
      pagination,
    },
    onPaginationChange,
  });

  return (
    <div className="space-y-4">
      <PageTitle>Konular</PageTitle>
      <Datatable isLoading={isLoading} table={table} columns={columns} />
      <TableNav table={table} />
    </div>
  );
}
