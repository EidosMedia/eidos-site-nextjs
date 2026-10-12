// CMS attributes use HTML names; React expects the camelCase DOM property names
export const REACT_ATTRIBUTE_NAMES: Record<string, string> = {
  class: 'className',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-width': 'strokeWidth',
  tabindex: 'tabIndex',
  contenteditable: 'contentEditable',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen',
};

// CMS-only metadata in camelCase (targetId, softCrop, mimeType…) is not a valid DOM attribute
export const isCmsOnlyAttribute = (key: string) => !(key in REACT_ATTRIBUTE_NAMES) && /[A-Z]/.test(key);
