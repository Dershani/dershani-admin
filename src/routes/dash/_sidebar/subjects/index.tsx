import { PageTitle } from '@/hooks/page-title';
import { usePagination } from '@/hooks/use-pagination';
import { collections } from '@/integrations/collections';
import { useLiveQuery } from '@tanstack/react-db';
import { Link, createFileRoute } from '@tanstack/react-router';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type } from 'arktype';

import { Datatable, TableNav } from '@/components/datatable';
import { Button } from '@/components/ui/button';

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
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    state: {
      pagination,
    },
    onPaginationChange,
  });

  return (
    <div className="space-y-4">
      <PageTitle>Konular</PageTitle>
      <div className="flex justify-end">
        <Button asChild>
          <Link to="/dash/subjects/create">Yeni Konu</Link>
        </Button>
      </div>
      <Datatable isLoading={isLoading} table={table} columns={columns} />
      <TableNav table={table} />
    </div>
  );
}
