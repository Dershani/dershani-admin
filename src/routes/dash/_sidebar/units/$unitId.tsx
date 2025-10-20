import { PageTitle } from '@/hooks/page-title';
import { collections } from '@/integrations/collections';
import { subjectCollection } from '@/integrations/collections/subjects';
import { eq, useLiveQuery } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Datatable, TableNav } from '@/components/datatable';

import { notFoundRedirectOptions } from '@/lib/redirect-route-options';

import { columns } from '../subjects/-columns';

export const Route = createFileRoute('/dash/_sidebar/units/$unitId')({
  ...notFoundRedirectOptions('/dash/units'),
  component: RouteComponent,
});

function RouteComponent() {
  'use no memo';
  const { unitId } = Route.useParams();
  const {
    data: [unit],
    isLoading,
  } = useLiveQuery(q =>
    q
      .from({ units: collections.units })
      .where(({ units }) => eq(units.id, Number(unitId)))
  );

  const { data: subjectsData } = useLiveQuery(q =>
    q
      .from({ subjects: subjectCollection })
      .where(({ subjects }) => eq(subjects.unit, Number(unitId)))
  );
  const table = useReactTable({
    data: subjectsData ?? [],
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
      <PageTitle>
        {!isLoading
          ? `Ünite - ${unit?.name} - ${unit?.class_no}. Sınıf`
          : 'Ünite -'}
      </PageTitle>
      <Datatable isLoading={isLoading} table={table} columns={columns} />
      <TableNav table={table} />
    </div>
  );
}
