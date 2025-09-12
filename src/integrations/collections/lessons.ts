import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';

import { api } from '@/lib/api';

import { getContext } from '../tanstack-query/root-provider';

export const lessonCollection = createCollection(
  queryCollectionOptions({
    queryClient: getContext().queryClient,
    queryKey: ['lessons'],
    queryFn: async () => {
      const res = await api.GET('/lessons/');
      if (res.error) throw new Error('Lesson fetch error');
      return res.data;
    },
    getKey: item => item.id,
    // Handle all CRUD operations
    onInsert: async ({ transaction }) => {
      const { modified: newTodo } = transaction.mutations[0];
      await api.PUT('/lessons/', {
        body: newTodo,
      });
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      if (original.id !== modified.id) throw new Error('Lesson Id değişemez');
      await api.PATCH('/lessons/{id}', {
        params: {
          path: {
            id: original.id,
          },
        },
        body: modified,
      });
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];
      await api.DELETE('/lessons/{id}', {
        params: {
          path: {
            id: original.id,
          },
        },
      });
    },
  })
);
