// Utility to get LinkedIn post URL from a DOM node
export const getLinkedInPostUrl = (node: Node | null): string | undefined => {
  let el: HTMLElement | null = node instanceof HTMLElement ? node : (node?.parentElement ?? null);
  while (el) {
    const urn = el.getAttribute('data-urn');
    if (urn && urn.startsWith('urn:li:activity:')) {
      // Extract activity ID
      const activityId = urn.replace('urn:li:activity:', '');
      return `https://www.linkedin.com/feed/update/activity:${activityId}`;
    }
    el = el.parentElement;
  }
  return undefined;
};
