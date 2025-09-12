import { useState } from 'react';

import { lessonCollection } from '@/integrations/collections/lessons';
import { ColumnDef } from '@tanstack/react-table';
import { type } from 'arktype';
import { EditIcon } from 'lucide-react';

import { useAppForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    defaultValues: row,
    validators: {
      onSubmit: type({
        id: 'number',
        name: 'string',
        name_normalized: 'string',
      }),
    },
    onSubmit: ({ value }) => {
      lessonCollection.update(value.id, draft => {
        draft.name = value.name;
        draft.name_normalized = value.name_normalized;
      });
      setOpen(false);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
