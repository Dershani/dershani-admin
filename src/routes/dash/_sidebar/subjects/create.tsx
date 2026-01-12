import { useMemo } from 'react';

import { PageTitle } from '@/hooks/page-title';
import { collections } from '@/integrations/collections';
import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type } from 'arktype';

import { useAppForm } from '@/components/form';

export const Route = createFileRoute('/dash/_sidebar/subjects/create')({
  component: RouteComponent,
});

const onSubmitSchema = type({
  name: 'string',
  name_normalized: 'string',
  unit: 'number',
  markdown: 'string',
  summary: 'string',
  finished: 'boolean',
});
type OnSubmitSchema = typeof onSubmitSchema.infer;

function RouteComponent() {
  const navigator = useNavigate();

  const { data: units } = useLiveQuery(q =>
    q.from({ lesson: collections.units })
  );

  const unitsFilter = useMemo(() => {
    return units.map(e => ({
      label: e.name,
      value: e.id,
    }));
  }, [units.length]);

  const { data: subjects } = useLiveQuery(q =>
    q.from({ subjects: collections.subjects })
  );
  const form = useAppForm({
    defaultValues: {} as OnSubmitSchema,
    validators: {
      onSubmit: onSubmitSchema,
    },
    onSubmit({ value }) {
      const u = collections.units.get(value.unit);
      if (!u) throw new Error('Seçili ünite mevcut değil');
      collections.subjects.insert({
        id: subjects.length + 1,
        name: value.name,
        name_normalized: value.name_normalized,
        markdown: value.markdown,

        lesson: u.lesson,
        unit: value.unit,

        summary: value.summary,
        finished: value.finished,
      });
      navigator({ to: '/dash/subjects' });
    },
    onSubmitInvalid: (...e) => {
      console.log(e, e[0].formApi.getAllErrors());
    },
  });
  return (
    <div className="space-y-4">
      <PageTitle>Yeni Konu Ekle</PageTitle>
      <form.AppForm>
        <form.FormBase>
          <form.AppField name="name">
            {field => <field.TextField label="İsim" />}
          </form.AppField>
          <form.AppField name="name_normalized">
            {field => <field.TextField label="URL İsim" />}
          </form.AppField>

          <form.AppField name="finished">
            {field => <field.Switch label="Yayına hazır mı" />}
          </form.AppField>

          <form.AppField name="unit">
            {field => (
              <field.SearchableSelect label="Ünite" values={unitsFilter} />
            )}
          </form.AppField>

          <form.AppField name="markdown">
            {field => <field.MDEditor label="İçerik" />}
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
