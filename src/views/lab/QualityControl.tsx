import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, TrendingDown, 
  TrendingUp, Activity as ActivityIcon, Settings,
  History, Download, RefreshCw, Filter, 
  CheckCircle2, Info, Beaker, Cpu, Bell,
  UserCheck, ShieldAlert, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, AreaChart, Area 
} from 'recharts';
import { toast } from 'sonner';

interface QCLevel {
  id: string;
  parameter: string;
  level: 'L1' | 'L2' | 'L3';
  mean: number;
  sd: number;
  currentValue: number;
  status: 'passed' | 'warning' | 'failed';
  history: { date: string; value: number }[];
}

interface QCAlert {
  id: string;
  level: string;
  parameter: string;
  value: number;
  target: string;
  timestamp: string;
  status: 'critical' | 'acknowledged';
  notifiedRoles: string[];
}

export function QualityControl() {
  const { t } = useLanguage();
  const [selectedDevice, setSelectedDevice] = useState('Analyzer-Gamma-X1');
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [qcData, setQcData] = useState<QCLevel[]>([
    { 
      id: 'glc-1',
      parameter: 'Glucose-Hexokinase',
      level: 'L1', mean: 14.5, sd: 0.3, currentValue: 14.6, status: 'passed',
      history: [
        { date: '08:00', value: 14.4 }, { date: '10:00', value: 14.7 },
        { date: '12:00', value: 14.5 }, { date: '14:00', value: 14.6 },
        { date: '16:00', value: 14.6 }
      ]
    },
    { 
      id: 'glc-2',
      parameter: 'Glucose-Hexokinase',
      level: 'L2', mean: 50.0, sd: 1.2, currentValue: 51.2, status: 'warning',
      history: [
        { date: '08:00', value: 50.1 }, { date: '10:00', value: 50.5 },
        { date: '12:00', value: 49.8 }, { date: '14:00', value: 51.2 },
        { date: '16:00', value: 51.2 }
      ]
    },
    { 
      id: 'glc-3',
      parameter: 'Glucose-Hexokinase',
      level: 'L3', mean: 300.0, sd: 5.0, currentValue: 305.2, status: 'passed',
      history: [
        { date: '08:00', value: 301.2 }, { date: '10:00', value: 298.5 },
        { date: '12:00', value: 305.0 }, { date: '14:00', value: 302.4 },
        { date: '16:00', value: 305.2 }
      ]
    }
  ]);

  const [alerts, setAlerts] = useState<QCAlert[]>([]);

  // Automatically check for critical results
  useEffect(() => {
    qcData.forEach(qc => {
      // Logic: If status is 'failed' and no active alert exists for this level/parameter
      if (qc.status === 'failed') {
        const alertExists = alerts.find(a => a.parameter === qc.parameter && a.level === qc.level && a.status === 'critical');
        if (!alertExists) {
          const newAlert: QCAlert = {
            id: Math.random().toString(36).substr(2, 9),
            level: qc.level,
            parameter: qc.parameter,
            value: qc.currentValue,
            target: `${qc.mean} ± ${qc.sd} SD`,
            timestamp: new Date().toLocaleTimeString(),
            status: 'critical',
            notifiedRoles: []
          };
          setAlerts(prev => [newAlert, ...prev]);
          toast.error(`CRITICAL QC ALERT: ${qc.parameter} Level ${qc.level} is out of bounds!`, {
            description: `Value ${qc.currentValue} exceeds threshold. Immediate action required.`,
            duration: 10000
          });
        }
      }
    });
  }, [qcData]);

  const handleNotify = (alertId: string, role: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        const updatedRoles = [...new Set([...a.notifiedRoles, role])];
        // If both Pathologist and Supervisor are notified, mark as acknowledged for demo
        const newStatus = updatedRoles.length >= 2 ? 'acknowledged' : 'critical';
        return { ...a, notifiedRoles: updatedRoles, status: newStatus as any };
      }
      return a;
    }));
    
    toast.success(`Notification sent to ${role}`, {
      description: `Pathology communication channel established for Alert ${alertId}.`
    });
  };

  const triggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setQcData(prev => prev.map(qc => {
        if (qc.level === 'L3') {
          return {
            ...qc,
            currentValue: 385.2,
            status: 'failed',
            history: [...qc.history, { date: '18:00', value: 385.2 }]
          };
        }
        return qc;
      }));
      setIsSimulating(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setQcData(prev => prev.map(qc => {
      if (qc.level === 'L3') {
        return {
          ...qc,
          currentValue: 305.2,
          status: 'passed',
          history: qc.history.slice(0, 5)
        };
      }
      return qc;
    }));
    setAlerts([]);
    toast.info("QC simulation reset to nominal values.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Critical Alerts Banner */}
      <AnimatePresence>
        {alerts.filter(a => a.status === 'critical').map(alert => (
          <motion.div
            key={alert.id}
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="bg-rose-50 border-2 border-rose-200 rounded-[2.5rem] p-8 mb-8 relative shadow-xl shadow-rose-500/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white animate-pulse shadow-lg shadow-rose-600/20">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-black text-rose-900 uppercase tracking-tighter">Critical QC Violation Detected</h2>
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded uppercase letter-spacing-widest">Urgent</span>
                    </div>
                    <p className="text-sm font-medium text-rose-700/80">
                      <span className="font-black text-rose-900">{alert.parameter}</span> level <span className="font-black text-rose-900">{alert.level}</span> is outside acceptable range: 
                      <span className="mx-2 px-2 py-0.5 bg-rose-200 rounded text-rose-900 font-bold underline decoration-rose-400 decoration-2">{alert.value}</span> 
                      (Target: {alert.target})
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleNotify(alert.id, 'Pathologist')}
                      disabled={alert.notifiedRoles.includes('Pathologist')}
                      className={cn(
                        "px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                        alert.notifiedRoles.includes('Pathologist') 
                          ? "bg-emerald-500 text-white opacity-80 cursor-default" 
                          : "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200"
                      )}
                    >
                      {alert.notifiedRoles.includes('Pathologist') ? <UserCheck size={14} /> : < Bell size={14} />}
                      {alert.notifiedRoles.includes('Pathologist') ? 'Pathologist Notified' : 'Notify Pathologist'}
                    </button>
                    {alert.notifiedRoles.includes('Pathologist') && (
                      <span className="text-[8px] font-black text-emerald-600 uppercase text-center">Protocol Initiated</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleNotify(alert.id, 'Supervisor')}
                      disabled={alert.notifiedRoles.includes('Supervisor')}
                      className={cn(
                        "px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 flex items-center gap-2",
                        alert.notifiedRoles.includes('Supervisor')
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"
                      )}
                    >
                      {alert.notifiedRoles.includes('Supervisor') ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                      {alert.notifiedRoles.includes('Supervisor') ? 'Supervisor Alerted' : 'Alert Supervisor'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Precision Header */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none scale-150 rotate-12">
            <ShieldCheck size={240} />
         </div>

         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-8">
               <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={48} />
               </div>
               <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-2">{t.qcControl}</h1>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t.deviceStatus}: Nominal</span>
                     </div>
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{selectedDevice} Active</span>
                  </div>
               </div>
            </div>

            <div className="flex gap-6">
               <button 
                onClick={triggerSimulation}
                disabled={isSimulating}
                className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20 flex items-center gap-3 active:scale-95"
               >
                 {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <AlertTriangle size={16} />}
                 Simulate Failure
               </button>
               <button 
                onClick={resetSimulation}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
               >
                 Reset QC
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Device Matrix</h3>
               <div className="space-y-2">
                  {['Analyzer-Gamma-X1', 'Hematology-Sync-4', 'Biochem-Node-B'].map(device => (
                    <button 
                      key={device}
                      onClick={() => setSelectedDevice(device)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl text-xs font-bold transition-all border",
                        selectedDevice === device ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {device}
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                  <Cpu className="text-indigo-400" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-tight">AI Auto-Calibration</h3>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed mb-8">
                 Autonomous 24h drift monitoring is enabled. System will automatically initiate re-calibration if values exceed 2.5 SD.
               </p>
               <button className="w-full py-4 bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
                  Manual Recall
               </button>
            </div>
         </div>

         <div className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {qcData.map((qc, i) => (
                  <motion.div 
                     key={qc.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm overflow-hidden relative group"
                  >
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">{qc.level}</span>
                              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{qc.parameter}</h4>
                           </div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target: {qc.mean} ± {qc.sd} SD</p>
                        </div>
                        <div className={cn(
                           "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                           qc.status === 'passed' ? "bg-emerald-50 text-emerald-600" : 
                           qc.status === 'warning' ? "bg-amber-50 text-amber-600 animate-pulse" :
                           "bg-rose-50 text-rose-600 animate-pulse font-black ring-2 ring-rose-200"
                        )}>
                           {qc.status}
                        </div>
                     </div>

                     <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={qc.history}>
                              <defs>
                                <linearGradient id={`colorValue${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={qc.status === 'passed' ? "#059669" : qc.status === 'warning' ? "#d97706" : "#e11d48"} stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor={qc.status === 'passed' ? "#059669" : qc.status === 'warning' ? "#d97706" : "#e11d48"} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="date" hide />
                              <YAxis hide domain={[qc.mean - 4*qc.sd, qc.mean + 4*qc.sd]} />
                              <Tooltip 
                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                              />
                              <Area 
                                 type="monotone" 
                                 dataKey="value" 
                                 stroke={qc.status === 'passed' ? "#059669" : qc.status === 'warning' ? "#d97706" : "#e11d48"} 
                                 strokeWidth={4}
                                 fillOpacity={1} 
                                 fill={`url(#colorValue${i})`} 
                              />
                              <ReferenceLine y={qc.mean} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: 'Mean', fill: '#94a3b8', fontSize: 10 }} />
                              <ReferenceLine y={qc.mean + 2*qc.sd} stroke="#f59e0b" strokeDasharray="1 1" />
                              <ReferenceLine y={qc.mean - 2*qc.sd} stroke="#f59e0b" strokeDasharray="1 1" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Dev</span>
                           <span className={cn(
                             "text-lg font-black",
                             Math.abs((qc.currentValue - qc.mean) / qc.sd) > 2 ? "text-rose-600" : "text-slate-900"
                           )}>
                             {((qc.currentValue - qc.mean) / qc.sd) > 0 ? '+' : ''}{((qc.currentValue - qc.mean) / qc.sd).toFixed(2)} SD
                           </span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl text-right">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">CV %</span>
                           <span className="text-lg font-black text-slate-900">0.82%</span>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                     <History className="text-indigo-600" /> Precision Audit Log
                  </h3>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-slate-100">
                           <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Timestamp</th>
                           <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Status</th>
                           <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Corrective Action</th>
                           <th className="pb-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Operator</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {[
                          { time: new Date().toLocaleString(), status: 'Warning', action: 'Westgard 1_2s Violation - Routine monitoring', user: 'AI-Audit' },
                          { time: '2024-03-20 14:02', status: 'Optimal', action: 'Auto-Calibrated successfully', user: 'System-Auto' },
                          { time: '2024-03-20 12:45', status: 'Optimal', action: 'Daily Maintenance - OK', user: 'Technician Ali' },
                        ].map((log, i) => (
                          <tr key={i} className="group hover:bg-slate-50 transition-colors">
                             <td className="py-6 text-xs font-bold text-slate-600">{log.time}</td>
                             <td className="py-6">
                                <span className={cn(
                                   "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                   log.status === 'Optimal' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                )}>{log.status}</span>
                             </td>
                             <td className="py-6 text-xs font-medium text-slate-500">{log.action}</td>
                             <td className="py-6 text-xs font-black text-slate-900 uppercase tracking-tighter">{log.user}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
