import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Star, AlignLeft, Flame } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { formatDate } from '@/utils';
import { cn } from '@/lib/utils';

export default function TaskDetailModal() {
  const editingTaskId = useTaskStore((s) => s.editingTaskId);
  const setEditingTaskId = useTaskStore((s) => s.setEditingTaskId);
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const toggleImportant = useTaskStore((s) => s.toggleImportant);
  const toggleUrgent = useTaskStore((s) => s.toggleUrgent);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);

  const task = tasks.find((t) => t.id === editingTaskId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    updateTask(task.id, {
      title: trimmed,
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
    setEditingTaskId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditingTaskId(null);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleSave();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-lg mx-4 overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="任务标题"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          <button
            onClick={handleSave}
            className="text-xs transition-colors px-2 py-1"
            style={{ color: '#3b82f6' }}
          >
            完成
          </button>
          <button
            onClick={() => setEditingTaskId(null)}
            className="p-1 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlignLeft className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加描述..."
              rows={2}
              className="flex-1 bg-transparent text-sm outline-none resize-none"
              style={{ color: 'var(--text-secondary)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>截止时间</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs bg-transparent outline-none"
              style={{ color: 'var(--text-secondary)' }}
            />
            {task.dueDate && (
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatDate(task.dueDate)}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleUrgent(task.id)}
              className="flex items-center gap-1.5 text-xs transition-colors hover:text-red-500"
              style={{ color: task.urgent ? '#ef4444' : 'var(--text-tertiary)' }}
            >
              <Flame
                className="w-3.5 h-3.5"
                style={{
                  fill: task.urgent ? '#ef4444' : 'none',
                  transition: 'color 0.15s, fill 0.15s'
                }}
              />
              紧急
            </button>

            <button
              onClick={() => toggleImportant(task.id)}
              className="flex items-center gap-1.5 text-xs transition-colors hover:text-yellow-500"
              style={{ color: task.important ? '#f59e0b' : 'var(--text-tertiary)' }}
            >
              <Star
                className="w-3.5 h-3.5"
                style={{
                  fill: task.important ? '#f59e0b' : 'none',
                  transition: 'color 0.15s, fill 0.15s'
                }}
              />
              重要
            </button>

            <button
              onClick={() => toggleComplete(task.id)}
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: task.completed ? '#3b82f6' : 'var(--text-tertiary)' }}
            >
              <Calendar className="w-3.5 h-3.5" />
              {task.completed ? '已取消完成' : '标记完成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
