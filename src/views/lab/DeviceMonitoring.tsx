import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Activity as ActivityIcon, Zap, AlertCircle, Settings, 
  RotateCw, CheckCircle2, XCircle, 
  Terminal, BarChart3, Database,
  Cpu, Thermometer, ShieldAlert, Sparkles, BrainCircuit, TrendingUp, Gauge, Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface DeviceStatus {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'warning' | 'offline' | 'calibrating';
  throughput: number;
  temperature: number;
  lastMaintenance: string;
  uptime: string;
  errors: string[];
  history: number[];
}

export function DeviceMonitoring() {
  const { t } = useLanguage();
  const [isRelaying, setIsRelaying] = useState(true);
  const [devices, setDevices] = useState<DeviceStatus[]>([
    {
      id: 'DEV-882',
      name: 'Roche Cobas 8000',
      type: 'Chemistry Analyzer',
      status: 'online',
      throughput: 840,
      temperature: 36.5,
      lastMaintenance: '2026-04-10',
      uptime: '14d 2h',
      errors: [],
      history: [820, 830, 840, 835, 840, 845, 840]
    },
    {
      id: 'DEV-104',
      name: 'Sysmex XN-3000',
      type: 'Hematology Line',
      status: 'warning',
      throughput: 410,
      temperature: 38.2,
      lastMaintenance: '2026-03-15',
      uptime: '122d 8h',
      errors: ['Temp threshold exceeded', 'Reagent low'],
      history: [450, 440, 430, 420, 415, 410, 405]
    },
    {
      id: 'DEV-455',
      name: 'Beckman Coulter DxC',
      type: 'Immunoassay',
      status: 'calibrating',
      throughput: 0,
      temperature: 36.1,
      lastMaintenance: '2026-04-18',
      uptime: '1h 12m',
      errors: [],
      history: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      id: 'DEV-901',
      name: 'Illumina NovaSeq',
      type: 'NGS Sequencer',
      status: 'online',
      throughput: 120,
      temperature: 22.4,
      lastMaintenance: '2026-05-01',
      uptime: '1d 4h',
      errors: [],
      history: [115, 118, 120, 119, 121, 120, 122]
    }
  ]);

  // Real-time simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(dev => {
        if (dev.status === 'offline' || dev.status === 'calibrating') return dev;
        
        const fluctuation = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newThroughput = Math.max(0, dev.throughput + fluctuation);
        const newTemp = +(dev.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1);
        
        const newHistory = [...dev.history.slice(1), newThroughput];
        
        return {
          ...dev,
          throughput: newThroughput,
          temperature: newTemp,
          history: newHistory
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const maintenanceAlerts = useMemo(() => {
    return devices.filter(d => d.status === 'warning' || d.errors.length > 0);
  }, [devices]);

  const globalThroughput = useMemo(() => {
    return devices.reduce((acc, d) => acc + d.throughput, 0);
  }, [devices]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 min-h-screen">
      {/* Immersive Device Core Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-slate-900 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none scale-150">
           <ActivityIcon size={300} />
        </div>
        
        {/* Animated Background Pulse */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 group cursor-pointer" onClick={() => setIsRelaying(!isRelaying)}>
              <Cpu size={32} className={cn("text-white transition-all", isRelaying && "animate-pulse scale-110")} />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">Instrument Control</h1>
              <div className="flex items-center gap-3">
                 <div className={cn(
                   "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors",
                   isRelaying ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-rose-500/20 text-rose-400 border-rose-500/20"
                 )}>
                    {isRelaying ? 'Active Telemetry' : 'Telemetry Paused'}
                 </div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Handshake Stability: 99.9%</p>
              </div>
            </div>
          </div>
          <p className="max-w-xl text-base text-slate-400 font-medium leading-relaxed">
            Real-time synchronization with the national analytical grid. {maintenanceAlerts.length} units require attention or predictive maintenance.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4">
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center gap-6 backdrop-blur-xl">
              <div className="text-center">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Global Load</p>
                 <p className="text-3xl font-black tabular-nums">{globalThroughput}<span className="text-xs text-slate-500 ml-1">T/H</span></p>
              </div>
              <div className="w-[2px] h-10 bg-white/10" />
              <div className="text-center">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Unit Count</p>
                 <p className="text-3xl font-black">{devices.length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Maintenance Intelligence */}
      <AnimatePresence>
        {maintenanceAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-500 rounded-[3rem] p-8 text-white relative shadow-2xl shadow-amber-500/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
               <ShieldAlert size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/20 rounded-2xl border border-white/20 backdrop-blur-md">
                     <Wrench size={32} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black uppercase tracking-tight italic">Predictive Maintenance Directive</h3>
                     <p className="text-amber-50 text-sm font-medium mt-1">
                       The intelligence engine has detected pattern drifts in <b>{maintenanceAlerts.length}</b> units. Recommend immediate calibration for {maintenanceAlerts[0].name}.
                     </p>
                  </div>
               </div>
               <button 
                 onClick={() => toast.success("Maintenance tickets dispatched to technical wing.")}
                 className="px-8 py-4 bg-white text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                 Dispatch Repair Grid
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connectivity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {devices.map((device, i) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-100 rounded-[4rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group flex flex-col"
          >
            {/* Device Header */}
            <div className="p-10 border-b border-slate-50 flex flex-col items-center text-center space-y-4">
               <div className={cn(
                 "w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl relative",
                 device.status === 'online' ? "bg-emerald-50 text-emerald-600 shadow-emerald-100" :
                 device.status === 'warning' ? "bg-amber-50 text-amber-600 shadow-amber-100 animate-pulse" :
                 device.status === 'calibrating' ? "bg-indigo-50 text-indigo-600 shadow-indigo-100" :
                 "bg-red-50 text-red-600 shadow-red-100"
               )}>
                  <Cpu size={40} className="group-hover:scale-110 transition-transform" />
                  <div className={cn(
                    "absolute -bottom-2 -right-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-4 border-white shadow-lg",
                    device.status === 'online' ? "bg-emerald-500 text-white" :
                    device.status === 'warning' ? "bg-amber-500 text-white" :
                    device.status === 'calibrating' ? "bg-indigo-500 text-white" :
                    "bg-red-500 text-white"
                  )}>
                     {device.status}
                  </div>
               </div>
               
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{device.name}</h3>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{device.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-[150px]">{device.type}</span>
                  </div>
               </div>
            </div>

            {/* Metrics */}
            <div className="p-10 bg-slate-50/30 space-y-8 flex-1">
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group/metric">
                    <div className="absolute top-0 right-0 p-2 opacity-[0.03]"><Zap size={40} /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Load Factor</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-black text-slate-900 leading-none tabular-nums">{device.throughput}</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase">T/hr</span>
                    </div>
                    {/* Sparkline Visualization */}
                    <div className="flex items-end gap-0.5 h-6 mt-2">
                       {device.history.map((h, idx) => {
                         const max = Math.max(...device.history, 1);
                         const height = (h / max) * 100;
                         return (
                           <motion.div 
                             key={idx}
                             initial={{ height: 0 }}
                             animate={{ height: `${height}%` }}
                             className={cn(
                               "flex-1 rounded-t-sm transition-colors duration-500",
                               device.status === 'online' ? "bg-indigo-500" : "bg-amber-500"
                             )}
                           />
                         );
                       })}
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group/metric">
                    <div className="absolute top-0 right-0 p-2 opacity-[0.03]"><Thermometer size={40} /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Thermal Node</span>
                    <div className="flex items-baseline gap-1">
                       <span className={cn(
                         "text-2xl font-black leading-none tabular-nums",
                         device.temperature > 38 ? "text-red-500" : "text-slate-900"
                       )}>{device.temperature}°C</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                       <div className={cn("w-2 h-2 rounded-full", device.temperature > 38 ? "bg-red-500 animate-ping" : "bg-emerald-500")} />
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Thermal Stability</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Handshake Uptime</span>
                      <span className="text-xs font-black text-slate-600">{device.uptime}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <TrendingUp size={14} className={cn(
                        "transition-transform",
                        device.throughput > device.history[device.history.length - 2] ? "text-emerald-500" : "rotate-180 text-rose-500"
                      )} />
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className={cn("w-1 h-3 rounded-full", i <= 4 ? "bg-indigo-600" : "bg-slate-200")} />)}
                      </div>
                   </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: deviceStatusToWidth(device.status) }}
                     transition={{ duration: 1 }}
                     className={cn(
                       "h-full rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]",
                       device.status === 'online' ? "bg-emerald-500" :
                       device.status === 'warning' ? "bg-amber-500" : "bg-indigo-500"
                     )}
                   />
                </div>
              </div>
            </div>

            {/* Console HUD */}
            <div className="px-10 py-6 bg-slate-900">
               <div className="flex items-center gap-3 mb-4">
                 <Terminal size={14} className="text-indigo-400 animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Node Error Stream</span>
               </div>
               <div className="space-y-2 max-h-24 overflow-y-auto custom-scrollbar">
                 {device.errors.length > 0 ? (
                   device.errors.map((err, i) => (
                     <div key={i} className="flex items-start gap-2 text-[10px] text-red-400 font-mono leading-relaxed bg-red-400/5 p-2 rounded-xl border border-red-400/10 mb-1">
                        <ShieldAlert size={12} className="shrink-0 mt-0.5" />
                        <span>NODE_ERROR: {err}</span>
                     </div>
                   ))
                 ) : (
                   <div className="text-[10px] text-slate-500 font-mono tracking-tight opacity-50 italic">Grid sync confirmed. No anomalies detected in current cycle.</div>
                 )}
               </div>
            </div>

            {/* Control Panel */}
            <div className="p-8 bg-white flex items-center justify-between border-t border-slate-50">
               <button className="p-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl shadow-sm transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                 <RotateCw size={16} /> Re-Align Unit
               </button>
               <div className="flex gap-2">
                  <button className="p-4 text-slate-400 hover:text-indigo-600 transition-colors">
                     <BarChart3 size={20} />
                  </button>
                  <button className="p-4 text-slate-400 hover:text-rose-600 transition-colors">
                     <XCircle size={20} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function deviceStatusToWidth(status: string) {
  switch(status) {
    case 'online': return '92%';
    case 'warning': return '45%';
    case 'calibrating': return '15%';
    default: return '0%';
  }
}
