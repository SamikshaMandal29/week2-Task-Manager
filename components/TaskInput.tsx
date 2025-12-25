import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { Priority } from '../types';
import { PRIORITY_STYLES } from '../constants';

interface TaskInputProps {
  onAddTask: (text: string, priority: Priority, dueDate?: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle collapsing the form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!text.trim()) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Task description cannot be empty');
      return;
    }
    onAddTask(text, priority, dueDate || undefined);
    setText('');
    setPriority(Priority.MEDIUM);
    setDueDate('');
    setError('');
  };

  const isFormVisible = isExpanded || text.length > 0;

  return (
    <div 
      ref={containerRef}
      className={`rounded-xl overflow-hidden transition-all duration-300 border border-transparent ${
        isFormVisible ? 'bg-white/40 dark:bg-indigo-950/40 shadow-lg border-white/40 dark:border-white/5' : ''
      }`}
    >
      <form onSubmit={handleSubmit} className="p-1">
        <div className="flex items-center gap-2 p-2">
          <div className="flex-1 relative flex items-center">
             <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError('');
              }}
              onFocus={() => setIsExpanded(true)}
              autoComplete="off"
              placeholder="What needs to be done?"
              className={`w-full bg-white/50 dark:bg-indigo-950/30 border ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-primary'
              } rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-inner`}
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className={`hidden md:flex bg-primary hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3.5 rounded-xl transition-all items-center justify-center shadow-md transform ${
               isFormVisible && text.trim() ? 'scale-100 opacity-100' : 'scale-90 opacity-0 w-0 p-0 overflow-hidden'
            }`}
            title="Add Task"
          >
            <Plus size={24} />
          </button>
        </div>

        {error && (
          <div className="px-4 pb-2 flex items-center gap-2 text-red-500 text-sm animate-pulse">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Collapsible Options Section */}
        <div 
          className={`overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isFormVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 pt-2 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
              
              {/* Custom Priority Selector */}
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Priority</span>
                 <div className="flex bg-white/40 dark:bg-indigo-950/40 p-1 rounded-lg">
                    {(Object.values(Priority) as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                          priority === p 
                            ? `${PRIORITY_STYLES[p].badge} shadow-sm ring-1 ring-black/5` 
                            : 'text-slate-500 hover:bg-white/50 dark:hover:bg-indigo-950/50'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                           p === Priority.HIGH ? 'bg-rose-500' : 
                           p === Priority.MEDIUM ? 'bg-orange-400' : 'bg-sky-400'
                        }`} />
                        {PRIORITY_STYLES[p].label}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Due Date Selector */}
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Due Date</span>
                <div className="flex items-center gap-2 bg-white/40 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-transparent focus-within:ring-2 focus-within:ring-primary/20 hover:bg-white/60 dark:hover:bg-indigo-900/40 transition-colors">
                  <Calendar size={14} className="text-slate-500 dark:text-slate-300" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-transparent text-sm text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full md:w-auto"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="md:hidden w-full bg-primary hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mt-2 shadow-md"
            >
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;