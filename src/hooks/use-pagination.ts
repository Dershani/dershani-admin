import { useNavigate, useSearch } from '@tanstack/react-router';
import { PaginationState, Updater } from '@tanstack/react-table';

export const usePagination = () => {
  const page = useSearch({
    select: ({ page }) => page,
    strict: false,
  });
  const navigate = useNavigate();
  const setPage = (n: number) => {
    navigate({
      // @ts-ignore
      search: p => ({ ...p, page: n }),
    });
  };

  const onPaginationChange = (u: Updater<PaginationState>) => {
    const n =
      typeof u === 'function'
        ? u({
            pageIndex: page ?? 0,
            pageSize: 14,
          })
        : u;
    setPage(n.pageIndex);
  };
  return {
    onPaginationChange,
    pagination: {
      pageIndex: page ?? 0,
      pageSize: 14,
    },
    setPage,
  };
};
