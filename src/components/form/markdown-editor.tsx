import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import katex from 'katex';
import 'katex/dist/katex.css';
import rehypeKatex from 'rehype-katex';
import { getCodeString } from 'rehype-rewrite';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkMath from 'remark-math';

import { getCommands, getExtraCommands } from './markdown-editor-toolbar';
import './react-islands';
import { rehypeReactIsland } from './rehype-react-island';

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'code', 'react-island'],
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
        components: {},
        rehypePlugins: [
          [rehypeSanitize, schema],
          rehypeKatex,
          rehypeReactIsland,
        ],
        remarkPlugins: [remarkMath],
        allowElement: element => {
          const t = schema.tagNames.includes(element.tagName);
          if (!t) element.tagName;
          return t;
        },
        allowedElements: schema.tagNames,
      }}
    />
  );
}

export default MarkdownEditor;
