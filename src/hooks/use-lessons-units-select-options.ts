import { useMemo } from 'react';

import { lessonCollection } from '@/integrations/collections/lessons';
import { unitCollection } from '@/integrations/collections/units';
import { useLiveQuery } from '@tanstack/react-db';

export const useLessonsSelectOptions = () => {
  const { data: lessons } = useLiveQuery(q =>
    q.from({ lesson: lessonCollection })
  );
  const lessonsSelectValues = useMemo(() => {
    if (!lessons) return [];
    return lessons.map(e => ({ label: e.name, value: e.id })) ?? [];
  }, [lessons]);

  return lessonsSelectValues;
};

export const useUnitsSelectOptions = () => {
  const { data: units } = useLiveQuery(q => q.from({ units: unitCollection }));
  const unitsSelectValues = useMemo(() => {
    if (!units) return [];
    return units.map(e => ({ label: e.name, value: e.id })) ?? [];
  }, [units]);

  return unitsSelectValues;
};
