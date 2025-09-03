import { useAppForm } from '@/hooks/form';
import { PageTitle } from '@/hooks/page-title';
import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { toast } from 'sonner';

export const Route = createFileRoute('/dash/_sidebar/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      key: '',
    },
    validators: {
      onSubmit: type({
        key: 'string',
      }),
    },
    onSubmit: async ({ value: { key } }) => {
      localStorage.setItem('auth-key', key);
      toast.success('Anahtar kaydedildi');
      return;
    },
  });

  return (
    <div className="space-y-6">
      <PageTitle>Auth Ayarları</PageTitle>
      <form.AppForm>
        <form.FormBase>
          <form.AppField name="key">
            {field => <field.TextField label="Anahtar" />}
          </form.AppField>
          <form.SubscribeButton label="Kaydet" />
        </form.FormBase>
      </form.AppForm>
    </div>
  );
}
