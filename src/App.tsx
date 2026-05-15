import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import TaskDetailModal from '@/components/TaskDetailModal';
import SettingsPage from '@/components/SettingsPage';
import CustomTitleBar from '@/components/CustomTitleBar';
import { useTaskStore } from '@/store/taskStore';

const viewTitles: Record<string, string> = {
  all: '全部任务',
  today: '今天',
  urgent: '紧急',
  important: '重要',
  completed: '已完成',
  trash: '回收站',
  settings: '设置',
};

export default function App() {
  const currentView = useTaskStore((s) => s.currentView);
  const toggleSidebar = useTaskStore((s) => s.toggleSidebar);
  const editingTaskId = useTaskStore((s) => s.editingTaskId);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* 自定义标题栏 */}
      <CustomTitleBar />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px 0 0 0', overflow: 'hidden' }}>
          <div className="flex items-center gap-3 h-12 px-4 shrink-0 lg:hidden">
            <button
              onClick={toggleSidebar}
              className="p-1 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{viewTitles[currentView]}</span>
          </div>

          {currentView === 'settings' ? <SettingsPage /> : <TaskList />}
        </main>
      </div>

      {editingTaskId && <TaskDetailModal />}
    </div>
  );
}
