declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export interface ElectronAPI {
  platform: string;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  urgent: boolean;
  important: boolean;
  categoryId: string | null;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  inTrash: boolean;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export type TaskView = 'all' | 'today' | 'urgent' | 'important' | 'completed' | 'trash' | 'settings';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface NavItem {
  id: TaskView;
  label: string;
  icon: string;
}

export interface Settings {
  defaultView: 'all' | 'today' | 'urgent';
  themeMode: ThemeMode;
  zoomLevel: number;
  hideCompleted: boolean;
}

export interface TaskStore {
  tasks: Task[];
  categories: Category[];
  selectedCategoryId: string | null;
  currentView: TaskView;
  sidebarOpen: boolean;
  editingTaskId: string | null;
  settings: Settings;
  addTask: (title: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  setSelectedCategoryId: (id: string | null) => void;
  toggleComplete: (id: string) => void;
  toggleImportant: (id: string) => void;
  toggleUrgent: (id: string) => void;
  moveToTrash: (id: string) => void;
  restoreTask: (id: string) => void;
  permanentlyDelete: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setCurrentView: (view: TaskView) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setEditingTaskId: (id: string | null) => void;
  getFilteredTasks: () => Task[];
  getViewCounts: () => Record<TaskView, number>;
  setThemeMode: (mode: ThemeMode) => void;
  setDefaultView: (view: 'all' | 'today' | 'urgent') => void;
  setZoomLevel: (level: number) => void;
  toggleHideCompleted: () => void;
  clearCompletedTasks: () => void;
  emptyTrash: () => void;
}