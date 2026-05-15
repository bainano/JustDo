import { Inbox, Calendar, Flame, Star, CheckCircle2, Trash2, Settings, type LucideIcon } from 'lucide-react';
import type { TaskView } from '@/types';

const emptyConfig: Record<TaskView, { icon: LucideIcon; text: string }> = {
  all: { icon: Inbox, text: '还没有任务，开始添加吧' },
  today: { icon: Calendar, text: '今天没有待办任务' },
  urgent: { icon: Flame, text: '没有紧急任务' },
  important: { icon: Star, text: '没有标记为重要的任务' },
  completed: { icon: CheckCircle2, text: '还没有已完成的任务' },
  trash: { icon: Trash2, text: '回收站是空的' },
  settings: { icon: Settings, text: '' },
};

export default function EmptyState({ view }: { view: TaskView }) {
  const config = emptyConfig[view];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <Icon className="w-8 h-8 mb-3" strokeWidth={1.5} style={{ color: 'var(--text-tertiary)' }} />
      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{config.text}</p>
    </div>
  );
}
