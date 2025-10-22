import React, { Suspense, createElement, lazy } from 'react';
import { type Root, createRoot } from 'react-dom/client';

import { createInstance } from '@module-federation/enhanced/runtime';

import { Skeleton } from '@/components/ui/skeleton';

const instance = createInstance({
  name: 'admin-panel',
  remotes: [
    {
      name: 'react_islands',
      // never changes
      entry: 'https://react-islands.dershani.com/mf/mf-manifest.json',
    },
  ],
});

function Loading() {
  return <Skeleton className="h-32 w-32 bg-red-50" />;
}

function LoadIsland({ name }: { name: string }) {
  return (
    <Suspense fallback={<Loading />}>
      {createElement(
        lazy(
          () =>
            instance.loadRemote(name) as Promise<{
              default: React.FC;
            }>
        )
      )}
    </Suspense>
  );
}

class ReactIsland extends HTMLElement {
  private reactRoot: null | Root = null;
  private isMounted: boolean = false;
  constructor() {
    super();
  }
  connectedCallback() {
    const name = this.dataset.name;
    if (!name) {
      console.error("react-island requires a 'data-name' attribute.");
      return;
    }

    this.isMounted = true;
    this.loadAndMountReactComponent(name);
  }

  disconnectedCallback() {
    this.isMounted = false;
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }

  async loadAndMountReactComponent(name: string) {
    try {
      if (!this.isMounted) return;
      const reactContainer = document.createElement('div');

      reactContainer.style.width = '100%';
      reactContainer.style.minHeight = '100px';
      this.appendChild(reactContainer);

      if (!this.isMounted) return;
      this.reactRoot = createRoot(reactContainer);
      this.reactRoot.render(createElement(LoadIsland, { name }));
    } catch (error) {
      console.error(
        `Failed to load or mount React component from ${name}:`,
        error
      );
    }
  }
}

if (!customElements.get('react-island')) {
  customElements.define('react-island', ReactIsland);
}
