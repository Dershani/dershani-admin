import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import { MDEditor } from '@/components/form/tanstack-markdown-editor';

import {
  FormBase,
  SearchableSelect,
  Select,
  SubscribeButton,
  Switch,
  TextArea,
  TextField,
} from './form-components';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    Switch,
    MDEditor,
    SearchableSelect,
  },
  formComponents: {
    SubscribeButton,
    FormBase,
  },
  fieldContext,
  formContext,
});
