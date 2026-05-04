import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Microscope, Activity, CheckCircle2, AlertCircle, 
  Settings, Search, Filter, Download, ArrowUpRight,
  Zap, Database, Server, RefreshCw, Building2, Globe
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  LineChart, Line 
} from 'recharts';

const labStats = [
  { name: 'Karkh Central', tests: 2450, capacity: 92, status: 'online', lat: '12ms' },
  { name: 'Basrah Regional', tests: 1840, capacity: 88, status: 'online', lat: '24ms' },
  { name: 'Nineveh Hub', tests: 1200, capacity: 45, status: 'maintenance', lat: 'offline' },
  { name: 'Erbil Lab 1', tests: 980, capacity: 62, status: 'online', lat: '18ms' },
  { name: 'Najaf Specialized', tests: 450, capacity: 30, status: 'warning', lat: '45ms' },
];

export function LabNetworkControl() {
  const { t, isRtl } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">{t.ministryWing}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{t.labControl}</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.labThroughput} • {t.realTimeSync}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={triggerSync}
            className={cn(
              "p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest",
              isSyncing && "animate-pulse border-indigo-200 text-indigo-600"
            )}
          >
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
            {t.syncGrid}
          </button>
          <button className="px-6 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center gap-3">
            <Download size={16} /> {t.exportMasterLog}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto w-full">
        <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.networkConnectivity}</p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-black text-slate-900 leading-none">98.4%</div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Zap size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter italic">
            <ArrowUpRight size={12} />
            {t.optimizationActive}
          </div>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.totalAssets}</p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-black text-slate-900 leading-none">12,482</div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {t.last24Hours}
          </div>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.sovereignValidation}</p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-black text-slate-900 leading-none">99.2%</div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-emerald-500 uppercase">{t.authenticated}</div>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.integrityIndex}</p>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-black text-slate-900 leading-none">A+ Score</div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Microscope size={20} />
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-amber-500 uppercase">{t.isoAligned}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50">
              <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">National Asset Routing</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Laboratory Status Feed</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Filter: Region</button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Sort: Capacity</button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className={cn("w-full", isRtl ? "text-right" : "text-left")}>
                    <thead>
                       <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-5">Laboratory Node</th>
                          <th className="px-8 py-5">Capacity Load</th>
                          <th className="px-8 py-5">ID Assets (24h)</th>
                          <th className="px-8 py-5">Node Status</th>
                          <th className="px-8 py-5">Latency</th>
                          <th className="px-4 py-5"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {labStats.map((lab, i) => (
                          <tr key={i} className="hover:bg-indigo-50/30 transition-all group cursor-pointer group">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                      <Building2 size={20} />
                                   </div>
                                   <div className="flex flex-col">
                                      <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{lab.name}</p>
                                      <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 opacity-60">REGULATORY ID: L-772-B</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-sm font-black text-slate-600">
                                <div className="flex items-center gap-3">
                                   <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className={cn(
                                          "h-full rounded-full transition-all duration-1000",
                                          lab.capacity > 85 ? "bg-rose-500" : "bg-indigo-500"
                                        )} 
                                        style={{ width: `${lab.capacity}%` }} 
                                      />
                                   </div>
                                   <span className={cn(lab.capacity > 85 ? "text-rose-500" : "text-indigo-600")}>{lab.capacity}%</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className="text-sm font-black text-slate-900">{lab.tests.toLocaleString()}</span>
                             </td>
                             <td className="px-8 py-6">
                                <div className={cn(
                                   "inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                   lab.status === 'online' ? "text-emerald-700 bg-emerald-50 border-emerald-100" : 
                                   lab.status === 'maintenance' ? "text-slate-700 bg-slate-50 border-slate-100" :
                                   "text-amber-700 bg-amber-50 border-amber-100"
                                )}>
                                   <div className={cn(
                                     "w-2 h-2 rounded-full mr-2 animate-pulse",
                                     lab.status === 'online' ? "bg-emerald-500" : lab.status === 'maintenance' ? "bg-slate-400" : "bg-amber-500"
                                   )} />
                                   {lab.status}
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-indigo-600 transition-colors">{lab.lat}</span>
                             </td>
                             <td className="px-4 py-6">
                                <button className="p-2 text-slate-200 group-hover:text-indigo-600 transition-all">
                                   <Settings size={18} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Server size={100} />
              </div>
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Network Health Intelligence</h3>
                 <h4 className="text-2xl font-black mb-4 leading-tight">Optimization Suggestions</h4>
                 <div className="space-y-4 mb-8">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                       <p className="text-xs font-bold text-white mb-1">Reroute Basrah Assets</p>
                       <p className="text-[10px] text-slate-400 font-medium">Basrah Lab Node 1 is at 94% capacity. Reroute 15% to Najaf Sector.</p>
                       <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1.5 bg-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Auto-Reroute</button>
                          <button className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest">Ignore</button>
                       </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                       <p className="text-xs font-bold text-white mb-1">Nineveh Hub Maintenance</p>
                       <p className="text-[10px] text-slate-400 font-medium">Scheduled maintenance in 2 hours. Ensure cold-chain integrity.</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/50">
                    Full Network Diagnostics
                 </button>
              </div>
           </div>

           <div className="p-8 bg-white rounded-[3rem] border border-slate-200">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Laboratory Distribution (GIS)</h3>
              <div className="h-[250px] w-full flex items-center justify-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 relative group cursor-crosshair overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                 <div className="relative z-10 flex flex-col items-center text-center p-6">
                    <Globe size={40} className="text-slate-300 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Digital Twin Active</p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Satellite Visualization Locked</p>
                 </div>
                 
                 {/* Decorative Points */}
                 <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-rose-500 rounded-full animate-ping opacity-50" />
                 <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                 <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default LabNetworkControl;
