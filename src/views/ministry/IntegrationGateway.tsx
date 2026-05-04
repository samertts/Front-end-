import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, CloudCog, Share2, Database,
  Search, Filter, Plus, Activity,
  Lock, Key, Zap, ArrowUpRight,
  RefreshCw, Server, Code2, Link2,
  AlertTriangle, MoreHorizontal, Terminal
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

const apiTraffic = [
  { name: '00:00', calls: 2400, errors: 40 },
  { name: '04:00', calls: 1800, errors: 32 },
  { name: '08:00', calls: 4500, errors: 80 },
  { name: '12:00', calls: 8200, errors: 120 },
  { name: '16:00', calls: 6100, errors: 90 },
  { name: '20:00', calls: 3800, errors: 50 },
];

const connectors = [
  { id: 'CON-001', name: 'National EMR Hub', type: 'FHIR R4', status: 'connected', latency: '42ms', throughput: '1.2GB/h' },
  { id: 'CON-002', name: 'Karkh Regional Clinicals', type: 'HL7 v2', status: 'connected', latency: '124ms', throughput: '450MB/h' },
  { id: 'CON-003', name: 'WHO International Sync', type: 'REST API', status: 'maintenance', latency: '---', throughput: '0B/h' },
  { id: 'CON-004', name: 'Private Lab Cluster Sync', type: 'LOINC Mapping', status: 'warning', latency: '850ms', throughput: '12MB/h' },
];

