import { useMemo } from 'react';

import { ClassOptionsSelect } from '@/constants/filter-options';
import { PageTitle } from '@/hooks/page-title';
import { collections } from '@/integrations/collections';
import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type } from 'arktype';

import { useAppForm } from '@/components/form';

export const Route = createFileRoute('/dash/_sidebar/units/create')({
  component: RouteComponent,
});

const onSubmitSchema = type({
  name: 'string',
  name_normalized: 'string',
  lesson: 'number',
  class_no: 'number',
  summary: 'string | null',
});
type OnSubmitSchema = typeof onSubmitSchema.infer;

function RouteComponent() {
  const navigator = useNavigate();
  const { data: lessons } = useLiveQuery(q =>
    q.from({ lesson: collections.lessons })
  );

  const lessonsFilter = useMemo(() => {
    return lessons.map(e => ({
      label: e.name,
      value: e.id,
    }));
  }, [lessons.length]);

  const { data: units } = useLiveQuery(q =>
    q.from({ lesson: collections.units })
  );
  const form = useAppForm({
    defaultValues: {} as OnSubmitSchema,
    validators: {
      onSubmit: onSubmitSchema,
    },
    onSubmit({ value }) {
      collections.units.insert({
        id: units.length + 1,
        name: value.name,
        name_normalized: value.name_normalized,
        lesson: value.lesson,
        class_no: value.class_no,
        summary: value.summary,
        summary_length: value.summary?.length ?? 0,
      });
      navigator({ to: '/dash/units' });
    },
    onSubmitInvalid: (...e) => {
      console.log(e);
    },
  });
  return (
    <div className="space-y-4">
      <PageTitle>Yeni Ünite Ekle</PageTitle>
      <form.AppForm>
        <form.FormBase>
          <form.AppField name="name">
            {field => <field.TextField label="İsim" />}
          </form.AppField>
          <form.AppField name="name_normalized">
            {field => <field.TextField label="URL İsim" />}
          </form.AppField>

          <form.AppField name="lesson">
            {field => <field.Select label="Ders" values={lessonsFilter} />}
          </form.AppField>

          <form.AppField name="class_no">
            {field => (
              <field.Select label="Sınıf" values={ClassOptionsSelect} />
            )}
          </form.AppField>

          <form.AppField name="summary">
            {field => <field.MDEditor label="Özet" />}
          </form.AppField>

          <form.SubscribeButton label="Kaydet" />
        </form.FormBase>
      </form.AppForm>
    </div>
  );
}
