// Utility to get LinkedIn author username from a DOM node
export const getAuthorUsername = (node: Node | null): string | undefined => {
  let el: HTMLElement | null = node instanceof HTMLElement ? node : (node?.parentElement ?? null);

  const checkElement = (element: HTMLElement): string | undefined => {
    // Check all 'a' tags in the current element
    const links = Array.from(element.getElementsByTagName('a'));
    for (const link of links) {
      const href = link.getAttribute('href');
      if (href?.startsWith('https://www.linkedin.com/in/')) {
        return href.replace('https://www.linkedin.com/in/', '').split('/')[0];
      }
    }

    // Check if the element itself is an 'a' tag
    if (element.tagName.toLowerCase() === 'a') {
      const href = element.getAttribute('href');
      if (href?.startsWith('https://www.linkedin.com/in/')) {
        return href.replace('https://www.linkedin.com/in/', '').split('/')[0];
      }
    }

    return undefined;
  };

  while (el) {
    // Check the current element and its siblings
    const parent = el.parentElement;
    if (parent) {
      const children = Array.from(parent.children);
      for (const child of children) {
        if (child instanceof HTMLElement) {
          const username = checkElement(child);
          if (username) return username;
        }
      }
    }

    // Check the current element itself
    const username = checkElement(el);
    if (username) return username;

    // Move up to parent
    el = parent;
  }

  return undefined;
};
