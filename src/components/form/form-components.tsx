import { useMemo, useState } from 'react';

import { useStore } from '@tanstack/react-form';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import * as ShadcnSelect from '@/components/ui/select';
import { Slider as ShadcnSlider } from '@/components/ui/slider';
import { Switch as ShadcnSwitch } from '@/components/ui/switch';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';

import { cn } from '@/lib/utils';

import { useFieldContext, useFormContext } from '.';

export function FormBase({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const form = useFormContext();
  return (
    <form
      className={cn('*:max-w-160 space-y-4', className)}
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {children}
    </form>
  );
}

export function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}

export function ErrorMessages({
  errors,
}: {
  errors: Array<string | { message: string }>;
}) {
  return (
    <>
      {errors.map(error => (
        <div
          key={typeof error === 'string' ? error : error.message}
          className="text-red-500 mt-1 font-bold"
        >
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </>
  );
}

export function TextField({
  label,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  label: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  disabled?: boolean;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, state => state.meta.errors);

  return (
    <div>
      <Label htmlFor={label} className="mb-2 font-semibold">
        {label}
      </Label>
      <Input
        value={field.state.value ?? ''}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
        type={type}
        disabled={disabled}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function TextArea({
  label,
  rows = 3,
}: {
  label: string;
  rows?: number;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, state => state.meta.errors);

  return (
    <div>
      <Label htmlFor={label} className="mb-2 font-semibold">
        {label}
      </Label>
      <ShadcnTextarea
        id={label}
        value={field.state.value}
        onBlur={field.handleBlur}
        rows={rows}
        onChange={e => field.handleChange(e.target.value)}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function Select({
  label,
  values,
  placeholder = 'Seçiniz..',
}: {
  label: string;
  values: Array<{ label: string; value: string | number }>;
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, state => state.meta.errors);

  return (
    <div>
      <Label className="mb-2 font-semibold">{label}</Label>
      <ShadcnSelect.Select
        multiple={false}
        items={values}
        name={field.name}
        value={field.state.value ?? ''}
        onValueChange={value => field.handleChange(value as string)}
      >
        <ShadcnSelect.SelectTrigger className="w-full">
          <ShadcnSelect.SelectValue placeholder={placeholder ?? ''} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectPositioner>
          <ShadcnSelect.SelectContent>
            <ShadcnSelect.SelectGroup>
              <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
              {values.map(value => (
                <ShadcnSelect.SelectItem key={value.value} value={value.value}>
                  {value.label}
                </ShadcnSelect.SelectItem>
              ))}
            </ShadcnSelect.SelectGroup>
          </ShadcnSelect.SelectContent>
        </ShadcnSelect.SelectPositioner>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function SearchableSelect({
  label,
  values,
  placeholder = 'Seçiniz..',
  searchPlaceholder = 'Ara...',
  emptyMessage = 'Bulunamadı',
  maxItemsRendered = 10,
  name,
  className,
}: {
  label: string;
  values: Array<{ label: string; value: string | number }>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxItemsRendered?: number;
  name?: string;
  className?: string;
}) {
  const field = useFieldContext<string | number>();
  const errors = useStore(field.store, state => state.meta.errors);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredValues = useMemo(() => {
    if (!searchQuery) return values;

    const query = searchQuery.toLowerCase();
    return values.filter(
      item =>
        item.label.toLowerCase().includes(query) ||
        String(item.value).toLowerCase().includes(query)
    );
  }, [values, searchQuery]);

  // Virtualization: only render the first maxItemsRendered items
  const virtualizedValues = useMemo(() => {
    return filteredValues.slice(0, maxItemsRendered);
  }, [filteredValues, maxItemsRendered]);

  const selectedItem = values.find(item => item.value === field.state.value);

  return (
    <div>
      <div className={cn('flex flex-col gap-2', className)}>
        <Label className="font-semibold">{label}</Label>
        <input type="hidden" name={name} value={field.state.value ?? ''} />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-transparent"
            >
              {selectedItem ? selectedItem.label : placeholder}
              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {virtualizedValues.map(item => (
                    <CommandItem
                      key={item.value}
                      value={String(item.value)}
                      onSelect={() => {
                        field.handleChange(item.value);
                        setOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 size-4',
                          field.state.value === item.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {filteredValues.length > maxItemsRendered && (
                  <div className="border-t py-2 px-2 text-xs text-muted-foreground text-center">
                    Showing {maxItemsRendered} of {filteredValues.length}{' '}
                    results
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function Slider({ label }: { label: string }) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, state => state.meta.errors);

  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <ShadcnSlider
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={value => field.handleChange(value[0])}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function Switch({ label }: { label: string }) {
  const field = useFieldContext<boolean>();
  const errors = useStore(field.store, state => state.meta.errors);

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={label}
          onBlur={field.handleBlur}
          checked={field.state.value ?? false}
          onCheckedChange={checked => field.handleChange(checked)}
        />
        <Label htmlFor={label}>{label}</Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
