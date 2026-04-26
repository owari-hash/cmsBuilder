/** Marks a text node for iframe live-edit (double-click → contentEditable, postMessage on blur). */
export type CmsLiveEditDataAttrs = {
  'data-cms-editable'?: '1'
  'data-cms-field'?: string
}

export function cmsLiveEditAttrs(
  liveEdit: boolean | undefined,
  field: string,
): CmsLiveEditDataAttrs {
  if (!liveEdit) return {};
  return {
    'data-cms-editable': '1',
    'data-cms-field': field,
  };
}
