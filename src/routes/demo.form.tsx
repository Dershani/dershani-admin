import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import { useAppForm } from '../hooks/form';

export const Route = createFileRoute('/demo/form')({
  component: SimpleForm,
});

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  finish: z.boolean(),
});

function SimpleForm() {
  const form = useAppForm({
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      // Show success message
      alert('Form submitted successfully!');
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-2xl p-8 rounded-xl">
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.AppField name="title">
            {field => <field.TextField label="Title" />}
          </form.AppField>

          <form.AppField name="description">
            {field => <field.TextArea label="Description" />}
          </form.AppField>

          <form.AppField name="finished">
            {field => <field.Switch label="Description" />}
          </form.AppField>

          <div className="flex justify-end">
            <form.AppForm>
              <form.SubscribeButton label="Submit" />
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  );
}
