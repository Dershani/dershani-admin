import { Suspense, lazy } from 'react';

import { useStore } from '@tanstack/react-form';

import { useFieldContext } from '@/components/form';

import { cn } from '@/lib/utils';

import { ErrorMessages } from '../form-components';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

const MarkdownEditor = lazy(() => import('./markdown-editor'));

export function MDEditor({
  label,
  parentClassName,
}: {
  label: string;
  parentClassName?: string;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, state => state.meta.errors);

  return (
    <div className={cn('max-w-full!', parentClassName)}>
      <Label htmlFor={field.name} className="mb-2 text-xl font-semibold">
        {label}
      </Label>
      <Suspense fallback={<Skeleton className="h-150" />}>
        <MarkdownEditor
          id={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e ?? '')}
        />
      </Suspense>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
