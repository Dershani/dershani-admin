import { createFormHook } from '@tanstack/react-form';

import { MDEditor } from '@/components/form/tanstack-markdown-editor';

import {
  FormBase,
  Select,
  SubscribeButton,
  Switch,
  TextArea,
  TextField,
} from '../components/form-components';
import { fieldContext, formContext } from './form-context';

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    Switch,
    MDEditor,
  },
  formComponents: {
    SubscribeButton,
    FormBase,
  },
  fieldContext,
  formContext,
});
