import { create } from 'zustand';
import { ENTITY_TYPES, type WorkloadId } from '@odigos/ui-utils';
import type { ActionDataParsed, ActualDestination, InstrumentationRuleSpec, K8sActualSource } from '@/types';

export enum DRAWER_OTHER_TYPES {
  ODIGOS_CLI = 'odigos-cli',
}

export interface DrawerItem {
  type: ENTITY_TYPES | DRAWER_OTHER_TYPES;
  id: string | WorkloadId;
  item?: InstrumentationRuleSpec | K8sActualSource | ActionDataParsed | ActualDestination;
}

interface DrawerStoreState {
  selectedItem: DrawerItem | null;
  setSelectedItem: (item: DrawerItem | null) => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerStoreState>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
