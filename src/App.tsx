import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Code2, 
  Database, 
  FileText, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Settings, 
  ShieldCheck, 
  Zap,
  PlayCircle,
  AlertCircle,
  ClipboardList,
  ChevronRight,
  Loader2,
  Terminal
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// API Configuration
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : `${window.location.origin}/api`;

const STATS_DATA = [
  { name: 'Critical', value: 4, color: '#F43F5E' },
  { name: 'High', value: 8, color: '#FB923C' },
  { name: 'Medium', value: 12, color: '#38BDF8' },
  { name: 'Low', value: 6, color: '#94A3B8' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState('');
  
  // Real State from Backend
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [selectedTC, setSelectedTC] = useState<any>(null);

  // Fetch Stories on Mount
  useEffect(() => {
    fetch(`${API_BASE}/jira/stories`)
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(err => console.error('Fetch Error:', err));
  }, []);

  // Real-time Test Plan Generation (SSE)
  const handleGenerateTestPlan = () => {
    if (!selectedStory) return;
    setIsGenerating(true);
    setCurrentPlan(null);

    const eventSource = new EventSource(`${API_BASE}/generate/test-plan?storyId=${selectedStory}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'complete') {
        setCurrentPlan(data.plan);
        setIsGenerating(false);
        eventSource.close();
      } else {
        setGenMessage(data.message);
      }
    };

    eventSource.onerror = () => {
      setIsGenerating(false);
      eventSource.close();
    };
  };

  // Generate Test Cases
  const handleGenerateTestCases = async () => {
    if (!selectedStory) return;
    setIsGenerating(true);
    setGenMessage('Analyzing architecture for test scenario mapping...');
    
    try {
      const res = await fetch(`${API_BASE}/generate/test-cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId: selectedStory })
      });
      const data = await res.json();
      setTestCases(data);
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  // Generate Code
  const handleGenerateCode = async (tc: any) => {
    setIsGenerating(true);
    setSelectedTC(tc);
    setGenMessage(`Building ${tc.title} automation script...`);
    
    try {
      const res = await fetch(`${API_BASE}/generate/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          framework: 'Playwright', 
          language: 'TypeScript', 
          testCase: tc 
        })
      });
      const data = await res.json();
      setGeneratedCode(data.code);
      setActiveTab('code');
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-slate-100 selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-bg-card/50 flex flex-col backdrop-blur-md">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-display">
            Orchestrator
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'stories', icon: Database, label: 'Jira Stories' },
            { id: 'plans', icon: ClipboardList, label: 'Test Plans' },
            { id: 'cases', icon: CheckCircle2, label: 'Test Cases' },
            { id: 'code', icon: Code2, label: 'Code Generator' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-primary/15 text-primary border border-primary/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-white/5 overflow-hidden">
            <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-[2px]">Real-time Status</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-bold text-slate-300">Backend Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-bg/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search synchronized user stories..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-1.5 rounded-full glass border border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Jira Live Access</span>
             </div>
          </div>
        </header>

        <div className="p-8 space-y-8 animate-in">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: 'Live Stories', value: stories.length, icon: Database, color: 'text-blue-400' },
                    { label: 'Active Plans', value: currentPlan ? '1' : '0', icon: ClipboardList, color: 'text-purple-400' },
                    { label: 'Test Cases', value: testCases.length, icon: FileText, color: 'text-amber-400' },
                    { label: 'Project Health', value: '98%', icon: ShieldCheck, color: 'text-emerald-400' },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card relative group">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-3xl font-bold mt-2 neon-text">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card h-[350px]">
                    <h3 className="text-sm font-bold mb-6 text-slate-400 uppercase tracking-widest">Automation Priority</h3>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={STATS_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '12px', fontSize: '12px' }}/>
                        <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={24} />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0EA5E9" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card h-[350px]">
                     <h3 className="text-sm font-bold mb-6 text-slate-400 uppercase tracking-widest">TestCase Coverage</h3>
                     <ResponsiveContainer width="100%" height="80%">
                      <PieChart>
                        <Pie data={STATS_DATA} innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value">
                          {STATS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stories' && (
              <motion.div key="stories" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Jira Synchronization</h2>
                  <button onClick={() => window.location.reload()} className="btn-secondary flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Re-Sync Live Data
                  </button>
                </div>
                <div className="glass-card overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="border-b border-white/5">
                      <tr>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Key</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Summary</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Sync Date</th>
                        <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stories.map((story) => (
                        <tr key={story.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-primary">{story.key}</td>
                          <td className="p-4 font-medium">{story.summary}</td>
                          <td className="p-4"><span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold">{story.status}</span></td>
                          <td className="p-4 text-xs text-slate-500">Today, Real-time</td>
                          <td className="p-4">
                            <button onClick={() => { setSelectedStory(story.id); setActiveTab('plans'); }} className="p-2 glass rounded-lg hover:text-primary transition-all">
                              <Zap className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'plans' && (
              <motion.div key="plans" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8">
                <div className="glass-card text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center mb-4">
                    <ClipboardList className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Automated Strategy Orchestration</h2>
                  <p className="text-slate-400 max-w-md mx-auto">Select a synchronized story to begin strategic test mapping using real AI analysis.</p>
                  
                  <div className="flex gap-4 max-w-lg mx-auto pt-4">
                    <select value={selectedStory || ''} onChange={(e) => setSelectedStory(e.target.value)} className="flex-1 glass border-white/10 p-4 rounded-2xl outline-none focus:border-primary">
                      <option value="" disabled>Choose synchronized story...</option>
                      {stories.map(s => <option key={s.id} value={s.id}>{s.key}: {s.summary}</option>)}
                    </select>
                    <button onClick={handleGenerateTestPlan} disabled={!selectedStory || isGenerating} className="btn-primary min-w-[200px]">
                      {isGenerating ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Generate Plan'}
                    </button>
                  </div>
                </div>

                {isGenerating && (
                  <div className="text-center p-8 animate-pulse text-primary font-bold tracking-widest text-sm uppercase">
                    &gt; {genMessage}
                  </div>
                )}

                {currentPlan && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card border-l-4 border-primary space-y-6">
                    <div className="flex justify-between border-b border-white/5 pb-4">
                      <h3 className="text-xl font-bold">Generated Strategy: TP-101</h3>
                      <span className="text-emerald-400 text-[10px] font-bold">V1.0.0 Real-time</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 italic">Strategic Objective</h4>
                        <p className="text-sm leading-relaxed">{currentPlan.objective}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 italic">Entry Threshold</h4>
                        <p className="text-sm leading-relaxed">{currentPlan.entryCriteria}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                      <h4 className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                        <Zap className="w-3 h-3" />
                        AI Analysis Note
                      </h4>
                      <p className="text-sm italic text-slate-300">{currentPlan.planContent}</p>
                    </div>
                    <div className="flex justify-end">
                       <button onClick={() => { setActiveTab('cases'); handleGenerateTestCases(); }} className="btn-secondary flex items-center gap-2">
                          Next: Map Test Scenarios
                          <ChevronRight className="w-4 h-4" />
                       </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'cases' && (
              <motion.div key="cases" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Scenario Repository</h2>
                  <button onClick={handleGenerateTestCases} className="glass p-3 rounded-xl hover:text-primary"><Zap className="w-5 h-5" /></button>
                </div>
                {testCases.map((tc, i) => (
                  <motion.div key={tc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }} className="glass-card p-6 flex justify-between items-center hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-primary">0{i+1}</div>
                       <div>
                          <h4 className="font-bold text-lg">{tc.title}</h4>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" /> {tc.priority}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-blue-500" /> {tc.category}</span>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => handleGenerateCode(tc)} className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary hover:text-white transform group-hover:scale-110 transition-all">
                      <Code2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'code' && (
              <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-8">
                <div className="col-span-1 glass-card space-y-6">
                  <h3 className="text-xl font-bold">Script Config</h3>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Automation Schema</p>
                    <div className="grid grid-cols-2 gap-2">
                       {['Playwright', 'Selenium'].map(f => (
                         <button key={f} className={`p-4 rounded-2xl glass text-xs font-bold border ${f === 'Playwright' ? 'border-primary text-primary' : 'border-white/5 text-slate-500'}`}>{f}</button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Execution Language</p>
                    <div className="grid grid-cols-2 gap-2">
                       {['TypeScript', 'Java', 'Python'].map(l => (
                         <button key={l} className={`p-4 rounded-2xl glass text-xs font-bold border ${l === 'TypeScript' ? 'border-secondary text-secondary' : 'border-white/5 text-slate-500'}`}>{l}</button>
                       ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 glass-card p-0 overflow-hidden min-h-[500px] flex flex-col border border-white/5">
                   <div className="bg-slate-900/80 p-4 border-b border-white/5 flex justify-between items-center">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                     </div>
                     <span className="text-[10px] font-mono text-slate-500">orchestrator_output.spec.ts</span>
                   </div>
                   <div className="flex-1 p-8 overflow-auto font-mono text-xs text-blue-300 bg-black/40">
                      {isGenerating ? (
                        <div className="flex items-center justify-center h-full gap-4 text-primary animate-pulse">
                          <Loader2 className="animate-spin w-8 h-8" />
                          <span className="font-bold tracking-tighter">&gt; SYNTHESIZING EXECUTABLE CONTEXT...</span>
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap">{generatedCode || '// Select a scenario to generate executable code...'}</pre>
                      )}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Global AI Loader for intensive tasks */}
      {isGenerating && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 glass px-8 py-3 rounded-full border border-primary/30 shadow-[0_0_30px_rgba(14,165,233,0.2)] flex items-center gap-4 z-50 animate-in">
           <Loader2 className="w-5 h-5 text-primary animate-spin" />
           <span className="text-xs font-bold text-slate-300 font-mono italic">{genMessage}</span>
        </div>
      )}

      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[160px]" />
      </div>

      <footer className="fixed bottom-6 right-8 flex gap-4 pointer-events-none">
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 opacity-30 border border-white/5">
          <Terminal className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Kernel 2.0.1_R</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
