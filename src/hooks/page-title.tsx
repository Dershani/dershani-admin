import { createContext, useContext, useEffect, useState } from 'react';

const TitleContext = createContext<
  | [
      string | undefined,
      React.Dispatch<React.SetStateAction<string | undefined>>,
    ]
  | null
>(null);

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | undefined>('');
  return <TitleContext value={[title, setTitle]}>{children}</TitleContext>;
}

export const usePageTitle = () => {
  const title = useContext(TitleContext)!;
  return title;
};

export const PageTitle = ({ children }: { children: string }) => {
  const [title, setTitle] = usePageTitle();
  useEffect(() => {
    if (title !== children) setTitle(children);
  }, [title, children]);
  return null;
};
