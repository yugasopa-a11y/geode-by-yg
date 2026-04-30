import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import {
  Home,
  SquarePen,
  ListChecks,
  PanelRight,
  Sun,
  Moon,
  Settings,
  Trash2,
  Menu,
  X,
  Plus,
  Zap,
  ChevronDown,
  ArrowDownCircle,
  Database,
  Cpu
} from 'lucide-react';
import Sidebar from './Sidebar';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
import ArtifactsPanel from './ArtifactsPanel';
import PlanView from './PlanView';
import SettingsPanel from './SettingsPanel';
import FloatingDock from './ui/FloatingDock';
import StatusBar from './StatusBar';
import CommandPalette from './CommandPalette';
import SkillsPanel from './SkillsPanel';
import { Loader, WaveLoader, TextShimmerLoader, TypingLoader } from './ui/Loader';
import { ToastContainer, Toast } from './ui/Toast';
import { Message, Conversation, Task, AgentState } from '../types';
import { chatStream, generateTitle, generatePlan, formatMessagesForAI } from '../api';
import { saveConversations, loadConversations, saveActiveId, loadActiveId } from '../store';
import { useLocalStorage } from '../hooks';
import { cn } from '../utils/cn';

interface ChatViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onGoHome: () => void;
}

const MODELS = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', cost: '$3/M' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', cost: '$15/M' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', cost: '$0.25/M' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini 1.5 Pro', cost: 'Free' },
];

