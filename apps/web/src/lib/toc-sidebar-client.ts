import { setTocCollapsed, tocCollapsed } from '@/stores/tocSidebar';

const DESKTOP_SIDEBAR_QUERY = '(min-width: 48rem)';

const g = globalThis as typeof globalThis & {
  __ujgTocSidebarPageLoadBound?: boolean;
};

let unbindStore: (() => void) | undefined;
let unbindOutsidePointerDown: (() => void) | undefined;

const clearBindings = () => {
  unbindStore?.();
  unbindStore = undefined;

  unbindOutsidePointerDown?.();
  unbindOutsidePointerDown = undefined;
};

export const initTocSidebar = () => {
  clearBindings();

  const container = document.querySelector<HTMLElement>('.sidebar-container');
  if (!container) return;

  container.setAttribute('data-toc-toggled', tocCollapsed.get().toString());

  unbindStore = tocCollapsed.subscribe((collapsed: boolean) => {
    container.setAttribute('data-toc-toggled', collapsed.toString());
  });

  const desktopSidebar = window.matchMedia(DESKTOP_SIDEBAR_QUERY);

  const onOutsidePointerDown = (event: PointerEvent) => {
    if (desktopSidebar.matches || !tocCollapsed.get()) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    const sidebar = container.querySelector('.sidebar');
    const isSidebarClick = sidebar?.contains(target);
    const isRestoreButtonClick =
      target instanceof Element && target.closest('.sidebar-restore-btn');

    if (isSidebarClick || isRestoreButtonClick) return;

    setTocCollapsed(false);
  };

  document.addEventListener('pointerdown', onOutsidePointerDown, { capture: true });
  unbindOutsidePointerDown = () => {
    document.removeEventListener('pointerdown', onOutsidePointerDown, { capture: true });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.classList.remove('is-initializing');
    });
  });
};

export const setupTocSidebar = () => {
  if (!g.__ujgTocSidebarPageLoadBound) {
    g.__ujgTocSidebarPageLoadBound = true;
    document.addEventListener('astro:page-load', initTocSidebar);
  }

  initTocSidebar();
};
