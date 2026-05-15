import { useState, useEffect } from 'react';
import { EyeOff, Trash2, Minus, Square, X } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { showToast } from './Toast';
import ConfirmModal from './ConfirmModal';

export default function CustomTitleBar() {
  const [showEmptyTrashConfirm, setShowEmptyTrashConfirm] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const isMac = typeof window !== 'undefined' && window.electronAPI?.platform === 'darwin';
  const isWin = typeof window !== 'undefined' && window.electronAPI?.platform === 'win32';

  useEffect(() => {
    const checkMaximized = async () => {
      if (isWin && window.electronAPI) {
        const maximized = await window.electronAPI.isMaximized();
        setIsMaximized(maximized);
      }
    };
    checkMaximized();
  }, [isWin]);

  const handleMinimize = () => {
    if (isWin && window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (isWin && window.electronAPI) {
      window.electronAPI.maximize();
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (isWin && window.electronAPI) {
      window.electronAPI.close();
    }
  };
  
  const hideCompleted = useTaskStore((s) => s.settings.hideCompleted);
  const toggleHideCompleted = useTaskStore((s) => s.toggleHideCompleted);
  const clearCompletedTasks = useTaskStore((s) => s.clearCompletedTasks);
  const emptyTrash = useTaskStore((s) => s.emptyTrash);
  const currentView = useTaskStore((s) => s.currentView);
  const tasks = useTaskStore((s) => s.tasks);
  
  const hasCompletedTasks = tasks.filter((t) => t.completed && !t.inTrash).length > 0;
  const hasTrashTasks = tasks.filter((t) => t.inTrash).length > 0;

  const handleClearCompleted = () => {
    if (!hasCompletedTasks) return;
    clearCompletedTasks();
    showToast('已将已完成任务移至回收站', { type: 'success' });
  };

  const handleEmptyTrash = () => {
    emptyTrash();
    setShowEmptyTrashConfirm(false);
    showToast('已清空回收站', { type: 'success' });
  };

  return (
    <>
      <div 
        className="flex items-center h-12 shrink-0 select-none titlebar-drag"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* 左侧区域：应用图标和名称 */}
        <div className="flex items-center gap-2 px-4 shrink-0 lg:px-6 lg:w-60">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center shrink-0">
            <svg 
              className="w-3 h-3 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>JustDo</span>
        </div>

        {/* 操作按钮区域：对齐到主区域左边 */}
        <div className="flex-1 flex items-center gap-2 px-4">
          <button
            onClick={toggleHideCompleted}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-colors duration-150 titlebar-no-drag"
            style={{
              backgroundColor: hideCompleted ? 'var(--bg-tertiary)' : 'transparent',
              color: hideCompleted ? 'var(--text-primary)' : 'var(--text-tertiary)',
            }}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>隐藏已完成任务</span>
          </button>

          <button
            onClick={handleClearCompleted}
            disabled={!hasCompletedTasks}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-colors duration-150 titlebar-no-drag"
            style={{
              backgroundColor: 'transparent',
              color: hasCompletedTasks ? 'var(--text-tertiary)' : 'var(--text-tertiary)',
              opacity: hasCompletedTasks ? 1 : 0.4,
              cursor: hasCompletedTasks ? 'pointer' : 'not-allowed',
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>回收已完成任务</span>
          </button>

          {currentView === 'trash' && (
            <button
              onClick={() => setShowEmptyTrashConfirm(true)}
              disabled={!hasTrashTasks}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-colors duration-150 titlebar-no-drag"
              style={{
                backgroundColor: hasTrashTasks ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                color: hasTrashTasks ? '#ef4444' : 'var(--text-tertiary)',
                opacity: hasTrashTasks ? 1 : 0.4,
                cursor: hasTrashTasks ? 'pointer' : 'not-allowed',
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空回收站</span>
            </button>
          )}
        </div>

        {/* 右侧区域：Windows 窗口控制按钮 */}
        {isWin && (
          <div className="flex items-center h-full shrink-0 titlebar-no-drag">
            <button
              onClick={handleMinimize}
              className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors duration-100"
              title="最小化"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleMaximize}
              className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors duration-100"
              title={isMaximized ? '还原' : '最大化'}
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClose}
              className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600/50 transition-colors duration-100"
              title="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showEmptyTrashConfirm && (
        <ConfirmModal
          title="确认清空回收站"
          message="此操作将永久删除回收站中的所有任务，且无法恢复。确定要继续吗？"
          confirmText="确认清空"
          onConfirm={handleEmptyTrash}
          onCancel={() => setShowEmptyTrashConfirm(false)}
        />
      )}
    </>
  );
}