const ChatView = ({ isDark, onToggleTheme, onGoHome }: ChatViewProps) => {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations());
  const [activeId, setActiveId] = useState<string | null>(loadActiveId());
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false);
  const [isPlanVisible, setIsPlanVisible] = useState(false);
  const [planTasks, setPlanTasks] = useState<Task[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSkillsPanelOpen, setIsSkillsPanelOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [agentState, setAgentState] = useState<AgentState>('IDLE');
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const [systemPrompt, setSystemPrompt] = useLocalStorage('geode-system-prompt', 'You are Geode, an advanced AI assistant created by YG.');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingContentRef = useRef('');

  const { scrollYProgress } = useScroll({ container: chatContainerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const bgY = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);

  const activeConversation = conversations.find(c => c.id === activeId);

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    saveActiveId(activeId);
  }, [activeId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, streamingContent]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
     const target = e.currentTarget;
     const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
     setShowScrollBottom(!isAtBottom);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Intelligence',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: 'anthropic/claude-3.5-sonnet',
      thinkingDepth: 'standard',
      pinnedContextIds: [],
      enabledTools: ['web-search', 'code-sandbox', 'image-vision', 'doc-reader', 'mermaid-render']
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newConv.id);
    setPlanTasks([]);
    setIsPlanVisible(false);
    setIsMobileMenuOpen(false);
    addToast('Engine re-initialized', 'success');
  };

  const deleteConversation = (id: string | null) => {
    if (!id) return;
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeId === id) {
      setActiveId(filtered.length > 0 ? filtered[0].id : null);
    }
    setIsMobileMenuOpen(false);
    addToast('Memory sector cleared', 'info');
  };

  const handleSend = async (content: string, image?: string) => {
    let processedContent = content
      .replace('{{date}}', new Date().toLocaleDateString())
      .replace('{{url}}', window.location.href);

    if (!activeId) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: processedContent.slice(0, 40) + (processedContent.length > 40 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model: 'anthropic/claude-3.5-sonnet',
        thinkingDepth: 'standard',
        pinnedContextIds: [],
        enabledTools: ['web-search', 'code-sandbox', 'image-vision', 'doc-reader', 'mermaid-render']
      };
      setConversations([newConv, ...conversations]);
      setActiveId(newConv.id);
      await sendMessage(newConv.id, processedContent, [], image);
    } else {
      await sendMessage(activeId, processedContent, activeConversation?.messages || [], image);
    }
  };

  const updatePlanFromStream = (content: string) => {
    if (planTasks.length === 0) return;

    // Heuristic status updates
    setPlanTasks(prev => {
      const newTasks = [...prev];
      let changed = false;

      newTasks.forEach((task, idx) => {
        // If task title or description is mentioned as "starting" or "beginning"
        if (task.status === 'pending') {
          if (content.toLowerCase().includes(task.title.toLowerCase()) ||
              content.toLowerCase().includes('starting') ||
              content.toLowerCase().includes('beginning')) {
             task.status = 'in-progress';
             changed = true;
          }
        }

        // If current task seems complete
        if (task.status === 'in-progress') {
           const nextTask = newTasks[idx + 1];
           if (nextTask && content.toLowerCase().includes(nextTask.title.toLowerCase())) {
              task.status = 'completed';
              changed = true;
           }
        }
      });

      // Special case: if near end of stream, mark all as complete
      if (content.length > 1000 && !content.endsWith('...')) {
         newTasks.forEach(t => t.status = 'completed');
         changed = true;
      }

      return changed ? newTasks : prev;
    });
  };

  const sendMessage = async (id: string, content: string, history: Message[], image?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: image ? `${content}\n\n![Image](${image})` : content,
      timestamp: Date.now(),
    };

    setConversations(prev => prev.map(c => c.id === id ? {
      ...c,
      messages: [...c.messages, userMessage],
      updatedAt: Date.now()
    } : c));

    setIsStreaming(true);
    setStreamingContent('');
    streamingContentRef.current = '';
    setAgentState('PLANNING');

    // Titling and Planning in background
    if (history.length === 0) {
      generateTitle(content).then(title => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c));
      });
    }

    if (activeConversation?.thinkingDepth !== 'quick') {
      try {
        const tasks = await generatePlan(content);
        setPlanTasks(tasks);
        if (tasks.length > 0) setIsPlanVisible(true);
      } catch (e) {
        console.error("Plan generation failed", e);
      }
    }

    try {
      setAgentState('STREAMING');
      abortControllerRef.current = new AbortController();

      const pinnedMessages = activeConversation?.messages.filter(m => activeConversation.pinnedContextIds.includes(m.id)) || [];
      const aiMessages = formatMessagesForAI([...history, userMessage], pinnedMessages);

      await chatStream(
        aiMessages,
        activeConversation?.model || 'anthropic/claude-3.5-sonnet',
        (chunk) => {
          if (chunk.startsWith('[TOOL_CALL:')) {
            setAgentState('SEARCHING'); // Map to appropriate state
            return;
          }
          streamingContentRef.current += chunk;
          setStreamingContent(streamingContentRef.current);
          updatePlanFromStream(streamingContentRef.current);
        },
        {
          signal: abortControllerRef.current.signal,
          systemPrompt: systemPrompt
        }
      );

      const finalContent = streamingContentRef.current;
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: finalContent,
        timestamp: Date.now(),
      };

      setConversations(prev => prev.map(c => c.id === id ? {
        ...c,
        messages: [...c.messages, assistantMessage],
        updatedAt: Date.now()
      } : c));

    } catch (error: any) {
      if (error.name === 'AbortError') return;
      addToast(error.message || 'Signal disruption detected', 'error');
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
      streamingContentRef.current = '';
      abortControllerRef.current = null;
      setAgentState('IDLE');
      setPlanTasks(prev => prev.map(t => ({ ...t, status: 'completed' })));
    }
  };

  const handleCommand = (cmd: string) => {
    if (cmd === 'toggle') setIsCommandPaletteOpen(!isCommandPaletteOpen);
    if (cmd === 'new-chat') createConversation();
    if (cmd === 'toggle-theme') onToggleTheme();
    if (cmd === 'settings') setSettingsOpen(true);
    if (cmd === 'skills') setIsSkillsPanelOpen(true);
    if (cmd === 'plan') setIsPlanVisible(!isPlanVisible);
    if (cmd === 'clear') deleteConversation(activeId);
    setIsCommandPaletteOpen(false);
  };

  const dockItems = [
    { title: 'Home', icon: <Home size={20} />, onClick: onGoHome },
    { title: 'New Intelligence', icon: <SquarePen size={20} />, onClick: createConversation },
    { title: 'Skills Registry', icon: <Zap size={20} className="text-accent" fill="currentColor" />, onClick: () => setIsSkillsPanelOpen(true) },
    { title: 'Live Plan', icon: <ListChecks size={20} />, onClick: () => setIsPlanVisible(!isPlanVisible) },
    { title: 'Artifacts', icon: <PanelRight size={20} />, onClick: () => setIsArtifactsOpen(!isArtifactsOpen) },
    { title: 'Vitals', icon: <Settings size={20} />, onClick: () => setSettingsOpen(true) },
    { title: 'Purge', icon: <Trash2 size={20} />, onClick: () => deleteConversation(activeId) },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <StatusBar state={agentState} />

      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={createConversation}
        onDelete={deleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        pinnedMessages={activeConversation?.messages.filter(m => activeConversation.pinnedContextIds.includes(m.id)) || []}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-background/50 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-text-secondary"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
               <div className={cn(
                 "w-2 h-2 rounded-full",
                 isStreaming ? "bg-accent animate-ping" : "bg-white/10"
               )} />
               <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-text-secondary">
                 Sector: {activeConversation?.title || 'Initialization'}
               </h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative">
                <button
                  onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <Cpu size={14} className="text-accent" />
                  <span className="text-[10px] font-mono text-text-secondary uppercase">
                    {activeConversation?.model.split('/').pop() || 'Select Model'}
                  </span>
                  <ChevronDown size={10} className="text-text-secondary" />
                </button>

                <AnimatePresence>
                  {isModelSelectorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 right-0 w-64 glass-panel rounded-2xl overflow-hidden z-[100] border-white/10 p-1"
                    >
                      {MODELS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setConversations(prev => prev.map(c => c.id === activeId ? { ...c, model: m.id } : c));
                            setIsModelSelectorOpen(false);
                            addToast(`Switched to ${m.name}`, 'info');
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-left transition-all",
                            activeConversation?.model === m.id ? "text-accent bg-accent/5" : "text-text-secondary"
                          )}
                        >
                          <div className="flex flex-col">
                             <span className="text-xs font-medium">{m.name}</span>
                             <span className="text-[8px] font-mono opacity-50">{m.cost} tokens</span>
                          </div>
                          {activeConversation?.model === m.id && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-text-secondary/40">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
                UPTIME: 100%
             </div>
          </div>
        </header>

        <div className="relative flex-1 overflow-hidden flex">
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none opacity-30"
            style={{ x: bgX, y: bgY }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,110,0.05),transparent_70%)]" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-amber/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-surface-steel/10 rounded-full blur-[120px]" />
          </motion.div>

          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar relative z-10"
          >
            <motion.div
              className="fixed top-16 left-0 right-0 h-[1px] bg-accent/60 z-50 origin-left"
              style={{ scaleX }}
            />

            <div className="max-w-4xl mx-auto py-12 px-4">
              {!activeId || (activeConversation?.messages.length === 0 && !streamingContent) ? (
                <EmptyState onSuggest={handleSend} />
              ) : (
                <>
                  {activeConversation?.messages.map((m, i) => (
                    <ChatMessage
                      key={m.id}
                      message={m}
                      isLast={i === activeConversation.messages.length - 1}
                      onRegenerate={() => handleSend(activeConversation.messages[i-1]?.content || '')}
                    />
                  ))}

                  {isStreaming && (
                    <div className="space-y-4">
                      {streamingContent ? (
                        <ChatMessage
                          message={{
                            id: 'streaming',
                            role: 'assistant',
                            content: streamingContent,
                            timestamp: Date.now()
                          }}
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start mb-12"
                        >
                          <div className="flex max-w-[85%] md:max-w-[75%]">
                            <div className="glass-panel p-8 rounded-3xl rounded-tl-none space-y-4 min-w-[300px] border-accent/20 bg-accent/5">
                              <div className="flex items-center gap-4">
                                <WaveLoader size="lg" />
                                <div className="space-y-1">
                                   <TextShimmerLoader text="Assembling cognitive response..." size="lg" />
                                   <p className="text-[10px] font-mono text-accent/50 uppercase tracking-widest">Neural Link Active</p>
                                </div>
                              </div>
                              <div className="pt-2">
                                <TypingLoader size="md" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </>
              )}
            </div>

            <AnimatePresence>
              {showScrollBottom && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={scrollToBottom}
                  className="fixed bottom-32 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass-panel flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent hover:bg-accent/10 transition-all z-30"
                >
                  <ArrowDownCircle size={14} />
                  New Telemetry
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isPlanVisible && (
              <PlanView
                tasks={planTasks}
                onClose={() => setIsPlanVisible(false)}
                depth={activeConversation?.thinkingDepth || 'standard'}
                onDepthChange={(depth) => {
                   setConversations(prev => prev.map(c => c.id === activeId ? { ...c, thinkingDepth: depth } : c));
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isArtifactsOpen && (
              <ArtifactsPanel content={activeConversation?.messages[activeConversation.messages.length-1]?.content || streamingContent} onClose={() => setIsArtifactsOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        <ChatInput onSend={handleSend} disabled={isStreaming} />

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden sm:block">
          <FloatingDock items={dockItems} />
        </div>

        {/* Mobile FAB with Actions */}
        <div className="fixed bottom-6 right-6 z-[80] sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-14 h-14 rounded-full bg-accent text-black shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Plus size={24} />}
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md z-[81]"
                />
                <motion.div
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  className="fixed bottom-0 left-0 right-0 glass-panel rounded-t-[32px] overflow-hidden flex flex-col p-4 pb-12 gap-2 z-[82] border-white/10"
                >
                  <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4" />
                  {dockItems.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => { item.onClick(); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-4 px-6 h-14 rounded-2xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                         {item.icon}
                      </div>
                      <span>{item.title}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        systemPrompt={systemPrompt}
        onSystemPromptChange={setSystemPrompt}
        onClearAll={() => {
          setConversations([]);
          setActiveId(null);
          localStorage.clear();
          window.location.reload();
        }}
      />

      <SkillsPanel
        isOpen={isSkillsPanelOpen}
        onClose={() => setIsSkillsPanelOpen(false)}
        enabledTools={activeConversation?.enabledTools || []}
        onToggleTool={(toolId) => {
           setConversations(prev => prev.map(c => c.id === activeId ? {
             ...c,
             enabledTools: c.enabledTools.includes(toolId)
               ? c.enabledTools.filter(id => id !== toolId)
               : [...c.enabledTools, toolId]
           } : c));
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={handleCommand}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ChatView;
