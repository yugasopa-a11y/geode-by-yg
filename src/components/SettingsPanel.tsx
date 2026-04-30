import React from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2, Shield, Zap, Database } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  onClearAll: () => void;
}

const SettingsPanel = ({
  isOpen,
  onClose,
  systemPrompt,
  onSystemPromptChange,
  onClearAll
}: SettingsPanelProps) => {
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
        className="relative w-full max-w-xl bg-surface-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#c9a96e]" />
            <h2 className="text-lg font-serif">Advanced Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#c9a96e]">
              <Zap size={16} />
              <h3 className="text-sm font-medium uppercase tracking-wider">System Prompt</h3>
            </div>
            <p className="text-xs text-text-secondary">
              Customize the base personality and behavior of Geode. This prompt is sent with every conversation.
            </p>
            <textarea
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-text-primary focus:outline-none focus:border-[#c9a96e]/50 transition-colors resize-none"
              placeholder="Enter system instructions..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <Database size={16} />
              <h3 className="text-sm font-medium uppercase tracking-wider">Danger Zone</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-400/5 border border-red-400/10 rounded-xl">
              <div>
                <h4 className="text-sm font-medium text-red-200">Clear All Data</h4>
                <p className="text-[10px] text-red-400/70">This will permanently delete all conversations and settings.</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure? This cannot be undone.')) {
                    onClearAll();
                  }
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg border border-red-500/20 transition-all"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/5 bg-white/2 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 bg-[#c9a96e] hover:bg-[#b8985d] text-black text-sm font-medium rounded-xl transition-all"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;
