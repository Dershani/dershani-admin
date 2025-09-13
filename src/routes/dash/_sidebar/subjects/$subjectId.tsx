import { useEffect } from 'react';

import { PageTitle } from '@/hooks/page-title';
import {
  useLessonsSelectOptions,
  useUnitsSelectOptions,
} from '@/hooks/use-lessons-units-select-options';
import { subjectCollection } from '@/integrations/collections/subjects';
import { eq, useLiveQuery } from '@tanstack/react-db';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type } from 'arktype';

import { useAppForm } from '@/components/form';

import { notFoundRedirectOptions } from '@/lib/redirect-route-options';

export const Route = createFileRoute('/dash/_sidebar/subjects/$subjectId')({
  ...notFoundRedirectOptions('/dash/subjects'),
  component: RouteComponent,
});

function RouteComponent() {
  'use no memo';
  const { subjectId } = Route.useParams();
  const lessonsSelectValues = useLessonsSelectOptions();
  const unitsSelectValues = useUnitsSelectOptions();
  const navigator = useNavigate();
  const navigateBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    navigator({ to: '/dash/subjects' });
  };
  const {
    data: [subject],
    isLoading,
  } = useLiveQuery(q =>
    q
      .from({ subject: subjectCollection })
      .where(({ subject }) => eq(subject.id, Number(subjectId)))
  );

  const form = useAppForm({
    defaultValues: subject,
    validators: {
      onSubmit: type({
        id: 'number',
        lesson: 'number',
        unit: 'number',
        name: 'string',
        name_normalized: 'string',
        markdown: 'string',
        summary: 'string',
        finished: 'boolean',
      }),
    },
    onSubmit: ({ value }) => {
      subjectCollection.update(value.id, draft => {
        draft.lesson = value.lesson;
        draft.unit = value.unit;
        draft.name = value.name;
        draft.name_normalized = value.name_normalized;
        draft.markdown = value.markdown;
        draft.summary = value.summary;
        draft.finished = value.finished;
      });
      navigateBack();
    },
  });

  useEffect(() => {
    if (subject === undefined && !isLoading) {
      navigateBack();
    }
  }, [subject, isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageTitle>{`Konu - `}</PageTitle>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageTitle>{`Konu - ${subject?.name}`}</PageTitle>
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
          <form.AppField name="lesson">
            {field => (
              <field.Select label="Ders" values={lessonsSelectValues} />
            )}
          </form.AppField>
          <form.AppField name="unit">
            {field => <field.Select label="Ünite" values={unitsSelectValues} />}
          </form.AppField>
          <form.AppField name="markdown">
            {field => <field.MDEditor label="İçerik" />}
          </form.AppField>
          <form.AppField name="summary">
            {field => <field.MDEditor label="Özet" />}
          </form.AppField>
          <form.AppField name="finished">
            {field => <field.Switch label="Yayına hazır mı" />}
          </form.AppField>
          <form.SubscribeButton label="Kaydet" />
        </form.FormBase>
      </form.AppForm>
    </div>
  );
}
