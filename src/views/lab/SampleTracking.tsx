import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Box, Search, Filter, ArrowRight, 
  MapPin, User, Calendar, Activity as ActivityIcon,
  Scan,
  Package, CheckCircle2, AlertTriangle, Info,
  ArrowUpDown, ChevronUp, ChevronDown, Clock,
  BrainCircuit, UserPlus, Camera, X, Zap,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { LabSample } from '../../types/domain';
import { Html5Qrcode } from 'html5-qrcode';
import Barcode from 'react-barcode';

export function SampleTracking() {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState<keyof LabSample>('receivedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [printingSample, setPrintingSample] = useState<LabSample | null>(null);
  const [newSampleId, setNewSampleId] = useState('');
  const [idError, setIdError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');

  const startScanner = async () => {
    setIsScanning(true);
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setNewSampleId(decodedText);
          setIsScanning(false);
          html5QrCode.stop().then(() => {
            scannerRef.current = null;
          }).catch(err => console.error(err));
        },
        (errorMessage) => {
          // ignore
        }
      );
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setIsScanning(false);
      scannerRef.current = null;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (!isAddModalOpen && isScanning) {
      stopScanner();
    }
  }, [isAddModalOpen, isScanning]);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error("Cleanup error:", err));
      }
    };
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkActionMenuOpen, setIsBulkActionMenuOpen] = useState(false);

  const [localSamples, setLocalSamples] = useState<LabSample[]>([
    { id: 'SAM-882-11', patientId: 'p1', testType: 'Full Blood Count', status: 'processing', priority: 'urgent', receivedAt: '2024-03-20 08:30', technicianId: 'T-04' },
    { id: 'SAM-882-12', patientId: 'p2', testType: 'Lipid Profile', status: 'pending', priority: 'routine', receivedAt: '2024-03-20 09:12' },
    { id: 'SAM-882-13', patientId: 'p3', testType: 'Glucose Fasting', status: 'completed', priority: 'stat', receivedAt: '2024-03-20 07:00', processedAt: '2024-03-20 08:45', technicianId: 'T-01' },
    { id: 'SAM-882-14', patientId: 'p4', testType: 'Liver Function', status: 'pending', priority: 'urgent', receivedAt: '2024-03-20 10:05' },
    { id: 'SAM-882-15', patientId: 'p5', testType: 'Urinalysis', status: 'processing', priority: 'routine', receivedAt: '2024-03-20 06:45', technicianId: 'T-02' },
  ]);

  const TECHNICIANS = [
    { id: 'T-01', name: 'Sarah Marshall', role: 'Senior Hematologist' },
    { id: 'T-02', name: 'James Wilson', role: 'Biochemist' },
    { id: 'T-03', name: 'Mira Chen', role: 'Lab Technologist' },
    { id: 'T-04', name: 'Adam Smollet', role: 'Analytical Chemist' },
  ];

  const handleSort = (field: keyof LabSample) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 20);
    setSearchQuery(val);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSamples.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSamples.map(s => s.id));
    }
  };

  const handleBulkStatusChange = (status: LabSample['status']) => {
    setLocalSamples(prev => prev.map(s => 
      selectedIds.includes(s.id) ? { ...s, status } : s
    ));
    setSelectedIds([]);
    setIsBulkActionMenuOpen(false);
  };

  const handleBulkAssign = (techId: string) => {
    setLocalSamples(prev => prev.map(s => 
      selectedIds.includes(s.id) ? { ...s, technicianId: techId } : s
    ));
    setSelectedIds([]);
    setIsBulkActionMenuOpen(false);
  };

  const updateSample = (id: string, updates: Partial<LabSample>) => {
    setLocalSamples(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const handleNewIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 20) return;
    
    // Filter characters to only allow alphanumeric and hyphens
    const filtered = val.replace(/[^a-zA-Z0-9-]/g, '');
    setNewSampleId(filtered);
    
    if (val !== filtered) {
      setIdError("Only alphanumeric characters and hyphens are permitted");
    } else {
      setIdError("");
    }
  };

  const filteredSamples = localSamples.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.testType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || s.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const sortedSamples = [...filteredSamples].sort((a, b) => {
    const valA = a[sortBy] || '';
    const valB = b[sortBy] || '';
    
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleAddSample = () => {
    if (!newSampleId || idError) return;
    
    const newSample: LabSample = {
      id: newSampleId,
      patientId: `p${localSamples.length + 1}`,
      testType: 'General Panel',
      status: 'pending',
      priority: 'routine',
      receivedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    
    setLocalSamples(prev => [newSample, ...prev]);
    setNewSampleId('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 min-h-screen relative">
      {/* Immersive Floating Command Bar for Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-3xl px-6"
          >
            <div className="bg-slate-900/90 backdrop-blur-2xl text-white p-6 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex items-center justify-between gap-8 border border-white/10 ring-1 ring-white/20">
              <div className="flex items-center gap-6">
                <div className="relative">
                   <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-pulse">
                      <Package size={24} />
                   </div>
                   <div className="absolute -top-2 -right-2 bg-white text-indigo-600 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-slate-900 shadow-lg">
                      {selectedIds.length}
                   </div>
                </div>
                <div>
                   <h4 className="text-sm font-black uppercase tracking-widest text-white">Batch Operation</h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Executing sequence on {selectedIds.length} nodes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setIsBulkActionMenuOpen(!isBulkActionMenuOpen)}
                    className="px-8 py-4 bg-indigo-600 hover:bg-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-indigo-900/20"
                  >
                    Control Sequence <ChevronDown size={14} />
                  </button>

                  <AnimatePresence>
                    {isBulkActionMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -12, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 w-80 bg-white rounded-[2.5rem] p-4 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 mb-2 overflow-hidden"
                      >
                        <div className="p-4">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">State Transition</p>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { id: 'pending', label: 'Reset to Pending', color: 'text-amber-500' },
                              { id: 'processing', label: 'Commence Analysis', color: 'text-indigo-600' },
                              { id: 'completed', label: 'Finalize & Archive', color: 'text-emerald-600' }
                            ].map((status) => (
                              <button 
                                key={status.id}
                                onClick={() => handleBulkStatusChange(status.id as any)}
                                className={cn(
                                  "w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-between group",
                                  status.color
                                )}
                              >
                                {status.label}
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-slate-50 my-2" />
                        <div className="p-4">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Assign Technical Lead</p>
                          <div className="grid grid-cols-1 gap-1">
                            {TECHNICIANS.map((tech) => (
                              <button 
                                key={tech.id}
                                onClick={() => handleBulkAssign(tech.id)}
                                className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black">
                                      {tech.name.split(' ').map(n => n[0]).join('')}
                                   </div>
                                   <span>{tech.name}</span>
                                </div>
                                <span className="text-[8px] opacity-40 font-black">{tech.id}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button 
                  onClick={() => setSelectedIds([])}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Command Center Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-slate-900 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,23,42,0.3)]">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none scale-150 rotate-12">
           <Box size={300} />
        </div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-4 ring-white/5">
              <Scan size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">Sample Intelligence</h1>
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    Neural Tracking Active
                 </div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Chain of Custody Protocol v4.0</p>
              </div>
            </div>
          </div>
          <p className="max-w-xl text-base text-slate-400 font-medium leading-relaxed">
            Autonomous sample classification and routing. Real-time parity with national bio-repositories. 
            <span className="text-indigo-400 ml-1">Predictive validation active for all pending nodes.</span>
          </p>
        </div>

        <div className="relative z-10">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5 group"
           >
              Register Node <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </div>

      {/* Advanced Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 w-fit rounded-2xl">
         {(['all', 'pending', 'processing', 'completed'] as const).map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={cn(
               "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
             )}
           >
             {tab}
           </button>
         ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <label htmlFor="sample-search" className="sr-only">Search samples by ID</label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                id="sample-search"
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Sample ID..."
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
            >
               Add Sample <ArrowRight size={18} />
            </button>
          </div>

          <div className="space-y-4">
          {/* Sort Controls */}
          <div className="flex flex-wrap items-center gap-6 px-8 py-4 bg-white/50 rounded-2xl border border-slate-100/50 mb-2">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
               <button 
                 onClick={toggleSelectAll}
                 className={cn(
                   "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                   selectedIds.length === filteredSamples.length && filteredSamples.length > 0
                     ? "bg-indigo-600 border-indigo-600 text-white" 
                     : "border-slate-200 bg-white"
                 )}
               >
                 {selectedIds.length === filteredSamples.length && filteredSamples.length > 0 && <CheckCircle2 size={12} />}
               </button>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.selectAll}</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort By:</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleSort('receivedAt')}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                    sortBy === 'receivedAt' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Received At 
                  {sortBy === 'receivedAt' ? (
                    sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : <ArrowUpDown size={10} className="opacity-30" />}
                </button>
                <button 
                  onClick={() => handleSort('testType')}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                    sortBy === 'testType' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Test Type
                  {sortBy === 'testType' ? (
                    sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : <ArrowUpDown size={10} className="opacity-30" />}
                </button>
                <button 
                  onClick={() => handleSort('priority')}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                    sortBy === 'priority' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Priority
                  {sortBy === 'priority' ? (
                    sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : <ArrowUpDown size={10} className="opacity-30" />}
                </button>
              </div>
            </div>
          </div>

          {sortedSamples.map((sample, i) => (
            <motion.div 
              key={sample.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group bg-white p-10 rounded-[3rem] border transition-all relative overflow-hidden",
                selectedIds.includes(sample.id) 
                  ? "border-indigo-600 ring-8 ring-indigo-50 shadow-2xl" 
                  : "border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100"
              )}
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform">
                 <Scan size={180} />
              </div>

              <div className="flex flex-col xl:flex-row gap-10 relative">
                <div className="flex-1 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(sample.id);
                        }}
                        className={cn(
                          "w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all",
                          selectedIds.includes(sample.id)
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                            : "border-slate-100 bg-slate-50 group-hover:border-slate-300"
                        )}
                      >
                        {selectedIds.includes(sample.id) && <CheckCircle2 size={16} />}
                      </button>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Operational Node</span>
                        <span className="text-sm font-black text-slate-900 tracking-tight">{sample.id}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      {(['pending', 'processing', 'completed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateSample(sample.id, { 
                            status, 
                            processedAt: status === 'completed' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : sample.processedAt 
                          })}
                          className={cn(
                            "px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                            sample.status === status 
                              ? (status === 'completed' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' : status === 'processing' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20 animate-pulse' : 'bg-amber-500 text-white shadow-xl shadow-amber-900/20')
                              : "text-slate-400 hover:text-slate-600 hover:bg-white"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        {sample.priority === 'stat' && (
                           <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                              <Zap size={10} className="fill-red-600" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Immediate Priority</span>
                           </div>
                        )}
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Test ID: P-{sample.patientId}</span>
                     </div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors uppercase">{sample.testType}</h3>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-50">
                     {[
                       { icon: MapPin, label: 'Geo-Link', val: 'Blood Sciences C-4' },
                       { icon: User, label: 'Asset Lead', val: sample.technicianId || 'Unassigned' },
                       { icon: ActivityIcon, label: 'Criticality', val: sample.priority.toUpperCase(), highlight: sample.priority === 'stat' },
                       { icon: Clock, label: 'Sync Time', val: sample.receivedAt }
                     ].map((meta, idx) => (
                       <div key={idx} className="flex flex-col gap-3 group/meta">
                          <div className={cn(
                             "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                             meta.highlight ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400 group-hover/meta:bg-indigo-50 group-hover/meta:text-indigo-600"
                          )}>
                             <meta.icon size={18} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{meta.label}</p>
                             <p className={cn("text-xs font-black", meta.highlight ? "text-red-500" : "text-slate-700")}>{meta.val}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>

                <div className="w-full xl:w-48 flex flex-row xl:flex-col gap-4">
                   <button 
                     onClick={() => setPrintingSample(sample)}
                     className="flex-1 xl:flex-none p-6 bg-white border border-slate-200 text-slate-400 rounded-[2rem] hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center relative group/print"
                     title="Print Label"
                   >
                      <Printer size={24} />
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover/print:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                         Print Clinical Label
                      </div>
                   </button>
                   <button className="flex-1 xl:flex-none p-6 bg-slate-50 text-slate-400 rounded-[2rem] hover:bg-white hover:shadow-xl hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100 flex items-center justify-center">
                      <ActivityIcon size={24} />
                   </button>
                   <button className="flex-1 xl:flex-none p-6 bg-slate-900 text-white rounded-[2rem] hover:bg-indigo-600 shadow-2xl hover:shadow-indigo-900/40 transition-all flex items-center justify-center group/btn relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                      <ChevronRight size={24} className="relative z-10" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           {/* AI Insight Card */}
           <div className="p-8 bg-indigo-600 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                <BrainCircuit size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-indigo-500 rounded-xl">
                      <ActivityIcon size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Flow Optimization</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight leading-tight mb-4">Route Optimization Activated</h3>
                <p className="text-sm text-indigo-100 leading-relaxed font-medium mb-6">
                  Technician T-01 is becoming available in 4 mins. Rerouting urgent samples to Station 4 will reduce TAT by 18%.
                </p>
                <div className="p-4 bg-white/10 rounded-2xl mb-6">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                      <span>Efficiency Gain</span>
                      <span>+18.4%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/20 rounded-full">
                      <div className="h-full bg-white rounded-full" style={{ width: '18.4%' }} />
                   </div>
                </div>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                  Deploy Reroute
                </button>
              </div>
           </div>

           {/* Watchlist */}
           <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Station Metrics</h3>
             <div className="space-y-6">
               {[
                 { id: 'ST-01', type: 'Hematology', area: 'Station A', load: '84%', warning: true },
                 { id: 'ST-02', type: 'Biochemistry', area: 'Station B', load: '45%', warning: false },
                 { id: 'ST-03', type: 'Pathology', area: 'Station C', load: '12%', warning: false }
               ].map((item) => (
                 <div key={item.id} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-slate-50 transition-colors rounded-2xl px-2 -mx-2">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center border transition-all",
                      item.warning ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-slate-50 border-slate-100 text-slate-400"
                    )}>
                      {item.warning ? <AlertTriangle size={18} /> : <ActivityIcon size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{item.type}</p>
                          <span className={cn("text-[9px] font-bold", item.warning ? "text-amber-500" : "text-slate-400")}>{item.load}</span>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400">{item.area}</p>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
      {/* Add Sample Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowUpDown className="rotate-45" size={24} />
                </button>
              </div>

              <div className="mb-8">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Box size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Register New Sample</h2>
                <p className="text-slate-500 font-medium">Validation rules apply to Sample ID</p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="sample-id" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sample ID</label>
                    <button 
                      onClick={isScanning ? stopScanner : startScanner}
                      className={cn(
                        "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all",
                        isScanning ? "bg-red-100 text-red-600" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      )}
                    >
                      {isScanning ? <X size={12} /> : <Scan size={12} />}
                      {isScanning ? "Stop Scan" : "Scan Barcode"}
                    </button>
                  </div>
                  
                  {isScanning && (
                    <div className="mb-6 relative">
                      <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden border-2 border-indigo-500 shadow-2xl shadow-indigo-100 mb-4">
                        <div id="reader" className="w-full h-full" />
                        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                          <div className="w-full h-full border-2 border-indigo-400/50 relative overflow-hidden">
                            <motion.div 
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-0.5 bg-indigo-400/80 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-[10px] font-bold text-slate-400 animate-pulse">Position barcode within the frame</p>
                    </div>
                  )}

                  <div className="relative group">
                    <input 
                      id="sample-id"
                      type="text" 
                      value={newSampleId}
                      onChange={handleNewIdChange}
                      maxLength={20}
                      pattern="[a-zA-Z0-9-]*"
                      placeholder="e.g. SAM-12345"
                      className={cn(
                        "w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold transition-all outline-none",
                        idError ? "border-red-100 focus:border-red-500 text-red-600" : "border-slate-50 focus:border-indigo-600"
                      )}
                    />
                    <Camera className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none opacity-40" size={18} />
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    <p className={cn("text-[10px] font-bold", idError ? "text-red-500" : "text-slate-400")}>
                      {idError || "Alphanumeric and hyphens only"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-300">{newSampleId.length}/20</p>
                  </div>
                </div>

                <button 
                  onClick={handleAddSample}
                  disabled={!!idError || !newSampleId}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  Confirm Registration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {printingSample && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPrintingSample(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl text-center"
            >
              <div className="mb-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                   <Printer size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Clinical Label Engine</h2>
                <p className="text-slate-500 font-bold tracking-tight uppercase text-xs">Preparing High-Fidelity Barcode Scan-Node</p>
              </div>

              {/* The actual label - styled for printing */}
              <div id="printable-label" className="bg-white border-2 border-slate-100 p-8 rounded-[2rem] shadow-sm mb-10 inline-block mx-auto">
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source Node</p>
                      <p className="text-sm font-black text-slate-900">{printingSample.id}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                       <p className={cn(
                         "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                         printingSample.priority === 'stat' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"
                       )}>
                         {printingSample.priority}
                       </p>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bio-Analysis Protocol</p>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">{printingSample.testType}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subject Link</p>
                       <p className="text-sm font-black text-slate-900">P-{printingSample.patientId}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sync Date</p>
                       <p className="text-[10px] font-bold text-slate-900">{printingSample.receivedAt}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center !mt-10">
                    <Barcode 
                      value={printingSample.id} 
                      width={1.5} 
                      height={60} 
                      fontSize={12}
                      background="#ffffff"
                      margin={0}
                    />
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">National Clinical Registry Verified • GULA OS</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setPrintingSample(null)}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={() => {
                    const printContent = document.getElementById('printable-label');
                    if (printContent) {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write('<html><head><title>Print Label</title>');
                        printWindow.document.write('<style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;} #printable-label{border:1px solid #000;padding:20px;width:300px;}</style>');
                        printWindow.document.write('</head><body>');
                        printWindow.document.write(printContent.outerHTML);
                        printWindow.document.write('</body></html>');
                        printWindow.document.close();
                        printWindow.print();
                        setPrintingSample(null);
                      }
                    }
                  }}
                  className="flex-3 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
                >
                  Commence Print Sequence <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
