'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

// Message type
interface Message {
  id: number;
  agent: string;
  avatar: string;
  content: string;
  time: string;
  isUser?: boolean;
  hasLink?: boolean;
  linkUrl?: string;
  linkTitle?: string;
  // P2 Fix: 交付链接（支持多个链接）
  deliverables?: DeliverableLink[];
}

// Generated content result
interface GeneratedContent {
  type: string;
  topic: string;
  style: string;
  content: string;
  docUrl: string;
  message: string;
  note?: string;
}

// Deliverable link for task completion
interface DeliverableLink {
  type: 'xiaohongshu' | 'app' | 'script' | 'website';
  label: string;
  onlineUrl?: string;  // 在线访问链接（部署后的 URL）
  sourceUrl?: string;  // 源代码链接（GitHub）
  docUrl?: string;     // 飞书文档链接
}

// Agent status type
type AgentStatus = 'waiting' | 'running' | 'completed' | 'paused' | 'cancelled';

// Task control state
interface TaskControlState {
  isPaused: boolean;
  isCancelled: boolean;
}

// Execution state for resumable tasks
interface ExecutionState {
  currentStep: number;        // Current agent response index (0-3)
  userMessage: string;         // Original user message for context
  startTime: number;          // When execution started
}

interface AgentProgress {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: AgentStatus;
  task: string;
  progress: number;
}

interface LogEntry {
  time: string;
  agent: string;
  action: string;
  type: 'running' | 'success' | 'info';
}

// 初始 Agent 配置（等待状态）
const defaultAgents: AgentProgress[] = [
  { id: 1, name: 'CEO Lobster', role: '任务协调', avatar: '🦞', status: 'waiting', task: '等待任务分配', progress: 0 },
  { id: 2, name: 'Coder Lobster', role: '代码开发', avatar: '💻', status: 'waiting', task: '等待任务分配', progress: 0 },
  { id: 3, name: 'Designer Lobster', role: 'UI/UX', avatar: '🎨', status: 'waiting', task: '等待任务分配', progress: 0 },
  { id: 4, name: 'DevOps Lobster', role: '部署运维', avatar: '⚙️', status: 'waiting', task: '等待任务分配', progress: 0 },
];

