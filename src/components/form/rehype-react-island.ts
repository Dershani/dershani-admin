import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const map: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Rehype plugin to transform `{{ Component }}` into
 * <react-island data-name="Component"></react-island>
 */
export const rehypeReactIsland: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || !node.value) return;

      const trimmed = node.value.trim();
      if (trimmed.startsWith('{{') && trimmed.endsWith('}}')) {
        const content = trimmed.slice(2, -2).trim();

        if (parent.type !== 'element') return;

        parent.tagName = 'react-island';
        parent.properties = { 'data-name': escapeHtml(content) };
        parent.children = [];
      }
    });
  };
};
