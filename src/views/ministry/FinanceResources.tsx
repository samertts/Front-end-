import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, TrendingDown, TrendingUp, 
  DollarSign, PieChart as PieIcon, BarChart3, 
  ArrowRight, Download, Filter, Search,
  Target, Zap, AlertTriangle, Wallet
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';

const budgetData = [
  { name: 'Jan', spent: 4000, budget: 4500 },
  { name: 'Feb', spent: 3000, budget: 4500 },
  { name: 'Mar', spent: 5000, budget: 4500 },
  { name: 'Apr', spent: 4200, budget: 4500 },
];

const allocationData = [
  { name: 'Laboratory Ops', value: 45, color: '#6366f1' },
  { name: 'Bio-Response', value: 25, color: '#f43f5e' },
  { name: 'Infrastructure', value: 20, color: '#10b981' },
  { name: 'R&D AI', value: 10, color: '#f59e0b' },
];

export function FinanceResources() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">{t.healthFinOps}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{t.healthFinance}</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.macroEconomics}</p>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center gap-3">
            <Filter size={16} /> {t.fiscalPeriod}
          </button>
          <button className="px-6 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-3">
             <ArrowRight size={16} /> {t.requestReAllocation}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto w-full">
         {[
           { label: t.annualBudget, value: '$840M', change: '+5.2%', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: t.opexUtilization, value: '72.4%', change: '-2.1%', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: t.costPerAsset, value: '$12.4', change: '-12%', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: t.wasteMitigation, value: '$4.2M', change: t.optimizedStatus, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
         ].map((stat, i) => (
           <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-start mb-6">
                 <div className={cn("p-4 rounded-2xl", stat.color, stat.bg)}>
                    <stat.icon size={24} />
                 </div>
                 <span className={cn(
                   "text-[10px] font-black px-2 py-1 rounded-lg uppercase",
                   stat.change.includes('+') ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                 )}>{stat.change}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
         <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-start mb-12">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{t.expenditureTimeline}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{t.budgetAllocation} (Actual vs Allocated)</p>
               </div>
               <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-all">
                  <Download size={18} />
               </button>
            </div>
            
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budgetData}>
                     <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
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
                     <Area type="monotone" dataKey="spent" stroke="#6366f1" strokeWidth={4} fill="url(#colorSpent)" />
                     <Area type="step" dataKey="budget" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 text-center">{t.budgetAllocation}</h3>
               <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-3 mt-6">
                  {allocationData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full", )} style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                       </div>
                       <span className="text-xs font-black text-slate-900">{item.value}%</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                  <BarChart3 size={100} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <AlertTriangle size={24} className="text-amber-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{t.anomalyDetected}</span>
                  </div>
                  <h4 className="text-2xl font-black mb-4 leading-tight">{t.supplyChainWaste}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">
                    {t.predictiveHeuristics}
                  </p>
                  <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-xl transition-all">
                     {t.auditLogs}
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default FinanceResources;
