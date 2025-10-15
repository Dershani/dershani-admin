import { useEffect } from 'react';

import { PageTitle } from '@/hooks/page-title';
import {
  useLessonsSelectOptions,
  useUnitsSelectOptions,
} from '@/hooks/use-lessons-units-select-options';
import { collections } from '@/integrations/collections';
import { eq, useLiveQuery } from '@tanstack/react-db';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type } from 'arktype';

import { useAppForm } from '@/components/form';
import { Button } from '@/components/ui/button';

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
  } = useLiveQuery(
    q =>
      q
        .from({ subject: collections.subjects })
        .where(({ subject }) => eq(subject.id, Number(subjectId))),
    [subjectId]
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
    onSubmitMeta: {
      skipGoBack: false,
      goNext: false,
    },
    onSubmit({ value, meta }) {
      collections.subjects.update(value.id, draft => {
        draft.lesson = value.lesson;
        draft.unit = value.unit;
        draft.name = value.name;
        draft.name_normalized = value.name_normalized;
        draft.markdown = value.markdown;
        draft.summary = value.summary;
        draft.finished = value.finished;
      });
      if (!meta.skipGoBack) navigateBack();
      if (meta.goNext) {
        navigator({
          to: '/dash/subjects/$subjectId',
          params: {
            subjectId: (value.id + 1).toString(),
          },
        });
        form.reset();
      }
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
      <PageTitle>{`Konu - ${subject?.name} (${subject?.id})`}</PageTitle>
      <form.AppForm>
        <form.FormBase>
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
          <div className="flex gap-2">
            <form.SubscribeButton label="Kaydet" />
            <Button
              type="button"
              onClick={() => {
                console.log('GO NEXT', subjectId);
                form.handleSubmit({ skipGoBack: true, goNext: true });
              }}
            >
              Kaydet ve İlerle
            </Button>
          </div>
        </form.FormBase>
      </form.AppForm>
    </div>
  );
}
