import { useState } from 'react';
import { Circle, CheckCircle2, Star, Trash2, Calendar, Flame } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import type { Task } from '@/types';
import { formatDate, isOverdue } from '@/utils';
import { cn } from '@/lib/utils';
import ConfirmModal from './ConfirmModal';
import { showToast } from './Toast';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const toggleImportant = useTaskStore((s) => s.toggleImportant);
  const toggleUrgent = useTaskStore((s) => s.toggleUrgent);
  const moveToTrash = useTaskStore((s) => s.moveToTrash);
  const setEditingTaskId = useTaskStore((s) => s.setEditingTaskId);
  const currentView = useTaskStore((s) => s.currentView);
  const restoreTask = useTaskStore((s) => s.restoreTask);
  const permanentlyDelete = useTaskStore((s) => s.permanentlyDelete);

  const isTrashView = currentView === 'trash';
  const overdue = !task.completed && isOverdue(task.dueDate);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleMoveToTrash = () => {
    moveToTrash(task.id);
    showToast('已移到回收站', { type: 'info' });
  };

  const handlePermanentDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    permanentlyDelete(task.id);
    showToast('任务已永久删除', { type: 'success' });
    setShowConfirm(false);
  };

  return (
    <>
      <div
        draggable={!isTrashView}
        onDragStart={!isTrashView ? handleDragStart : undefined}
        onDragEnd={!isTrashView ? handleDragEnd : undefined}
        className={cn(
          'group flex items-start gap-3 px-4 py-3 transition-colors duration-150 cursor-pointer',
          isDragging && 'opacity-40'
        )}
        style={{
          backgroundColor: 'transparent',
          boxShadow: task.urgent && task.important
            ? 'inset 2px 0 0 #ef4444, inset 4px 0 0 #f59e0b'
            : task.urgent
            ? 'inset 2px 0 0 #ef4444'
            : task.important
            ? 'inset 2px 0 0 #f59e0b'
            : 'none'
        }}
      >
        <button
          onClick={() => (isTrashView ? restoreTask(task.id) : toggleComplete(task.id))}
          className="shrink-0 mt-0.5"
        >
          {isTrashView ? (
            <Circle className="w-[1.125rem] h-[1.125rem] transition-colors" style={{ color: 'var(--text-tertiary)' }} />
          ) : task.completed ? (
            <CheckCircle2 className="w-[1.125rem] h-[1.125rem]" style={{ color: '#3b82f6' }} />
          ) : (
            <Circle className="w-[1.125rem] h-[1.125rem] transition-colors" style={{ color: 'var(--text-secondary)' }} />
          )}
        </button>

        <button
          onClick={() => !isTrashView && setEditingTaskId(task.id)}
          className={cn('flex-1 min-w-0 text-left', isTrashView && 'cursor-default')}
        >
          <span
            className="text-sm block"
            style={{
              color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
              textDecoration: task.completed ? 'line-through' : 'none'
            }}
          >
            {task.title}
          </span>
          {task.dueDate && !isTrashView && (
            <div className="flex items-center gap-1 mt-0.5">
              <Calendar className="w-2.5 h-2.5" style={{ color: overdue ? '#ef4444' : 'var(--text-tertiary)' }} />
              <span
                className="text-xs tabular-nums"
                style={{ color: overdue ? '#ef4444' : 'var(--text-tertiary)' }}
              >
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
        </button>

        <div className="flex items-center gap-1 shrink-0 pt-1">
          {!isTrashView && (
            <>
              <button
                onClick={() => toggleUrgent(task.id)}
                className="p-0.5 transition-all hover:scale-110"
              >
                <Flame
                  className="w-3.5 h-3.5 urgent-icon"
                  style={{
                    color: task.urgent ? '#ef4444' : 'var(--text-tertiary)',
                    fill: task.urgent ? '#ef4444' : 'none',
                    transition: 'color 0.15s'
                  }}
                />
              </button>

              <button
                onClick={() => toggleImportant(task.id)}
                className="p-0.5 transition-all hover:scale-110"
              >
                <Star
                  className="w-3.5 h-3.5 star-icon"
                  style={{
                    color: task.important ? '#f59e0b' : 'var(--text-tertiary)',
                    fill: task.important ? '#f59e0b' : 'none',
                    transition: 'color 0.15s'
                  }}
                />
              </button>

              <button
                onClick={handleMoveToTrash}
                className="p-0.5 transition-all hover:scale-110"
              >
                <Trash2
                  className="w-3.5 h-3.5 trash-icon"
                  style={{
                    color: 'var(--text-tertiary)',
                    transition: 'color 0.15s'
                  }}
                />
              </button>
            </>
          )}

          {isTrashView && (
            <button
              onClick={handlePermanentDelete}
              className="p-0.5 transition-all hover:scale-110"
            >
              <Trash2
                className="w-3.5 h-3.5 trash-icon"
                style={{
                  color: 'var(--text-tertiary)',
                  transition: 'color 0.15s'
                }}
              />
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="删除任务"
          message="确定要永久删除这个任务吗？此操作不可撤销。"
          confirmText="删除"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
