import { createStore, get, set } from 'idb-keyval';
import { MetaState, createDefaultMetaState, migrateMetaState } from '../state/MetaState';

const metaStore = createStore('autoscroller-meta', 'meta-state');

export async function loadMetaState(): Promise<MetaState> {
  const raw = await get('meta', metaStore);
  if (!raw) return createDefaultMetaState();
  return migrateMetaState(raw);
}

export async function saveMetaState(state: MetaState): Promise<void> {
  await set('meta', state, metaStore);
}