export function IntegrationGateway() {
  const { t, isRtl } = useLanguage();
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);

  const rotateMasterKeys = () => {
    setIsRotatingKeys(true);
    setTimeout(() => setIsRotatingKeys(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">{t.interopGrid}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{t.integrationGateway}</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.dataExchange}</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={rotateMasterKeys}
            className={cn(
               "px-6 py-4 bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all",
               isRotatingKeys && "animate-pulse border-indigo-500 text-indigo-600"
            )}
          >
            <RefreshCw size={16} className={isRotatingKeys ? "animate-spin" : ""} />
            {isRotatingKeys ? `${t.rotateKeys}...` : t.rotateKeys}
          </button>
          <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-200">
             <Plus size={16} className="inline-block mr-2" /> {t.registerInterface}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto w-full">
         {[
           { label: t.activeConnectors, value: '84', sub: 'Across 12 Clusters', icon: Link2, color: 'text-indigo-600' },
           { label: t.apiTraffic, value: '1.2B', sub: 'Calls / Monthly', icon: Activity, color: 'text-emerald-600' },
           { label: t.latency, value: '42ms', sub: 'P99 Global', icon: Zap, color: 'text-amber-600' },
           { label: t.interopHealth, value: 'A+', sub: 'FHIR Compliance', icon: Server, color: 'text-rose-600' },
         ].map((stat, i) => (
           <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                 <div className={cn("p-4 rounded-xl bg-slate-50", stat.color)}>
                    <stat.icon size={22} />
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase italic">Live Feed</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                 <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                 <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.sub}</span>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 uppercase italic">{t.executionMetrics}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.ingressEgress}</p>
                  </div>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                     {['24h', '7d', '30d'].map(t => (
                       <button key={t} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">{t}</button>
                     ))}
                  </div>
               </div>
               
               <div className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={apiTraffic}>
                        <defs>
                           <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(0,0,0,0.3)" fontSize={10} fontWeight={900} />
                        <YAxis stroke="rgba(0,0,0,0.3)" fontSize={10} fontWeight={900} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={4} fill="url(#colorCalls)" />
                        <Area type="monotone" dataKey="errors" stroke="#f43f5e" strokeWidth={2} fill="none" strokeDasharray="4 4" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 text-left">
               <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.activeConnectors}</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className={cn("w-full", isRtl ? "text-right" : "text-left")}>
                     <thead>
                        <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                           <th className="px-8 py-5">{t.labNode}</th>
                           <th className="px-8 py-5">{t.interfaceProto}</th>
                           <th className="px-8 py-5">{t.latency}</th>
                           <th className="px-8 py-5">{t.loadPerHour}</th>
                           <th className="px-8 py-5">{t.stateStatus}</th>
                           <th className="px-4 py-5"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {connectors.map((con, i) => (
                           <tr key={i} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                       <CloudCog size={18} />
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900 leading-tight mb-1">{con.name}</p>
                                       <p className="text-[10px] font-mono text-slate-400 uppercase">{con.id}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-600 uppercase tracking-tighter italic">{con.type}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={cn(
                                   "text-xs font-black font-mono",
                                   con.latency === '---' ? "text-slate-300" : parseInt(con.latency) > 500 ? "text-rose-500" : "text-emerald-500"
                                 )}>{con.latency}</span>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-xs font-bold text-slate-600">{con.throughput}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <div className={cn(
                                   "inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                   con.status === 'connected' ? "text-emerald-700 bg-emerald-50 border-emerald-100" : 
                                   con.status === 'maintenance' ? "text-slate-700 bg-slate-50 border-slate-100" :
                                   "text-amber-700 bg-amber-50 border-amber-100"
                                 )}>
                                    <div className={cn(
                                      "w-2 h-2 rounded-full mr-2",
                                      con.status === 'connected' ? "bg-emerald-500 animate-pulse" : con.status === 'maintenance' ? "bg-slate-400" : "bg-amber-500"
                                    )} />
                                    {con.status}
                                 </div>
                              </td>
                              <td className="px-4 py-6">
                                 <button className="p-2 text-slate-200 group-hover:text-indigo-600 transition-all">
                                    <MoreHorizontal size={18} />
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
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Terminal size={100} />
               </div>
               <div className="relative z-10">
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">{t.devAccess}</h3>
                  <div className="space-y-6 mb-10">
                     <div className="p-5 bg-white/5 border border-white/5 rounded-3xl group-hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 bg-indigo-600/30 rounded-xl flex items-center justify-center text-indigo-400">
                              <Key size={20} />
                           </div>
                           <span className="text-[10px] font-black text-emerald-400 uppercase">Production</span>
                        </div>
                        <p className="text-xs font-black mb-1 uppercase tracking-tight">Main National Hub Key</p>
                        <p className="text-[10px] font-mono text-slate-500 truncate">gula_prod_neural_v4_77291a...</p>
                     </div>

                     <div className="p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 bg-rose-600/30 rounded-xl flex items-center justify-center text-rose-400">
                              <Globe size={20} />
                           </div>
                           <span className="text-[10px] font-black text-amber-400 uppercase">Sandbox</span>
                        </div>
                        <p className="text-xs font-black mb-1 uppercase tracking-tight">External Developer Sandbox</p>
                        <p className="text-[10px] font-mono text-slate-500">gula_sandbox_access_9921...</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/50 hover:bg-indigo-500 transition-all">
                     {t.apiDocs}
                  </button>
               </div>
            </div>

            <div className="p-8 bg-white rounded-[3rem] border border-slate-200">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t.semanticMapping}</h3>
               <div className="flex flex-col items-center text-center p-6">
                  <div className="w-24 h-24 rounded-full border-[10px] border-slate-100 border-t-emerald-500 flex items-center justify-center mb-6">
                     <Database size={32} className="text-emerald-500" />
                  </div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight italic">92% LOINC Alignment</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed">
                     Semantic normalization engine currently processing 14.2k fragments/sec.
                  </p>
               </div>
            </div>
            
            <div className="p-8 bg-amber-600/10 border border-amber-500/20 rounded-[3rem]">
               <div className="flex items-center gap-4 mb-4">
                  <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Interoperability Alert</p>
               </div>
               <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                  Basrah EMR Cluster reported minor schema drift in the HL7 v2.x mapping. Automatic patch application in progress.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

export default IntegrationGateway;
