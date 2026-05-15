import { useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatShort(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatFull(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function GanttChart() {
  const tasks = useTaskStore((s) => s.tasks);

  const { weeks, range, taskCountMap, maxCount } = useMemo(() => {
    const active = tasks.filter((t) => !t.inTrash);
    const countMap: Record<string, number> = {};
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    active.forEach((task) => {
      const taskDate = task.dueDate
        ? startOfDay(new Date(task.dueDate))
        : startOfDay(new Date(task.createdAt));
      const key = formatFull(taskDate);
      countMap[key] = (countMap[key] || 0) + 1;

      if (!minDate || taskDate < minDate) minDate = taskDate;
      if (!maxDate || taskDate > maxDate) maxDate = taskDate;
    });

    if (!minDate || !maxDate) {
      const now = new Date();
      minDate = startOfDay(now);
      maxDate = startOfDay(now);
    }

    const padDays = 14;
    const rangeStart = new Date(minDate);
    rangeStart.setDate(rangeStart.getDate() - padDays);
    const dayOfWeek = rangeStart.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    rangeStart.setDate(rangeStart.getDate() - daysToMonday);
    const rangeEnd = new Date(maxDate);
    rangeEnd.setDate(rangeEnd.getDate() + padDays);
    const endDayOfWeek = rangeEnd.getDay();
    if (endDayOfWeek !== 0) {
      rangeEnd.setDate(rangeEnd.getDate() + (7 - endDayOfWeek));
    }

    const weeks: Date[][] = [];
    let current = new Date(rangeStart);

    while (current <= rangeEnd) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    const max = Math.max(1, ...Object.values(countMap));

    return { weeks, range: { start: rangeStart, end: rangeEnd }, taskCountMap: countMap, maxCount: max };
  }, [tasks]);

  const getIntensity = (date: Date): number => {
    const key = formatFull(date);
    const count = taskCountMap[key] || 0;
    if (count === 0) return 0;
    return Math.min(Math.ceil((count / maxCount) * 4), 4);
  };

  return (
    <div className="px-2 pb-3 shrink-0">
      <div className="text-[0.625rem] px-1 mb-1" style={{ color: 'var(--text-tertiary)' }}>
        {formatShort(range.start)} — {formatShort(range.end)}
      </div>
      <div className="flex flex-col gap-0.5 pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex gap-0.5">
            {week.map((day, di) => {
              const level = getIntensity(day);
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={di}
                  title={`${formatFull(day)}: ${taskCountMap[formatFull(day)] || 0} 个任务`}
                  className="w-2 h-2 rounded-sm transition-opacity shrink-0"
                  style={{
                    backgroundColor: level === 0
                      ? 'var(--bg-tertiary)'
                      : level === 1
                        ? 'rgba(59, 130, 246, 0.25)'
                        : level === 2
                          ? 'rgba(59, 130, 246, 0.5)'
                          : level === 3
                            ? 'rgba(59, 130, 246, 0.75)'
                            : '#3b82f6',
                    outline: isToday ? '1px solid #3b82f6' : 'none',
                    outlineOffset: '1px',
                    opacity: day > new Date() ? 0.3 : 1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className="text-[0.5625rem]" style={{ color: 'var(--text-tertiary)' }}>少</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="w-2 h-2 rounded-sm"
            style={{
              backgroundColor: level === 0
                ? 'var(--bg-tertiary)'
                : level === 1
                  ? 'rgba(59, 130, 246, 0.25)'
                  : level === 2
                    ? 'rgba(59, 130, 246, 0.5)'
                    : level === 3
                      ? 'rgba(59, 130, 246, 0.75)'
                      : '#3b82f6',
            }}
          />
        ))}
        <span className="text-[0.5625rem]" style={{ color: 'var(--text-tertiary)' }}>多</span>
      </div>
    </div>
  );
}
