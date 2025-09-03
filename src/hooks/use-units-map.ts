import { useQuery } from '@tanstack/react-query';

import { queryApi } from '@/lib/api';

export const useUnitsMap = () => {
  const unitsMap = useQuery({
    queryKey: ['units-set'],
    queryFn: async ({ client }) => {
      const units = await client.fetchQuery(
        queryApi.queryOptions('get', '/units/')
      );
      return new Map(units.map(e => [e.id, e]));
    },
  });

  return unitsMap.data;
};
