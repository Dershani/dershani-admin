import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import katex from 'katex';
import 'katex/dist/katex.css';
import { getCodeString } from 'rehype-rewrite';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import { getCommands, getExtraCommands } from './markdown-editor-toolbar';
import './react-islands';
import { rehypeReactIsland } from './rehype-react-island';

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'react-island'],
  attributes: {
    ...defaultSchema.attributes,
    'react-island': ['data-name'],
  },
};

export function MarkdownEditor({
  id,
  value,
  onChange,
  onBlur,
}: {
  id: string;
  value: MDEditorProps['value'];
  onChange: MDEditorProps['onChange'];
  onBlur: MDEditorProps['onBlur'];
}) {
  return (
    // @ts-ignore
    <MDEditor
      value={value ?? ''}
      onChange={onChange}
      minHeight={600}
      height={600}
      onBlur={onBlur}
      textareaProps={{ id }}
      className="w-full max-w-full"
      style={
        {
          '--md-editor-font-family': 'var(--font-family)',
        } as React.CSSProperties
      }
      commands={getCommands()}
      extraCommands={getExtraCommands()}
      previewOptions={{
        components: {
          code: ({ children = [], className, ...props }) => {
            if (
              typeof children === 'string' &&
              /^\$\$(.*)\$\$/.test(children)
            ) {
              const html = katex.renderToString(
                children.replace(/^\$\$(.*)\$\$/, '$1'),
                {
                  throwOnError: false,
                }
              );
              return (
                <code
                  dangerouslySetInnerHTML={{ __html: html }}
                  style={{ background: 'transparent' }}
                />
              );
            }
            const code =
              props.node && props.node.children
                ? getCodeString(props.node.children)
                : children;
            if (
              typeof code === 'string' &&
              typeof className === 'string' &&
              /^language-katex/.test(className.toLocaleLowerCase())
            ) {
              const html = katex.renderToString(code, {
                throwOnError: false,
              });
              return (
                <code
                  style={{ fontSize: '150%' }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }
            return <code className={String(className)}>{children}</code>;
          },
        },
        rehypePlugins: [[rehypeSanitize, schema], rehypeReactIsland],
        allowElement: element => {
          return schema.tagNames.includes(element.tagName);
        },
        allowedElements: schema.tagNames,
      }}
    />
  );
}

export default MarkdownEditor;
