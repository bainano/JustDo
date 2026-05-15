import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Category, TaskStore, TaskView, ThemeMode, Settings } from '@/types';
import { generateId, isToday } from '@/utils';

function getTodayDate(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

const defaultSettings: Settings = {
  defaultView: 'all',
  themeMode: 'dark',
  zoomLevel: 100,
  hideCompleted: false,
};

function applyTheme(mode: ThemeMode) {
  const root = window.document.documentElement;

  root.classList.remove('dark', 'light');

  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!prefersDark) {
      root.classList.add('light');
    }
  } else if (mode === 'light') {
    root.classList.add('light');
  }
}

function applyZoom(level: number) {
  const root = window.document.documentElement;
  root.style.fontSize = `${level}%`;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: [],
      selectedCategoryId: null,
      currentView: 'all',
      sidebarOpen: true,
      editingTaskId: null,
      settings: defaultSettings,

      addTask: (title: string) => {
        const task: Task = {
          id: generateId(),
          title,
          description: '',
          completed: false,
          urgent: false,
          important: false,
          categoryId: null,
          dueDate: getTodayDate(),
          createdAt: new Date().toISOString(),
          completedAt: null,
          inTrash: false,
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
      },

      addCategory: (name: string) => {
        const category: Category = {
          id: generateId(),
          name,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ categories: [category, ...state.categories] }));
      },

      deleteCategory: (id: string) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          tasks: state.tasks.map((t) =>
            t.categoryId === id ? { ...t, categoryId: null } : t
          ),
          selectedCategoryId: state.selectedCategoryId === id ? null : state.selectedCategoryId,
        }));
      },

      setSelectedCategoryId: (id: string | null) => {
        set({ selectedCategoryId: id });
      },

      toggleComplete: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date().toISOString() : null,
                }
              : t
          ),
        }));
      },

      toggleImportant: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, important: !t.important } : t
          ),
        }));
      },

      toggleUrgent: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, urgent: !t.urgent } : t
          ),
        }));
      },

      moveToTrash: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, inTrash: true } : t
          ),
        }));
      },

      restoreTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, inTrash: false } : t
          ),
        }));
      },

      permanentlyDelete: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      setCurrentView: (view: TaskView) => {
        set({ currentView: view });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setEditingTaskId: (id: string | null) => {
        set({ editingTaskId: id });
      },

      setThemeMode: (mode: ThemeMode) => {
        set((state) => ({ settings: { ...state.settings, themeMode: mode } }));
        applyTheme(mode);
      },

      setDefaultView: (view: 'all' | 'today') => {
        set((state) => ({ settings: { ...state.settings, defaultView: view } }));
      },

      setZoomLevel: (level: number) => {
        set((state) => ({ settings: { ...state.settings, zoomLevel: level } }));
        applyZoom(level);
      },

      toggleHideCompleted: () => {
        set((state) => ({ settings: { ...state.settings, hideCompleted: !state.settings.hideCompleted } }));
      },

      clearCompletedTasks: () => {
        set((state) => ({ 
          tasks: state.tasks.map((t) => {
            if (t.completed && !t.inTrash) {
              return { ...t, inTrash: true };
            }
            return t;
          })
        }));
      },

      emptyTrash: () => {
        set((state) => ({ tasks: state.tasks.filter((t) => !t.inTrash) }));
      },

      getFilteredTasks: () => {
        const { tasks, currentView, selectedCategoryId, settings } = get();
        const active = tasks.filter((t) => !t.inTrash);

        let result: Task[];
        switch (currentView) {
          case 'all':
            result = active;
            break;
          case 'today':
            result = active.filter((t) => isToday(t.dueDate));
            break;
          case 'urgent':
            result = active.filter((t) => t.urgent);
            break;
          case 'important':
            result = active.filter((t) => t.important);
            break;
          case 'completed':
            result = active.filter((t) => t.completed);
            break;
          case 'trash':
            result = tasks.filter((t) => t.inTrash);
            break;
          default:
            result = active;
        }

        if (selectedCategoryId && currentView !== 'trash') {
          result = result.filter((t) => t.categoryId === selectedCategoryId);
        }

        // 隐藏已完成任务（仅在非已完成视图时生效）
        if (settings.hideCompleted && currentView !== 'completed' && currentView !== 'trash') {
          result = result.filter((t) => !t.completed);
        }

        if (currentView !== 'trash') {
          result = [...result].sort((a, b) => {
            if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
            if (a.important !== b.important) return a.important ? -1 : 1;
            const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            if (aDate !== bDate) return aDate - bDate;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
        }

        return result;
      },

      getViewCounts: () => {
        const { tasks } = get();
        const active = tasks.filter((t) => !t.inTrash);
        return {
          all: active.length,
          today: active.filter((t) => isToday(t.dueDate)).length,
          urgent: active.filter((t) => t.urgent).length,
          important: active.filter((t) => t.important).length,
          completed: active.filter((t) => t.completed).length,
          trash: tasks.filter((t) => t.inTrash).length,
          settings: 0,
        };
      },
    }),
    {
      name: 'todo-storage',
      partialize: (state) => ({ tasks: state.tasks, categories: state.categories, settings: state.settings }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 数据迁移：给没有createdAt的分类添加默认值
          state.categories = state.categories.map((cat, index) => {
            if (!cat.createdAt) {
              // 没有创建时间的旧分类，按索引倒序分配时间，确保相对顺序合理
              const offset = state.categories.length - 1 - index;
              const fakeDate = new Date();
              fakeDate.setDate(fakeDate.getDate() - offset);
              return {
                ...cat,
                createdAt: fakeDate.toISOString(),
              };
            }
            return cat;
          });
          
          // 确保分类按时间倒序排列
          state.categories.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      },
    }
  )
);

// 初始化主题和缩放
if (typeof window !== 'undefined') {
  const savedSettings = localStorage.getItem('todo-storage');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      if (parsed.state.settings) {
        applyTheme(parsed.state.settings.themeMode);
        if (parsed.state.settings.zoomLevel) {
          applyZoom(parsed.state.settings.zoomLevel);
        }
        if (parsed.state.settings.defaultView) {
          useTaskStore.setState({ currentView: parsed.state.settings.defaultView });
        }
      }
    } catch (e) {
      applyTheme(defaultSettings.themeMode);
      applyZoom(defaultSettings.zoomLevel);
    }
  } else {
    applyTheme(defaultSettings.themeMode);
    applyZoom(defaultSettings.zoomLevel);
  }

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const savedSettings = localStorage.getItem('todo-storage');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.state.settings.themeMode === 'system') {
          applyTheme('system');
        }
      } catch (e) {}
    }
  });
}