// 模拟的 Agent 响应
const agentResponses = [
  { agent: 'CEO', avatar: '🦞', content: '收到！我来分析需求并协调团队。让我先拆解一下任务...', delay: 1500, taskDesc: '分析需求文档...' },
  { agent: 'Coder', avatar: '💻', content: '明白，我来评估技术方案。\n\n初步分析：\n1. 需要数据层\n2. 核心逻辑层\n3. 输出层\n\n开始编码...', delay: 3000, taskDesc: '编写代码框架...' },
  { agent: 'Designer', avatar: '🎨', content: '收到需求，我来设计用户界面和交互流程。', delay: 2500, taskDesc: '设计 UI 原型...' },
  { agent: 'DevOps', avatar: '⚙️', content: '好的，我来准备部署环境和 CI/CD 配置。', delay: 2000, taskDesc: '配置部署环境...' },
];

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isNewProject = searchParams.get('new') === 'true';
  const projectName = searchParams.get('name') || '新项目';
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents, setAgents] = useState<AgentProgress[]>(defaultAgents);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showProgressPanel, setShowProgressPanel] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasOutputFiles, setHasOutputFiles] = useState(false);
  const [taskControl, setTaskControl] = useState<TaskControlState>({ isPaused: false, isCancelled: false });
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // V3: Content generation states
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [contentTopic, setContentTopic] = useState('');
  const [contentStyle, setContentStyle] = useState<'种草' | '攻略' | '测评'>('种草');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  
  // P1-1: Scroll state for mini agent status bar
  const [isScrolled, setIsScrolled] = useState(false);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  
  // Flag to check if task was paused mid-execution (not completed)
  const wasPausedMidExecution = useRef(false);
  
  // Ref to track execution state for timeout callbacks (avoids stale closures)
  const isExecutionCancelled = useRef(false);
  const isExecutionPaused = useRef(false);
  const executionStateRef = useRef<ExecutionState | null>(null);

  // Storage key for messages
  const storageKey = `lobster-messages-${projectName}`;

  // Check if first visit - show welcome guide
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('lobster-hasSeenWelcome');
    if (!hasSeenWelcome && isNewProject) {
      setShowWelcome(true);
      localStorage.setItem('lobster-hasSeenWelcome', 'true');
    }
  }, [isNewProject]);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (!isNewProject) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            // P1-3: Restore hasOutputFiles state from persisted messages
            const hasLink = parsed.some((msg: Message) => msg.hasLink && msg.linkUrl);
            if (hasLink) {
              setHasOutputFiles(true);
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [storageKey, isNewProject]);
  
  // P1-1: Scroll detection for mini status bar
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      // Show mini bar when scrolled down more than 50px (past the agent cards)
      setIsScrolled(scrollTop > 50);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  // Get current time in HH:mm format
  const getCurrentTime = useCallback(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }, []);

  // Add log entry
  const addLog = useCallback((agent: string, action: string, type: 'running' | 'success' | 'info') => {
    setLogs(prev => [{ time: getCurrentTime(), agent, action, type }, ...prev].slice(0, 20));
  }, [getCurrentTime]);

  // Update agent status
  const updateAgentStatus = useCallback((agentId: number, status: AgentStatus, task: string, progress: number) => {
    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status, task, progress } : a
    ));
  }, []);

  // Clear all pending timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];
  }, []);

  // Execute agent responses from a specific step
  const executeAgentResponses = useCallback((startStep: number, userMsg: string) => {
    let messageDelay = 200; // Shorter delay when resuming
    
    agentResponses.slice(startStep).forEach((response, relativeIndex) => {
      const actualIndex = startStep + relativeIndex;
      const timeoutId = setTimeout(() => {
        // Check if task was paused or cancelled using refs (avoids stale closure issues)
        if (isExecutionCancelled.current || isExecutionPaused.current) {
          wasPausedMidExecution.current = true;
          return;
        }
        
        const newMessage: Message = {
          id: Date.now() + actualIndex,
          agent: response.agent,
          avatar: response.avatar,
          content: response.content,
          time: getCurrentTime(),
        };
        setMessages(prev => [...prev, newMessage]);
        
        // Update corresponding Agent status with specific task description
        const agentId = actualIndex + 1;
        const progress = 20 + actualIndex * 20;
        updateAgentStatus(agentId, 'running', response.taskDesc || '执行任务中...', progress);
        addLog(response.agent, response.content.split('\n')[0].substring(0, 30) + '...', 'running');
        
        // Update execution state
        setExecutionState(prev => {
          if (prev) {
            const newState = { ...prev, currentStep: actualIndex + 1 };
            executionStateRef.current = newState;
            return newState;
          }
          return null;
        });
        
        // Last response - mark complete
        if (actualIndex === agentResponses.length - 1) {
          const completeTimeout = setTimeout(() => {
            // Check again before completing
            if (isExecutionCancelled.current || isExecutionPaused.current) {
              return;
            }
            
            // Mark all agents as completed
            setAgents(prev => prev.map(a => ({ ...a, status: 'completed' as AgentStatus, progress: 100, task: '任务完成' })));
            addLog('CEO', '任务分配完成，团队开始工作', 'success');
            
            // P2 Fix: Detect task type and provide appropriate deliverable links
            const userMessage = executionStateRef.current?.userMessage || '';
            const isAppTask = /网站|应用|游戏|app|web|game/i.test(userMessage);
            const isContentTask = /小红书|内容|文案|种草|攻略|测评/i.test(userMessage);
            
            let deliverables: DeliverableLink[] | undefined;
            let completionContent = '';
            
            if (isAppTask) {
              // 应用项目：提供在线链接 + 源代码链接
              deliverables = [{
                type: 'app',
                label: '应用项目',
                onlineUrl: 'https://demo.lobster-ai.dev',  // 实际部署时会替换
                sourceUrl: 'https://github.com/lobster-ai/demo-app',
              }];
              completionContent = '✅ 应用开发完成！\n\n🎉 项目已部署上线，点击下方链接访问：';
            } else if (isContentTask) {
              // 内容任务：提示使用小红书功能
              completionContent = '✅ 任务已启动！\n\n💡 如需生成小红书内容，请点击下方 **📕 小红书内容** 按钮。';
            } else {
              // 默认任务
              completionContent = '✅ 团队已就绪，开始执行任务！\n\n💡 如需生成小红书内容，请点击下方 **📕 小红书内容** 按钮。';
            }
            
            const completionMessage: Message = {
              id: Date.now() + 100,
              agent: 'CEO',
              avatar: '🦞',
              content: completionContent,
              time: getCurrentTime(),
              hasLink: !!deliverables,
              deliverables,
            };
            setMessages(prev => [...prev, completionMessage]);
            setHasOutputFiles(true);
            setIsProcessing(false);
            setExecutionState(null);
            executionStateRef.current = null;
            wasPausedMidExecution.current = false;
          }, 1000);
          timeoutRefs.current.push(completeTimeout);
        }
      }, messageDelay);
      timeoutRefs.current.push(timeoutId);
      messageDelay += response.delay;
    });
  }, [getCurrentTime, updateAgentStatus, addLog]);

  // Handle pause task
  const handlePauseTask = useCallback(() => {
    clearAllTimeouts();
    isExecutionPaused.current = true;
    wasPausedMidExecution.current = true;
    setTaskControl(prev => ({ ...prev, isPaused: true }));
    setAgents(prev => prev.map(a => 
      a.status === 'running' ? { ...a, status: 'paused' as AgentStatus, task: '已暂停 - 等待恢复' } : a
    ));
    addLog('System', '任务已暂停', 'info');
  }, [clearAllTimeouts, addLog]);

  // Handle resume task
  const handleResumeTask = useCallback(() => {
    // Reset pause flag first
    isExecutionPaused.current = false;
    setTaskControl(prev => ({ ...prev, isPaused: false }));
    
    // Get current execution state from ref (avoids stale closure)
    const currentState = executionStateRef.current;
    if (!currentState) {
      // No execution state, just reset UI
      setAgents(prev => prev.map(a => 
        a.status === 'paused' ? { ...a, status: 'running' as AgentStatus, task: '继续执行中...' } : a
      ));
      addLog('System', '任务已恢复', 'info');
      return;
    }
    
    // Update paused agents to running
    setAgents(prev => prev.map(a => 
      a.status === 'paused' ? { ...a, status: 'running' as AgentStatus, task: '继续执行中...' } : a
    ));
    
    addLog('System', '任务已恢复，继续执行...', 'info');
    
    // Check if all messages were already added (currentStep >= agentResponses.length)
    // If so, just trigger completion
    if (currentState.currentStep >= agentResponses.length) {
      // All agents already responded, just complete the task
      const completeTimeout = setTimeout(() => {
        if (isExecutionCancelled.current || isExecutionPaused.current) {
          return;
        }
        
        // Mark all agents as completed
        setAgents(prev => prev.map(a => ({ ...a, status: 'completed' as AgentStatus, progress: 100, task: '任务完成' })));
        addLog('CEO', '任务分配完成，团队开始工作', 'success');
        
        // P2 Fix: Detect task type and provide appropriate deliverable links
        const userMessage = currentState.userMessage || '';
        const isAppTask = /网站|应用|游戏|app|web|game/i.test(userMessage);
        const isContentTask = /小红书|内容|文案|种草|攻略|测评/i.test(userMessage);
        
        let deliverables: DeliverableLink[] | undefined;
        let completionContent = '';
        
        if (isAppTask) {
          deliverables = [{
            type: 'app',
            label: '应用项目',
            onlineUrl: 'https://demo.lobster-ai.dev',
            sourceUrl: 'https://github.com/lobster-ai/demo-app',
          }];
          completionContent = '✅ 应用开发完成！\n\n🎉 项目已部署上线，点击下方链接访问：';
        } else if (isContentTask) {
          completionContent = '✅ 任务已启动！\n\n💡 如需生成小红书内容，请点击下方 **📕 小红书内容** 按钮。';
        } else {
          completionContent = '✅ 团队已就绪，开始执行任务！\n\n💡 如需生成小红书内容，请点击下方 **📕 小红书内容** 按钮。';
        }
        
        const completionMessage: Message = {
          id: Date.now() + 100,
          agent: 'CEO',
          avatar: '🦞',
          content: completionContent,
          time: getCurrentTime(),
          hasLink: !!deliverables,
          deliverables,
        };
        setMessages(prev => [...prev, completionMessage]);
        setHasOutputFiles(true);
        setIsProcessing(false);
        setExecutionState(null);
        executionStateRef.current = null;
        wasPausedMidExecution.current = false;
      }, 500);
      timeoutRefs.current.push(completeTimeout);
      return;
    }
    
    // Resume execution from current step
    executeAgentResponses(currentState.currentStep, currentState.userMessage);
  }, [addLog, executeAgentResponses, getCurrentTime]);

  // Handle cancel task
  const handleCancelTask = useCallback(() => {
    clearAllTimeouts();
    isExecutionCancelled.current = true;
    isExecutionPaused.current = false;
    setTaskControl({ isPaused: false, isCancelled: true });
    setIsProcessing(false);
    setExecutionState(null);
    executionStateRef.current = null;
    wasPausedMidExecution.current = false;
    setAgents(prev => prev.map(a => ({ 
      ...a, 
      status: 'cancelled' as AgentStatus, 
      task: '已取消',
      progress: a.status === 'completed' ? a.progress : a.progress 
    })));
    addLog('System', '任务已取消', 'info');
  }, [clearAllTimeouts, addLog]);

  // Handle send message
  const handleSendMessage = () => {
    if (!input.trim() || isProcessing) return;
    
    // Reset task control state for new task
    isExecutionCancelled.current = false;
    isExecutionPaused.current = false;
    setTaskControl({ isPaused: false, isCancelled: false });
    wasPausedMidExecution.current = false;
    
    const userMessage: Message = {
      id: Date.now(),
      agent: 'User',
      avatar: '👤',
      content: input.trim(),
      time: getCurrentTime(),
      isUser: true,
    };
    
    const msgContent = input.trim();
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Initialize execution state
    const newExecutionState = {
      currentStep: 0,
      userMessage: msgContent,
      startTime: Date.now(),
    };
    setExecutionState(newExecutionState);
    executionStateRef.current = newExecutionState;

    // 开始 Agent 协作流程
    addLog('System', '收到用户需求，开始分析...', 'info');
    updateAgentStatus(1, 'running', '分析用户需求...', 10);

    // Start execution from step 0
    executeAgentResponses(0, msgContent);
  };

  // V3: Handle content generation (Xiaohongshu)
  const handleGenerateContent = useCallback(async () => {
    if (!contentTopic.trim()) return;
    
    setIsGenerating(true);
    addLog('Designer', '正在生成小红书内容...', 'running');
    
    try {
      const response = await fetch('/api/content/xiaohongshu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: contentTopic, style: contentStyle }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGeneratedContent(result);
        addLog('Designer', '小红书内容生成完成', 'success');
        
        // P2 Fix: Use deliverables structure for proper link display
        const resultMessage: Message = {
          id: Date.now(),
          agent: 'Designer',
          avatar: '🎨',
          content: `✅ ${result.message}\n\n📋 **主题**：${result.topic}\n📝 **风格**：${result.style}\n\n📄 **内容预览**：\n${result.content.substring(0, 150)}...`,
          time: getCurrentTime(),
          hasLink: true,
          deliverables: [{
            type: 'xiaohongshu',
            label: '小红书内容',
            docUrl: result.docUrl,
          }],
        };
        setMessages(prev => [...prev, resultMessage]);
        setHasOutputFiles(true);
      } else {
        addLog('System', '内容生成失败', 'info');
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
      addLog('System', '内容生成请求失败', 'info');
    } finally {
      setIsGenerating(false);
    }
  }, [contentTopic, contentStyle, addLog, getCurrentTime]);

  // Calculate overall progress
  const overallProgress = Math.round(
    agents.reduce((sum, a) => sum + a.progress, 0) / agents.length
  );

  // Get overall progress description with step info
  const getProgressDescription = useCallback(() => {
    const runningAgent = agents.find(a => a.status === 'running');
    const pausedAgent = agents.find(a => a.status === 'paused');
    const completedCount = agents.filter(a => a.status === 'completed').length;
    const totalAgents = agents.length;
    
    if (taskControl.isPaused && pausedAgent) {
      return `步骤 ${completedCount + 1}/${totalAgents} · ${pausedAgent.name}：已暂停`;
    }
    
    if (runningAgent) {
      return `步骤 ${completedCount + 1}/${totalAgents} · ${runningAgent.name}：${runningAgent.task}`;
    }
    
    if (agents.every(a => a.status === 'completed')) {
      return '✅ 全部任务已完成';
    }
    
    if (agents.every(a => a.status === 'waiting')) {
      return '等待任务开始...';
    }
    
    if (taskControl.isCancelled) {
      return '❌ 任务已取消';
    }
    
    return '准备中...';
  }, [agents, taskControl.isPaused, taskControl.isCancelled]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, []);

  // Auto-scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'bg-blue-500 animate-pulse';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'waiting': return 'bg-gray-300';
    }
  };

  const getStatusText = (status: AgentStatus) => {
    switch (status) {
      case 'running': return '执行中';
      case 'completed': return '已完成';
      case 'paused': return '已暂停';
      case 'cancelled': return '已取消';
      case 'waiting': return '等待中';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'running': return '●';
      case 'info': return '→';
      default: return '●';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'running': return 'bg-blue-100 text-blue-600';
      case 'info': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm">📁</div>
        <div className="flex-1">
          <h1 className="font-semibold text-[#1A1A2E] text-sm">{projectName}</h1>
          <p className="text-xs text-gray-400">{agents.filter(a => a.status === 'running').length} 个 Agent 执行中</p>
        </div>
        <button 
          onClick={() => setShowProgressPanel(!showProgressPanel)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${showProgressPanel ? 'bg-[#FF6B3D]/10 text-[#FF6B3D]' : 'bg-gray-50'}`}
        >
          📊
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm">⋯</button>
      </div>

      {/* Progress Bar - Always visible */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{getProgressDescription()}</span>
          <span className="text-xs font-medium text-[#FF6B3D]">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              taskControl.isCancelled ? 'bg-red-400' : 
              taskControl.isPaused ? 'bg-yellow-400' : 
              'bg-gradient-to-r from-[#FF6B3D] to-[#FF8F6B]'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        
        {/* Task Control Buttons */}
        {isProcessing && (
          <div className="flex items-center justify-end gap-2 mt-2">
            {taskControl.isPaused ? (
              <button
                onClick={handleResumeTask}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
              >
                <span>▶</span>
                <span>继续</span>
              </button>
            ) : (
              <button
                onClick={handlePauseTask}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors"
              >
                <span>⏸</span>
                <span>暂停</span>
              </button>
            )}
            <button
              onClick={handleCancelTask}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
            >
              <span>✕</span>
              <span>取消</span>
            </button>
          </div>
        )}
      </div>

      {/* P1-1: Mini Agent Status Bar - Fixed at top when scrolled */}
      {isScrolled && showProgressPanel && (
        <div className="fixed top-[60px] left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-screen-md mx-auto">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className="flex items-center gap-1.5 shrink-0"
              >
                <div className="relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-base ${
                    agent.status === 'running' ? 'bg-blue-100' :
                    agent.status === 'completed' ? 'bg-green-100' :
                    agent.status === 'paused' ? 'bg-yellow-100' :
                    agent.status === 'cancelled' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {agent.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Status Panel - Collapsible */}
      {showProgressPanel && (
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className={`relative p-3 rounded-xl border transition-all duration-300 ${
                  agent.status === 'running' 
                    ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-sm' 
                    : agent.status === 'completed'
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-white shadow-sm'
                    : agent.status === 'paused'
                    ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-white shadow-sm'
                    : agent.status === 'cancelled'
                    ? 'border-red-300 bg-gradient-to-br from-red-50 to-white shadow-sm'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                {/* Status indicator animation for running agents */}
                {agent.status === 'running' && (
                  <div className="absolute top-2 right-2">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                      agent.status === 'running' ? 'bg-blue-100' :
                      agent.status === 'completed' ? 'bg-green-100' :
                      agent.status === 'paused' ? 'bg-yellow-100' :
                      agent.status === 'cancelled' ? 'bg-red-100' :
                      'bg-white shadow-sm'
                    }`}>
                      {agent.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1A1A2E] truncate">{agent.name.replace(' Lobster', '')}</p>
                    <p className="text-[10px] text-gray-400">{getStatusText(agent.status)}</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 truncate pl-10">{agent.task}</p>
                {agent.status !== 'waiting' && agent.status !== 'cancelled' && (
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2 ml-10">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        agent.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                        agent.status === 'paused' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                        'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Logs Toggle */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-600">实时日志</span>
            </div>
            <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div 
            ref={logContainerRef}
            className="mt-2 max-h-32 overflow-auto bg-gray-900 rounded-lg p-2 text-xs font-mono"
          >
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-800 last:border-0">
                <span className="text-gray-500 w-10 shrink-0">{log.time}</span>
                <span className="text-gray-400 w-14 shrink-0">[{log.agent}]</span>
                <span className="text-gray-300 flex-1">{log.action}</span>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${getLogColor(log.type)}`}>
                  {getLogIcon(log.type)}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-auto p-4 space-y-4 pb-36">
        {isNewProject && messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-4xl mb-3">🦞</p>
            <p className="text-sm">开始你的项目吧！</p>
            <p className="text-xs mt-1">输入需求，AI 团队将协助你完成</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.isUser ? 'flex-row-reverse' : ''}`}>
              {!msg.isUser && (
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-sm shrink-0">
                  {msg.avatar}
                </div>
              )}
              <div className={msg.isUser ? 'text-right' : ''}>
                {!msg.isUser && (
                  <p className="text-xs text-gray-400 mb-1 ml-1">{msg.agent}</p>
                )}
                <div className={`rounded-2xl px-3 py-2 text-sm ${
                  msg.isUser 
                    ? 'bg-gradient-to-r from-[#FF6B3D] to-[#FF8F6B] text-white rounded-tr-md' 
                    : 'bg-white shadow-sm rounded-tl-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className={`text-[10px] text-gray-300 mt-1 ${msg.isUser ? 'mr-1' : 'ml-1'}`}>{msg.time}</p>
                
                {/* P2 Fix: Display deliverable links */}
                {msg.hasLink && (
                  <div className="mt-2 ml-1 p-3 bg-gradient-to-r from-[#FF6B3D]/10 to-[#FF8F6B]/10 rounded-lg border border-[#FF6B3D]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">✅</span>
                      <span className="text-xs font-medium text-[#1A1A2E]">任务完成</span>
                    </div>
                    
                    {/* 新版：支持多链接 */}
                    {msg.deliverables && msg.deliverables.length > 0 ? (
                      <div className="space-y-2">
                        {msg.deliverables.map((del, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            {del.onlineUrl && (
                              <a 
                                href={del.onlineUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#FF6B3D] font-medium hover:underline"
                              >
                                <span>🔗</span>
                                <span>在线访问</span>
                              </a>
                            )}
                            {del.sourceUrl && (
                              <a 
                                href={del.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800"
                              >
                                <span>💻</span>
                                <span>源代码</span>
                              </a>
                            )}
                            {del.docUrl && (
                              <a 
                                href={del.docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#FF6B3D] font-medium hover:underline"
                              >
                                <span>📄</span>
                                <span>查看文档</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* 兼容旧版单链接 */
                      msg.linkUrl && (
                        <a 
                          href={msg.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#FF6B3D] font-medium hover:underline"
                        >
                          {msg.linkTitle || '查看结果'} →
                        </a>
                      )
                    )}
                    
                    <p className="text-[10px] text-gray-500 mt-2">
                      💡 点击链接可直接使用，无需进入文件页面
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Output Files Guidance - P2 Fix: 移除错误的 /artifacts 链接 */}
        {/* 现在交付链接直接显示在消息中，不再需要单独的文件区域 */}
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        {/* Quick Tips - 快捷操作提示 */}
        {isNewProject && messages.length === 0 && (
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              onClick={() => setShowContentDialog(true)}
              className="shrink-0 px-3 py-1.5 text-xs bg-pink-50 text-pink-500 rounded-full hover:bg-pink-100 transition-colors"
            >
              📕 小红书内容
            </button>
            <button 
              onClick={() => setInput('帮我创建一个24点游戏应用')}
              className="shrink-0 px-3 py-1.5 text-xs bg-orange-50 text-[#FF6B3D] rounded-full hover:bg-orange-100 transition-colors"
            >
              🎮 24点游戏
            </button>
            <button 
              onClick={() => setInput('帮我创建一个网站')}
              className="shrink-0 px-3 py-1.5 text-xs bg-orange-50 text-[#FF6B3D] rounded-full hover:bg-orange-100 transition-colors"
            >
              🌐 创建网站
            </button>
            <button 
              onClick={() => setInput('帮我分析数据并生成报告')}
              className="shrink-0 px-3 py-1.5 text-xs bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
            >
              📊 数据分析
            </button>
            <button 
              onClick={() => setInput('帮我设计一个移动应用')}
              className="shrink-0 px-3 py-1.5 text-xs bg-purple-50 text-purple-500 rounded-full hover:bg-purple-100 transition-colors"
            >
              📱 应用设计
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors shrink-0">
            <span>+</span>
          </button>
          <div className="flex-1 relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSendMessage();
                  }
                }
              }}
              onPaste={(e) => {
                // Allow normal paste behavior for multi-line text
                // The default behavior already handles this correctly
              }}
              placeholder="描述你的需求，AI 团队将协作完成... (Shift+Enter换行)"
              rows={1}
              className="w-full text-sm bg-gray-50 border-0 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B3D]/20 resize-none min-h-[36px] max-h-[120px] overflow-y-auto"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            {/* Character count */}
            <span className={`absolute right-3 bottom-1 text-[10px] ${input.length > 500 ? 'text-red-400' : 'text-gray-300'}`}>
              {input.length}
            </span>
          </div>
          <button 
            onClick={handleSendMessage}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all shrink-0 ${
              input.trim() 
                ? 'bg-gradient-to-r from-[#FF6B3D] to-[#FF8F6B] text-white shadow-md' 
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Welcome Guide Modal - 首次使用引导 */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#FF6B3D] to-[#FF8F6B] flex items-center justify-center text-3xl mb-3">
                🦞
              </div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">欢迎来到 Lobster AI！</h2>
              <p className="text-sm text-gray-500 mt-1">你的 AI 团队已就绪</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">🦞</span>
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E]">CEO Lobster</p>
                  <p className="text-xs text-gray-500">协调团队，拆解任务</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">💻</span>
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E]">Coder Lobster</p>
                  <p className="text-xs text-gray-500">编写代码，实现功能</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">🎨</span>
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E]">Designer Lobster</p>
                  <p className="text-xs text-gray-500">UI/UX 设计</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">⚙️</span>
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E]">DevOps Lobster</p>
                  <p className="text-xs text-gray-500">部署运维，监控告警</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FF6B3D]/10 to-[#FF8F6B]/10 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-600">
                💡 <strong>提示：</strong>在执行过程中，你可以随时<strong>暂停</strong>或<strong>取消</strong>任务
              </p>
            </div>

            <button 
              onClick={() => setShowWelcome(false)}
              className="w-full h-11 bg-gradient-to-r from-[#FF6B3D] to-[#FF8F6B] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              开始使用
            </button>
          </div>
        </div>
      )}

      {/* V3: Content Generation Dialog - 小红书内容生成 */}
      {showContentDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-3xl mb-3">
                📕
              </div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">生成小红书内容</h2>
              <p className="text-sm text-gray-500 mt-1">AI 自动生成图文内容并上传飞书</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">主题</label>
                <input 
                  type="text"
                  value={contentTopic}
                  onChange={(e) => setContentTopic(e.target.value)}
                  placeholder="例如：护肤品、旅行攻略、数码产品..."
                  className="w-full h-10 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">风格</label>
                <div className="flex gap-2">
                  {(['种草', '攻略', '测评'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setContentStyle(style)}
                      className={`flex-1 py-2 text-xs rounded-xl transition-all ${
                        contentStyle === style 
                          ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-600">
                💡 <strong>功能说明：</strong>生成的小红书内容将自动上传到飞书文档，你可以直接复制发布。
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setShowContentDialog(false);
                  setContentTopic('');
                  setGeneratedContent(null);
                }}
                className="flex-1 h-11 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (contentTopic.trim()) {
                    handleGenerateContent();
                    setShowContentDialog(false);
                  }
                }}
                disabled={!contentTopic.trim() || isGenerating}
                className={`flex-1 h-11 rounded-xl font-medium transition-all ${
                  contentTopic.trim() && !isGenerating
                    ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:opacity-90' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isGenerating ? '生成中...' : '开始生成'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* V3: Generated Content Result Modal */}
      {generatedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-3xl mb-3">
                ✅
              </div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">内容生成完成！</h2>
              <p className="text-sm text-gray-500 mt-1">已自动上传到飞书文档</p>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">主题</p>
                <p className="text-sm font-medium">{generatedContent.topic}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">风格</p>
                <p className="text-sm font-medium">{generatedContent.style}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">内容预览</p>
                <p className="text-xs text-gray-700 line-clamp-4">{generatedContent.content.substring(0, 200)}...</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FF6B3D]/10 to-[#FF8F6B]/10 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A1A2E]">查看结果</p>
                  <a 
                    href={generatedContent.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#FF6B3D] font-medium hover:underline"
                  >
                    打开飞书文档 →
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 最佳查看方式：在浏览器中打开，支持完整格式
              </p>
            </div>

            {generatedContent.note && (
              <div className="bg-yellow-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-yellow-700">{generatedContent.note}</p>
              </div>
            )}

            <button 
              onClick={() => setGeneratedContent(null)}
              className="w-full h-11 bg-gradient-to-r from-[#FF6B3D] to-[#FF8F6B] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              完成
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}