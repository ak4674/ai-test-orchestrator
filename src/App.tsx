import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Code2, 
  Database, 
  LayoutDashboard, 
  Search, 
  Settings, 
  ShieldCheck, 
  Zap,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Copy,
  Download,
  BrainCircuit,
  ShieldCheck as ShieldIcon,
  Terminal,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// API Configuration
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
  ? 'http://localhost:8080/api' 
  : '/api';

const STATS_DATA = [
  { name: 'Critical', value: 4, color: '#FF006E' }, // Hot Pink
  { name: 'High', value: 8, color: '#0066FF' },     // Electric Blue
  { name: 'Medium', value: 12, color: '#00F0FF' },   // Cyan
  { name: 'Low', value: 6, color: '#39FF14' },      // Neon Green
];

// Types
interface JiraStory {
  id: string;
  key: string;
  summary: string;
  description: string;
  priority: string;
  status: string;
}

interface TestPlan {
  objectives: string[];
  risks: string[];
  entryCriteria: string[];
  dataRequirements: string[];
}

interface TestCase {
  id: string;
  title: string;
  type: string;
  preconditions: string;
  steps: string[];
  expectedResults: string;
}

// Sentinel Logo Concept: Eye + Shield merged
const KairosLogo = () => (
  <div className="relative group">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all duration-500 group-hover:scale-110">
      {/* Outer Shield Outline */}
      <path d="M20 2L4 8V18C4 28.3 10.8 37.9 20 42C29.2 37.9 36 28.3 36 18V8L20 2Z" 
        stroke="currentColor" strokeWidth="2" className="text-[#00F0FF] opacity-40 shadow-inner" />
      {/* Inner Shield Gradient */}
      <path d="M20 4L6 9.3V18C6 26.5 11.5 34.3 20 37.6C28.5 34.3 34 26.5 34 18V9.3L20 4Z" 
        fill="url(#shieldGrad)" fillOpacity="0.1" />
      {/* The Eye */}
      <path d="M8 20C8 20 12.5 12 20 12C27.5 12 32 20 32 20C32 20 27.5 28 20 28C12.5 28 8 20 8 20Z" 
        stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
      {/* Pulsing Iris */}
      <circle cx="20" cy="20" r="4.5" fill="#00F0FF" className="animate-pulse shadow-[0_0_15px_#00F0FF]" />
      <defs>
        <linearGradient id="shieldGrad" x1="20" y1="2" x2="20" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F0FF" />
          <stop offset="1" stopColor="#0066FF" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute -inset-1 bg-cyan/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stories, setStories] = useState<JiraStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<JiraStory | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [testPlan, setTestPlan] = useState<TestPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiStatus, setAiStatus] = useState<string>('');

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isGeneratingCases, setIsGeneratingCases] = useState(false);

  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [selectedFramework, setSelectedFramework] = useState('Playwright');
  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  
  // Dynamic Configuration State (as per screenshot)
  const [showConfig, setShowConfig] = useState(false);
  const [jiraConfig, setJiraConfig] = useState({
    url: 'https://akyanand.atlassian.net/',
    projectKey: 'SCRUM',
    email: 'aky.anand@gmail.com',
    token: '••••••••••••••••'
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Sync Jira Stories
  const syncJira = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/jira/stories`);
      const data = await res.json();
      setStories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncJira();
  }, []);

  // AI Test Plan Generation (SSE)
  const generateTestPlan = async (story: JiraStory) => {
    setSelectedStory(story);
    setIsGeneratingPlan(true);
    setTestPlan(null);
    setActiveTab('plan');

    const eventSource = new EventSource(`${API_BASE}/generate/test-plan?storyId=${story.id}&provider=${selectedProvider}`);
    console.log('🔗 Connecting SSE:', eventSource.url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'analyzing') setAiStatus(data.message);
      if (data.status === 'complete') {
        setTestPlan(data.plan);
        setIsGeneratingPlan(false);
        eventSource.close();
      }
      if (data.status === 'error') {
        setAiStatus(`Error: ${data.message}`);
        setIsGeneratingPlan(false);
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      console.error('❌ SSE Connection Error:', err);
      setAiStatus('Lost connection to backend. Retrying...');
      eventSource.close();
      setIsGeneratingPlan(false);
    };
  };

  // Generate Test Cases (Supports Multi-modal if screenshot present)
  const generateTestCases = async () => {
    if (!selectedStory && !screenshot) return;
    setIsGeneratingCases(true);
    try {
      const res = await fetch(`${API_BASE}/generate/test-cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          storyId: selectedStory?.id, 
          provider: selectedProvider,
          screenshot: screenshotPreview // Base64
        })
      });
      const data = await res.json();
      setTestCases(data);
      setActiveTab('cases');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCases(false);
    }
  };

  // Generate Automation Code
  const generateCode = async (testCase: TestCase) => {
    setIsGeneratingCode(true);
    setGeneratedCode('');
    setActiveTab('code');
    try {
      const res = await fetch(`${API_BASE}/generate/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          testCase, 
          framework: selectedFramework, 
          language: selectedLanguage,
          provider: selectedProvider
        })
      });
      const data = await res.json();
      setGeneratedCode(data.code);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-slate-100 overflow-hidden font-body">
      {/* Sidebar - Cyber Identity */}
      <aside className="w-72 bg-[#111827] border-r border-white/5 flex flex-col relative z-10 box-border">
        <div className="p-8 pb-4 flex items-center gap-4">
          <KairosLogo />
          <div>
            <h1 className="text-2xl font-brand font-black text-[#00F0FF] tracking-tighter leading-none animate-glow-text">
              KAIROS
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-heading text-slate-500 mt-1">
              Perfect-Moment QA
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Database size={20}/>} label="Jira Stories" active={activeTab === 'stories'} onClick={() => setActiveTab('stories')} />
          <NavItem icon={<BrainCircuit size={20}/>} label="AI Test Plan" active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} badge={isGeneratingPlan ? "Thinking..." : undefined} />
          <NavItem icon={<CheckCircle2 size={20}/>} label="Test Repository" active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} />
          <NavItem icon={<Code2 size={20}/>} label="Synesthetic Code" active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
          <NavItem icon={<Settings size={20}/>} label="Configuration" active={showConfig} onClick={() => setShowConfig(!showConfig)} />
        </nav>

        {/* Dynamic Configuration Panel - Mirroring User Attached Pic */}
        <AnimatePresence>
          {showConfig && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 py-4 bg-black/40 border-t border-white/5 space-y-4 overflow-hidden"
            >
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2">AI Provider</label>
                <select 
                  value={selectedProvider} 
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full bg-[#1c2537] border border-white/10 rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-cyan/50"
                >
                  <option value="gemini">Google Gemini 3</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="local">Local LLM (OpenAI Compatible)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2">Jira URL</label>
                <input 
                  type="text" 
                  value={jiraConfig.url}
                  onChange={(e) => setJiraConfig({...jiraConfig, url: e.target.value})}
                  className="w-full bg-[#1c2537] border border-white/10 rounded px-2 py-1.5 text-xs text-slate-300"
                  placeholder="https://your-domain.atlassian.net"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2">Project Key</label>
                  <input 
                    type="text" 
                    value={jiraConfig.projectKey}
                    onChange={(e) => setJiraConfig({...jiraConfig, projectKey: e.target.value})}
                    className="w-full bg-[#1c2537] border border-white/10 rounded px-2 py-1.5 text-xs text-slate-300"
                    placeholder="PROJ"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2">Email</label>
                  <input 
                    type="text" 
                    value={jiraConfig.email}
                    onChange={(e) => setJiraConfig({...jiraConfig, email: e.target.value})}
                    className="w-full bg-[#1c2537] border border-white/10 rounded px-2 py-1.5 text-xs text-slate-300"
                  />
                </div>
              </div>

              <button className="w-full py-2 bg-gradient-to-r from-cyan/20 to-blue/20 border border-cyan/30 rounded text-[10px] uppercase font-bold tracking-widest text-cyan hover:bg-cyan/30 transition-all">
                Update Live Config
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-cyan/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#0066FF] p-0.5">
              <div className="w-full h-full rounded-full bg-[#0a0e1a] flex items-center justify-center font-bold text-[#00F0FF]">
                AK
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Guest User</p>
              <p className="text-xs text-slate-500">Live Workspace</p>
            </div>
            <Settings size={16} className="ml-auto text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Grid Background */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-[#0a0e1a]">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 relative z-20 backdrop-blur-md bg-[#111827]/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <h2 className="text-lg font-heading font-bold uppercase tracking-widest text-slate-300">
              {activeTab === 'stories' ? 'Jira Synchronization' : activeTab.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={syncJira}
              disabled={isSyncing}
              className="btn-neon-outline flex items-center gap-2"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              Sync Live Stories
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00F0FF] border border-white/5 cursor-pointer">
              <Search size={20} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Live Stories" value={stories.length} icon={<Database className="text-[#00F0FF]"/>} color="#00F0FF" />
                  <StatCard label="AI Scenarios" value={testCases.length} icon={<BrainCircuit className="text-[#0066FF]"/>} color="#0066FF" />
                  <StatCard label="Automation Rate" value="68%" icon={<Zap className="text-[#39FF14]"/>} color="#39FF14" />
                  <StatCard label="Critical Defects" value="4" icon={<AlertTriangle className="text-[#FF006E]"/>} color="#FF006E" />
                </div>

                {/* Screenshot Insight Area - Dynamic AI Generation */}
                <div className="glass-card p-8 border-dashed border-2 border-cyan/20 flex flex-col items-center justify-center min-h-[200px] group hover:border-cyan/50 transition-all cursor-pointer relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setScreenshot(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setScreenshotPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {screenshotPreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <img src={screenshotPreview} alt="Target System" className="h-32 rounded border border-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]" />
                      <p className="text-xs text-cyan animate-pulse uppercase tracking-widest font-heading font-bold">Screenshot Linked: System Ready for Visual Analysis</p>
                      <button onClick={generateTestCases} className="btn-neon text-[10px]">Analyze & Generate Scenarios</button>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-cyan/10 group-hover:bg-cyan/20 transition-all mb-4">
                        <Database size={32} className="text-cyan animate-pulse" />
                      </div>
                      <h4 className="text-sm font-heading font-bold uppercase tracking-widest text-slate-300">Visual Intelligence Core</h4>
                      <p className="text-xs text-slate-500 mt-2">Drop system screenshot here to generate test cases from UI patterns</p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-card p-8">
                    <h3 className="text-lg font-heading font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                      <BarChart3 size={20} className="text-[#00F0FF]" />
                      Coverage Analysis
                    </h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={STATS_DATA}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#64748B" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                            {STATS_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-8 flex flex-col items-center justify-center h-full">
                    <h3 className="text-lg font-heading font-bold uppercase tracking-widest mb-8 self-start flex items-center gap-3">
                      <ShieldIcon size={20} className="text-[#39FF14]" />
                      Project Guard
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={STATS_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {STATS_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 w-full text-center">
                      {STATS_DATA.map(stat => (
                        <div key={stat.name} className="flex items-center gap-2 justify-center">
                          <div className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                          <span className="text-[10px] uppercase font-bold text-slate-500">{stat.name}: {stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stories' && (
              <motion.div 
                key="stories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card overflow-hidden"
              >
                <table className="w-full text-left">
                  <thead className="bg-[#1e293b]/50 border-b border-white/10 text-slate-500">
                    <tr>
                      <th className="px-8 py-5 text-xs font-heading font-bold uppercase tracking-[0.2em]">Key</th>
                      <th className="px-8 py-5 text-xs font-heading font-bold uppercase tracking-[0.2em]">Summary</th>
                      <th className="px-8 py-5 text-xs font-heading font-bold uppercase tracking-[0.2em]">Priority</th>
                      <th className="px-8 py-5 text-xs font-heading font-bold uppercase tracking-[0.2em] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map(story => (
                      <tr key={story.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 font-code text-[#00F0FF]">{story.key}</td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-white mb-1 leading-tight">{story.summary}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{story.status}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest ${
                            story.priority === 'High' || story.priority === 'Highest' ? 'bg-[#FF006E]/10 text-[#FF006E]' : 
                            story.priority === 'Medium' ? 'bg-[#F7C948]/10 text-[#F7C948]' : 'bg-[#00F0FF]/10 text-[#00F0FF]'
                          }`}>
                            {story.priority}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => generateTestPlan(story)}
                            className="btn-cyber flex items-center gap-2 ml-auto"
                          >
                            <BrainCircuit size={14} />
                            Architect Plan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'plan' && (
              <motion.div 
                key="plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {!selectedStory ? (
                  <div className="p-20 text-center glass-card">
                    <p className="text-slate-500 font-heading tracking-widest">Select a story to architect high-fidelity test plans.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-3xl font-brand font-black text-white">{selectedStory.key} Strategy</h3>
                        <p className="text-[#00F0FF] font-heading tracking-[0.2em] uppercase text-xs">{selectedStory.summary}</p>
                      </div>
                      <button 
                        onClick={generateTestCases}
                        disabled={isGeneratingCases || isGeneratingPlan}
                        className="btn-cyber flex items-center gap-2"
                      >
                        {isGeneratingCases ? <RefreshCw className="animate-spin" size={16}/> : <Zap size={16}/>}
                        Synthesis Test Cases
                      </button>
                    </div>

                    {isGeneratingPlan && (
                      <div className="glass-card p-12 text-center space-y-6">
                        <div className="flex justify-center gap-3">
                          <div className="ai-dot" />
                          <div className="ai-dot" style={{ animationDelay: '0.16s' }} />
                          <div className="ai-dot" style={{ animationDelay: '0.32s' }} />
                        </div>
                        <p className="text-lg font-heading tracking-[0.3em] text-[#00F0FF] animate-pulse uppercase">{aiStatus}</p>
                      </div>
                    )}

                    {testPlan && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <PlanSection title="Primary Objectives" items={testPlan.objectives || []} icon={<ShieldCheck className="text-[#39FF14]"/>} />
                        <PlanSection title="Risk Matrix" items={testPlan.risks || []} icon={<AlertTriangle className="text-[#FF006E]"/>} />
                        <PlanSection title="Entry Criteria" items={testPlan.entryCriteria || []} icon={<CheckCircle2 className="text-[#00F0FF]"/>} />
                        <PlanSection title="Data Strategy" items={testPlan.dataRequirements || []} icon={<Database className="text-[#F7C948]"/>} />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'cases' && (
              <motion.div 
                key="cases"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Playwright Automation Status Card - Mirroring User Attached Pic */}
                <div className="p-8 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-l-4 border-cyan rounded-r-xl group hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all flex items-center justify-between">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-brand font-black text-white tracking-tight group-hover:text-cyan transition-colors">Playwright</h4>
                    <p className="text-sm text-slate-400 font-heading opacity-80 uppercase tracking-widest flex items-center gap-2">
                      <Terminal size={14} className="text-cyan" /> Integrated Browser Automation Engine
                    </p>
                    <div className="flex gap-4 mt-6">
                      <span className="px-3 py-1 bg-cyan/10 border border-cyan/20 rounded-full text-[10px] font-black text-cyan uppercase tracking-widest animate-pulse">Live Recorder Active</span>
                      <span className="px-3 py-1 bg-green-400/10 border border-green-400/20 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest">SFDC Ready</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan blur-2xl opacity-10 animate-pulse rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="p-4 rounded-full bg-cyan/10 border border-cyan/30 text-cyan relative z-10"
                    >
                      <RefreshCw size={40} className="opacity-60" />
                    </motion.div>
                    <Zap size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan shadow-[0_0_15px_#00F0FF]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testCases.map((tc, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 flex flex-col group border-transparent hover:border-[#00F0FF]/30"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.2em] ${
                        tc.type === 'Positive' ? 'bg-[#39FF14]/10 text-[#39FF14]' : 
                        tc.type === 'Security' ? 'bg-[#FF006E]/10 text-[#FF006E]' : 
                        'bg-[#F7C948]/10 text-[#F7C948]'
                      }`}>
                        {tc.type}
                      </span>
                      <ChevronRight size={16} className="text-slate-700 group-hover:text-[#00F0FF] transition-all" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight">{tc.title}</h4>
                    <p className="text-xs text-slate-500 mb-6 flex-1 italic line-clamp-3">"{tc.expectedResults}"</p>
                    <button 
                      onClick={() => generateCode(tc)}
                      className="btn-ghost flex items-center justify-center gap-2 group-hover:bg-[#00F0FF] group-hover:text-black"
                    >
                      <Code2 size={14} />
                      Automation SYNTH
                    </button>
                  </motion.div>
                ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'code' && (
              <motion.div 
                key="code"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card flex flex-col h-[700px] border-none shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <KairosLogo />
                </div>
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] z-10">
                  <div className="flex items-center gap-6">
                    <select 
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="bg-transparent text-[#00F0FF] font-bold focus:outline-none cursor-pointer uppercase tracking-widest text-xs"
                    >
                      <option className="bg-[#111827]">Playwright</option>
                      <option className="bg-[#111827]">Selenium</option>
                      <option className="bg-[#111827]">Cypress</option>
                    </select>
                    <div className="w-px h-4 bg-white/10" />
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-transparent text-slate-400 focus:outline-none cursor-pointer text-xs"
                    >
                      <option className="bg-[#111827]">TypeScript</option>
                      <option className="bg-[#111827]">JavaScript</option>
                      <option className="bg-[#111827]">Python</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="btn-ghost !px-3 !py-1.5 flex items-center gap-2 !text-xs">
                      <Copy size={14} />
                      Copy
                    </button>
                    <button className="btn-cyber !px-4 !py-1.5 flex items-center gap-2 !text-xs">
                      <Download size={14} />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-8 font-code text-xs overflow-auto bg-[#0a0e10]/80 relative custom-scrollbar border-t border-white/5">
                  {isGeneratingCode && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-b-2 border-[#00F0FF] rounded-full animate-spin glow-cyan" />
                        <span className="font-heading tracking-[0.4em] text-[#00F0FF] animate-pulse">SYNTHESIZING...</span>
                      </div>
                    </div>
                  )}
                  <pre className="text-[#00F0FF]/90 leading-relaxed font-code selection:bg-[#00F0FF]/20">
                    <code>{generatedCode || '// Select a scenario to synthesize automation script...'}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Subcomponents
function NavItem({ icon, label, active, onClick, badge }: { icon: any, label: string, active?: boolean, onClick: () => void, badge?: string }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 group relative ${
        active 
          ? 'bg-gradient-to-r from-[#00F0FF]/10 to-transparent text-[#00F0FF] border border-[#00F0FF]/10' 
          : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#00F0FF] rounded-r-full shadow-[0_0_12px_#00F0FF]" />}
      <span className={`${active ? 'text-[#00F0FF]' : 'group-hover:text-[#00F0FF]'} transition-colors`}>{icon}</span>
      <span className="font-heading text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
      {badge && (
        <span className="ml-auto text-[8px] font-black uppercase tracking-tighter bg-[#00F0FF]/10 text-[#00F0FF] px-2 py-1 rounded animate-pulse border border-[#00F0FF]/20">
          {badge}
        </span>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="glass-card p-6 flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all shadow-inner">
          {icon}
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-800" />
      </div>
      <p className="text-[10px] uppercase font-heading font-black tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-brand font-black animate-glow-text" style={{ color }}>{value}</p>
    </div>
  );
}

function PlanSection({ title, items, icon }: { title: string, items: string[], icon: any }) {
  return (
    <div className="glass-card p-8 group border-transparent hover:border-white/5">
      <h4 className="text-[10px] font-heading font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-3 text-slate-500 group-hover:text-slate-300 transition-colors">
        {icon}
        {title}
      </h4>
      <ul className="space-y-5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 group/item items-start">
            <span className="text-[#00F0FF] font-code text-[10px] opacity-40 group-hover/item:opacity-100 transition-opacity mt-1">
              {(i+1).toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 group-hover/item:text-slate-200 transition-colors leading-relaxed tracking-wide">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
