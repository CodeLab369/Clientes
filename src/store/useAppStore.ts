import create from 'zustand';
import { nanoid } from 'nanoid';

export type TabKey = 'Login' | 'Clientes' | 'SIN' | 'Comprimir' | 'Configuración';

export type Toast = {
  id: string;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
};

export type Client = {
  id: string;
  nit: string;
  razonSocial: string;
  tipoContribuyente: string;
  tipoEntidad: string;
  facturacion: string;
  actividadEconomica: string;
  direccion: string;
  correo: string;
  credenciales: { password: string };
};

export type SinCategory = 'RCV' | 'IVA' | 'IT' | 'RC-IVA' | 'FACTURAS' | 'IUE' | 'OTROS' | 'CONTABILIDAD';

export type SinDoc = {
  id: string;
  clientId: string;
  year: number;
  period: string;
  category: SinCategory;
  fileName: string;
  uploadedAt: string;
  batchId: string;
};

export type Compression = {
  id: string;
  clientId: string;
  year: number;
  period: string;
  categories: SinCategory[];
  includeSubfolders: boolean;
  includeMetadata: boolean;
  name: string;
  status: 'queued' | 'processing' | 'done';
  createdAt: string;
};

export type NotificationPrefs = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration: number; // ms
  maxVisible: number;
};

type State = {
  // Nav / auth
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
  isAuthenticated: boolean;
  user?: string;
  login: (u: string, p: string) => boolean;
  logout: () => void;

  // Clients
  clients: Client[];
  selectedClientIds: Set<string>;
  clientQuery: string;
  clientRowsPerPage: number;
  clientLastDigit: number | 'Todos';
  addClient: (c: Omit<Client, 'id'>) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  deleteClients: (ids: string[]) => void;
  deleteAllClients: () => void;
  setClientQuery: (q: string) => void;
  setClientRowsPerPage: (n: number) => void;
  setClientLastDigit: (d: number | 'Todos') => void;
  toggleSelectClient: (id: string) => void;
  clearClientSelection: () => void;

  // SIN docs
  sinDocs: SinDoc[];
  addSinDocs: (docs: Omit<SinDoc, 'id' | 'uploadedAt' | 'batchId'>[], batchId: string) => void;
  deleteSinBatch: (batchId: string) => void;

  // Compression
  compressions: Compression[];
  addCompression: (c: Omit<Compression, 'id' | 'status' | 'createdAt'>) => string;
  setCompressionStatus: (id: string, status: Compression['status']) => void;

  // Toasts / notifications
  toasts: Toast[];
  notify: (t: Omit<Toast, 'id'>) => void;
  closeToast: (id: string) => void;
  notifications: NotificationPrefs;
  setNotifications: (n: Partial<NotificationPrefs>) => void;
};

const DEMO_USER = 'Nestor';
const DEMO_PASS = '1005';

export const useAppStore = create<State>((set, get) => ({
  activeTab: 'Login',
  setActiveTab: (t) => set({ activeTab: t }),
  isAuthenticated: false,
  user: undefined,
  login: (u, p) => {
    const ok = u === DEMO_USER && p === DEMO_PASS;
    if (ok) set({ isAuthenticated: true, user: u, activeTab: 'Clientes' });
    else get().notify({ message: 'Credenciales inválidas', severity: 'error' });
    return ok;
  },
  logout: () => set({ isAuthenticated: false, user: undefined, activeTab: 'Login' }),

  clients: [],
  selectedClientIds: new Set<string>(),
  clientQuery: '',
  clientRowsPerPage: 10,
  clientLastDigit: 'Todos',
  addClient: (c) => set((s) => ({ clients: [...s.clients, { ...c, id: nanoid() }] })),
  updateClient: (id, patch) => set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
  deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
  deleteClients: (ids) => set((s) => ({ clients: s.clients.filter((c) => !ids.includes(c.id)), selectedClientIds: new Set() })),
  deleteAllClients: () => set({ clients: [], selectedClientIds: new Set() }),
  setClientQuery: (q) => set({ clientQuery: q }),
  setClientRowsPerPage: (n) => set({ clientRowsPerPage: n }),
  setClientLastDigit: (d) => set({ clientLastDigit: d }),
  toggleSelectClient: (id) => set((s) => {
    const next = new Set(s.selectedClientIds);
    next.has(id) ? next.delete(id) : next.add(id);
    return { selectedClientIds: next };
  }),
  clearClientSelection: () => set({ selectedClientIds: new Set() }),

  sinDocs: [],
  addSinDocs: (docs, batchId) => set((s) => ({
    sinDocs: [
      ...s.sinDocs,
      ...docs.map((d) => ({ ...d, id: nanoid(), uploadedAt: new Date().toISOString(), batchId }))
    ]
  })),
  deleteSinBatch: (batchId) => set((s) => ({ sinDocs: s.sinDocs.filter((d) => d.batchId !== batchId) })),

  compressions: [],
  addCompression: (c) => {
    const id = nanoid();
    set((s) => ({ compressions: [{ ...c, id, status: 'queued', createdAt: new Date().toISOString() }, ...s.compressions] }));
    return id;
  },
  setCompressionStatus: (id, status) => set((s) => ({ compressions: s.compressions.map((x) => (x.id === id ? { ...x, status } : x)) })),

  toasts: [],
  notify: (t) => set((s) => ({ toasts: [...s.toasts, { id: nanoid(), ...t }] })),
  closeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  notifications: { position: 'top-right', duration: 4000, maxVisible: 3 },
  setNotifications: (n) => set((s) => ({ notifications: { ...s.notifications, ...n } }))
}));
