import { ColumnDef } from '@tanstack/react-table';

import { components } from '@/lib/types/api-schema';

export const columns: ColumnDef<components['schemas']['lesson']>[] = [
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
];
