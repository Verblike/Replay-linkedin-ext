// Utility to get LinkedIn author name from a DOM node
export const getAuthorName = (node: Node | null): string | undefined => {
  let el: HTMLElement | null = node instanceof HTMLElement ? node : (node?.parentElement ?? null);

  const extractNameFrom = (element: HTMLElement): string | undefined => {
    const titleSpan = element.querySelector('span.update-components-actor__title') as HTMLElement | null;
    if (!titleSpan) return undefined;

    // Prefer text from a `.visually-hidden` element if present
    const visuallyHidden = titleSpan.querySelector('.visually-hidden') as HTMLElement | null;
    if (visuallyHidden) {
      const hiddenText = (visuallyHidden.innerText || visuallyHidden.textContent || '').trim().replace(/\s+/g, ' ');
      if (hiddenText) return hiddenText;
    }

    // Prefer the first visible child element if present
    const children = Array.from(titleSpan.children) as HTMLElement[];
    const firstVisibleChild =
      children.find(child => {
        if (child.getAttribute('aria-hidden') === 'true') return false;
        const className = (child.className?.toString?.() ?? '') as string;
        if (/(^|\s)(visually-hidden|sr-only|hidden)(\s|$)/.test(className)) return false;
        return true;
      }) || (children[0] as HTMLElement | undefined);

    const sourceEl = firstVisibleChild || titleSpan;
    const text = (sourceEl.innerText || sourceEl.textContent || '').trim().replace(/\s+/g, ' ');
    return text || undefined;
  };

  while (el) {
    const parent = el.parentElement;
    if (parent) {
      const children = Array.from(parent.children);
      for (const child of children) {
        if (child instanceof HTMLElement) {
          const name = extractNameFrom(child);
          if (name) return name;
        }
      }
    }

    const name = extractNameFrom(el);
    if (name) return name;

    el = parent;
  }

  return undefined;
};
