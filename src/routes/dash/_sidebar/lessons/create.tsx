import { PageTitle } from '@/hooks/page-title';
import { collections } from '@/integrations/collections';
import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type } from 'arktype';

import { useAppForm } from '@/components/form';

export const Route = createFileRoute('/dash/_sidebar/lessons/create')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigator = useNavigate();
  const { data: lessons } = useLiveQuery(q =>
    q.from({ lesson: collections.lessons })
  );
  const form = useAppForm({
    defaultValues: { id: 0, name: '', name_normalized: '' },
    validators: {
      onSubmit: type({
        id: 'number',
        name: 'string',
        name_normalized: 'string',
      }),
    },
    onSubmit({ value }) {
      collections.lessons.insert({
        id: lessons.length + 1,
        name: value.name,
        name_normalized: value.name_normalized,
      });
      navigator({ to: '/dash/lessons' });
    },
  });
  return (
    <div className="space-y-4">
      <PageTitle>Yeni Ders Ekle</PageTitle>
      <form.AppForm>
        <form.FormBase>
          <form.AppField name="name">
            {field => <field.TextField label="İsim" />}
          </form.AppField>
          <form.AppField name="name_normalized">
            {field => <field.TextField label="URL İsim" />}
          </form.AppField>

          <form.SubscribeButton label="Kaydet" />
        </form.FormBase>
      </form.AppForm>
    </div>
  );
}
