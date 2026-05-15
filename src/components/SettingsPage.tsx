import { useTaskStore } from '@/store/taskStore';
import type { ThemeMode } from '@/types';

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'dark', label: '深色模式' },
  { value: 'light', label: '浅色模式' },
  { value: 'system', label: '跟随系统' },
];

const defaultViewOptions: { value: 'all' | 'today' | 'urgent'; label: string }[] = [
  { value: 'all', label: '全部任务' },
  { value: 'today', label: '今天' },
  { value: 'urgent', label: '紧急' },
];

const zoomOptions: { value: number; label: string }[] = [
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' },
  { value: 110, label: '110%' },
  { value: 120, label: '120%' },
  { value: 130, label: '130%' },
  { value: 140, label: '140%' },
  { value: 150, label: '150%' },
];

export default function SettingsPage() {
  const settings = useTaskStore((s) => s.settings);
  const setThemeMode = useTaskStore((s) => s.setThemeMode);
  const setDefaultView = useTaskStore((s) => s.setDefaultView);
  const setZoomLevel = useTaskStore((s) => s.setZoomLevel);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>设置</h2>
      </div>

      <div className="flex flex-col gap-6 px-4">
        <div>
          <h3 className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>主题</h3>
          <div className="grid grid-cols-1 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setThemeMode(option.value)}
                className="flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 rounded"
                style={{
                  backgroundColor: settings.themeMode === option.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: settings.themeMode === option.value ? '#3b82f6' : 'var(--text-primary)'
                }}
              >
                <span className="text-sm">{option.label}</span>
                {settings.themeMode === option.value && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>默认启动页</h3>
          <div className="grid grid-cols-1 gap-2">
            {defaultViewOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDefaultView(option.value)}
                className="flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 rounded"
                style={{
                  backgroundColor: settings.defaultView === option.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: settings.defaultView === option.value ? '#3b82f6' : 'var(--text-primary)'
                }}
              >
                <span className="text-sm">{option.label}</span>
                {settings.defaultView === option.value && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>缩放</h3>
          <div className="flex flex-nowrap gap-2 overflow-x-auto">
            {zoomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setZoomLevel(option.value)}
                className="flex items-center justify-center px-2 py-3 text-left transition-colors duration-150 rounded shrink-0"
                style={{
                  backgroundColor: settings.zoomLevel === option.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: settings.zoomLevel === option.value ? '#3b82f6' : 'var(--text-primary)'
                }}
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
