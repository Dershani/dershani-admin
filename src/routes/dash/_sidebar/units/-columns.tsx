import { useState } from 'react';

import { ClassOptionsSelect } from '@/constants/filter-options';
import { useLessonsSelectOptions } from '@/hooks/use-lessons-units-select-options';
import { unitCollection } from '@/integrations/collections/units';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { type } from 'arktype';
import { EditIcon, LinkIcon } from 'lucide-react';

import { useAppForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ApiReturnTypes, queryApi } from '@/lib/api';

export const columns: ColumnDef<ApiReturnTypes<'/units/'>[number]>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => (
      <Link
        to="/dash/units/$unitId"
        params={{ unitId: row.original.id.toString() }}
        className="flex gap-2 justify-center items-center"
      >
        {row.original.id}
        <LinkIcon className="size-3" />
      </Link>
    ),
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
    accessorKey: 'summary',
    header: 'Özet',
    cell: ({ getValue }) => (
      <span className="max-w-50 truncate block">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'summary_length',
    header: 'Özet Uzunluğu',
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
  {
    header: 'Aksiyon',
    cell: ({ row }) => <EditRow row={row.original} />,
  },
];

function EditRow({ row }: { row: ApiReturnTypes<'/units/'>[number] }) {
  const [open, setOpen] = useState(false);
  const lessonsSelectValues = useLessonsSelectOptions();

  const form = useAppForm({
    defaultValues: row,
    validators: {
      onSubmit: type({
        id: 'number',
        lesson: 'number',
        class_no: 'number',
        summary: 'string',
        name: 'string',
        name_normalized: 'string',
      }),
    },
    onSubmit: ({ value }) => {
      unitCollection.update(value.id, draft => {
        draft.lesson = value.lesson;
        draft.class_no = value.class_no;
        draft.summary = value.summary;
        draft.summary_length = value.summary?.length ?? draft.summary_length;
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
              <form.AppField name="class_no">
                {field => (
                  <field.Select label="Sınıf" values={ClassOptionsSelect} />
                )}
              </form.AppField>
              <form.AppField name="summary">
                {field => <field.TextArea label="Özet" />}
              </form.AppField>
              <form.AppField name="lesson">
                {field => (
                  <field.Select label="Ders" values={lessonsSelectValues} />
                )}
              </form.AppField>
              <form.SubscribeButton label="Kaydet" />
            </form.FormBase>
          </form.AppForm>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
