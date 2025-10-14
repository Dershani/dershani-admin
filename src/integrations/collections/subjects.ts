import { queryCollectionOptions } from '@tanstack/query-db-collection';
import { createCollection } from '@tanstack/react-db';

import { api } from '@/lib/api';

import { getContext } from '../tanstack-query/root-provider';

export const subjectCollection = createCollection(
  queryCollectionOptions({
    startSync: true,
    queryClient: getContext().queryClient,
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await api.GET('/subjects/admin');
      if (res.error) throw new Error('Lesson fetch error');
      return res.data;
    },
    getKey: item => item.id,
    // Handle all CRUD operations
    onInsert: async ({ transaction }) => {
      const { modified: newTodo } = transaction.mutations[0];
      await api.PUT('/subjects/', {
        body: newTodo,
      });
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      if (original.id !== modified.id) throw new Error('Subject Id değişemez');
      await api.PATCH('/subjects/{id}', {
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
      await api.DELETE('/subjects/{id}', {
        params: {
          path: {
            id: original.id,
          },
        },
      });
    },
  })
);
