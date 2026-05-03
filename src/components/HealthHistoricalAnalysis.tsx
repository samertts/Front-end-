import React, { useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Activity, BrainCircuit, Calendar, 
  Heart, Zap, ChevronRight, Share2, Download, Bot,
  AlertCircle, Sparkles, ArrowRight, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

interface DataPoint {
  date: string;
  value?: number;
  systolic?: number;
  diastolic?: number;
}

interface MetricConfig {
  id: string;
  name: string;
  unit: string;
  color: string;
  icon: any;
  status: 'optimal' | 'warning' | 'alert';
  currentValue: string;
  trend: string;
  aiInsight: {
    stability: string;
    description: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    positiveDev: string;
  };
}

const mockData: Record<string, DataPoint[]> = {
  bloodPressure: [
    { date: '04/10', systolic: 132, diastolic: 88 },
    { date: '04/15', systolic: 130, diastolic: 85 },
    { date: '04/20', systolic: 128, diastolic: 82 },
    { date: '04/25', systolic: 125, diastolic: 80 },
    { date: '04/28', systolic: 122, diastolic: 81 },
    { date: '05/01', systolic: 120, diastolic: 79 },
    { date: '05/03', systolic: 119, diastolic: 80 },
  ],
  heartRate: [
    { date: '04/10', value: 78 },
    { date: '04/15', value: 75 },
    { date: '04/20', value: 72 },
    { date: '04/25', value: 70 },
    { date: '04/28', value: 69 },
    { date: '05/01', value: 68 },
    { date: '05/03', value: 67 },
  ],
  glucose: [
    { date: '04/10', value: 105 },
    { date: '04/15', value: 102 },
    { date: '04/20', value: 98 },
    { date: '04/25', value: 95 },
    { date: '04/28', value: 94 },
    { date: '05/01', value: 92 },
    { date: '05/03', value: 91 },
  ]
};

const metrics: MetricConfig[] = [
  { 
    id: 'bloodPressure', 
    name: 'Blood Pressure', 
    unit: 'mmHg', 
    color: '#f43f5e', 
    icon: Heart, 
    status: 'optimal', 
    currentValue: '119/80', 
    trend: '-9%',
    aiInsight: {
      stability: 'Normalizing Trend',
      description: 'Your systolic pressure has dropped significantly over the last 21 days, returning to the optimal green zone.',
      riskLevel: 'Low',
      positiveDev: 'Hypertension risk reduced by 14% compared to last month.'
    }
  },
  { 
    id: 'heartRate', 
    name: 'Heart Rate', 
    unit: 'BPM', 
    color: '#6366f1', 
    icon: Activity, 
    status: 'optimal', 
    currentValue: '67', 
    trend: '-4%',
    aiInsight: {
      stability: 'Stable Baseline',
      description: 'Resting heart rate shows high consistency. Recovery times after physical exertion are improving.',
      riskLevel: 'Low',
      positiveDev: 'Cardiovascular efficiency index is in the top 10th percentile for your age group.'
    }
  },
  { 
    id: 'glucose', 
    name: 'Glucose', 
    unit: 'mg/dL', 
    color: '#10b981', 
    icon: Zap, 
    status: 'optimal', 
    currentValue: '91', 
    trend: '-2%',
    aiInsight: {
      stability: 'Metabolic Balance',
      description: 'Blood sugar values are perfectly stabilized. No significant spikes detected in post-prandial periods.',
      riskLevel: 'Low',
      positiveDev: 'Insulin sensitivity appears to be at peak performance levels.'
    }
  },
];

export function HealthHistoricalAnalysis() {
  const [activeMetricId, setActiveMetricId] = useState('bloodPressure');
  const activeMetric = metrics.find(m => m.id === activeMetricId) || metrics[0];
  const chartData = mockData[activeMetricId];

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
       {/* Diagnostic Dynamic Header */}
       <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className={cn(
                "w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-500",
                activeMetricId === 'bloodPressure' ? "bg-rose-500 shadow-rose-200 rotate-3" :
                activeMetricId === 'heartRate' ? "bg-indigo-600 shadow-indigo-200 -rotate-3" :
                "bg-emerald-500 shadow-emerald-200 rotate-6"
             )}>
                <activeMetric.icon size={32} />
             </div>
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{activeMetric.name}</h2>
                   <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      activeMetric.status === 'optimal' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                   )}>
                      {activeMetric.status}
                   </div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                   <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                      <Calendar size={14} /> 30-Day Analysis
                   </div>
                   <div className="w-1 h-1 bg-slate-200 rounded-full" />
                   <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-500">
                      <TrendingUp size={14} /> {activeMetric.aiInsight.stability}
                   </div>
                </div>
             </div>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             {metrics.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMetricId(m.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeMetricId === m.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                  )}
                >
                  {m.id === 'bloodPressure' ? 'BP' : m.id === 'heartRate' ? 'HR' : 'GLU'}
                </button>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Chart Area */}
          <div className="lg:col-span-8 p-10 border-r border-slate-100">
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   {activeMetricId === 'bloodPressure' ? (
                     <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                          itemStyle={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}
                        />
                        <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
                        <Area 
                          type="monotone" 
                          dataKey="systolic" 
                          name="Systolic"
                          stroke="#f43f5e" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorSys)" 
                          animationDuration={1500}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="diastolic" 
                          name="Diastolic"
                          stroke="#6366f1" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorDia)" 
                          animationDuration={1500}
                        />
                     </AreaChart>
                   ) : (
                     <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={activeMetric.color} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={activeMetric.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={activeMetric.color} 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorMetric)" 
                          animationDuration={1500}
                        />
                     </AreaChart>
                   )}
                </ResponsiveContainer>
             </div>

             <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-white p-3 rounded-xl shadow-sm">
                      <Sparkles className="text-indigo-600" size={20} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Predictive Analysis: Steady decline in BP suggests successful protocol adherence.
                   </p>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                   Logic Trace <ChevronRight size={14} />
                </button>
             </div>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="lg:col-span-4 p-10 space-y-10 bg-slate-50/50">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-900 text-white rounded-xl">
                      <BrainCircuit size={20} />
                   </div>
                   <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 italic">Core Intelligence Report</h3>
                </div>

                <div className="space-y-4">
                   <div className="p-6 bg-white border border-slate-200 rounded-[2rem] relative overflow-hidden group shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Risk Assessment</span>
                         <span className={cn(
                           "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                           activeMetric.aiInsight.riskLevel === 'Low' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                         )}>{activeMetric.aiInsight.riskLevel} Risk</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-2">{activeMetric.aiInsight.stability}</p>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                         {activeMetric.aiInsight.description}
                      </p>
                   </div>

                   <div className="p-6 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                         <Sparkles size={60} />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                         <Bot size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Positive Development</span>
                      </div>
                      <p className="text-xs font-bold leading-relaxed italic opacity-90">
                         "{activeMetric.aiInsight.positiveDev}"
                      </p>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <TrendingUp size={20} />
                   </div>
                   <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Statistical Momentum</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-indigo-600 transition-all">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consistency</p>
                         <p className="text-xl font-black text-slate-900">98.2%</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                        <ShieldCheck size={20} />
                      </div>
                   </div>
                   <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-emerald-600 transition-all">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delta Variance</p>
                         <p className="text-xl font-black text-slate-900">0.02</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                        <Zap size={20} />
                      </div>
                   </div>
                </div>
             </div>

             <div className="pt-6 flex gap-3">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 transition-all">
                   <Download size={16} /> Export Dataset
                </button>
                <button className="p-4 bg-white text-slate-400 hover:text-indigo-600 rounded-2xl transition-all border border-slate-200 shadow-sm active:scale-95">
                   <Share2 size={18} />
                </button>
             </div>
          </div>
       </div>

       {/* Bottom Control Bar */}
       <div className="px-10 py-6 bg-slate-900 flex items-center justify-between text-white border-t border-slate-800">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Data Shield Active</span>
             </div>
             <div className="hidden md:flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Heuristic Model Only</span>
             </div>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors">
             View National Baseline <ArrowRight size={14} />
          </button>
       </div>
    </div>
  );
}
