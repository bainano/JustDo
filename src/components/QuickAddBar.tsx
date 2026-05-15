import { useState, useRef } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';

export default function QuickAddBar() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [folderValue, setFolderValue] = useState('');
  const [folderFocused, setFolderFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((s) => s.addTask);
  const addCategory = useTaskStore((s) => s.addCategory);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    addTask(trimmed);
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFolderSubmit = () => {
    const trimmed = folderValue.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setFolderValue('');
    folderInputRef.current?.focus();
  };

  const handleFolderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFolderSubmit();
    }
  };

  return (
    <div className="px-4 py-3 space-y-2">
      <div
        className={cn('flex items-center gap-2 px-3 py-2 transition-colors duration-150 rounded')}
        style={{
          backgroundColor: focused ? 'var(--bg-tertiary)' : 'transparent'
        }}
      >
        <Plus
          className="w-[1.125rem] h-[1.125rem] shrink-0 transition-colors duration-150"
          style={{ color: focused ? '#3b82f6' : 'var(--text-tertiary)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="添加任务，回车确认"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'transparent'
          }}
        />
      </div>

      <div
        className={cn('flex items-center gap-2 px-3 py-2 transition-colors duration-150 rounded')}
        style={{
          backgroundColor: folderFocused ? 'var(--bg-tertiary)' : 'transparent'
        }}
      >
        <FolderPlus
          className="w-[1.125rem] h-[1.125rem] shrink-0 transition-colors duration-150"
          style={{ color: folderFocused ? '#f59e0b' : 'var(--text-tertiary)' }}
        />
        <input
          ref={folderInputRef}
          type="text"
          value={folderValue}
          onChange={(e) => setFolderValue(e.target.value)}
          onFocus={() => setFolderFocused(true)}
          onBlur={() => setFolderFocused(false)}
          onKeyDown={handleFolderKeyDown}
          placeholder="添加文件夹，回车确认"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
}
