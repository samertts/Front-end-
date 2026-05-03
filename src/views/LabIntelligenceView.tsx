import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Activity as ActivityIcon, Send, Sparkles, AlertCircle, Bot, User, Camera, Image as ImageIcon, X, Cpu, Zap, BrainCircuit, Terminal, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getClinicalInsight } from '../services/geminiService';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

export function LabIntelligenceView() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; image?: string }[]>([
    { role: 'ai', text: "GULA Systems Intelligence online. Local knowledge clusters indexed. Semantic retrieval engine ready for cross-module queries." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'graph' | 'index'>('chat');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [indexingProgress, setIndexingProgress] = useState(94);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contextLayers, setContextLayers] = useState([
    { id: 'hem', name: 'Hematology Pattern', active: true },
    { id: 'bio', name: 'Bio-Grid Telemetry', active: true },
    { id: 'gen', name: 'Genomic Markers', active: false },
    { id: 'inf', name: 'Infection Outbreaks', active: true },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleLayer = (id: string) => {
    setContextLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !attachedImage) return;
    
    const userMessage = input || (attachedImage ? "Please analyze this context." : "");
    const imgData = attachedImage;
    
    setInput('');
    setAttachedImage(null);
    setMessages(prev => [...prev, { role: 'user', text: userMessage, image: imgData || undefined }]);
    setIsTyping(true);

    const activeLayers = contextLayers.filter(l => l.active).map(l => l.name);
    const context = `Active Knowledge Clusters: ${activeLayers.join(', ')}. Clinical Profile: Stable. Relational Index: Valid.`;
    const response = await getClinicalInsight(userMessage, context, imgData || undefined);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto h-[calc(100vh-120px)] flex gap-8">
      {/* Left Sidebar: Logic Controls */}
      <div className="hidden lg:flex flex-col w-80 gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white space-y-6">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                 <Cpu size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">Semantic Core</h3>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Indexing</span>
                 <span className="text-xl font-black">{indexingProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: `${indexingProgress}%` }}
                   className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                 />
              </div>
              <p className="text-[9px] text-slate-500 font-medium">42M Knowledge Points Embeddings generated. Local Vector DB synced.</p>
           </div>

           <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Context Layers</span>
              {contextLayers.map(layer => (
                <button 
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                    layer.active ? "bg-indigo-600/20 border-indigo-500/50 text-white" : "bg-white/5 border-white/5 text-slate-500"
                  )}
                >
                   <span className="text-xs font-bold">{layer.name}</span>
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full",
                     layer.active ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" : "bg-slate-700"
                   )} />
                </button>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 flex-1 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-900">
                 <Zap size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Performance</h3>
           </div>
           
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-500">Latency</span>
                 <span className="font-mono text-xs text-indigo-600">12ms</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-500">Token Efficiency</span>
                 <span className="font-mono text-xs text-emerald-600">92%</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-500">Semantic Drift</span>
                 <span className="font-mono text-xs text-amber-600">0.02</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col gap-6">
         {/* Top Navigation */}
         <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-2xl w-fit">
            {[
              { id: 'chat', label: 'Intelligence Chat', icon: Bot },
              { id: 'graph', label: 'Semantic Graph', icon: ActivityIcon },
              { id: 'index', label: 'Index Explorer', icon: Terminal },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                  activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                 <tab.icon size={14} />
                 {tab.label}
              </button>
            ))}
         </div>

         <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' ? (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-8"
                  >
                    {messages.map((msg, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={cn(
                          "flex items-start gap-4",
                          msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                          msg.role === 'user' ? "bg-slate-950 text-white" : "bg-indigo-600 text-white"
                        )}>
                          {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
                        </div>
                        <div className={cn("flex flex-col gap-3 max-w-[85%]", msg.role === 'user' && "items-end")}>
                          {msg.image && (
                            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl max-w-sm">
                              <img src={msg.image} alt="context" className="w-full h-auto" />
                            </div>
                          )}
                          <div className={cn(
                            "p-6 rounded-[2rem] text-sm leading-relaxed relative",
                            msg.role === 'user' 
                              ? "bg-slate-950 text-white rounded-tr-none shadow-2xl shadow-slate-200" 
                              : "bg-indigo-50/30 text-slate-900 border border-indigo-100 rounded-tl-none"
                          )}>
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-3 text-indigo-400">
                        <div className="flex gap-1">
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Processor Active</span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-slate-300">
                           <BrainCircuit size={18} />
                           {input === '' && <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Semantic Hybrid Search</span>}
                        </div>
                        <input 
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="        Analyze system lifecycle or query relational knowledge..."
                          className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-5 px-14 text-sm focus:outline-none focus:border-indigo-600 transition-all shadow-xl shadow-slate-100"
                        />
                        <div className="absolute right-4 top-2 bottom-2 flex gap-2">
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="px-4 bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"
                           >
                              <ImageIcon size={20} />
                           </button>
                           <button 
                             onClick={handleSend}
                             disabled={isTyping}
                             className="px-6 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                           >
                              <Send size={18} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : activeTab === 'graph' ? (
                <motion.div 
                   key="graph"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 bg-slate-900"
                >
                   <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
                      {/* Simulated Knowledge Graph */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
                      <div className="p-8 bg-indigo-600 rounded-full shadow-[0_0_100px_rgba(99,102,241,0.5)] z-10 animate-pulse">
                         <Bot size={48} className="text-white" />
                      </div>
                      
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <motion.div 
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          style={{
                            position: 'absolute',
                            transform: `rotate(${angle}deg) translateY(-180px) rotate(-${angle}deg)`
                          }}
                          className="flex flex-col items-center gap-2"
                        >
                           <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer group">
                              <Database size={24} className="group-hover:scale-110 transition-transform" />
                              <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Cluster {i+1}</span>
                        </motion.div>
                      ))}

                      {/* Connection lines would go here in SVGs */}
                   </div>
                   <div className="text-center space-y-2 relative z-20">
                      <h4 className="text-2xl font-black text-white italic">Neural Semantic Map</h4>
                      <p className="text-slate-400 text-sm max-w-lg">
                        Visualizing relational dependencies across 42M semantic points.
                        Yellow nodes indicate high-activity clinical clusters.
                      </p>
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                   key="index"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="flex-1 p-8 overflow-y-auto font-mono text-[11px] bg-black text-emerald-500"
                >
                   <div className="space-y-1">
                      <p className="text-slate-500 mb-4 font-sans text-xs">// LOGS: Semantic Engine v2.4.1</p>
                      <p>[SYSTEM] Parsing module: HEMATOLOGY_CORE_V1</p>
                      <p>[SYSTEM] Generating Embeddings via GULA-SEMANTIC-MODEL-LARGE</p>
                      <p className="text-indigo-400">[SUCCESS] Vector DB insertion: 124,502 nodes indexed</p>
                      <p>[SYSTEM] Relationship analysis start...</p>
                      <p>[ALERT] Potential semantic overlap: Glucose_Level vs Diabetic_Marker</p>
                      <p>[SYNC] File watcher active. Root: /clinical/knowledge</p>
                      <p className="animate-pulse">_</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
}

