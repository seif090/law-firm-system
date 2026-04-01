import { create } from 'zustand';

type CaseStatus = 'الكل' | 'جارية' | 'معلقة' | 'مغلقة' | 'urgent';

type TimelineItem = {
  id: number;
  title: string;
  detail: string;
  timestamp: string;
  type: 'case' | 'client' | 'task' | 'hearing';
};

type NotificationItem = {
  id: number;
  title: string;
  body: string;
  read: boolean;
  url: string;
  severity?: 'info' | 'warning' | 'critical';
};

interface DashboardState {
  searchQuery: string;
  setSearchQuery: (value: string) => void;

  gotoQuery: string;
  setGotoQuery: (value: string) => void;

  casesQuery: string;
  setCasesQuery: (value: string) => void;
  casesStatus: CaseStatus;
  setCasesStatus: (value: CaseStatus) => void;

  clientsQuery: string;
  setClientsQuery: (value: string) => void;

  notifications: NotificationItem[];
  setNotifications: (value: NotificationItem[]) => void;
  unreadCount: number;
  setUnreadCount: (value: number) => void;

  wsConnected: boolean;
  setWsConnected: (value: boolean) => void;

  wsToken: string;
  setWsToken: (value: string) => void;

  timelineByEntity: Record<string, TimelineItem[]>;
  setTimelineByEntity: (entity: string, id: number, items: TimelineItem[]) => void;
  getTimelineByEntity: (entity: string, id: number) => TimelineItem[];
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  searchQuery: '',
  setSearchQuery: (value) => set({ searchQuery: value }),

  gotoQuery: '',
  setGotoQuery: (value) => set({ gotoQuery: value }),

  casesQuery: '',
  setCasesQuery: (value) => set({ casesQuery: value }),
  casesStatus: 'الكل',
  setCasesStatus: (value) => set({ casesStatus: value }),

  clientsQuery: '',
  setClientsQuery: (value) => set({ clientsQuery: value }),

  notifications: [],
  setNotifications: (value) => set({ notifications: value }),
  unreadCount: 0,
  setUnreadCount: (value) => set({ unreadCount: value }),

  wsConnected: false,
  setWsConnected: (value) => set({ wsConnected: value }),

  wsToken: 'local-token',
  setWsToken: (value) => set({ wsToken: value }),

  timelineByEntity: {},
  setTimelineByEntity: (entity, id, items) => {
    const key = `${entity}:${id}`;
    set((state) => ({ timelineByEntity: { ...state.timelineByEntity, [key]: items } }));
  },
  getTimelineByEntity: (entity, id) => {
    const key = `${entity}:${id}`;
    return get().timelineByEntity[key] ?? [];
  },
}));
