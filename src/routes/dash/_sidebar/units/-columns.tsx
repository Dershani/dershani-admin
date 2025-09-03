import { ColumnDef } from '@tanstack/react-table';

import { queryApi } from '@/lib/api';
import { components } from '@/lib/types/api-schema';

export const columns: ColumnDef<components['schemas']['unit']>[] = [
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
    accessorKey: 'class_no',
    header: 'Sınıf',
    cell: ({ getValue }) => <span>{getValue() as number}. Sınıf</span>,
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
];
