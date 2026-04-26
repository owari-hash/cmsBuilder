import type { HTMLAttributes } from 'react';

/** Marks a text node for iframe live-edit (double-click → contentEditable, postMessage on blur). */
export function cmsLiveEditAttrs(
  liveEdit: boolean | undefined,
  field: string,
): Pick<HTMLAttributes<HTMLElement>, 'data-cms-editable' | 'data-cms-field'> {
  if (!liveEdit) return {};
  return {
    'data-cms-editable': '1',
    'data-cms-field': field,
  };
}
