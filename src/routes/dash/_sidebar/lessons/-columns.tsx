import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { type } from 'arktype';
import { EditIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { api, queryApi } from '@/lib/api';
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
  {
    header: 'Aksiyon',
    cell: ({ row }) => <EditRow row={row.original} />,
  },
];

function EditRow({ row }: { row: components['schemas']['lesson'] }) {
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: row,
    validators: {
      onSubmit: type({
        id: 'number',
        name: 'string',
        name_normalized: 'string',
      }),
    },
    onSubmit: async ({ value }) => {
      const res = await api.PATCH('/lessons/{id}', {
        params: {
          path: { id: value.id },
        },
        body: value,
      });
      if (res.error) {
        console.log(res.error);
        toast.error(res);
      }

      await queryClient.setQueryData(
        queryApi.queryOptions('get', '/lessons/').queryKey,
        res.data
      );
    },
  });
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size={'datatable'} variant={'outline'}>
            <EditIcon className="size-3" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Değişiklik Yap</DialogTitle>
          <form.AppForm>
            <form.FormBase>
              <form.AppField name="id">
                {field => <field.TextField label="Id" type="number" disabled />}
              </form.AppField>
              <form.AppField name="name">
                {field => <field.TextField label="İsim" />}
              </form.AppField>
              <form.AppField name="name_normalized">
                {field => <field.TextField label="URL İsim" />}
              </form.AppField>
              <form.SubscribeButton label="Kaydet" />
            </form.FormBase>
          </form.AppForm>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
