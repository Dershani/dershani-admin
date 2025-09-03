import { useUnitsMap } from '@/hooks/use-units-map';
import { ColumnDef } from '@tanstack/react-table';

import { queryApi } from '@/lib/api';
import { components } from '@/lib/types/api-schema';

export const columns: ColumnDef<components['schemas']['subject']>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: 'İsim',
  },
  {
    accessorKey: 'name_normalized',
    header: 'Normal İsim',
  },
  {
    accessorKey: 'lesson',
    header: 'Ders',
    cell: ({ getValue }) => {
      const { data } = queryApi.useQuery('get', '/lessons/');
      const v = getValue() as number;
      const l = data?.find(e => e.id === v);

      return <span>{l?.name}</span>;
    },
  },
  {
    accessorKey: 'unit',
    header: 'Ünite',
    cell: ({ getValue }) => {
      const v = getValue() as number;
      const unitSet = useUnitsMap();
      if (!unitSet) return <span>..</span>;
      const l = unitSet.get(v);

      return <span>{l?.name}</span>;
    },
  },
];
