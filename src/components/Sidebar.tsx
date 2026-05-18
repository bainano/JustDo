import { useMemo, useState } from 'react';
import { List, Calendar, Star, CheckCircle2, Trash2, ChevronLeft, Settings, Flame, Folder, X, type LucideIcon } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import type { NavItem, TaskView } from '@/types';
import { isToday } from '@/utils';
import { cn } from '@/lib/utils';
import GanttChart from './GanttChart';
import { showToast } from './Toast';

const navItems: NavItem[] = [
  { id: 'all', label: '全部', icon: 'List' },
  { id: 'today', label: '今天', icon: 'Calendar' },
  { id: 'urgent', label: '紧急', icon: 'Flame' },
  { id: 'important', label: '重要', icon: 'Star' },
  { id: 'completed', label: '已完成', icon: 'CheckCircle2' },
  { id: 'trash', label: '回收站', icon: 'Trash2' },
  { id: 'settings', label: '设置', icon: 'Settings' },
];

const iconMap: Record<string, LucideIcon> = {
  List, Calendar, Flame, Star, CheckCircle2, Trash2, Settings,
};

export default function Sidebar() {
  const currentView = useTaskStore((s) => s.currentView);
  const setCurrentView = useTaskStore((s) => s.setCurrentView);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);
  const selectedCategoryId = useTaskStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useTaskStore((s) => s.setSelectedCategoryId);
  const deleteCategory = useTaskStore((s) => s.deleteCategory);
  const updateTask = useTaskStore((s) => s.updateTask);
  const toggleUrgent = useTaskStore((s) => s.toggleUrgent);
  const toggleImportant = useTaskStore((s) => s.toggleImportant);
  const moveToTrash = useTaskStore((s) => s.moveToTrash);
  const sidebarOpen = useTaskStore((s) => s.sidebarOpen);
  const toggleSidebar = useTaskStore((s) => s.toggleSidebar);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);
  const [dragOverNavId, setDragOverNavId] = useState<string | null>(null);

  const counts = useMemo(() => {
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
  }, [tasks]);

  const handleNavClick = (view: TaskView) => {
    setCurrentView(view);
    setSelectedCategoryId(null);
    if (window.innerWidth < 1024) {
      useTaskStore.getState().setSidebarOpen(false);
    }
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategoryId(categoryId);
  };

  const handleDragLeave = () => {
    setDragOverCategoryId(null);
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    setDragOverCategoryId(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { categoryId });
      showToast('已移入文件夹', { type: 'success' });
    }
  };

  const handleNavDragOver = (e: React.DragEvent, navId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverNavId(navId);
  };

  const handleNavDragLeave = () => {
    setDragOverNavId(null);
  };

  const handleNavDrop = (e: React.DragEvent, navId: string) => {
    e.preventDefault();
    setDragOverNavId(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    switch (navId) {
      case 'urgent':
        if (!task.urgent) {
          toggleUrgent(taskId);
          showToast('已标记为紧急', { type: 'success' });
        }
        break;
      case 'important':
        if (!task.important) {
          toggleImportant(taskId);
          showToast('已标记为重要', { type: 'success' });
        }
        break;
      case 'trash':
        if (!task.inTrash) {
          moveToTrash(taskId);
          showToast('已移到回收站', { type: 'info' });
        }
        break;
    }
  };

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-200',
          'w-60 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="lg:hidden flex items-center justify-end h-12 px-4 shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <nav className="px-2 py-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = currentView === item.id && selectedCategoryId === null;
            const count = counts[item.id];
            const isDragOver = dragOverNavId === item.id;
            const canDrop = item.id === 'urgent' || item.id === 'important' || item.id === 'trash';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onDragOver={canDrop ? (e) => handleNavDragOver(e, item.id) : undefined}
                onDragLeave={canDrop ? handleNavDragLeave : undefined}
                onDrop={canDrop ? (e) => handleNavDrop(e, item.id) : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors duration-150'
                )}
                style={{
                  backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.15)' : (isActive ? 'var(--bg-tertiary)' : 'transparent'),
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: isDragOver ? '0 0 0 1px dashed #3b82f6' : 'none'
                }}
              >
                <Icon
                  className="w-[1.125rem] h-[1.125rem]"
                  style={{
                    color: isActive
                      ? (item.id === 'important' ? '#f59e0b' : (item.id === 'trash' ? '#ef4444' : (item.id === 'urgent' ? '#ef4444' : '#3b82f6')))
                      : (item.id === 'urgent' && counts.urgent > 0 ? '#ef4444' : (item.id === 'important' && counts.important > 0 ? '#f59e0b' : 'inherit'))
                  }}
                />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {count > 0 && (
                  <span
                    className="text-xs tabular-nums px-1.5 py-0.5 rounded min-w-[20px] text-center"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {categories.length > 0 && (
          <div className="flex-1 flex flex-col min-h-0 px-2">
            <div
              className="text-[0.65rem] font-medium uppercase tracking-wider px-3 py-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              文件夹
            </div>
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-1">
                {categories.map((cat) => {
                  const isActive = selectedCategoryId === cat.id;
                  const isDragOver = dragOverCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(isActive ? null : cat.id)}
                      onDragOver={(e) => handleDragOver(e, cat.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, cat.id)}
                      className={cn(
                        'group flex items-center gap-1.5 px-2 py-1.5 text-xs rounded transition-colors duration-150 text-left relative'
                      )}
                      style={{
                        backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.15)' : isActive ? 'var(--bg-tertiary)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        boxShadow: isDragOver ? '0 0 0 1px dashed #3b82f6' : 'none'
                      }}
                    >
                      <Folder
                        className="w-3 h-3 shrink-0"
                        style={{ color: isActive ? '#f59e0b' : 'var(--text-tertiary)' }}
                      />
                      <span className="flex-1 truncate">{cat.name}</span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(cat.id);
                        }}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <X className="w-3 h-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {categories.length === 0 && <div className="flex-1" />}

        <GanttChart />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
