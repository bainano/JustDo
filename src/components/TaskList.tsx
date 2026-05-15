import { useMemo, useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import TaskItem from '@/components/TaskItem';
import EmptyState from '@/components/EmptyState';
import QuickAddBar from '@/components/QuickAddBar';
import { isToday } from '@/utils';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import { showToast } from './Toast';

const viewTitles: Record<string, string> = {
  all: '全部任务',
  today: '今天',
  urgent: '紧急',
  important: '重要',
  completed: '已完成',
  trash: '回收站',
};

interface TaskGroup {
  categoryId: string | null;
  categoryName: string;
  tasks: Task[];
}

export default function TaskList() {
  const currentView = useTaskStore((s) => s.currentView);
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);
  const selectedCategoryId = useTaskStore((s) => s.selectedCategoryId);
  const hideCompleted = useTaskStore((s) => s.settings.hideCompleted);
  const updateTask = useTaskStore((s) => s.updateTask);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    const active = tasks.filter((t) => !t.inTrash);
    let result;
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
    if (hideCompleted && currentView !== 'completed' && currentView !== 'trash') {
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
  }, [tasks, currentView, selectedCategoryId, categories, hideCompleted]);

  const groupedTasks = useMemo((): TaskGroup[] => {
    if (currentView === 'trash') return [];
    if (selectedCategoryId) return [];
    if (categories.length === 0) return [];

    const groups: TaskGroup[] = [];

    const sortedCats = [...categories].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    for (const cat of sortedCats) {
      const catTasks = filteredTasks.filter((t) => t.categoryId === cat.id);
      groups.push({ categoryId: cat.id, categoryName: cat.name, tasks: catTasks });
    }

    const uncategorized = filteredTasks.filter((t) => t.categoryId === null);
    groups.push({ categoryId: null, categoryName: '未分类', tasks: uncategorized });

    return groups;
  }, [filteredTasks, categories, currentView, selectedCategoryId]);

  useEffect(() => {
    setCollapsedGroups((prev) => {
      const next = new Set<string>();
      for (const group of groupedTasks) {
        const groupKey = group.categoryId ?? '__uncategorized__';
        if (group.tasks.length === 0) {
          next.add(groupKey);
        }
      }
      return next;
    });
  }, [groupedTasks]);

  const toggleGroup = (key: string, hasTasks: boolean) => {
    if (!hasTasks) return;

    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleDragOver = (e: React.DragEvent, groupKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverGroupId(groupKey);
  };

  const handleDragLeave = () => {
    setDragOverGroupId(null);
  };

  const handleDrop = (e: React.DragEvent, categoryId: string | null) => {
    e.preventDefault();
    setDragOverGroupId(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { categoryId });
      showToast('任务已移动', { type: 'success' });
    }
  };

  const shouldGroup = groupedTasks.length > 0;
  const isTrashView = currentView === 'trash';

  return (
    <div className="flex flex-col h-full">
      {!isTrashView && <QuickAddBar />}

      <div className="flex items-center justify-between px-4 py-2">
        <h2
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {viewTitles[currentView]}
        </h2>
        <span
          className="text-xs tabular-nums"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {filteredTasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length === 0 && !shouldGroup ? (
          <EmptyState view={currentView} />
        ) : shouldGroup ? (
          <div>
            {groupedTasks.map((group) => {
              const groupKey = group.categoryId ?? '__uncategorized__';
              const isCollapsed = collapsedGroups.has(groupKey);
              const hasTasks = group.tasks.length > 0;
              const isDragOver = dragOverGroupId === groupKey;

              return (
                <div key={groupKey}>
                  <button
                    onClick={() => toggleGroup(groupKey, hasTasks)}
                    onDragOver={(e) => handleDragOver(e, groupKey)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, group.categoryId)}
                    className={cn(
                      'w-full flex items-center gap-2 px-4 py-2 text-xs transition-colors duration-150 sticky top-0 z-10',
                      !hasTasks && 'cursor-not-allowed'
                    )}
                    style={{
                      backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
                      color: hasTasks ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                      borderBottom: '1px solid var(--border-color)',
                      boxShadow: isDragOver ? '0 0 0 1px dashed #3b82f6' : 'none'
                    }}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3 h-3 shrink-0" />
                    )}
                    <Folder
                      className="w-3 h-3 shrink-0"
                      style={{ color: group.categoryId ? '#f59e0b' : 'var(--text-tertiary)' }}
                    />
                    <span className="flex-1 text-left">{group.categoryName}</span>
                    <span
                      className="tabular-nums"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {group.tasks.length}
                    </span>
                  </button>

                  <div className={cn(isCollapsed && 'hidden')}>
                    {group.tasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
