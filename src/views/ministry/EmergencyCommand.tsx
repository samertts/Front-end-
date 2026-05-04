import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Zap, Radio, Globe, 
  Users, Activity, AlertTriangle, 
  Lock, Unlock, Bell, Flame,
  MessageSquare, Send, CheckCircle2,
  PhoneCall, Play, Square, Settings
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

type SystemMode = 'NORMAL' | 'ELEVATED' | 'CRITICAL' | 'EMERGENCY';

export function EmergencyCommand() {
  const { t, isRtl } = useLanguage();
  const [mode, setMode] = useState<SystemMode>('NORMAL');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [message, setMessage] = useState('');

  const getModeConfig = (m: SystemMode) => {
    switch (m) {
      case 'NORMAL': return { color: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      case 'ELEVATED': return { color: 'bg-indigo-500', text: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' };
      case 'CRITICAL': return { color: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
      case 'EMERGENCY': return { color: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' };
    }
  };

  const currentCfg = getModeConfig(mode);

  return (
    <div className={cn(
      "p-8 space-y-8 min-h-screen transition-colors duration-1000",
      mode === 'EMERGENCY' ? "bg-rose-50/50" : "bg-slate-50"
    )}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("w-2 h-2 rounded-full animate-ping", currentCfg.color)} />
            <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", currentCfg.text)}>{t.systemMode}: {mode}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{t.emergencyCenter}</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.crisisGovernance}</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
             {(['NORMAL', 'ELEVATED', 'CRITICAL', 'EMERGENCY'] as SystemMode[]).map((m) => (
               <button
                 key={m}
                 onClick={() => setMode(m)}
                 className={cn(
                   "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                   mode === m 
                    ? getModeConfig(m).color + " text-white shadow-lg" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                 )}
               >
                 {m}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        {/* Left: Communication & Status */}
        <div className="lg:col-span-8 space-y-8">
           <div className={cn(
             "p-1 rounded-[3rem] border transition-all duration-500 shadow-2xl",
             mode === 'EMERGENCY' ? "bg-rose-600 border-rose-500" : "bg-slate-900 border-slate-800"
           )}>
              <div className="p-10 bg-black/20 rounded-[2.85rem] backdrop-blur-xl">
                 <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center text-white relative">
                          <Radio size={32} className={isBroadcasting ? "animate-pulse" : ""} />
                          {isBroadcasting && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-bounce" />
                          )}
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t.strategicBroadcast}</h2>
                          <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">{t.encryptedChannel}: G-HQ-ALPHA</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black text-white/80 uppercase tracking-widest italic">{t.secureFeed} {t.activeStatus}</span>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="relative">
                       <textarea 
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         placeholder={t.typeCommand}
                         className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] p-8 text-white font-bold text-lg focus:border-white/30 focus:bg-white/10 transition-all outline-none min-h-[200px]"
                       />
                       <div className="absolute bottom-6 right-6 flex gap-4">
                          <button className="p-3 bg-white/5 text-white/40 hover:text-white rounded-xl transition-all">
                             <Settings size={20} />
                          </button>
                          <button 
                            onClick={() => setIsBroadcasting(!isBroadcasting)}
                            className={cn(
                              "px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all",
                              isBroadcasting 
                                ? "bg-rose-500 text-white animate-pulse" 
                                : "bg-white text-slate-900 hover:bg-slate-100"
                            )}
                          >
                             {isBroadcasting ? <Square size={16} fill="white" /> : <Play size={16} fill="black" />}
                             {isBroadcasting ? t.stopBroadcast : t.startBroadcast}
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                       {[
                         { icon: Bell, label: t.notifyLabs, count: '482' },
                         { icon: Users, label: t.notifyCitizens, count: '3.4M' },
                         { icon: PhoneCall, label: t.firstResponders, count: '24k' },
                         { icon: Globe, label: t.internationalOrganizations, count: 'WHO/CDC' },
                       ].map((target, i) => (
                         <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:bg-white/10 transition-all">
                            <target.icon size={24} className="text-white/40 group-hover:text-white group-hover:scale-110 transition-all mb-3" />
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{target.label}</span>
                            <span className="text-xs font-black text-white">{target.count}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.incidentLogs}</h3>
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase">{t.live}</span>
                 </div>
                 <div className="space-y-4">
                    {[
                      { id: '1', title: 'Water Contamination Logic Detected', zone: 'Basrah C', status: 'intercepted' },
                      { id: '2', title: 'Viral Spike: Variant-Delta-9', zone: 'Karkh North', status: 'monitoring' },
                      { id: '3', title: 'Lab Supply Chain Interruption', zone: 'Erbil Hub', status: 'resolved' },
                    ].map(log => (
                      <div key={log.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all">
                         <div>
                            <p className="text-xs font-black text-slate-900 leading-tight mb-1">{log.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{log.zone}</p>
                         </div>
                         <div className={cn(
                           "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter",
                           log.status === 'intercepted' ? "bg-rose-500 text-white" : 
                           log.status === 'monitoring' ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                         )}>
                            {log.status}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">{t.mobilization}</h3>
                 <div className="space-y-6">
                    {[
                      { label: 'Bio-Response Teams', value: 82, color: 'bg-indigo-500' },
                      { label: 'Ambulance Mobility', value: 95, color: 'bg-rose-500' },
                      { label: 'Hospital Capacity', value: 45, color: 'bg-emerald-500' },
                    ].map((bar, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>{bar.label}</span>
                            <span className="text-slate-900">{bar.value}% {t.readyStatus}</span>
                         </div>
                         <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${bar.value}%` }}
                              className={cn("h-full rounded-full", bar.color)} 
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Security & Protocols */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-slate-900 text-white rounded-2xl">
                    <Lock size={20} />
                 </div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.protocolOverrides}</h3>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Bypass MFA for Emergency Responders', active: false },
                   { label: 'Force Global Data Replication', active: true },
                   { label: 'Unlock Strategic Reagent Reserves', active: false },
                   { label: 'Disable External API Egress', active: false },
                 ].map((protocol, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-600 max-w-[150px] leading-tight">{protocol.label}</span>
                      <button className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        protocol.active ? "bg-indigo-600" : "bg-slate-300"
                      )}>
                         <div className={cn(
                           "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                           protocol.active ? "right-1" : "left-1"
                         )} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-rose-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                 <Flame size={40} className="mb-6 animate-bounce" />
                 <h3 className="text-2xl font-black mb-4 leading-tight">{t.networkLockdown}</h3>
                 <p className="text-xs text-rose-100/80 font-medium leading-relaxed mb-8">
                   This action will immediately terminate all external connections, revoke all non-admin access tokens, and place the national database in Read-Only Mode.
                 </p>
                 <button className="w-full py-4 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                    EXECUTE LOCKDOWN
                 </button>
                 <p className="text-[8px] font-black text-center mt-4 uppercase tracking-[0.2em] opacity-40">{t.authRequired}: Level 9+</p>
              </div>
           </div>

           <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem]">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center mb-6">{t.crisisAi}</h3>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <Activity size={20} />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase">GULA Predictive</p>
                    <p className="text-[9px] text-slate-400 font-bold">Heuristic analysis active. Optimal strategy: Isolation of Block-9.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyCommand;
