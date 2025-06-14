import type { TagItem } from '@hyperse/inspector-component';

/**
 * Get element tags information
 * @param element - Element to get tags from
 * @returns Array of tags containing element ID and class names
 */
export const getElementTags = <E>(element: E): TagItem[] => {
  const tags: TagItem[] = [];

  if (element instanceof HTMLElement) {
    // Add ID tag if element has an ID
    if (element.id) {
      tags.push({
        label: `#${element.id}`,
        background: 'var(--color-tag-gray-1)',
      });
    }

    // Collect all class names and add class tag
    let classList = '';
    element.classList.forEach((className) => {
      classList += `.${className}`;
    });
    if (classList) {
      tags.push({
        label: classList,
        background: 'var(--color-tag-gray-1)',
      });
    }
  }

  return tags;
};
