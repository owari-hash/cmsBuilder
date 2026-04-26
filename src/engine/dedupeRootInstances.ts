import type { ComponentInstance } from '../types';

/**
 * Superadmin / canvas workflows can leave multiple root instances of the same
 * `componentType` on one `pageRoute`. The public renderer should show one shell
 * per type: prefer `instanceId` starting with `fc-`, else lowest `order`.
 */
export function dedupeRootInstances(instances: ComponentInstance[]): ComponentInstance[] {
  const roots = instances.filter((i) => i.parentId == null || i.parentId === undefined);
  const nested = instances.filter((i) => i.parentId != null && i.parentId !== undefined);

  const bucketKey = (r: ComponentInstance) =>
    `${String(r.pageRoute || '')}::${String(r.componentType || '').toLowerCase()}`;
  const buckets = new Map<string, ComponentInstance[]>();

  for (const r of roots) {
    const k = bucketKey(r);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(r);
  }

  const winners: ComponentInstance[] = [];
  for (const group of buckets.values()) {
    if (group.length === 1) {
      winners.push(group[0]);
      continue;
    }
    const fcPref = group.filter((g) => /^fc-/i.test(String(g.instanceId)));
    const pool = fcPref.length > 0 ? fcPref : group;
    pool.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    winners.push(pool[0]);
  }

  winners.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  return [...winners, ...nested];
}
