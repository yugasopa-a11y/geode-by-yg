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
  Plus
} from 'lucide-react';
import Sidebar from './Sidebar';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
import ArtifactsPanel from './ArtifactsPanel';
import PlanView from './PlanView';
import SettingsPanel from './SettingsPanel';
import FloatingDock from './ui/FloatingDock';
import { Loader, WaveLoader, TextShimmerLoader, TypingLoader } from './ui/Loader';
import { ToastContainer, Toast } from './ui/Toast';
import { Message, Conversation, Task } from '../types';
import { chatStream } from '../api';
import { saveConversations, loadConversations, saveActiveId, loadActiveId } from '../store';
import { useLocalStorage } from '../hooks';
import { cn } from '../utils/cn';

interface ChatViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onGoHome: () => void;
}

const ChatView = ({ isDark, onToggleTheme, onGoHome }: ChatViewProps) => {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations());
  const [activeId, setActiveId] = useState<string | null>(loadActiveId());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false);
  const [isPlanVisible, setIsPlanVisible] = useState(false);
  const [planTasks, setPlanTasks] = useState<Task[] | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [systemPrompt, setSystemPrompt] = useLocalStorage('geode-system-prompt', 'You are Geode, an advanced AI assistant created by YG.');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  useEffect(() => {
    if (conversations.length === 0 && !activeId) {
      addToast('Welcome to Geode 💎', 'info');
    }
  }, []);

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
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newConv.id);
    setPlanTasks(null);
    setIsPlanVisible(false);
    setIsMobileMenuOpen(false);
    addToast('New conversation started', 'success');
  };

  const deleteConversation = (id: string | null) => {
    if (!id) return;
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeId === id) {
      setActiveId(filtered.length > 0 ? filtered[0].id : null);
    }
    setIsMobileMenuOpen(false);
    addToast('Conversation deleted', 'info');
  };

  const handleSend = async (content: string, image?: string) => {
    if (!activeId) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations([newConv, ...conversations]);
      setActiveId(newConv.id);
      await sendMessage(newConv.id, content, [], image);
    } else {
      await sendMessage(activeId, content, activeConversation?.messages || [], image);
    }
  };

  const sendMessage = async (id: string, content: string, history: Message[], image?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: image ? `${content}\n\n![Image](${image})` : content,
      timestamp: Date.now(),
    };

    const updatedConversations = conversations.map(c => {
      if (c.id === id) {
        return {
          ...c,
          messages: [...c.messages, userMessage],
          updatedAt: Date.now(),
          title: c.messages.length === 0 ? content.slice(0, 40) : c.title
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setIsStreaming(true);
    setStreamingContent('');

    // Fake plan generation for demo
    if (!isPlanVisible) {
      setTimeout(() => {
        setPlanTasks([
          {
            id: '1',
            title: "Understanding your request",
            description: "Parsing intent and identifying context",
            status: 'in-progress',
            priority: 'high',
            level: 1,
            dependencies: [],
            subtasks: [
              { id: '1-1', title: "Parsing intent", description: "Determining what the user wants to achieve", status: 'completed', priority: 'high' },
              { id: '1-2', title: "Identifying context", description: "Extracting relevant entities and background", status: 'in-progress', priority: 'medium' }
            ]
          },
          {
            id: '2',
            title: "Formulating response",
            description: "Selecting approach and drafting answer",
            status: 'pending',
            priority: 'medium',
            level: 1,
            dependencies: ['1'],
            subtasks: [
              { id: '2-1', title: "Selecting approach", description: "Choosing the best way to present information", status: 'pending', priority: 'medium' },
              { id: '2-2', title: "Drafting answer", description: "Writing the actual content", status: 'pending', priority: 'high' }
            ]
          },
          {
            id: '3',
            title: "Refining output",
            description: "Checking accuracy and polishing language",
            status: 'pending',
            priority: 'low',
            level: 1,
            dependencies: ['2'],
            subtasks: [
              { id: '3-1', title: "Checking accuracy", description: "Verifying facts and logic", status: 'pending', priority: 'medium' },
              { id: '3-2', title: "Polishing language", description: "Ensuring tone and style are consistent", status: 'pending', priority: 'low' }
            ]
          }
        ]);
        setIsPlanVisible(true);
      }, 2000);
    }

    try {
      abortControllerRef.current = new AbortController();
      const messagesWithSystem = [
        { role: 'system', content: systemPrompt, id: 'sys', timestamp: Date.now() },
        ...history,
        userMessage
      ];

      await chatStream(
        messagesWithSystem as Message[],
        (chunk) => setStreamingContent(prev => prev + chunk),
        abortControllerRef.current.signal
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setConversations(prev => prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            messages: [...c.messages, { ...assistantMessage, content: "" }],
            updatedAt: Date.now()
          };
        }
        return c;
      }));

      setConversations(prev => prev.map(c => {
        if (c.id === id) {
          const lastMsg = c.messages[c.messages.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
             lastMsg.content = streamingContent;
          }
          return { ...c };
        }
        return c;
      }));

    } catch (error: any) {
      if (error.name === 'AbortError') return;
      addToast(error.message || 'An error occurred', 'error');
      console.error(error);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    addToast('Generation stopped', 'info');
  };

  const dockItems = [
    { title: 'Home', icon: <Home size={20} />, onClick: onGoHome },
    { title: 'New Chat', icon: <SquarePen size={20} />, onClick: createConversation },
    { title: 'Plan', icon: <ListChecks size={20} />, onClick: () => { setIsPlanVisible(!isPlanVisible); setIsMobileMenuOpen(false); } },
    { title: 'Artifacts', icon: <PanelRight size={20} />, onClick: () => { setIsArtifactsOpen(!isArtifactsOpen); setIsMobileMenuOpen(false); } },
    { title: 'Theme', icon: isDark ? <Sun size={20} /> : <Moon size={20} />, onClick: () => { onToggleTheme(); setIsMobileMenuOpen(false); } },
    { title: 'Settings', icon: <Settings size={20} />, onClick: () => { setSettingsOpen(true); setIsMobileMenuOpen(false); } },
    { title: 'Clear', icon: <Trash2 size={20} />, onClick: () => deleteConversation(activeId) },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
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
            <h2 className="text-sm font-medium text-text-secondary truncate max-w-[200px] md:max-w-md">
              {activeConversation?.title || 'Geode AI Chat'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming && (
              <button
                onClick={stopGeneration}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
              >
                Stop
              </button>
            )}
          </div>
        </header>

        <div className="relative flex-1 overflow-hidden flex">
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none opacity-20"
            style={{ x: bgX, y: bgY }}
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a96e]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
          </motion.div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar relative z-10"
          >
            <motion.div
              className="fixed top-16 left-0 right-0 h-[1px] bg-[#c9a96e]/60 z-50 origin-left"
              style={{ scaleX }}
            />

            <div className="max-w-3xl mx-auto py-8 px-4">
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
                          className="flex justify-start mb-8"
                        >
                          <div className="flex max-w-[85%] md:max-w-[75%]">
                            <div className="w-8 h-8 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center mr-4 mt-1">
                              <Loader variant="circular" size="sm" />
                            </div>
                            <div className="glass-panel p-6 rounded-2xl rounded-tl-none space-y-3 min-w-[200px]">
                              <div className="flex items-center gap-3">
                                <WaveLoader size="md" />
                                <TextShimmerLoader text="Geode is thinking" size="md" />
                              </div>
                              <TypingLoader size="sm" />
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
          </div>

          <AnimatePresence>
            {isPlanVisible && planTasks && (
              <PlanView tasks={planTasks} onClose={() => setIsPlanVisible(false)} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isArtifactsOpen && streamingContent.includes('```') && (
              <ArtifactsPanel content={streamingContent} onClose={() => setIsArtifactsOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        <ChatInput onSend={handleSend} disabled={isStreaming} />

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden sm:block">
          <FloatingDock items={dockItems} />
        </div>

        {/* Mobile FAB with Actions */}
        <div className="fixed bottom-6 right-6 z-50 sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-14 h-14 rounded-full bg-[#c9a96e] text-black shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Plus size={24} />}
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-20 right-0 w-64 glass-panel rounded-2xl overflow-hidden flex flex-col p-2 gap-1"
              >
                {dockItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all text-sm"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </button>
                ))}
              </motion.div>
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ChatView;
